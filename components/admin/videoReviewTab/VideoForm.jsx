import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useVideo } from "@/hooks/useVideo";

export default function VideoForm() {
    const [newVideo, setNewVideo] = useState({
        title: "",
        description: "",
        videoId: "",
    });
    const { handleAddVideo } = useVideo();
    return (
        <div className="bg-white dark:bg-black/50 rounded-lg border border-border p-6 mb-6">
            <h3 className="font-bold text-lg mb-4">Add New Video Review</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                        Video Title
                    </label>
                    <Input
                        placeholder="e.g., 2023 Toyota Camry Full Review"
                        value={newVideo.title}
                        onChange={(e) =>
                            setNewVideo({ ...newVideo, title: e.target.value })
                        }
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                        Description
                    </label>
                    <textarea
                        className="w-full px-4 py-2 rounded bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
                        placeholder="Brief description of the video content..."
                        value={newVideo.description}
                        onChange={(e) =>
                            setNewVideo({
                                ...newVideo,
                                description: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            YouTube Video ID
                        </label>
                        <Input
                            placeholder="e.g., dQw4w9WgXcQ"
                            value={newVideo.videoId}
                            onChange={(e) =>
                                setNewVideo({ ...newVideo, videoId: e.target.value })
                            }
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Find this in the YouTube URL: youtube.com/watch?v=
                            <strong>VIDEO_ID</strong>
                        </p>
                    </div>
                    <div className="flex items-end pt-2">
                        <Button className="w-full" onClick={handleAddVideo}>
                            <Plus size={18} className="mr-2" />
                            Add Video
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}