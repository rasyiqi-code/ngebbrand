import { prisma } from "@/lib/prisma";
import { BrandGenesisService } from "../pilar1-genesis/services";

export const BrandAmplifierService = {
  /**
   * Get all content queue for a workspace
   */
  async getContentQueue(workspaceId?: string) {
    if (!workspaceId) {
      const workspace = await BrandGenesisService.getOrCreateDefaultWorkspace();
      workspaceId = workspace.id;
    }
    
    return await prisma.contentQueue.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" }
    });
  },

  /**
   * Add content to queue
   */
  async addToQueue(data: { content: string; platform: string; scheduledFor?: Date; aiInsights?: any }) {
    const workspace = await BrandGenesisService.getOrCreateDefaultWorkspace();
    
    return await prisma.contentQueue.create({
      data: {
        workspaceId: workspace.id,
        content: data.content,
        platform: data.platform,
        scheduledFor: data.scheduledFor,
        aiInsights: data.aiInsights
      }
    });
  },

  /**
   * Get Analytics data
   */
  async getAnalytics(workspaceId?: string) {
    if (!workspaceId) {
      const workspace = await BrandGenesisService.getOrCreateDefaultWorkspace();
      workspaceId = workspace.id;
    }

    return await prisma.analyticsData.findMany({
      where: { workspaceId },
      orderBy: { date: "desc" }
    });
  }
};
