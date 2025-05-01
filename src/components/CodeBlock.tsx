
import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
}

export default function CodeBlock({
  code,
  language = 'javascript',
  filename,
  showLineNumbers = true,
  highlightLines = []
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // Handle copy code to clipboard
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Split code into lines for line numbers
  const codeLines = code.split('\n');

  return (
    <div className="code-block group relative my-6">
      {filename && (
        <div className="code-block-header flex items-center">
          <Terminal size={14} className="mr-2 text-muted-foreground" />
          <span>{filename}</span>
        </div>
      )}
      <div className="relative">
        <button
          onClick={copyToClipboard}
          className="absolute right-2 top-2 rounded-md bg-muted-foreground/10 p-1 text-muted-foreground opacity-0 transition group-hover:opacity-100"
          aria-label="Copy code"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
        <div className="overflow-x-auto font-mono text-sm p-4">
          <pre className="language-{language}">
            {showLineNumbers ? (
              <div className="table w-full">
                {codeLines.map((line, i) => (
                  <div 
                    key={i}
                    className={cn(
                      "table-row",
                      highlightLines.includes(i + 1) && "bg-accent/20"
                    )}
                  >
                    <span className="table-cell text-right pr-4 select-none text-muted-foreground/60 w-8">
                      {i + 1}
                    </span>
                    <span className="table-cell">{line || ' '}</span>
                  </div>
                ))}
              </div>
            ) : (
              code
            )}
          </pre>
        </div>
        <div className="absolute top-2 right-2 bg-primary/10 text-xs px-2 py-0.5 rounded-sm text-muted-foreground">
          {language}
        </div>
      </div>
    </div>
  );
}
