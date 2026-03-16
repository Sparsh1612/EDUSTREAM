import { useState, useEffect } from "react";
import { ChevronRight, Play, Zap, Users, Wifi } from "lucide-react";
import Header from "@/components/Header";
import ContentCard from "@/components/ContentCard";
import { contentService, Video } from "@/services/contentService";

export default function Index() {
  const [trendingVideos, setTrendingVideos] = useState<Video[]>([]);
  const [continueWatching, setContinueWatching] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // Fetch trending videos
        const trending = await contentService.getVideos({ limit: 6 });
        setTrendingVideos(trending);

        // For now, use same videos for continue watching (in a real app, this would be based on user progress)
        setContinueWatching(trending.slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="text-lg">Loading EduStream content...</div>
          </div>
        </div>
      </div>
    );
  }

  // Use first video as featured if available
  const featuredVideo = trendingVideos[0];

  const CATEGORIES = [
    { icon: Zap, label: "Trending", color: "from-primary to-secondary" },
    { icon: Users, label: "For You", color: "from-secondary to-accent" },
    { icon: Wifi, label: "Low Bandwidth", color: "from-accent to-primary" },
  ];

function ContentRow({ title, courses, showViewAll }: { title: string; courses: any[]; showViewAll?: boolean }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg sm:text-2xl font-bold text-foreground">{title}</h2>
        {showViewAll && (
          <button className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors">
            View All <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8">
        <div className="flex gap-4 pb-4 min-w-min">
          {courses.map((course) => (
            <div key={course.id} className="w-full sm:w-80 flex-shrink-0">
              <ContentCard {...course} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  const [isAutoPlay] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="relative h-96 sm:h-[500px] md:h-[600px] overflow-hidden pt-16">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={FEATURED_COURSE.image}
            alt={FEATURED_COURSE.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <div className="inline-block px-3 py-1 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30">
                <span className="text-xs sm:text-sm font-semibold text-primary">Featured Course</span>
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight animate-fade-in">
                {featuredVideo?.title || "Welcome to EduStream"}
              </h1>
            </div>

            <p className="text-sm sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
              {featuredVideo?.description || "Adaptive streaming platform optimized for low-bandwidth environments"}
            </p>

            {/* Course Meta */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/20" />
                <span className="text-foreground/80">{featuredVideo?.uploadedBy || "EduStream"}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-primary font-semibold">{featuredVideo?.status || "Ready"}</span>
              </div>
              <span className="text-muted-foreground">{featuredVideo ? `${Math.floor(featuredVideo.duration / 60)} min` : ""}</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-lg bg-gradient-to-r from-primary via-secondary to-accent text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105 group">
                <Play className="h-5 w-5 group-hover:fill-current" />
                Play Now
              </button>
              <button className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-lg border border-primary/50 text-primary font-semibold hover:bg-primary/10 transition-all duration-300">
                + Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <button
                key={idx}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-full font-semibold text-sm text-white bg-gradient-to-r ${cat.color} hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:scale-105 flex-shrink-0`}
              >
                <Icon className="h-4 w-4" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Continue Watching */}
      {continueWatching.length > 0 && (
        <div className="py-8 space-y-6">
          <ContentRow title="Continue Watching" courses={continueWatching} />
        </div>
      )}

      {/* Trending Now */}
      <div className="py-8 space-y-6">
        <ContentRow title="Trending Videos" courses={trendingVideos} showViewAll />
      </div>

      {/* Footer CTA */}
      <div className="relative mt-16 mb-8 px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 border border-primary/30 p-8 sm:p-12 text-center">
          {/* Gradient background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary blur-3xl" />
            <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-accent blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative space-y-4">
            <h2 className="text-2xl sm:text-4xl font-bold text-foreground">
              Ready to start learning?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Access 10,000+ high-quality courses optimized for low-bandwidth environments. Learn anything, anywhere, anytime.
            </p>
            <button className="inline-flex px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105">
              Explore All Courses
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground">
            <p>&copy; 2024 EduStream. All rights reserved.</p>
            <p className="mt-4 sm:mt-0">Optimized for low-bandwidth environments. Stream anywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
