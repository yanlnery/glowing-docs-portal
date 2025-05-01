
import { useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import CodeBlock from "@/components/CodeBlock";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const GettingStarted = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="docs-heading text-3xl sm:text-4xl mb-4">Getting Started</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Learn how to integrate with PET SERPENTES APIs and tools to manage snake information
        </p>

        <div className="space-y-12">
          <section id="installation" className="docs-section">
            <h2 className="docs-section-title text-2xl font-bold mb-6">Installation</h2>
            
            <p className="mb-4">
              To get started with the PET SERPENTES API, you'll need to install our client library:
            </p>

            <CodeBlock 
              code={`# Using npm
npm install pet-serpentes-client

# Using yarn
yarn add pet-serpentes-client

# Using pnpm
pnpm add pet-serpentes-client`}
              language="bash"
            />

            <Alert className="mt-6">
              <Info className="h-5 w-5" />
              <AlertTitle>Note</AlertTitle>
              <AlertDescription>
                The client library requires Node.js 14.0.0 or later.
              </AlertDescription>
            </Alert>
          </section>

          <section id="authentication" className="docs-section">
            <h2 className="docs-section-title text-2xl font-bold mb-6">Authentication</h2>
            
            <p className="mb-4">
              To access the PET SERPENTES API, you need an API key. You can obtain one by registering on our portal.
            </p>

            <CodeBlock 
              code={`import { PetSerpentesClient } from 'pet-serpentes-client';

// Initialize the client with your API key
const client = new PetSerpentesClient({
  apiKey: 'YOUR_API_KEY'
});

// Test the connection
const isConnected = await client.testConnection();
console.log(isConnected ? 'Connected to API!' : 'Connection failed');`}
              language="javascript"
              filename="auth.js"
            />

            <Alert variant="destructive" className="mt-6">
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                Never expose your API key in client-side code. Always use environment variables or a secure vault.
              </AlertDescription>
            </Alert>
          </section>

          <section id="configuration" className="docs-section">
            <h2 className="docs-section-title text-2xl font-bold mb-6">Configuration</h2>
            
            <p className="mb-4">
              The PET SERPENTES client can be configured with several options:
            </p>

            <CodeBlock 
              code={`import { PetSerpentesClient } from 'pet-serpentes-client';

// Full configuration example
const client = new PetSerpentesClient({
  apiKey: 'YOUR_API_KEY',
  baseUrl: 'https://api.petserpentes.com/v1', // Optional, defaults to this URL
  timeout: 5000, // Optional, request timeout in milliseconds
  retries: 3, // Optional, number of retry attempts
  debug: process.env.NODE_ENV === 'development', // Optional, enable detailed logging
  cache: {
    enabled: true, // Optional, enable response caching
    ttl: 60 * 1000, // Optional, cache TTL in milliseconds
  }
});`}
              language="javascript"
              filename="config.js"
            />

            <Alert className="mt-6 border-green-200 dark:border-green-900">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <AlertTitle>Best Practice</AlertTitle>
              <AlertDescription>
                For production environments, it's recommended to increase the timeout and retry values to handle temporary network issues.
              </AlertDescription>
            </Alert>
          </section>

          <section id="basic-usage" className="docs-section">
            <h2 className="docs-section-title text-2xl font-bold mb-6">Basic Usage</h2>
            
            <p className="mb-4">
              Here's a simple example of fetching snake species data:
            </p>

            <CodeBlock 
              code={`// Import the client
import { PetSerpentesClient } from 'pet-serpentes-client';

// Initialize the client
const client = new PetSerpentesClient({
  apiKey: process.env.API_KEY
});

async function getSnakeInfo() {
  try {
    // Get all snake species
    const allSpecies = await client.species.list();
    console.log(\`Found \${allSpecies.length} snake species\`);
    
    // Get a specific snake by ID
    const kingCobra = await client.species.getById('king-cobra');
    console.log(\`King Cobra scientific name: \${kingCobra.scientificName}\`);
    
    // Search for snakes by criteria
    const venomousSnakes = await client.species.search({
      venomous: true,
      region: 'Asia'
    });
    console.log(\`Found \${venomousSnakes.length} venomous snake species in Asia\`);
  } catch (error) {
    console.error('Error fetching snake data:', error);
  }
}

// Run the example
getSnakeInfo();`}
              language="javascript"
              filename="basic-usage.js"
            />
          </section>
          
          <div className="border-t pt-6 mt-12">
            <h2 className="text-xl font-bold mb-4">Next Steps</h2>
            <p className="mb-4">
              Now that you're set up with the basics, you can explore more features:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><a href="/api" className="text-serpente-600 dark:text-serpente-400 hover:underline">Full API Reference</a> - Explore all available endpoints.</li>
              <li><a href="/examples" className="text-serpente-600 dark:text-serpente-400 hover:underline">Code Examples</a> - See practical usage examples.</li>
              <li><a href="/api/auth" className="text-serpente-600 dark:text-serpente-400 hover:underline">Advanced Authentication</a> - Learn about OAuth and token management.</li>
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default GettingStarted;
