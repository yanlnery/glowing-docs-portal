
import { useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import ApiEndpoint from "@/components/ApiEndpoint";

const Api = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="docs-heading text-3xl sm:text-4xl mb-4">API Reference</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Comprehensive documentation for the PET SERPENTES API
        </p>

        <div className="space-y-12">
          <section className="docs-section">
            <h2 className="docs-section-title text-2xl font-bold mb-6">Introduction</h2>
            <p className="mb-4">
              The PET SERPENTES API provides programmatic access to snake species data, care information, and management tools.
            </p>
            <p className="mb-4">
              All API requests should be made to the base URL: <code className="bg-muted px-2 py-1 rounded">https://api.petserpentes.com/v1</code>
            </p>
            <p className="mb-4">
              Responses are returned in JSON format. All timestamps are returned in ISO 8601 format.
            </p>
          </section>

          <section className="docs-section">
            <h2 className="docs-section-title text-2xl font-bold mb-6">Snake Species Endpoints</h2>
            
            <ApiEndpoint
              method="GET"
              endpoint="/species"
              description="Returns a list of all snake species in the database."
              parameters={[
                {
                  name: "limit",
                  type: "integer",
                  required: false,
                  description: "Maximum number of results to return. Default is 20, maximum is 100."
                },
                {
                  name: "offset",
                  type: "integer",
                  required: false,
                  description: "Number of results to skip. Used for pagination."
                },
                {
                  name: "sort",
                  type: "string",
                  required: false,
                  description: "Field to sort by. Available options: name, scientificName, popularity."
                }
              ]}
              responseFields={[
                {
                  name: "id",
                  type: "string",
                  description: "Unique identifier for the snake species."
                },
                {
                  name: "name",
                  type: "string",
                  description: "Common name of the snake."
                },
                {
                  name: "scientificName",
                  type: "string",
                  description: "Scientific name of the snake species."
                },
                {
                  name: "venomous",
                  type: "boolean",
                  description: "Whether the snake is venomous."
                },
                {
                  name: "regions",
                  type: "array of strings",
                  description: "Geographic regions where the snake is found."
                }
              ]}
              examples={[
                {
                  request: `GET /species?limit=2`,
                  response: `{
  "data": [
    {
      "id": "ball-python",
      "name": "Ball Python",
      "scientificName": "Python regius",
      "venomous": false,
      "regions": ["West Africa", "Central Africa"]
    },
    {
      "id": "corn-snake",
      "name": "Corn Snake",
      "scientificName": "Pantherophis guttatus",
      "venomous": false,
      "regions": ["United States", "Mexico"]
    }
  ],
  "pagination": {
    "total": 138,
    "limit": 2,
    "offset": 0
  }
}`
                }
              ]}
            />

            <ApiEndpoint
              method="GET"
              endpoint="/species/{id}"
              description="Returns detailed information about a specific snake species."
              parameters={[
                {
                  name: "id",
                  type: "string",
                  required: true,
                  description: "The unique identifier of the snake species."
                }
              ]}
              responseFields={[
                {
                  name: "id",
                  type: "string",
                  description: "Unique identifier for the snake species."
                },
                {
                  name: "name",
                  type: "string",
                  description: "Common name of the snake."
                },
                {
                  name: "scientificName",
                  type: "string",
                  description: "Scientific name of the snake species."
                },
                {
                  name: "description",
                  type: "string",
                  description: "Detailed description of the snake species."
                },
                {
                  name: "venomous",
                  type: "boolean",
                  description: "Whether the snake is venomous."
                },
                {
                  name: "size",
                  type: "object",
                  description: "Size information for the snake species."
                },
                {
                  name: "lifespan",
                  type: "object",
                  description: "Typical lifespan range in years."
                },
                {
                  name: "diet",
                  type: "array of strings",
                  description: "Typical food items for this snake species."
                },
                {
                  name: "habitat",
                  type: "object",
                  description: "Natural habitat information and husbandry requirements."
                },
                {
                  name: "images",
                  type: "array of objects",
                  description: "Images of the snake species."
                }
              ]}
              examples={[
                {
                  request: `GET /species/king-cobra`,
                  response: `{
  "id": "king-cobra",
  "name": "King Cobra",
  "scientificName": "Ophiophagus hannah",
  "description": "The king cobra is the world's longest venomous snake...",
  "venomous": true,
  "size": {
    "averageLength": "3-4m",
    "maximumLength": "5.85m"
  },
  "lifespan": {
    "wild": "15-20",
    "captivity": "up to 25"
  },
  "diet": ["snakes", "lizards", "small mammals"],
  "habitat": {
    "natural": "Forests and swamps of Southeast Asia and India",
    "temperature": "75-85°F",
    "humidity": "60-80%"
  },
  "images": [
    {
      "url": "https://api.petserpentes.com/images/king-cobra-1.jpg",
      "alt": "King cobra in defensive posture",
      "credit": "Wildlife Photographer"
    }
  ]
}`
                }
              ]}
            />

            <ApiEndpoint
              method="POST"
              endpoint="/species/search"
              description="Search for snake species based on specific criteria."
              parameters={[
                {
                  name: "query",
                  type: "string",
                  required: false,
                  description: "Text search query for snake names or descriptions."
                },
                {
                  name: "venomous",
                  type: "boolean",
                  required: false,
                  description: "Filter by whether the snake is venomous."
                },
                {
                  name: "region",
                  type: "string",
                  required: false,
                  description: "Geographic region to filter by."
                },
                {
                  name: "minSize",
                  type: "number",
                  required: false,
                  description: "Minimum size of the snake in centimeters."
                },
                {
                  name: "maxSize",
                  type: "number",
                  required: false,
                  description: "Maximum size of the snake in centimeters."
                },
                {
                  name: "beginner_friendly",
                  type: "boolean",
                  required: false,
                  description: "Filter by whether the snake is suitable for beginners."
                }
              ]}
              examples={[
                {
                  request: `POST /species/search
{
  "venomous": false,
  "beginner_friendly": true,
  "region": "North America"
}`,
                  response: `{
  "data": [
    {
      "id": "corn-snake",
      "name": "Corn Snake",
      "scientificName": "Pantherophis guttatus",
      "venomous": false,
      "beginner_friendly": true,
      "regions": ["United States", "Mexico"]
    },
    {
      "id": "california-kingsnake",
      "name": "California Kingsnake",
      "scientificName": "Lampropeltis getula californiae",
      "venomous": false,
      "beginner_friendly": true,
      "regions": ["United States"]
    }
  ],
  "total": 2
}`
                }
              ]}
            />
          </section>

          <section className="docs-section">
            <h2 className="docs-section-title text-2xl font-bold mb-6">Care Information Endpoints</h2>
            
            <ApiEndpoint
              method="GET"
              endpoint="/care-guides/{speciesId}"
              description="Returns detailed care information for a specific snake species."
              parameters={[
                {
                  name: "speciesId",
                  type: "string",
                  required: true,
                  description: "The unique identifier of the snake species."
                }
              ]}
              examples={[
                {
                  request: `GET /care-guides/ball-python`,
                  response: `{
  "species": {
    "id": "ball-python",
    "name": "Ball Python",
    "scientificName": "Python regius"
  },
  "housing": {
    "minimumEnclosureSize": "120x60x60cm",
    "substrate": ["cypress mulch", "coconut fiber", "reptile bark"],
    "temperature": {
      "basking": "88-92°F",
      "cool": "75-80°F"
    },
    "humidity": "50-60%",
    "lighting": "12 hours light/12 hours dark cycle"
  },
  "feeding": {
    "diet": ["mice", "rats"],
    "frequency": "every 1-2 weeks",
    "notes": "Feed prey items that are roughly 1-1.5x the width of the snake's body."
  },
  "handleingTips": [
    "Support the entire body when handling",
    "Limit handling sessions to 15-20 minutes",
    "Avoid handling for 48 hours after feeding"
  ],
  "commonIssues": [
    {
      "name": "Respiratory infection",
      "symptoms": ["wheezing", "bubbles from mouth/nose"],
      "prevention": "Maintain proper temperature and humidity"
    },
    {
      "name": "Stuck shed",
      "symptoms": ["retained skin, particularly on eyes or tail tip"],
      "prevention": "Ensure adequate humidity during shedding"
    }
  ]
}`
                }
              ]}
            />
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default Api;
