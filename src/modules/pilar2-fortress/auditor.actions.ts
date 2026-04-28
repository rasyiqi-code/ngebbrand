"use server";

import { revalidatePath } from "next/cache";
import { BrandAuditorService } from "./auditor.services";

/**
 * Start a new brand audit for a URL
 */
export async function startAuditAction(url: string, type: string = "website")
{
  try {
    // 1. Create pending report
    const report = await BrandAuditorService.createReport(url, type);
    
    // 2. Fetch content (Server-side fetch)
    // We use a simple fetch here. In real production, we might use a proxy or Puppeteer.
    let pageContent = "";
    try {
      const res = await fetch(url, { next: { revalidate: 0 } });
      pageContent = await res.text();
    } catch (e) {
      pageContent = "Failed to fetch actual URL content. Proceeding with metadata analysis only.";
    }

    // 3. Trigger analysis (Asynchronous but we wait for MVP)
    await BrandAuditorService.performAudit(report.id, pageContent);

    revalidatePath("/dashboard/fortress/auditor");
    return { success: true as const, reportId: report.id };
  } catch (error: any) {
    return { success: false as const, error: error.message as string };
  }
}

/**
 * Get audit history
 */
export async function getAuditHistoryAction()
{
  try {
    const reports = await BrandAuditorService.getReports();
    return { success: true as const, reports };
  } catch (error: any) {
    return { success: false as const, error: error.message as string };
  }
}
