import { fetchJSON } from "@/services/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getVideoReviews,
  addVideoReview,
  deleteVideoReview,
  editVideoReview
} from "@/app/actions/videoActions"; 

interface VideoReview {
    id: string;
    title: string;
    description: string;
    youtubeId: string;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export const useVideo = () => {
    const [videoReviews, setVideoReviews] = useState<VideoReview[]>([]);
    const [videoIds, setVideoIds] = useState<string[]>([]);
    const [newVideo, setNewVideo] = useState({ title: "", description: "", videoId: "" });
    const [deleteVideoId, setDeleteVideoId] = useState<string | null>(null);
    const [editingVideo, setEditingVideo] = useState<VideoReview | null>(null);

  const handleVideoFieldChange = (field:any, value: string, videoId: string) => {
    setVideoReviews((prev) =>
      prev.map((video) =>
        video.id === videoId ? { ...video, [field]: value } : video,
      ),
    );
  };

  const handleEditVideo = async (videoId: string) => {
    const video = videoReviews.find((v) => v.id === videoId);
    if (!video) {
      toast.error("Video not found");
      return;
    }
    try {
      const result = await editVideoReview(videoId, {
        title: video.title || "",
        description: video.description || null,
      });
      if (result.success) {
        toast.success("Video review updated successfully");
        loadVideos();
      } else {
        toast.error("Failed to update video review");
      }
    } catch (error) {
      toast.error("Failed to update video review");
    }
  };

  const loadVideos = async () => {
    const result: { success: boolean; data: VideoReview[]; ids: string[] } = await getVideoReviews();
    if (result.success) {
      setVideoReviews(result.data);
      setVideoIds(result.ids);
    }
  };

  const handleAddVideo = async () => {
    //Basic Validation
    if (!newVideo.title || !newVideo.videoId) {
      toast.error("Please fill in Title and VideoId");
      return;
    }

    //Call the server action
    const result: { success: boolean } = await addVideoReview(newVideo);

    if (result.success) {
      toast.success("Video Review added successfully");
      setNewVideo({ title: "", description: "", videoId: "" }); //Resets form
      loadVideos();
    } else {
      toast.error("Failed to add video");
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    const result: { success: boolean } = await deleteVideoReview(videoId);

    if (result.success) {
      toast.success("Video review removed from homepage");
      loadVideos(); //Refreshes the List
    } else {
      toast.error("Failed to remove the video");
    }
    setDeleteVideoId(null);
  };

  useEffect(() => {
    loadVideos();
  }, []);

  return {
    videoReviews,
    videoIds,
    newVideo,
    deleteVideoId,
    editingVideo,
    handleVideoFieldChange,
    handleEditVideo,
    loadVideos,
    handleAddVideo,
    handleDeleteVideo
  }
};
