"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

//Fetch all videos (Newest first)
export async function getVideoReviews() {
  try {
    const videos = await prisma.videoReview.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: videos };
  } catch (error) {
    console.error("Error fetching video reviews:", error);
    return { success: false, error: "Failed to fetch video reviews" };
  }
}

//Add a new video review
export async function addVideoReview(formData: {
  title: string;
  description: string;
  videoId: string;
}) {
  try {
    await prisma.videoReview.create({
      data: {
        title: formData.title,
        description: formData.description,
        videoId: formData.videoId,
      },
    });

    //telling NextJs to refresh the data on these pages immediately
    revalidatePath("/");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Error adding video review:", error);
    return { success: false, error: "Failed to add video review" };
  }
}

//Delete a video review by ID
export async function deleteVideoReview(id: string) {
  try {
    await prisma.videoReview.delete({
      where: { id },
    });
    //telling NextJs to refresh the data on these pages immediately
    revalidatePath("/");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Error deleting video review:", error);
    return { success: false, error: "Failed to delete video review" };
  }
}
