import { prisma } from "@/lib/prisma";
import { BrandGenesisService } from "../pilar1-genesis/services";

export const BrandFortressService = {
  /**
   * Get all assets for a workspace
   */
  async getAssets(workspaceId?: string)
  {
    if (!workspaceId) {
      const workspace = await BrandGenesisService.getOrCreateDefaultWorkspace();
      workspaceId = workspace.id;
    }
    
    return await prisma.asset.findMany({
      where: { workspaceId },
      include: { auditLogs: true },
      orderBy: { createdAt: "desc" }
    });
  },

  /**
   * Get a single asset with its rules
   */
  async getAsset(assetId: string)
  {
    return await prisma.asset.findUnique({
      where: { id: assetId },
      include: { auditLogs: true }
    });
  },

  /**
   * Upload asset metadata and save to DB
   */
  async uploadAsset(data: { fileName: string; s3Key: string; mimeType: string; fileSize?: number; tags?: string[]; aiColors?: any; isLocked?: boolean })
  {
    const workspace = await BrandGenesisService.getOrCreateDefaultWorkspace();
    
    return await prisma.asset.create({
      data: {
        workspaceId: workspace.id,
        fileName: data.fileName,
        s3Key: data.s3Key,
        mimeType: data.mimeType,
        fileSize: data.fileSize || 0,
        tags: data.tags || [],
        aiColors: data.aiColors || [],
        isLocked: data.isLocked || false,
      }
    });
  },

  /**
   * Log an audit action
   */
  async logAudit(assetId: string, action: string, userId?: string, format?: string)
  {
    return await prisma.assetAuditLog.create({
      data: {
        assetId,
        action,
        format,
        userId: userId || "anonymous"
      }
    });
  },

  /**
   * BRAND RULES MANAGEMENT
   */
  
  async getRules(assetId?: string)
  {
    const workspace = await BrandGenesisService.getOrCreateDefaultWorkspace();
    return await prisma.brandRule.findMany({
      where: { 
        workspaceId: workspace.id,
        assetId: assetId || null
      }
    });
  },

  async saveRule(data: { assetId?: string; ruleType: string; ruleValue: any })
  {
    const workspace = await BrandGenesisService.getOrCreateDefaultWorkspace();
    
    // Find existing rule of this type for this asset
    const existing = await prisma.brandRule.findFirst({
      where: {
        workspaceId: workspace.id,
        assetId: data.assetId || null,
        ruleType: data.ruleType
      }
    });

    if (existing) {
      return await prisma.brandRule.update({
        where: { id: existing.id },
        data: { ruleValue: data.ruleValue }
      });
    }

    return await prisma.brandRule.create({
      data: {
        workspaceId: workspace.id,
        assetId: data.assetId || null,
        ruleType: data.ruleType,
        ruleValue: data.ruleValue
      }
    });
  },

  /**
   * Toggle asset lock status
   */
  async toggleLock(assetId: string, isLocked: boolean)
  {
    return await prisma.asset.update({
      where: { id: assetId },
      data: { isLocked }
    });
  }
};
