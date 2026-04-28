"use server";

import { revalidatePath } from "next/cache";
import { BrandAmplifierService } from "./services";

export async function getContentQueueAction() {
  try {
    const queue = await BrandAmplifierService.getContentQueue();
    return { success: true, queue };
  } catch (error: any) {
    console.error("Failed to fetch content queue:", error);
    return { success: false, error: error.message };
  }
}

export async function addContentToQueueAction(data: { content: string; platform: string; scheduledFor?: Date }) {
  try {
    await BrandAmplifierService.addToQueue(data);
    revalidatePath("/dashboard/amplifier");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to add to queue:", error);
    return { success: false, error: error.message };
  }
}

export async function getAnalyticsAction() {
  try {
    const analytics = await BrandAmplifierService.getAnalytics();
    return { success: true, analytics };
  } catch (error: any) {
    console.error("Failed to fetch analytics:", error);
    return { success: false, error: error.message };
  }
}
