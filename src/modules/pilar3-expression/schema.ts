import { pgTable, text, timestamp, uuid, varchar, jsonb } from "drizzle-orm/pg-core";

/**
 * Pilar 3: Brand Expression Studio
 * Prefix 'p3_' for modular isolation.
 */

// Templates with locked elements
export const templates = pgTable("p3_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").notNull(),
  
  name: varchar("name", { length: 255 }).notNull(),
  thumbnailUrl: varchar("thumbnail_url", { length: 512 }),
  category: varchar("category", { length: 50 }), // 'social', 'presentation', 'email'
  
  // Fabric.js or Canvas data structure
  canvasData: jsonb("canvas_data"), 
  lockedElements: jsonb("locked_elements"), // Array of IDs that cannot be moved/changed
  
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Generated Copywriting
export const aiCopy = pgTable("p3_ai_copy", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").notNull(),
  
  title: varchar("title", { length: 255 }),
  content: text("content"),
  tone: varchar("tone", { length: 50 }),
  platform: varchar("platform", { length: 50 }), // 'instagram', 'linkedin', 'email'
  
  // Context used to generate this
  contextId: uuid("context_id"), // Reference to pillar 1 strategy
  
  createdAt: timestamp("created_at").defaultNow(),
});
