
import VideoForm from "./VideoForm";
import VideoList from "./VideoList";

export default function VideoReviewTab() {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold">
                        Video Reviews Management
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage YouTube video reviews displayed on homepage
                    </p>
                </div>
            </div>
            <div>
                <VideoForm />
            </div>
            <div>
                <VideoList />
            </div>
        </div>
    );
}