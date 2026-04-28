"use server";

import { revalidatePath } from "next/cache";
import { BrandFortressService } from "./services";
import { AICortexService } from "../pilar6-cortex/services";
import { BrandGenesisService } from "../pilar1-genesis/services";
import sharp from "sharp";

export async function getAssetsAction()
{
  try {
    const assets = await BrandFortressService.getAssets();
    return { success: true as const, assets };
  } catch (error: any) {
    console.error("Failed to fetch assets:", error);
    return { success: false as const, error: error.message as string };
  }
}

import fs from "fs/promises";
import path from "path";

/**
 * Real asset upload (Metadata + Local Storage)
 */
export async function uploadAssetAction(formData: FormData)
{
  try {
    const file = formData.get("file") as File;
    if (!file) throw new Error("No file uploaded");

    const fileName = file.name;
    const buffer = Buffer.from(await file.arrayBuffer());
    const s3Key = `${Date.now()}-${fileName}`;
    const filePath = path.join(process.cwd(), "public", "uploads", s3Key);

    // Save to local filesystem
    await fs.writeFile(filePath, buffer);

    // --- AI & Image Processing Start ---
    let tags = ["Uploaded"];
    let colors: { hex: string, ratio: number }[] = [];

    try {
      // 1. Color Extraction (if image)
      if (file.type.startsWith("image/") && !file.type.includes("svg")) {
        const { dominant } = await sharp(buffer).stats();
        const hex = `#${((1 << 24) + (dominant.r << 16) + (dominant.g << 8) + dominant.b).toString(16).slice(1)}`;
        colors.push({ hex, ratio: 1 });
      }

      // 2. AI Tagging & Categorization
      const workspace = await BrandGenesisService.getOrCreateDefaultWorkspace();
      const strategy = await BrandGenesisService.getStrategy(workspace.id);
      
      const aiResponse = await AICortexService.generateJSON<{ tags: string[] }>(
        "You are a Digital Asset Manager. Analyze the uploaded file name and brand context to provide 3-5 relevant tags.",
        `Brand: ${strategy?.brandName || "Unknown"}
File Name: ${fileName}
Current Tags: ${file.type.split('/')[1]?.toUpperCase()}

Suggest tags in JSON format: { "tags": ["tag1", "tag2"] }`
      );
      
      tags = [...new Set([...tags, ...(aiResponse.tags || [])])];
    } catch (e) {
      console.warn("AI Asset Processing failed, falling back to basic tags:", e);
      tags.push(file.type.split('/')[1]?.toUpperCase() || "FILE");
    }
    // --- AI & Image Processing End ---
    
    const asset = await BrandFortressService.uploadAsset({
      fileName,
      s3Key,
      mimeType: file.type,
      fileSize: file.size,
      tags,
      aiColors: colors as any,
      isLocked: false
    });

    // 3. Log Audit
    await BrandFortressService.logAudit(asset.id, "upload", "admin", file.type);

    revalidatePath("/dashboard/fortress");
    return { success: true as const };
  } catch (error: any) {
    console.error("Failed to upload asset:", error);
    return { success: false as const, error: error.message as string };
  }
}

/**
 * Toggle asset lock
 */
export async function toggleAssetLockAction(assetId: string, isLocked: boolean)
{
  try {
    await BrandFortressService.toggleLock(assetId, isLocked);
    revalidatePath("/dashboard/fortress");
    return { success: true as const };
  } catch (error: any) {
    return { success: false as const, error: error.message as string };
  }
}

/**
 * Save Brand Rules for an asset
 */
export async function saveBrandRulesAction(assetId: string, rules: { type: string; value: any }[])
{
  try {
    for (const rule of rules) {
      await BrandFortressService.saveRule({
        assetId,
        ruleType: rule.type,
        ruleValue: rule.value
      });
    }

    // Log the change
    await BrandFortressService.logAudit(assetId, "update_rules", "admin");
    revalidatePath("/dashboard/fortress");
    return { success: true as const };
  } catch (error: any) {
    return { success: false as const, error: error.message as string };
  }
}

/**
 * Get rules for an asset
 */
export async function getAssetRulesAction(assetId: string)
{
  try {
    const rules = await BrandFortressService.getRules(assetId);
    return { success: true as const, rules };
  } catch (error: any) {
    return { success: false as const, error: error.message as string };
  }
}

export async function downloadAssetAction(assetId: string, options?: { format?: string; variant?: string })
{
  try {
    // Log the audit
    await BrandFortressService.logAudit(assetId, "download", "admin", options?.format);
    
    // In reality, this would generate a signed URL from S3 or proxy through Sharp API
    let url = `/api/assets/${assetId}/download`;
    if (options?.format) url += `?format=${options.format}`;
    if (options?.variant) url += `${options.format ? '&' : '?'}variant=${options.variant}`;

    return { success: true as const, url };
  } catch (error: any) {
    console.error("Failed to download asset:", error);
    return { success: false as const, error: error.message as string };
  }
}
