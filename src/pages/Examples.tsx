
import { useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import CodePlayground from "@/components/CodePlayground";
import CodeBlock from "@/components/CodeBlock";

const Examples = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="docs-heading text-3xl sm:text-4xl mb-4">Code Examples</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Interactive examples to help you get started with the PET SERPENTES API
        </p>

        <div className="space-y-12">
          <section className="docs-section">
            <h2 className="docs-section-title text-2xl font-bold mb-6">Basic API Usage</h2>
            
            <p className="mb-6">
              This example shows how to fetch and display a list of snake species using our client library.
            </p>

            <CodePlayground
              title="Fetching Snake Species"
              initialCode={{
                js: `// Simulated PET SERPENTES API client
class PetSerpentesClient {
  constructor(config) {
    this.apiKey = config.apiKey;
    console.log("PET SERPENTES client initialized!");
  }
  
  async getSpecies() {
    // In a real implementation, this would make an API call
    // This is simulated data for the example
    return [
      {
        id: "ball-python",
        name: "Ball Python",
        scientificName: "Python regius",
        venomous: false
      },
      {
        id: "king-cobra",
        name: "King Cobra",
        scientificName: "Ophiophagus hannah",
        venomous: true
      },
      {
        id: "corn-snake",
        name: "Corn Snake",
        scientificName: "Pantherophis guttatus",
        venomous: false
      }
    ];
  }
}

// Initialize the client
const client = new PetSerpentesClient({
  apiKey: "demo_api_key"
});

// Function to fetch and display snake species
async function displaySnakes() {
  try {
    const species = await client.getSpecies();
    
    console.log("Found " + species.length + " snake species:");
    
    // Display each snake species
    species.forEach(snake => {
      const venomStatus = snake.venomous ? "Venomous" : "Non-venomous";
      console.log(\`- \${snake.name} (\${snake.scientificName}): \${venomStatus}\`);
    });
    
    return "Species data fetched successfully!";
  } catch (error) {
    console.error("Error fetching snake data:", error);
    return "Error: " + error.message;
  }
}

// Run the example
displaySnakes();`
              }}
            />

            <p className="mt-8 mb-6">
              Here's a more complex example that demonstrates searching for snakes by specific criteria:
            </p>

            <CodePlayground
              title="Searching Snake Species"
              initialCode={{
                js: `// Simulated PET SERPENTES API client
class PetSerpentesClient {
  constructor(config) {
    this.apiKey = config.apiKey;
    console.log("PET SERPENTES client initialized!");
    
    // Mock database for the example
    this.snakeDatabase = [
      {
        id: "ball-python",
        name: "Ball Python",
        scientificName: "Python regius",
        venomous: false,
        regions: ["West Africa", "Central Africa"],
        size: 150, // cm
        beginnerFriendly: true
      },
      {
        id: "king-cobra",
        name: "King Cobra",
        scientificName: "Ophiophagus hannah",
        venomous: true,
        regions: ["Southeast Asia", "India"],
        size: 420, // cm
        beginnerFriendly: false
      },
      {
        id: "corn-snake",
        name: "Corn Snake",
        scientificName: "Pantherophis guttatus",
        venomous: false,
        regions: ["North America"],
        size: 120, // cm
        beginnerFriendly: true
      },
      {
        id: "green-tree-python",
        name: "Green Tree Python",
        scientificName: "Morelia viridis",
        venomous: false,
        regions: ["Australia", "Indonesia", "Papua New Guinea"],
        size: 180, // cm
        beginnerFriendly: false
      },
      {
        id: "gaboon-viper",
        name: "Gaboon Viper",
        scientificName: "Bitis gabonica",
        venomous: true,
        regions: ["Africa"],
        size: 200, // cm
        beginnerFriendly: false
      }
    ];
  }
  
  async searchSpecies(criteria = {}) {
    // In a real implementation, this would make an API call
    // This is a simulated search for the example
    
    return this.snakeDatabase.filter(snake => {
      // Check each search criteria
      if (criteria.venomous !== undefined && snake.venomous !== criteria.venomous) {
        return false;
      }
      
      if (criteria.region && !snake.regions.some(r => r.toLowerCase().includes(criteria.region.toLowerCase()))) {
        return false;
      }
      
      if (criteria.minSize && snake.size < criteria.minSize) {
        return false;
      }
      
      if (criteria.maxSize && snake.size > criteria.maxSize) {
        return false;
      }
      
      if (criteria.beginnerFriendly !== undefined && snake.beginnerFriendly !== criteria.beginnerFriendly) {
        return false;
      }
      
      if (criteria.query) {
        const query = criteria.query.toLowerCase();
        return snake.name.toLowerCase().includes(query) || 
               snake.scientificName.toLowerCase().includes(query);
      }
      
      return true;
    });
  }
}

// Initialize the client
const client = new PetSerpentesClient({
  apiKey: "demo_api_key"
});

// Function to search and display snake species
async function searchSnakes() {
  try {
    console.log("Searching for beginner-friendly, non-venomous snakes:");
    const beginnerSnakes = await client.searchSpecies({
      venomous: false,
      beginnerFriendly: true
    });
    
    console.log(\`Found \${beginnerSnakes.length} beginner-friendly snakes:\`);
    beginnerSnakes.forEach(snake => {
      console.log(\`- \${snake.name}\`);
    });
    
    console.log("\\nSearching for large venomous snakes:");
    const largeVenomous = await client.searchSpecies({
      venomous: true,
      minSize: 200 // At least 2 meters
    });
    
    console.log(\`Found \${largeVenomous.length} large venomous snakes:\`);
    largeVenomous.forEach(snake => {
      console.log(\`- \${snake.name} (\${snake.size} cm)\`);
    });
    
    console.log("\\nSearching for snakes from Asia:");
    const asianSnakes = await client.searchSpecies({
      region: "Asia"
    });
    
    console.log(\`Found \${asianSnakes.length} Asian snakes:\`);
    asianSnakes.forEach(snake => {
      console.log(\`- \${snake.name} (Regions: \${snake.regions.join(", ")})\`);
    });
    
    return "Search completed successfully!";
  } catch (error) {
    console.error("Error searching snake data:", error);
    return "Error: " + error.message;
  }
}

// Run the example
searchSnakes();`
              }}
            />
          </section>

          <section className="docs-section">
            <h2 className="docs-section-title text-2xl font-bold mb-6">Data Visualization</h2>
            
            <p className="mb-4">
              This example demonstrates how you might use our API data to create visualizations with a library like Chart.js.
            </p>
            
            <CodeBlock 
              code={`import { PetSerpentesClient } from 'pet-serpentes-client';
import Chart from 'chart.js/auto';

// Initialize the client
const client = new PetSerpentesClient({
  apiKey: 'YOUR_API_KEY'
});

// Fetch data and create chart
async function createVenomousSnakeDistributionChart() {
  try {
    // Get venomous snakes
    const venomousSnakes = await client.searchSpecies({
      venomous: true
    });
    
    // Process data for visualization
    const regionCounts = {};
    
    venomousSnakes.forEach(snake => {
      snake.regions.forEach(region => {
        if (!regionCounts[region]) {
          regionCounts[region] = 0;
        }
        regionCounts[region]++;
      });
    });
    
    // Sort regions by snake count
    const sortedRegions = Object.keys(regionCounts).sort(
      (a, b) => regionCounts[b] - regionCounts[a]
    );
    
    // Create chart
    const ctx = document.getElementById('venomous-chart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: sortedRegions,
        datasets: [{
          label: 'Venomous Snake Species by Region',
          data: sortedRegions.map(region => regionCounts[region]),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Venomous Snake Species'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Geographic Region'
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Global Distribution of Venomous Snake Species'
          }
        }
      }
    });
    
  } catch (error) {
    console.error('Error creating chart:', error);
  }
}

createVenomousSnakeDistributionChart();`}
              language="javascript"
              filename="data-visualization.js"
            />
          </section>

          <section className="docs-section">
            <h2 className="docs-section-title text-2xl font-bold mb-6">Working with Care Guides</h2>
            
            <CodePlayground
              title="Accessing Care Information"
              initialCode={{
                js: `// Simulated PET SERPENTES API client
class PetSerpentesClient {
  constructor(config) {
    this.apiKey = config.apiKey;
    console.log("PET SERPENTES client initialized!");
  }
  
  async getCareGuide(speciesId) {
    // In a real implementation, this would make an API call
    
    // Simulated care guide data
    const careGuides = {
      "ball-python": {
        species: {
          id: "ball-python",
          name: "Ball Python",
          scientificName: "Python regius"
        },
        housing: {
          minimumEnclosureSize: "120x60x60cm",
          substrate: ["cypress mulch", "coconut fiber", "reptile bark"],
          temperature: {
            basking: "88-92°F",
            cool: "75-80°F"
          },
          humidity: "50-60%",
          lighting: "12 hours light/12 hours dark cycle"
        },
        feeding: {
          diet: ["mice", "rats"],
          frequency: "every 1-2 weeks",
          notes: "Feed prey items that are roughly 1-1.5x the width of the snake's body."
        },
        handlingTips: [
          "Support the entire body when handling",
          "Limit handling sessions to 15-20 minutes",
          "Avoid handling for 48 hours after feeding"
        ],
        commonIssues: [
          {
            name: "Respiratory infection",
            symptoms: ["wheezing", "bubbles from mouth/nose"],
            prevention: "Maintain proper temperature and humidity"
          },
          {
            name: "Stuck shed",
            symptoms: ["retained skin, particularly on eyes or tail tip"],
            prevention: "Ensure adequate humidity during shedding"
          }
        ]
      },
      "corn-snake": {
        species: {
          id: "corn-snake",
          name: "Corn Snake",
          scientificName: "Pantherophis guttatus"
        },
        housing: {
          minimumEnclosureSize: "90x45x45cm",
          substrate: ["aspen shavings", "paper towels", "reptile carpet"],
          temperature: {
            basking: "85-88°F",
            cool: "72-80°F"
          },
          humidity: "40-50%",
          lighting: "12 hours light/12 hours dark cycle"
        },
        feeding: {
          diet: ["mice"],
          frequency: "every 7-10 days for juveniles, every 10-14 days for adults",
          notes: "Feed prey items that are roughly 1-1.5x the width of the snake's body."
        },
        handlingTips: [
          "Gentle handling is important",
          "Support the entire body when handling",
          "Wash hands before and after handling"
        ],
        commonIssues: [
          {
            name: "Mites",
            symptoms: ["small black dots on snake or in enclosure", "excessive soaking"],
            prevention: "Quarantine new animals and maintain clean enclosure"
          }
        ]
      }
    };
    
    if (!careGuides[speciesId]) {
      throw new Error(\`Care guide not found for species: \${speciesId}\`);
    }
    
    return careGuides[speciesId];
  }
}

// Initialize the client
const client = new PetSerpentesClient({
  apiKey: "demo_api_key"
});

// Function to display care guide information
async function displayCareGuide(speciesId) {
  try {
    const careGuide = await client.getCareGuide(speciesId);
    
    console.log(\`Care Guide for \${careGuide.species.name} (\${careGuide.species.scientificName})\\n\`);
    
    console.log("HOUSING REQUIREMENTS:");
    console.log(\`- Minimum enclosure size: \${careGuide.housing.minimumEnclosureSize}\`);
    console.log(\`- Recommended substrate: \${careGuide.housing.substrate.join(", ")}\`);
    console.log(\`- Temperature: Basking \${careGuide.housing.temperature.basking}, Cool \${careGuide.housing.temperature.cool}\`);
    console.log(\`- Humidity: \${careGuide.housing.humidity}\`);
    
    console.log("\\nFEEDING:");
    console.log(\`- Diet: \${careGuide.feeding.diet.join(", ")}\`);
    console.log(\`- Frequency: \${careGuide.feeding.frequency}\`);
    console.log(\`- Notes: \${careGuide.feeding.notes}\`);
    
    console.log("\\nHANDLING TIPS:");
    careGuide.handlingTips.forEach((tip, index) => {
      console.log(\`\${index + 1}. \${tip}\`);
    });
    
    console.log("\\nCOMMON HEALTH ISSUES:");
    careGuide.commonIssues.forEach(issue => {
      console.log(\`- \${issue.name}:\`);
      console.log(\`  Symptoms: \${issue.symptoms.join(", ")}\`);
      console.log(\`  Prevention: \${issue.prevention}\`);
    });
    
    return "Care guide retrieved successfully!";
  } catch (error) {
    console.error("Error fetching care guide:", error);
    return "Error: " + error.message;
  }
}

// Run the example with Ball Python
displayCareGuide("ball-python");

// Uncomment to see the Corn Snake care guide instead:
// displayCareGuide("corn-snake");`
              }}
            />
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default Examples;
