import { Link } from "react-router-dom";
import { Play } from "lucide-react";

interface ContentCardProps {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration?: string;
  badge?: string;
  progress?: number;
}

export default function ContentCard({
  id,
  title,
  description,
  thumbnail,
  duration,
  badge,
  progress,
}: ContentCardProps) {
  return (
    <Link to={`/course/${id}`}>
      <div className="group relative h-full rounded-lg overflow-hidden bg-card hover:bg-card/80 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
        {/* Thumbnail */}
        <div className="relative h-40 sm:h-44 md:h-52 overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />

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
          {duration && (
            <div className="absolute bottom-2 right-2 px-2 py-1 rounded text-xs font-semibold bg-background/80 text-foreground backdrop-blur-sm">
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
