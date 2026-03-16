import Header from "@/components/Header";
import { Link } from "react-router-dom";

export default function Browse() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6 text-center">
            <h1 className="text-4xl font-bold text-foreground">Browse Courses</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore thousands of courses across all categories. This page is coming soon with full filtering and search capabilities.
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
