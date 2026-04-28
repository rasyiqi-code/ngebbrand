"use server";

import { VisualIntelligenceService } from "./services";
import { AICortexService } from "../pilar6-cortex/services";
import { revalidatePath } from "next/cache";

/**
 * Save Aaker Canvas data
 */
export async function saveAakerAction(data: {
  product?: string;
  organization?: string;
  person?: string;
  symbol?: string;
}) {
  try {
    await VisualIntelligenceService.updateAaker(data);
    revalidatePath("/dashboard/visual/aaker");
    return { success: true as const };
  } catch (error: any) {
    return { success: false as const, error: error.message };
  }
}

/**
 * Save Kapferer Prism data
 */
export async function savePrismAction(data: {
  physique?: string;
  personality?: string;
  culture?: string;
  relationship?: string;
  reflection?: string;
  selfImage?: string;
}) {
  try {
    await VisualIntelligenceService.updatePrism(data);
    revalidatePath("/dashboard/visual/prism");
    return { success: true as const };
  } catch (error: any) {
    return { success: false as const, error: error.message };
  }
}

/**
 * AI Assist: Generate Visual DNA Keywords from Aaker Canvas
 */
export async function generateVisualDNAFromAakerAction(input: {
  product?: string;
  organization?: string;
  person?: string;
  symbol?: string;
}, language: string = "id") {
  try {
    const result = await AICortexService.generateVisualDNA(input, language);
    await VisualIntelligenceService.updateVisualDNA(result.keywords);
    revalidatePath("/dashboard/visual/aaker");
    revalidatePath("/dashboard/visual");
    return { success: true as const, data: result };
  } catch (error: any) {
    return { success: false as const, error: error.message };
  }
}

/**
 * Save selected visual system (color/typo)
 */
export async function saveVisualSystemAction(data: {
  colorPalette?: any;
  typography?: any;
}) {
  try {
    await VisualIntelligenceService.updateVisualSystem(data);
    revalidatePath("/dashboard/visual");
    return { success: true as const };
  } catch (error: any) {
    return { success: false as const, error: error.message };
  }
}

/**
 * Get visual identity data
 */
export async function getVisualIdentityAction() {
  try {
    const data = await VisualIntelligenceService.getVisualIdentity();
    return { success: true as const, data };
  } catch (error: any) {
    return { success: false as const, error: error.message };
  }
}
