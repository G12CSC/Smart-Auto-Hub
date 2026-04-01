import { Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VideoReview {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  createdAt: Date;
}

export  function VideoReviews({ video, index }: { video: VideoReview; index: number }) {
  return (
    <a
      key={video.id}
      className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-2xl hover:border-primary/50 transition-all duration-300 group cursor-pointer hover-glow fade-in-up"
      style={{
        opacity: 0,
        animationDelay: `${(index + 1) * 0.1}s`,
      }}
      href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="relative h-48 bg-muted overflow-hidden">
        <img
          src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition">
          <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
            <Play className="text-white fill-white ml-1" size={28} />
          </div>
        </div>
        <Badge className="absolute bottom-3 right-3 px-3 py-1 bg-primary text-white text-xs rounded-md font-semibold flex items-center gap-1">
          <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          YouTube
        </Badge>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
          {video.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
          {video.description}
        </p>
      </div>
    </a>
  );
}
