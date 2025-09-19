"use client";
import React, { useState } from "react";
import { McpListToolsItem } from "@/lib/assistant";
import { ChevronRight, Code } from "lucide-react";

interface Props {
  item: McpListToolsItem;
}

export default function McpToolsList({ item }: Props) {
  function ToolDescription({ description }: { description: string }) {
    const [expanded, setExpanded] = useState(false);
    return (
      <div className="flex items-start mt-1 gap-2">
        <div
          className={
            `text-muted-foreground text-xs whitespace-pre-wrap transition-all duration-200 ` +
            (expanded ? "line-clamp-none" : "line-clamp-1 overflow-hidden")
          }
          style={{ maxWidth: 400 }}
        >
          {description}
        </div>
        <div
          className="flex cursor-pointer select-none items-center text-xs text-muted-foreground focus:outline-none"
          onClick={() => setExpanded((prev) => !prev)}
        >
          <ChevronRight
            className={`h-4 w-4 transition-transform duration-200 mr-1 ${
              expanded ? "rotate-90" : "rotate-0"
            }`}
            aria-hidden="true"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex">
        <div className="mr-4 rounded-[16px] bg-card px-4 py-2 font-light text-card-foreground transition-colors md:mr-24">
          <div className="mb-2 text-sm text-primary">
            Server <span className="font-semibold">{item.server_label}</span>{" "}
            tools list
          </div>
          <div className="mt-3 space-y-2 text-sm">
            {item.tools.map((tool) => (
              <div key={tool.name}>
                <div className="flex items-center gap-2 text-xs">
                  <div className="rounded-md bg-primary/10 p-1 text-primary">
                    <Code size={12} />
                  </div>
                  <div className="font-mono">{tool.name}</div>
                </div>
                {tool.description && (
                  <ToolDescription description={tool.description} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
