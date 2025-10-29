import { mysqlEnum, mysqlTable, text, timestamp, varchar, int, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Articles table for storing blog posts
 */
export const articles = mysqlTable("articles", {
  id: varchar("id", { length: 64 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  category: varchar("category", { length: 100 }), // Country name
  author: varchar("author", { length: 100 }).default("Sofia Yan"),
  coverImageUrl: text("coverImageUrl"),
  coverImageKey: varchar("coverImageKey", { length: 255 }), // S3 key
  latitude: varchar("latitude", { length: 20 }),
  longitude: varchar("longitude", { length: 20 }),
  gpxFileUrl: text("gpxFileUrl"),
  gpxFileKey: varchar("gpxFileKey", { length: 255 }), // S3 key
  publishedAt: timestamp("publishedAt").defaultNow(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type Article = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;

/**
 * File uploads table for tracking uploaded files
 */
export const fileUploads = mysqlTable("fileUploads", {
  id: varchar("id", { length: 64 }).primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  fileKey: varchar("fileKey", { length: 255 }).notNull(), // S3 key
  fileUrl: text("fileUrl").notNull(), // S3 URL
  fileSize: int("fileSize"), // bytes
  mimeType: varchar("mimeType", { length: 100 }),
  fileType: mysqlEnum("fileType", ["image", "gpx", "other"]).notNull(),
  uploadedBy: varchar("uploadedBy", { length: 64 }), // user id
  createdAt: timestamp("createdAt").defaultNow(),
});

export type FileUpload = typeof fileUploads.$inferSelect;
export type InsertFileUpload = typeof fileUploads.$inferInsert;
