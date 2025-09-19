"use client";

import { toolsList } from "@/config/tools-list";
import { Code } from "lucide-react";
import React from "react";

type ToolParameter = {
  type: string;
  description?: string;
  enum?: string[];
  properties?: { [key: string]: string | unknown };
};

const getToolArgs = (parameters: {
  [key: string]: ToolParameter | undefined;
}) => {
  return (
    <div className="ml-4">
      {Object.entries(parameters).map(([key, value]) => (
        <div key={key} className="my-1 flex items-center space-x-2 text-xs">
          <span className="text-primary">{key}:</span>
          <span className="text-muted-foreground">{value?.type}</span>
        </div>
      ))}
    </div>
  );
};

export default function FunctionsView() {
  return (
    <div className="flex flex-col space-y-4">
      {toolsList.map((tool) => (
        <div key={tool.name} className="flex items-start gap-2">
          <div className="rounded-md bg-primary/10 p-1 text-primary">
            <Code size={16} />
          </div>
          <div className="mt-0.5 font-mono text-sm text-foreground">
            {tool.name}(
            {tool.parameters && Object.keys(tool.parameters).length > 0
              ? getToolArgs(tool.parameters)
              : ""}
            )
          </div>
        </div>
      ))}
    </div>
  );
}
