import { prisma } from "@/lib/db";
import { IResponse } from "@/lib/type";
import {
  ICreateOGImage,
  IOGImageDetail,
  IUpdateOGImage,
} from "@/services/ogImage/ogImage.interface";
import { storageService } from "@/services/storage";
import { usageService } from "@/services/usage";

class OGImageService {
  async create({
    src,
    expiresAt,
    userId,
  }: ICreateOGImage): Promise<IResponse<IOGImageDetail | null>> {
    try {
      // Check usage first
      const usageRes = await usageService.incrementUsage({ userId });
      if (usageRes.status !== 200) {
        return {
          message: usageRes.message,
          status: usageRes.status,
          data: null,
        };
      }

      const ogImage = await prisma.oGImage.create({
        data: {
          src,
          expiresAt,
        },
      });

      return {
        message: "OG Image created successfully",
        status: 200,
        data: ogImage as IOGImageDetail,
      };
    } catch (error) {
      console.error(`Error creating OG Image: ${error}`);
      return {
        status: 500,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        data: null,
      };
    }
  }

  async updateBy({
    id,
    src,
    expiresAt,
  }: IUpdateOGImage): Promise<IResponse<IOGImageDetail | null>> {
    try {
      const ogImage = await prisma.oGImage.update({
        where: {
          id,
        },
        data: {
          src,
          expiresAt,
        },
      });

      if (!ogImage) {
        return {
          message: "OG Image not found",
          status: 404,
          data: null,
        };
      }

      return {
        message: "OG Image updated successfully",
        status: 200,
        data: ogImage as IOGImageDetail,
      };
    } catch (error) {
      console.error(`Error updating OG Image: ${error}`);
      return {
        status: 500,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        data: null,
      };
    }
  }

  async deleteBy({ id }: { id: string }): Promise<IResponse<null>> {
    try {
      const ogImage = await prisma.oGImage.findUnique({
        where: {
          id,
        },
      });

      if (!ogImage) {
        return {
          message: "OG Image not found",
          status: 404,
          data: null,
        };
      }

      await prisma.oGImage.delete({
        where: {
          id,
        },
      });

      // delete images from storage
      await storageService.deleteImages({
        keys: [ogImage.src],
      });

      return {
        message: "OG Image deleted successfully",
        status: 200,
        data: null,
      };
    } catch (error) {
      console.error(`Error deleting OG Image: ${error}`);
      return {
        status: 500,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        data: null,
      };
    }
  }
}

export const ogImageService = new OGImageService();
