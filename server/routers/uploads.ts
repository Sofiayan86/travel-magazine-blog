import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { storagePut } from "../storage";
import { createFileUpload, getAllFileUploads, deleteFileUpload } from "../db";

export const uploadsRouter = router({
  list: publicProcedure.query(async () => {
    return getAllFileUploads();
  }),

  uploadImage: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
        data: z.string(), // Base64 encoded
        mimeType: z.string().default("image/jpeg"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Only admin can upload
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      try {
        // Decode base64
        const buffer = Buffer.from(input.data, "base64");

        // Upload to S3
        const { key, url } = await storagePut(
          `images/${Date.now()}-${input.filename}`,
          buffer,
          input.mimeType
        );

        // Save to database
        const fileUpload = await createFileUpload({
          filename: input.filename,
          fileKey: key,
          fileUrl: url,
          fileSize: buffer.length,
          mimeType: input.mimeType,
          fileType: "image",
          uploadedBy: ctx.user.id,
        });

        return {
          id: fileUpload.id,
          url: fileUpload.fileUrl,
          key: fileUpload.fileKey,
        };
      } catch (error) {
        console.error("Upload failed:", error);
        throw new Error("Failed to upload image");
      }
    }),

  uploadGPX: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
        data: z.string(), // Base64 encoded
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Only admin can upload
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      try {
        // Decode base64
        const buffer = Buffer.from(input.data, "base64");

        // Upload to S3
        const { key, url } = await storagePut(
          `gpx/${Date.now()}-${input.filename}`,
          buffer,
          "application/gpx+xml"
        );

        // Save to database
        const fileUpload = await createFileUpload({
          filename: input.filename,
          fileKey: key,
          fileUrl: url,
          fileSize: buffer.length,
          mimeType: "application/gpx+xml",
          fileType: "gpx",
          uploadedBy: ctx.user.id,
        });

        return {
          id: fileUpload.id,
          url: fileUpload.fileUrl,
          key: fileUpload.fileKey,
        };
      } catch (error) {
        console.error("GPX upload failed:", error);
        throw new Error("Failed to upload GPX file");
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Only admin can delete
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      await deleteFileUpload(input.id);
      return { success: true };
    }),
});

