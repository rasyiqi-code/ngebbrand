"use server";

import { AICortexService } from "../pilar6-cortex/services";
import { BrandGenesisService } from "./services";
import { VisualIntelligenceService } from "../pilar7-visual/services";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

/**
 * Server Action for AI Discovery Chat
 * Follows the modular monolith pattern by coordinating between Pilar 1 and Pilar 6.
 */
export async function sendDiscoveryMessage(
  chatHistory: { role: "ai" | "user"; content: string }[],
  language: string = "id"
) {
  try {
    const langName = language === "id" ? "Bahasa Indonesia" : "English";
    
    // 1. Get current workspace & strategy
    const workspace = await BrandGenesisService.getOrCreateDefaultWorkspace();
    const strategy = await BrandGenesisService.getStrategy(workspace.id);

    const strategyContext = JSON.stringify({
      brandName: strategy?.brandName || "Not set",
      brandEssence: strategy?.brandEssence || "Not set",
      archetypePrimary: strategy?.archetypePrimary || "Not set",
      brandMantra: strategy?.brandMantra || "Not set",
    }, null, 2);

    // 2. Prepare messages for AI Cortex
    const messages = [
      {
        role: "system" as const,
        content: `You are a friendly, sharp, and approachable Branding Mentor helping a business owner build their brand. 
While your logic is grounded in the wisdom of branding experts like David Aaker and Jean-Noël Kapferer, your TONE should be like a supportive friend who is genuinely curious about their business.

CURRENT BRAND STRATEGY DATA:
${strategyContext}

INTERVIEW GUIDELINES:
1. Conduct a SEMI-STRUCTURED INTERVIEW. 
2. Focus on one element at a time (e.g., focus on defining the 'Brand Essence' before moving to 'Archetype').
3. Do not move to the next topic until the current point is clear and you have enough data to fill the field.
4. Strictly avoid using academic marketing jargon (like 'Archetype', 'Brand DNA', 'Essence', or 'Prism') as primary terms for the user. Instead, use human-friendly metaphors like 'Karakter Brand', 'Kepribadian', 'Semangat Utama', or 'Ide Besar'.
5. If you must mention a technical concept like "Archetype", explain it immediately as "Karakter/Pribadi" using relatable analogies (e.g., "Jika brand Anda adalah manusia, dia tipe yang seperti apa?").
6. For Bahasa Indonesia, use a "santai tapi profesional" tone (like a modern startup mentor). Avoid being too formal or too stiff.
7. Be helpful, ask practical questions, and help them uncover what makes their business special in a way that feels natural and conversational.
8. Never accept generic answers, but probe with empathy and encouragement.

FORMATTING RULES:
1. Use clear Markdown formatting.
2. Use bullet points or numbered lists for questions to make them easy to read.
3. Use bold text for key terms or questions.
4. Add double line breaks between paragraphs and list items for better readability.
5. Keep paragraphs short and punchy.

INTERNAL PROTOCOL (CRITICAL):
1. [STRATEGY_UPDATE]: If you identify key brand elements, include a hidden JSON update at the end of your message:
   [STRATEGY_UPDATE: {"brandName": "...", "brandEssence": "...", "archetypePrimary": "...", "brandMantra": "..."}]
   - Use standard professional terminology (e.g., 'The Creator', 'The Caregiver') inside the JSON.
   - Only include fields you are 100% confident about.

2. [SUGGESTED_OPTIONS]: You MUST ALWAYS provide 3-4 suggested quick-answer options for EVERY question you ask. This helps the user respond faster.
   Format: [SUGGESTED_OPTIONS: ["Option 1", "Option 2", "Option 3", "Other..."]]
   - Place this at the VERY END of your message, after the [STRATEGY_UPDATE] if any.
   - Keep options short (1-3 words).
   - Example: If asking about tone, use [SUGGESTED_OPTIONS: ["Professional", "Friendly", "Luxurious", "Bold"]]

3. Language: Always respond in ${langName}.
4. Jargon: Use metaphors in text, but professional terms in [STRATEGY_UPDATE].
5. NATIVE FLUENCY: Speak fluently and naturally in ${langName}. Do NOT use robotic or literal translations of idioms. Act as a native-speaking expert in ${langName}.`
      },

      ...chatHistory.map(m => ({
        role: (m.role === "ai" ? "assistant" : "user") as "system" | "user" | "assistant",
        content: m.content
      }))
    ];

    // 3. Call AI Cortex (Pilar 6)
    const aiResponse = await AICortexService.chat(messages);

    // 4. Auto-extract strategy updates from AI response
    const updateMatch = aiResponse.match(/STRATEGY_UPDATE[\]:]*\s*({[\s\S]*?})/i);
    if (updateMatch) {
      try {
        let jsonStr = updateMatch[1].trim();
        jsonStr = jsonStr.replace(/,\s*}/, "}");
        const updateData = JSON.parse(jsonStr);
        await BrandGenesisService.updateStrategy(workspace.id, {
          ...updateData,
          updatedByMode: "discovery"
        });
      } catch (e) {
        console.error("Failed to parse AI strategy update:", e);
      }
    }

    // 5. Extract suggested options
    let suggestedOptions: string[] = [];
    const optionsMatch = aiResponse.match(/SUGGESTED_OPTIONS[\]:]*\s*([\s\S]*?)(?=\n|$)/i);
    if (optionsMatch) {
      let rawOptions = optionsMatch[1].trim();
      
      // Look for the actual array boundaries to ignore markdown like **[...]**
      const firstBracket = rawOptions.indexOf('[');
      const lastBracket = rawOptions.lastIndexOf(']');
      
      if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
         rawOptions = rawOptions.substring(firstBracket, lastBracket + 1);
      } else {
         // Clean up markdown formatting and brackets
         rawOptions = rawOptions.replace(/[*_~`]/g, "").replace(/^\[+/, '').replace(/\]+$/, '').trim();
      }

      try {
        if (rawOptions.includes("\"") || rawOptions.includes("'")) {
          suggestedOptions = rawOptions
            .split(",")
            .map(opt => opt.trim().replace(/^["']|["']$/g, ""));
        } else {
          suggestedOptions = rawOptions.split(",").map(opt => opt.trim());
        }
      } catch (e) {
        console.error("Failed to parse suggested options:", e);
      }
    }

    // Clean the response from the hidden tags before sending to UI
    let cleanResponse = aiResponse
      .replace(/(?:^|\n)\s*[-*]?\s*\[?\s*STRATEGY_UPDATE[\s\S]*?}(?:\s*\]\]?)?/gi, "")
      .replace(/(?:^|\n)\s*[-*]?\s*\[?\s*SUGGESTED_OPTIONS[\s\S]*?(?=\n|$)/gi, "")
      .trim();



    // 6. Save User message and AI response to DiscoveryLog (Defensive check)
    if (prisma.discoveryLog) {
      try {
        const userMessage = chatHistory[chatHistory.length - 1];
        if (userMessage && userMessage.role === "user") {
          await prisma.discoveryLog.create({
            data: {
              workspaceId: workspace.id,
              role: "user",
              content: userMessage.content
            }
          });
        }

        await prisma.discoveryLog.create({
          data: {
            workspaceId: workspace.id,
            role: "ai",
            content: aiResponse
          }
        });
      } catch (logError) {
        console.error("Failed to save discovery log:", logError);
      }
    }

    return {
      success: true,
      content: cleanResponse,
      suggestedOptions
    };
  } catch (error: any) {
    console.error("Discovery Chat Error:", error);
    return {
      success: false,
      error: error.message || "Gagal mendapatkan respon dari AI Strategist.",
    };
  }
}

/**
 * Get Discovery Chat Logs
 */
export async function getDiscoveryLogsAction() {
  try {
    const workspace = await BrandGenesisService.getOrCreateDefaultWorkspace();
    const logs = await prisma.discoveryLog.findMany({
      where: { workspaceId: workspace.id },
      orderBy: { createdAt: "asc" }
    });
    return { 
      success: true as const, 
      data: logs.map((l: any) => ({
        id: l.id,
        role: l.role as "ai" | "user",
        content: l.content,
        timestamp: l.createdAt
      })) 
    };
  } catch (error: any) {
    return { success: false as const, error: error.message };
  }
}

/**
 * Get the current brand strategy
 */
export async function getStrategyAction() {
  try {
    const workspace = await BrandGenesisService.getOrCreateDefaultWorkspace();
    const strategy = await BrandGenesisService.getStrategy(workspace.id);
    return { success: true as const, data: strategy };
  } catch (error: any) {
    return { success: false as const, error: error.message };
  }
}

/**
 * Update the brand strategy
 */
export async function updateStrategyAction(data: any) {
  try {
    const workspace = await BrandGenesisService.getOrCreateDefaultWorkspace();
    await BrandGenesisService.updateStrategy(workspace.id, {
      ...data,
      updatedByMode: "manual"
    });
    revalidatePath("/dashboard/genesis");
    revalidatePath("/dashboard/genesis/edit");
    return { success: true as const };
  } catch (error: any) {
    return { success: false as const, error: error.message };
  }
}

/**
 * Reset the brand strategy (clear all data)
 */
export async function resetStrategyAction() {
  try {
    const workspace = await BrandGenesisService.getOrCreateDefaultWorkspace();
    await BrandGenesisService.updateStrategy(workspace.id, {
      brandName: null,
      brandEssence: null,
      brandMantra: null,
      whyStatement: null,
      archetypePrimary: null,
      archetypeSecondary: null,
      coreValues: [],
      toneOfVoice: null,
      goldenCircle: {},
      brandKey: {},
      vpCanvas: {},
      kapfererPrism: {},
      executiveSummary: null,
      updatedByMode: null
    });

    // Clear logs
    await prisma.discoveryLog.deleteMany({
      where: { workspaceId: workspace.id }
    });

    revalidatePath("/dashboard/genesis");
    revalidatePath("/dashboard/genesis/edit");
    revalidatePath("/dashboard/genesis/report");
    return { success: true as const };
  } catch (error: any) {
    return { success: false as const, error: error.message };
  }
}

/**
 * Generate Visual DNA Brief from Brand Strategy
 */
export async function generateVisualBriefAction(language: string = "en") {
  try {
    const workspace = await BrandGenesisService.getOrCreateDefaultWorkspace();
    const strategy = await BrandGenesisService.getStrategy(workspace.id);
    
    if (!strategy) {
      throw new Error("Strategy not found. Please complete discovery first.");
    }

    // Compile strategy info for AI
    const input = {
      product: strategy.brandEssence || "",
      organization: strategy.brandName || "",
      person: strategy.archetypePrimary || "",
      symbol: strategy.brandMantra || ""
    };

    const result = await AICortexService.generateVisualDNA(input, language);
    
    // Save to Visual Intelligence (Pilar 7)
    await VisualIntelligenceService.updateVisualDNA(result.keywords);
    
    revalidatePath("/dashboard/genesis");
    revalidatePath("/dashboard/visual");
    
    return { success: true as const, data: result };
  } catch (error: any) {
    return { success: false as const, error: error.message };
  }
}

/**
 * AI Assist: Generate Executive Summary
 */
export async function generateExecutiveSummaryAction(language: string = "en") {
  try {
    const workspace = await BrandGenesisService.getOrCreateDefaultWorkspace();
    const strategy = await BrandGenesisService.getStrategy(workspace.id);
    
    if (!strategy) {
      throw new Error("Strategy data missing.");
    }

    const langName = language === "id" ? "Indonesian" : "English";

    const systemPrompt = `You are a Senior Brand Strategist at a top-tier global agency (like Pentagram or Wolff Olins). 
Your task is to write a high-level, sophisticated Executive Summary for a brand based on their strategic framework.
The tone should be professional, visionary, and compelling. 
Focus on how the brand's 'Why' connects to its 'Value Proposition' and 'Archetype'.
Respond CONSISTENTLY in ${langName}.`;

    const userPrompt = `BRAND STRATEGY DATA:
Brand Name: ${strategy.brandName}
Brand Mantra: ${strategy.brandMantra}
Brand Essence: ${strategy.brandEssence}
Golden Circle: ${JSON.stringify(strategy.goldenCircle)}
Archetype: ${strategy.archetypePrimary}
Brand Key: ${JSON.stringify(strategy.brandKey)}
Value Proposition: ${JSON.stringify(strategy.vpCanvas)}
Identity Prism: ${JSON.stringify(strategy.kapfererPrism)}

Write a 3-4 paragraph narrative that ties all these elements into a cohesive brand story.`;

    const summary = await AICortexService.generateText(systemPrompt, userPrompt);
    
    // Save to DB
    await BrandGenesisService.updateStrategy(workspace.id, {
      executiveSummary: summary
    });

    revalidatePath("/dashboard/genesis");
    revalidatePath("/dashboard/genesis/edit");
    revalidatePath("/dashboard/genesis/report");
    
    return { success: true as const, data: summary };
  } catch (error: any) {
    return { success: false as const, error: error.message };
  }
}
