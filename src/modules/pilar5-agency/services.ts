import { prisma } from "@/lib/prisma";

export const AgencyHubService = {
  /**
   * Get all clients for the agency
   */
  async getClients() {
    return await prisma.client.findMany({
      include: {
        workspaces: true
      },
      orderBy: { createdAt: "desc" }
    });
  },

  /**
   * Create a new client and their default workspace
   */
  async createClient(data: { name: string; industry?: string }) {
    return await prisma.client.create({
      data: {
        name: data.name,
        workspaces: {
          create: {
            name: `${data.name} Workspace`,
            industry: data.industry
          }
        }
      },
      include: {
        workspaces: true
      }
    });
  }
};
