"use server";

import { AICortexService } from "./services";
import { getExpertPrompt, getExperts } from "./prompts";
import { prisma } from "@/lib/prisma";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Chat with the AI Co-Strategist
 */
export async function chatWithCortexAction(
  messages: ChatMessage[],
  context: {
    currentPage: string;
    brandEssence?: string;
    archetype?: string;
    expert?: string;
    language?: string;
  }
) {
  try {
    const response = await AICortexService.coStrategistChat(messages, context);
    return { success: true as const, content: response };
  } catch (error: any) {
    console.error("Cortex chat error:", error);
    return { success: false as const, error: error.message || "Failed to get AI response" };
  }
}

/**
 * Generate Visual DNA keywords from Aaker Canvas input
 */
export async function generateVisualDNAAction(input: {
  product?: string;
  organization?: string;
  person?: string;
  symbol?: string;
}, language: string = "id") {
  try {
    const result = await AICortexService.generateVisualDNA(input, language);
    return { success: true as const, data: result };
  } catch (error: any) {
    console.error("Visual DNA generation error:", error);
    return { success: false as const, error: error.message };
  }
}

/**
 * Generate color palette options
 */
export async function generatePaletteAction(archetype: string, keywords: string[], language: string = "id") {
  try {
    const result = await AICortexService.generatePalette(archetype, keywords, language);
    return { success: true as const, data: result };
  } catch (error: any) {
    console.error("Palette generation error:", error);
    return { success: false as const, error: error.message };
  }
}

/**
 * Generate typography options
 */
export async function generateTypographyAction(archetype: string, keywords: string[], language: string = "id") {
  try {
    const result = await AICortexService.generateTypography(archetype, keywords, language);
    return { success: true as const, data: result };
  } catch (error: any) {
    console.error("Typography generation error:", error);
    return { success: false as const, error: error.message };
  }
}

/**
 * Get available expert list
 */
export async function getExpertsAction() {
  return { success: true as const, experts: getExperts() };
}

/**
 * Check if AI is configured
 */
export async function checkAIStatusAction() {
  return {
    success: true as const,
    configured: AICortexService.isConfigured(),
    defaultModel: process.env.OPENROUTER_DEFAULT_MODEL || "openai/gpt-4o",
  };
}

/**
 * Analyze brand compliance for a given page content
 */
export async function analyzeBrandComplianceAction(
  pageContent: string,
  context: { name: string; tone: string; colors: any; keywords: string[] }
) {
  try {
    const result = await AICortexService.analyzeBrandCompliance(pageContent, context);
    return { success: true as const, data: result };
  } catch (error: any) {
    console.error("Brand compliance analysis error:", error);
    return { success: false as const, error: error.message };
  }
}

/**
 * Get Brand Context (Strategy + Visual Identity) for a workspace
 */
export async function getBrandContextAction(workspaceId: string) {
  try {
    const [strategy, visual] = await Promise.all([
      prisma.brandStrategy.findFirst({ where: { workspaceId } }),
      prisma.visualIdentity.findFirst({ where: { workspaceId } })
    ]);
    
    return { 
      success: true as const, 
      data: {
        strategy,
        visual
      }
    };
  } catch (error: any) {
    console.error("Get brand context error:", error);
    return { success: false as const, error: error.message };
  }
}
