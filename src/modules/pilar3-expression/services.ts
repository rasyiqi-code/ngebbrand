import { prisma } from "@/lib/prisma";
import { AICortexService } from "@/modules/pilar6-cortex/services";
import { BrandGenesisService } from "@/modules/pilar1-genesis/services";

export interface CopyGenerationOptions {
  topic: string;
  platform?: "instagram" | "linkedin" | "tiktok" | "website" | "email";
  tone?: string;
  length?: "short" | "medium" | "long";
  language?: string;
}

export const BrandExpressionService = {
  /**
   * Get all generated copies for a workspace
   */
  async getCopies(workspaceId: string) {
    return await prisma.aICopy.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" }
    });
  },

  /**
   * Generate copy using the Brand Strategy DNA from Pilar 1
   */
  async generateCopy(workspaceId: string, options: CopyGenerationOptions) {
    // 1. Get the source of truth (Strategy)
    const strategy = await BrandGenesisService.getStrategy(workspaceId);
    
    if (!strategy || !strategy.brandName) {
      throw new Error("Brand Strategy not defined. Please complete Genesis Lab first.");
    }

    const { topic, platform = "instagram", tone, length = "medium", language = "id" } = options;
    const langName = language === "en" ? "English" : "Bahasa Indonesia";

    // 2. Build the prompt
    const systemPrompt = `You are a world-class Copywriter and Brand Voice Expert. 
Your job is to write copy that sounds exactly like the brand described in the DNA.

BRAND DNA:
- Name: ${strategy.brandName}
- Essence: ${strategy.brandEssence || "Not defined"}
- Mantra: ${strategy.brandMantra || "Not defined"}
- Primary Archetype: ${strategy.archetypePrimary || "Not defined"}
- Tone Preference: ${tone || strategy.toneOfVoice || "Professional & Engaging"}

RULES:
1. Always align with the brand archetype and essence.
2. Use the platform's best practices (${platform}).
3. Include relevant emojis if appropriate for the platform.
4. Output should be ONLY the generated copy. No preamble.
5. Language: ${langName}.`;

    const userPrompt = `TOPIC/INSTRUCTION: ${topic}
PLATFORM: ${platform}
LENGTH: ${length}`;

    // 3. Call AI Cortex
    const content = await AICortexService.generateText(systemPrompt, userPrompt);

    // 4. Save to DB
    return await prisma.aICopy.create({
      data: {
        workspaceId,
        title: topic.substring(0, 50),
        content,
        platform,
        tone: tone || strategy.toneOfVoice
      }
    });
  },

  /**
   * Delete a copy
   */
  async deleteCopy(id: string) {
    return await prisma.aICopy.delete({
      where: { id }
    });
  }
};
