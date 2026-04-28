import { prisma } from "@/lib/prisma";
import { BrandGenesisService } from "../pilar1-genesis/services";

/**
 * Pilar 7: Visual Intelligence Service
 * Manages Aaker Canvas, Kapferer Prism, and AI Visual Assets.
 */
export const VisualIntelligenceService = {
  /**
   * Get or create visual identity for the default workspace
   */
  async getVisualIdentity()
  {
    const workspace = await BrandGenesisService.getOrCreateDefaultWorkspace();

    let identity = await prisma.visualIdentity.findUnique({
      where: { workspaceId: workspace.id }
    });

    if (!identity) {
      identity = await prisma.visualIdentity.create({
        data: {
          workspaceId: workspace.id,
          visualDnaKeywords: []
        }
      });
    }

    return identity;
  },

  /**
   * Update Aaker Canvas data
   */
  async updateAaker(data: {
    product?: string;
    organization?: string;
    person?: string;
    symbol?: string;
  })
  {
    const identity = await this.getVisualIdentity();
    return prisma.visualIdentity.update({
      where: { id: identity.id },
      data: {
        aakerProduct: data.product,
        aakerOrganization: data.organization,
        aakerPerson: data.person,
        aakerSymbol: data.symbol
      }
    });
  },

  /**
   * Update Kapferer Prism data
   */
  async updatePrism(data: {
    physique?: string;
    personality?: string;
    culture?: string;
    relationship?: string;
    reflection?: string;
    selfImage?: string;
  })
  {
    const identity = await this.getVisualIdentity();
    return prisma.visualIdentity.update({
      where: { id: identity.id },
      data: {
        prismPhysique: data.physique,
        prismPersonality: data.personality,
        prismCulture: data.culture,
        prismRelationship: data.relationship,
        prismReflection: data.reflection,
        prismSelfImage: data.selfImage
      }
    });
  },

  /**
   * Update Visual DNA keywords
   */
  async updateVisualDNA(keywords: string[])
  {
    const identity = await this.getVisualIdentity();
    return prisma.visualIdentity.update({
      where: { id: identity.id },
      data: { visualDnaKeywords: keywords }
    });
  },

  /**
   * Update AI Visual System (Colors & Typography)
   */
  async updateVisualSystem(data: {
    colorPalette?: any;
    typography?: any;
  })
  {
    const identity = await this.getVisualIdentity();
    return prisma.visualIdentity.update({
      where: { id: identity.id },
      data: {
        colorPalette: data.colorPalette,
        typography: data.typography
      }
    });
  }
};
