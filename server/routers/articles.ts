import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { createArticle, getAllArticles, getArticle, getArticlesByCategory, updateArticle, deleteArticle } from "../db";
import { InsertArticle } from "../../drizzle/schema";

export const articlesRouter = router({
  list: publicProcedure.query(async () => {
    return getAllArticles();
  }),

  listByCategory: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ input }) => {
      return getArticlesByCategory(input.category);
    }),

  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return getArticle(input.id);
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        excerpt: z.string().optional(),
        content: z.string().min(1),
        category: z.string().optional(),
        author: z.string().optional(),
        coverImageUrl: z.string().optional(),
        coverImageKey: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        gpxFileUrl: z.string().optional(),
        gpxFileKey: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Only admin can create articles
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      return createArticle({
        ...input,
        author: input.author || "Sofia Yan",
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        excerpt: z.string().optional(),
        content: z.string().min(1).optional(),
        category: z.string().optional(),
        author: z.string().optional(),
        coverImageUrl: z.string().optional(),
        coverImageKey: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        gpxFileUrl: z.string().optional(),
        gpxFileKey: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Only admin can update articles
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const { id, ...data } = input;
      const updateData: Record<string, any> = {};
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          updateData[key] = value;
        }
      });
      return updateArticle(id, updateData as Partial<InsertArticle>);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Only admin can delete articles
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      await deleteArticle(input.id);
      return { success: true };
    }),
});

