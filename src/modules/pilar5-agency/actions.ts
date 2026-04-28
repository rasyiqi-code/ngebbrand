"use server";

import { revalidatePath } from "next/cache";
import { AgencyHubService } from "./services";

export async function getClientsAction() {
  try {
    const clients = await AgencyHubService.getClients();
    return { success: true, clients };
  } catch (error: any) {
    console.error("Failed to fetch clients:", error);
    return { success: false, error: error.message };
  }
}

export async function createClientAction(data: { name: string; industry?: string }) {
  try {
    const client = await AgencyHubService.createClient(data);
    revalidatePath("/dashboard/agency");
    return { success: true, client };
  } catch (error: any) {
    console.error("Failed to create client:", error);
    return { success: false, error: error.message };
  }
}
