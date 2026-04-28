import { prisma } from "@/lib/prisma";

export interface BrandStrategy {
  id: string;
  workspaceId: string;
  brandName: string | null;
  whyStatement: string | null;
  archetypePrimary: string | null;
  // ... other fields
}

export const BrandGenesisService = {
  /**
   * Get or Create the default workspace for MVP
   */
  async getOrCreateDefaultWorkspace() {
    let workspace = await prisma.workspace.findFirst();
    if (!workspace) {
      workspace = await prisma.workspace.create({
        data: { name: "Default Workspace", industry: "General" }
      });
    }
    return workspace;
  },

  /**
   * Get brand strategy from DB
   */
  async getStrategy(workspaceId: string) {
    return await prisma.brandStrategy.findFirst({
      where: { workspaceId }
    });
  },

  /**
   * Update brand strategy
   */
  async updateStrategy(workspaceId: string, data: any) {
    const existing = await this.getStrategy(workspaceId);
    
    if (existing) {
      return await prisma.brandStrategy.update({
        where: { id: existing.id },
        data
      });
    } else {
      return await prisma.brandStrategy.create({
        data: {
          ...data,
          workspaceId
        }
      });
    }
  },

  /**
   * Business logic for generating AI insights (Integration with P6)
   */
  async generateInsights(data: any) {
    // This would call Pilar 6 (AI Cortex) internal API
    console.log("Generating insights for", data.brandName);
    return {
      status: "success",
      insight: "Fokus pada elemen 'Zen' untuk memperkuat arketipe Magician.",
    };
  },
};
