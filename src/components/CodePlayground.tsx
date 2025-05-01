
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import CodeBlock from './CodeBlock';

interface CodePlaygroundProps {
  initialCode: {
    js?: string;
    css?: string;
    html?: string;
  };
  title?: string;
}

export default function CodePlayground({ 
  initialCode,
  title = "Interactive Example" 
}: CodePlaygroundProps) {
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState<string>("");
  const [isError, setIsError] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("js");
  const [isRunning, setIsRunning] = useState(false);

  // Run code effect
  useEffect(() => {
    if (isRunning) {
      try {
        // Create a sandbox environment
        const sandboxFn = new Function(
          'html', 'css', 
          `
          try {
            ${code.js || ''}
            return "Code executed successfully!";
          } catch (error) {
            return "Error: " + error.message;
          }
          `
        );
        
        const output = sandboxFn(code.html, code.css);
        setResult(output);
        setIsError(output.startsWith("Error"));
      } catch (error) {
        setResult(`Error: ${(error as Error).message}`);
        setIsError(true);
      }
      setIsRunning(false);
    }
  }, [isRunning, code]);

  const handleRun = () => {
    setIsRunning(true);
  };

  const handleReset = () => {
    setCode(initialCode);
    setResult("");
  };

  return (
    <div className="border rounded-lg overflow-hidden mb-8 bg-card">
      {title && (
        <div className="p-4 border-b">
          <h3 className="font-medium">{title}</h3>
        </div>
      )}
      
      <Tabs defaultValue="js" value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b px-4">
          <TabsList className="h-10">
            {code.js && <TabsTrigger value="js">JavaScript</TabsTrigger>}
            {code.html && <TabsTrigger value="html">HTML</TabsTrigger>}
            {code.css && <TabsTrigger value="css">CSS</TabsTrigger>}
            <TabsTrigger value="result">Result</TabsTrigger>
          </TabsList>
        </div>
        
        {code.js && (
          <TabsContent value="js" className="mt-0 relative">
            <textarea
              className="min-h-[300px] w-full p-4 font-mono text-sm bg-muted outline-none resize-none"
              value={code.js}
              onChange={(e) => setCode({ ...code, js: e.target.value })}
              spellCheck="false"
            />
          </TabsContent>
        )}
        
        {code.html && (
          <TabsContent value="html" className="mt-0">
            <textarea
              className="min-h-[300px] w-full p-4 font-mono text-sm bg-muted outline-none resize-none"
              value={code.html || ""}
              onChange={(e) => setCode({ ...code, html: e.target.value })}
              spellCheck="false"
            />
          </TabsContent>
        )}
        
        {code.css && (
          <TabsContent value="css" className="mt-0">
            <textarea
              className="min-h-[300px] w-full p-4 font-mono text-sm bg-muted outline-none resize-none"
              value={code.css || ""}
              onChange={(e) => setCode({ ...code, css: e.target.value })}
              spellCheck="false"
            />
          </TabsContent>
        )}
        
        <TabsContent value="result" className="mt-0">
          <div className="min-h-[300px] p-4">
            <div className={cn(
              "p-4 rounded bg-card",
              isError ? "border-red-300" : "border"
            )}>
              <pre className={cn(
                "whitespace-pre-wrap text-sm font-mono",
                isError && "text-red-500"
              )}>
                {result || "Click 'Run' to see the result"}
              </pre>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between items-center p-2 border-t bg-muted/50">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleReset}
          className="text-xs gap-1"
        >
          <RefreshCw size={12} />
          Reset
        </Button>
        <Button 
          size="sm" 
          onClick={handleRun}
          className="text-xs gap-1"
        >
          <Play size={12} />
          Run
        </Button>
      </div>
    </div>
  );
}
