import { prisma } from "@/lib/prisma";
import { AICortexService } from "../pilar6-cortex/services";
import { BrandGenesisService } from "../pilar1-genesis/services";
import { VisualIntelligenceService } from "../pilar7-visual/services";

export const BrandAuditorService = {
  /**
   * Get all audit reports for a workspace
   */
  async getReports(workspaceId?: string)
  {
    if (!workspaceId) {
      const workspace = await BrandGenesisService.getOrCreateDefaultWorkspace();
      workspaceId = workspace.id;
    }
    return await prisma.auditReport.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" }
    });
  },

  /**
   * Get a single report
   */
  async getReport(id: string)
  {
    return await prisma.auditReport.findUnique({
      where: { id }
    });
  },

  /**
   * Create a new pending report
   */
  async createReport(targetUrl: string, targetType: string = "website")
  {
    const workspace = await BrandGenesisService.getOrCreateDefaultWorkspace();
    return await prisma.auditReport.create({
      data: {
        workspaceId: workspace.id,
        targetUrl,
        targetType,
        score: 0,
        findings: [],
        status: "pending"
      }
    });
  },

  /**
   * THE CORE AUDIT ENGINE
   * This simulates the scanning process using AI.
   */
  async performAudit(reportId: string, pageContent: string)
  {
    const report = await this.getReport(reportId);
    if (!report) throw new Error("Report not found");

    const workspace = await BrandGenesisService.getOrCreateDefaultWorkspace();
    const strategy = await BrandGenesisService.getStrategy(workspace.id);
    const visual = await VisualIntelligenceService.getVisualIdentity();

    // 1. Prepare Brand Context for AI
    const brandContext = {
      name: strategy?.brandName || "Unknown Brand",
      tone: strategy?.toneOfVoice || "Professional",
      colors: (visual?.colorPalette as any)?.colors || {},
      keywords: visual?.visualDnaKeywords || []
    };

    // 2. AI Analysis via Cortex
    // We'll call AICortexService to analyze the content against the context
    const analysis = await AICortexService.analyzeBrandCompliance(pageContent, brandContext);

    // 3. Update the report in DB
    return await prisma.auditReport.update({
      where: { id: reportId },
      data: {
        status: "completed",
        score: analysis.score,
        findings: analysis.findings,
        colorAnalysis: analysis.colorAnalysis || null,
        toneAnalysis: analysis.toneAnalysis || null
      }
    });
  }
};
