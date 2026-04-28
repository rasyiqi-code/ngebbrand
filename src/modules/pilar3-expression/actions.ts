"use server";

import { BrandExpressionService, CopyGenerationOptions } from "./services";
import { BrandGenesisService } from "@/modules/pilar1-genesis/services";
import { revalidatePath } from "next/cache";

/**
 * Generate AI Copy based on brand strategy
 */
export async function generateCopyAction(options: CopyGenerationOptions) {
  try {
    const workspace = await BrandGenesisService.getOrCreateDefaultWorkspace();
    const copy = await BrandExpressionService.generateCopy(workspace.id, options);
    
    revalidatePath("/dashboard/expression/writer");
    return { success: true as const, data: copy };
  } catch (error: any) {
    console.error("Generate Copy Error:", error);
    return { success: false as const, error: error.message };
  }
}

/**
 * Get all copies
 */
export async function getCopiesAction() {
  try {
    const workspace = await BrandGenesisService.getOrCreateDefaultWorkspace();
    const copies = await BrandExpressionService.getCopies(workspace.id);
    return { success: true as const, data: copies };
  } catch (error: any) {
    return { success: false as const, error: error.message };
  }
}

/**
 * Delete a copy
 */
export async function deleteCopyAction(id: string) {
  try {
    await BrandExpressionService.deleteCopy(id);
    revalidatePath("/dashboard/expression/writer");
    return { success: true as const };
  } catch (error: any) {
    return { success: false as const, error: error.message };
  }
}
