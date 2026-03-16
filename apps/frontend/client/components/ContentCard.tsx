import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import { Video } from "@/services/contentService";

interface ContentCardProps {
  video: Video;
  progress?: number;
  badge?: string;
}

export default function ContentCard({ video, progress, badge }: ContentCardProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Link to={`/watch/${video.id}`}>
      <div className="group relative h-full rounded-lg overflow-hidden bg-card hover:bg-card/80 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
        {/* Thumbnail */}
        <div className="relative h-40 sm:h-44 md:h-52 overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
          {video.thumbnail ? (
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Play className="h-8 w-8" />
            </div>
          )}

          {/* Progress Bar */}
          {progress && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-background/50">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors">
              <Play className="h-5 w-5 text-primary-foreground fill-current" />
            </div>
          </div>

          {/* Badge */}
          {badge && (
            <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/90 text-primary-foreground backdrop-blur-sm">
              {badge}
            </div>
          )}

          {/* Duration */}
          <div className="absolute bottom-2 right-2 px-2 py-1 rounded text-xs font-semibold bg-background/80 text-foreground backdrop-blur-sm">
            {formatDuration(video.duration)}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {video.title}
          </h3>
          {video.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {video.description}
            </p>
          )}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{video.uploadedBy}</span>
            <span className="capitalize px-2 py-1 rounded bg-muted">
              {video.status}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
              {duration}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4">
          <h3 className="font-semibold text-sm sm:text-base text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 mt-1">
            {description}
          </p>

          {/* Progress bar */}
          {progress !== undefined && (
            <div className="mt-3 h-1 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
