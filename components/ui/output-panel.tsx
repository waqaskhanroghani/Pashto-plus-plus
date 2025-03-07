"use client";

import { useRef, useEffect } from "react";

interface OutputPanelProps {
  output: string;
}

export function OutputPanel({ output }: OutputPanelProps) {
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div 
      ref={outputRef}
      className="flex-1 p-4 border rounded overflow-auto font-mono text-sm bg-black text-white whitespace-pre-wrap min-h-[300px] max-h-[calc(100vh-300px)]"
    >
      {output || "// Output will appear here when you run your code"}
    </div>
  );
}
