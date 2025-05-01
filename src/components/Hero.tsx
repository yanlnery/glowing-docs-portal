
import { ArrowRight, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <div className="relative py-16 md:py-24 hero-pattern overflow-hidden border-b">
      <div className="docs-container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <img
              src="/lovable-uploads/7cf1001e-0989-475f-aaf5-fb56c4fb22a4.png"
              alt="PET SERPENTES & COMPANHIA"
              className="h-20 md:h-24 animate-fade-in"
            />
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 animate-fade-in">
            PET SERPENTES Documentation
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in">
            Comprehensive guides, API references, and examples for working with our snake species database and management system.
          </p>

          <div className="flex flex-wrap justify-center gap-4 animate-fade-in">
            <Button asChild size="lg">
              <Link to="/getting-started">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link to="/api">
                API Reference
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Animated decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full -z-10 bg-gradient-to-l from-serpente-100/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-1/3 h-full -z-10 bg-gradient-to-r from-serpente-100/20 to-transparent" />
    </div>
  );
}
