import Header from "@/components/Header";
import { Link } from "react-router-dom";

export default function MyLearning() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6 text-center">
            <h1 className="text-4xl font-bold text-foreground">My Learning</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Track your progress and continue where you left off. Your personalized learning dashboard is coming soon.
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
