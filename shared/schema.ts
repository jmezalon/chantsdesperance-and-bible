import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  approvedCount: integer("approved_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const hymnSubmissions = pgTable("hymn_submissions", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  sectionId: integer("section_id").notNull(),
  sectionName: text("section_name").notNull(),
  language: text("language").notNull(),
  hymnNumber: integer("hymn_number").notNull(),
  title: text("title").notNull(),
  verses: text("verses").notNull(),
  chorus: text("chorus"),
  submittedBy: varchar("submitted_by").notNull().references(() => users.id),
  status: text("status").default("pending").notNull(),
  reviewedBy: varchar("reviewed_by").references(() => users.id),
  reviewNote: text("review_note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertHymnSubmissionSchema = createInsertSchema(hymnSubmissions).pick({
  sectionId: true,
  sectionName: true,
  language: true,
  hymnNumber: true,
  title: true,
  verses: true,
  chorus: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type HymnSubmission = typeof hymnSubmissions.$inferSelect;
export type InsertHymnSubmission = z.infer<typeof insertHymnSubmissionSchema>;
