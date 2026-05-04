
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVideo } from "@/hooks/useVideo";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2, ExternalLink, Video, CircleX } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";


export default function VideoList() {
    const { videoReviews, handleVideoFieldChange, handleEditVideo, handleDeleteVideo } = useVideo();
    return (
        <div>
            <div className="space-y-4">
                <h3 className="font-bold text-lg">
                    Published Videos ({videoReviews.length})
                </h3>
                {videoReviews.map((video) => (
                    <div
                        key={video.id}
                        className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-secondary/30 transition"
                    >
                        <div className="relative h-24 w-40 shrink-0 bg-secondary rounded overflow-hidden group">
                            <img
                                src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                                alt={video.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Video size={24} className="text-white" />
                            </div>
                        </div>
                        <div className="grow">
                            <h4 className="font-semibold text-base mb-1">
                                {video.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {video.description}
                            </p>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>Uploaded: { }</span>
                                <span>{video.views} views</span>
                                <span>ID: {video.youtubeId}</span>

                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                    window.open(
                                        `https://www.youtube.com/watch?v=${video.youtubeId}`,
                                        "_blank",
                                    )
                                }
                            >
                                <ExternalLink size={16} />
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button size="sm" variant="ghost">
                                        <Edit size={16} />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-lg font-bold flex justify-between items-center">
                                            Edit Video Review
                                            <AlertDialogCancel size="xs" variant="outline" className="ml-4 cursor-pointer" >
                                                <CircleX />
                                            </AlertDialogCancel>
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will allow you to edit the video title and
                                            description. To change the video itself, please
                                            delete and re-add with the new YouTube ID.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <div className="p-4">
                                        <Input
                                            className="mb-4"
                                            value={video.title}
                                            onChange={(e) => handleVideoFieldChange("title", e.target.value, video.id)}
                                            placeholder="Video Title"
                                        />
                                        <Textarea
                                            value={video.description}
                                            onChange={(e) => handleVideoFieldChange("description", e.target.value, video.id)}
                                            placeholder="Video Description"
                                        />
                                        <Button onClick={() => {
                                            handleEditVideo(video.id);

                                        }} className="mt-4">
                                            Save Changes
                                        </Button>
                                    </div>
                                </AlertDialogContent>
                            </AlertDialog>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Remove Video</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to remove this video from
                                            the homepage? This cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <div className="flex justify-end gap-3">
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => handleDeleteVideo(video.id)}
                                            className="bg-red-600 hover:bg-red-700"
                                        >
                                            Remove
                                        </AlertDialogAction>
                                    </div>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}