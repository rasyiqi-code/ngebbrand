import { pgTable, text, timestamp, uuid, varchar, jsonb, integer } from "drizzle-orm/pg-core";

/**
 * Pilar 2: Brand Fortress - Digital Asset Management
 * Prefix 'p2_' for modular isolation.
 */
export const assets = pgTable("p2_assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").notNull(),
  
  fileName: varchar("file_name", { length: 255 }).notNull(),
  s3Key: varchar("s3_key", { length: 512 }).notNull(), // Path in storage
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  fileSize: integer("file_size"), // in bytes
  
  // AI Metadata (auto-tagging results)
  tags: text("tags").array(), // ['logo', 'blue', 'modern']
  aiColors: jsonb("ai_colors"), // [{ hex: '#1A2B3C', ratio: 0.8 }]
  
  // Locked Asset Settings
  isLocked: text("is_locked").default("false"), // Use text for boolean simplicity if needed, or boolean
  lockedSettings: jsonb("locked_settings"), // { clearSpace: 20, allowedFormats: ['png', 'svg'] }
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/**
 * Audit Logs for Asset Downloads
 */
export const assetAuditLog = pgTable("p2_asset_audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  assetId: uuid("asset_id").references(() => assets.id),
  userId: uuid("user_id"),
  action: varchar("action", { length: 50 }), // 'download_locked', 'download_original'
  format: varchar("format", { length: 10 }),
  timestamp: timestamp("timestamp").defaultNow(),
});
