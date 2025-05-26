import MainLayout from "@/layouts/MainLayout";
import Hero from "@/components/Hero";
import HeroCarousel from "@/components/HeroCarousel";
import CodeBlock from "@/components/CodeBlock";
import { ArrowRight, Book, Code, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Index = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout fullWidth>
      <Hero />
      <HeroCarousel />
      
      <div className="docs-container py-16">
        <div className="text-center mb-12">
          <div className="docs-section-title inline-flex">
            <h2 className="text-2xl sm:text-3xl font-bold">
              What is PET SERPENTES?
            </h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto mt-4">
            PET SERPENTES is a comprehensive platform for snake enthusiasts, 
            breeders, and researchers with detailed documentation and APIs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="docs-card docs-card-gradient flex flex-col items-center text-center p-8">
            <div className="h-12 w-12 rounded-full bg-serpente-100 dark:bg-serpente-900/50 flex items-center justify-center mb-4">
              <Book className="h-6 w-6 text-serpente-600" />
            </div>
            <h3 className="text-xl font-medium mb-2">Comprehensive Guides</h3>
            <p className="text-muted-foreground mb-6">
              In-depth documentation covering all aspects of snake care, breeding, and research.
            </p>
            <Button variant="outline" className="mt-auto" asChild>
              <Link to="/getting-started">
                Read guides <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="docs-card docs-card-gradient flex flex-col items-center text-center p-8">
            <div className="h-12 w-12 rounded-full bg-serpente-100 dark:bg-serpente-900/50 flex items-center justify-center mb-4">
              <Code className="h-6 w-6 text-serpente-600" />
            </div>
            <h3 className="text-xl font-medium mb-2">API Reference</h3>
            <p className="text-muted-foreground mb-6">
              Access our snake data API with detailed documentation and examples.
            </p>
            <Button variant="outline" className="mt-auto" asChild>
              <Link to="/api">
                Explore API <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="docs-card docs-card-gradient flex flex-col items-center text-center p-8">
            <div className="h-12 w-12 rounded-full bg-serpente-100 dark:bg-serpente-900/50 flex items-center justify-center mb-4">
              <FileQuestion className="h-6 w-6 text-serpente-600" />
            </div>
            <h3 className="text-xl font-medium mb-2">Interactive Examples</h3>
            <p className="text-muted-foreground mb-6">
              Try our code examples and see how our APIs work in real-time.
            </p>
            <Button variant="outline" className="mt-auto" asChild>
              <Link to="/examples">
                View examples <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mb-16">
          <div className="docs-section-title mb-6">
            <h2 className="text-2xl font-bold">Quick Start</h2>
          </div>
          
          <div className="prose max-w-none">
            <p className="text-lg mb-4">Get started with our API in just a few steps:</p>
            
            <CodeBlock 
              code={`// Install our client library
npm install pet-serpentes-client

// Initialize the client
import { PetSerpentesClient } from 'pet-serpentes-client';

const client = new PetSerpentesClient({
  apiKey: 'YOUR_API_KEY'
});

// Fetch all snake species
const snakes = await client.getSpecies();
console.log(snakes);`}
              language="javascript"
              filename="quick-start.js"
              highlightLines={[7, 8, 9, 10]}
            />
          </div>

          <div className="mt-8 text-center">
            <Button asChild>
              <Link to="/getting-started">
                Continue to Full Documentation <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="animated-snake-border rounded-lg p-8 bg-card">
          <div className="flex flex-col md:flex-row gap-6 md:items-center">
            <div className="md:flex-1">
              <h3 className="text-xl font-bold mb-2">Ready to get started?</h3>
              <p className="text-muted-foreground">
                Explore our documentation to learn everything about PET SERPENTES & COMPANHIA
              </p>
            </div>
            <div className="flex gap-4">
              <Button asChild>
                <Link to="/getting-started">Get Started</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/api">API Reference</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
