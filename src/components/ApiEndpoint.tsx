
import React from "react";
import { Badge } from "@/components/ui/badge";
import CodeBlock from "./CodeBlock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface ResponseField {
  name: string;
  type: string;
  description: string;
}

interface EndpointExample {
  request: string;
  response: string;
}

interface ApiEndpointProps {
  method: HttpMethod;
  endpoint: string;
  description: string;
  parameters?: Parameter[];
  responseFields?: ResponseField[];
  examples?: EndpointExample[];
}

// Map HTTP methods to colors
const methodColors: Record<HttpMethod, string> = {
  GET: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  POST: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  PUT: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  DELETE: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  PATCH: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
};

export default function ApiEndpoint({
  method,
  endpoint,
  description,
  parameters = [],
  responseFields = [],
  examples = [],
}: ApiEndpointProps) {
  return (
    <div className="border rounded-lg overflow-hidden mb-8 bg-card" id={endpoint.replace(/\//g, '-')}>
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Badge 
            variant="outline" 
            className={`font-mono ${methodColors[method]} border-0 px-2`}
          >
            {method}
          </Badge>
          <h3 className="font-mono font-medium">{endpoint}</h3>
        </div>
        <p className="mt-2 text-muted-foreground">{description}</p>
      </div>

      {(parameters.length > 0 || responseFields.length > 0 || examples.length > 0) && (
        <Tabs defaultValue="parameters" className="p-4">
          <TabsList className="mb-4">
            {parameters.length > 0 && <TabsTrigger value="parameters">Parameters</TabsTrigger>}
            {responseFields.length > 0 && <TabsTrigger value="response">Response</TabsTrigger>}
            {examples.length > 0 && <TabsTrigger value="examples">Examples</TabsTrigger>}
          </TabsList>

          {parameters.length > 0 && (
            <TabsContent value="parameters">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="py-2 px-4 text-sm font-medium">Name</th>
                      <th className="py-2 px-4 text-sm font-medium">Type</th>
                      <th className="py-2 px-4 text-sm font-medium">Required</th>
                      <th className="py-2 px-4 text-sm font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parameters.map((param, i) => (
                      <tr key={i} className="border-b">
                        <td className="py-2 px-4 font-mono text-sm">{param.name}</td>
                        <td className="py-2 px-4 text-sm">
                          <Badge variant="outline">{param.type}</Badge>
                        </td>
                        <td className="py-2 px-4 text-sm">
                          {param.required ? (
                            <Badge variant="default">Required</Badge>
                          ) : (
                            <Badge variant="outline">Optional</Badge>
                          )}
                        </td>
                        <td className="py-2 px-4 text-sm text-muted-foreground">
                          {param.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          )}

          {responseFields.length > 0 && (
            <TabsContent value="response">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="py-2 px-4 text-sm font-medium">Field</th>
                      <th className="py-2 px-4 text-sm font-medium">Type</th>
                      <th className="py-2 px-4 text-sm font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {responseFields.map((field, i) => (
                      <tr key={i} className="border-b">
                        <td className="py-2 px-4 font-mono text-sm">{field.name}</td>
                        <td className="py-2 px-4 text-sm">
                          <Badge variant="outline">{field.type}</Badge>
                        </td>
                        <td className="py-2 px-4 text-sm text-muted-foreground">
                          {field.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          )}

          {examples.length > 0 && (
            <TabsContent value="examples">
              {examples.map((example, i) => (
                <div key={i}>
                  <h4 className="text-sm font-medium mt-4 mb-2">Request</h4>
                  <CodeBlock 
                    code={example.request}
                    language="json"
                    showLineNumbers={false}
                  />
                  
                  <h4 className="text-sm font-medium mt-4 mb-2">Response</h4>
                  <CodeBlock 
                    code={example.response}
                    language="json"
                    showLineNumbers={false}
                  />
                </div>
              ))}
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  );
}
