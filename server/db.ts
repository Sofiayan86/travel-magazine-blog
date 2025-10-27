import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, articles, fileUploads, InsertArticle, InsertFileUpload } from "../drizzle/schema";
import { ENV } from './_core/env';
import { nanoid } from 'nanoid';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      id: user.id,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        user.role = 'admin';
        values.role = 'admin';
        updateSet.role = 'admin';
      }
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ Article Functions ============

export async function createArticle(data: Omit<InsertArticle, 'id'>) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const id = nanoid();
  const article: InsertArticle = {
    ...data,
    id,
  };

  await db.insert(articles).values(article);
  return { ...article, id };
}

export async function getArticle(id: string) {
  const db = await getDb();
  if (!db) {
    return undefined;
  }

  const result = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllArticles() {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return db.select().from(articles).orderBy(desc(articles.publishedAt));
}

export async function getArticlesByCategory(category: string) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return db.select().from(articles).where(eq(articles.category, category)).orderBy(desc(articles.publishedAt));
}

export async function updateArticle(id: string, data: Partial<InsertArticle>) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const updateData = {
    ...data,
    updatedAt: new Date(),
  };

  await db.update(articles).set(updateData).where(eq(articles.id, id));
  return getArticle(id);
}

export async function deleteArticle(id: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.delete(articles).where(eq(articles.id, id));
}

// ============ File Upload Functions ============

export async function createFileUpload(data: Omit<InsertFileUpload, 'id'>) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const id = nanoid();
  const fileUpload: InsertFileUpload = {
    ...data,
    id,
  };

  await db.insert(fileUploads).values(fileUpload);
  return { ...fileUpload, id };
}

export async function getFileUpload(id: string) {
  const db = await getDb();
  if (!db) {
    return undefined;
  }

  const result = await db.select().from(fileUploads).where(eq(fileUploads.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllFileUploads() {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return db.select().from(fileUploads).orderBy(desc(fileUploads.createdAt));
}

export async function deleteFileUpload(id: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.delete(fileUploads).where(eq(fileUploads.id, id));
}
