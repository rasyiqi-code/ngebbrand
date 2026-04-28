import { pgTable, text, timestamp, uuid, varchar, jsonb } from "drizzle-orm/pg-core";

/**
 * Pilar 1: Brand Strategy Schema
 * Using a dedicated table for pilar 1 data.
 * Prefix 'p1_' for future microservice migration clarity.
 */
export const brandStrategy = pgTable("p1_brand_strategy", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").notNull(), // Links to the workspace
  
  // Core Identity
  brandName: varchar("brand_name", { length: 255 }),
  brandEssence: varchar("brand_essence", { length: 255 }),
  brandMantra: varchar("brand_mantra", { length: 255 }),
  whyStatement: text("why_statement"),
  
  // Archetypes
  archetypePrimary: varchar("archetype_primary", { length: 50 }),
  archetypeSecondary: varchar("archetype_secondary", { length: 50 }),
  
  // Strategic Frameworks (JSON storage for flexibility)
  goldenCircle: jsonb("golden_circle"), // { why, how, what }
  brandKey: jsonb("brand_key"), // 9 elements
  
  // AI metadata
  updatedAt: timestamp("updated_at").defaultNow(),
  updatedByMode: varchar("updated_by_mode", { length: 20 }), // 'discovery' or 'manual'
});
