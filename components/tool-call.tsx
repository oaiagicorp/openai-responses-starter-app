"use client";
import React, { useMemo } from "react";

import { ToolCallItem } from "@/lib/assistant";
import { BookOpenText, Clock, Globe, Zap, Code2, Download } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy, duotoneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "./theme-provider";

interface ToolCallProps {
  toolCall: ToolCallItem;
}

type SyntaxTheme = Record<string, unknown>;

function ApiCallCell({
  toolCall,
  syntaxTheme,
}: {
  toolCall: ToolCallItem;
  syntaxTheme: SyntaxTheme;
}) {
  return (
    <div className="relative mb-[-8px] flex w-[70%] flex-col">
      <div>
        <div className="flex flex-col rounded-[16px] text-sm">
          <div className="flex gap-2 rounded-b-none p-3 pl-0 font-semibold text-foreground">
            <div className="ml-[-8px] flex items-center gap-2 text-primary">
              <Zap size={16} />
              <div className="text-sm font-medium">
                {toolCall.status === "completed"
                  ? `Called ${toolCall.name}`
                  : `Calling ${toolCall.name}...`}
              </div>
            </div>
          </div>

          <div className="ml-4 mt-2 rounded-xl border border-border/60 bg-muted py-2">
            <div className="mx-6 max-h-96 overflow-y-scroll border-b border-border/60 p-2 text-xs">
              <SyntaxHighlighter
                customStyle={{
                  backgroundColor: "transparent",
                  padding: "8px 0",
                  margin: 0,
                }}
                language="json"
                style={syntaxTheme}
              >
                {JSON.stringify(toolCall.parsedArguments, null, 2)}
              </SyntaxHighlighter>
            </div>
            <div className="mx-6 max-h-96 overflow-y-scroll p-2 text-xs">
              {toolCall.output ? (
                <SyntaxHighlighter
                  customStyle={{
                    backgroundColor: "transparent",
                    padding: "8px 0",
                    margin: 0,
                  }}
                  language="json"
                  style={syntaxTheme}
                >
                  {JSON.stringify(JSON.parse(toolCall.output), null, 2)}
                </SyntaxHighlighter>
              ) : (
                <div className="flex items-center gap-2 py-2 text-muted-foreground">
                  <Clock size={16} /> Waiting for result...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FileSearchCell({ toolCall }: ToolCallProps) {
  return (
    <div className="mb-[-16px] ml-[-8px] flex items-center gap-2 text-primary">
      <BookOpenText size={16} />
      <div className="text-sm font-medium mb-0.5">
        {toolCall.status === "completed"
          ? "Searched files"
          : "Searching files..."}
      </div>
    </div>
  );
}

function WebSearchCell({ toolCall }: ToolCallProps) {
  return (
    <div className="mb-[-16px] ml-[-8px] flex items-center gap-2 text-primary">
      <Globe size={16} />
      <div className="text-sm font-medium">
        {toolCall.status === "completed"
          ? "Searched the web"
          : "Searching the web..."}
      </div>
    </div>
  );
}

function McpCallCell({
  toolCall,
  syntaxTheme,
}: {
  toolCall: ToolCallItem;
  syntaxTheme: SyntaxTheme;
}) {
  return (
    <div className="relative mb-[-8px] flex w-[70%] flex-col">
      <div>
        <div className="flex flex-col rounded-[16px] text-sm">
          <div className="flex gap-2 rounded-b-none p-3 pl-0 font-semibold text-foreground">
            <div className="ml-[-8px] flex items-center gap-2 text-primary">
              <Zap size={16} />
              <div className="text-sm font-medium">
                {toolCall.status === "completed"
                  ? `Called ${toolCall.name} via MCP tool`
                  : `Calling ${toolCall.name} via MCP tool...`}
              </div>
            </div>
          </div>

          <div className="ml-4 mt-2 rounded-xl border border-border/60 bg-muted py-2">
            <div className="mx-6 max-h-96 overflow-y-scroll border-b border-border/60 p-2 text-xs">
              <SyntaxHighlighter
                customStyle={{
                  backgroundColor: "transparent",
                  padding: "8px 0",
                  margin: 0,
                }}
                language="json"
                style={syntaxTheme}
              >
                {JSON.stringify(toolCall.parsedArguments, null, 2)}
              </SyntaxHighlighter>
            </div>
            <div className="mx-6 max-h-96 overflow-y-scroll p-2 text-xs">
              {toolCall.output ? (
                <SyntaxHighlighter
                  customStyle={{
                    backgroundColor: "transparent",
                    padding: "8px 0",
                    margin: 0,
                  }}
                  language="json"
                  style={syntaxTheme}
                >
                  {(() => {
                    try {
                      const parsed = JSON.parse(toolCall.output!);
                      return JSON.stringify(parsed, null, 2);
                    } catch {
                      return toolCall.output!;
                    }
                  })()}
                </SyntaxHighlighter>
              ) : (
                <div className="flex items-center gap-2 py-2 text-muted-foreground">
                  <Clock size={16} /> Waiting for result...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CodeInterpreterCell({
  toolCall,
  syntaxTheme,
}: {
  toolCall: ToolCallItem;
  syntaxTheme: SyntaxTheme;
}) {
  return (
    <div className="relative mb-[-8px] flex w-[70%] flex-col">
      <div className="flex flex-col rounded-[16px] text-sm">
        <div className="flex gap-2 rounded-b-none p-3 pl-0 font-semibold text-foreground">
          <div className="ml-[-8px] flex items-center gap-2 text-primary">
            <Code2 size={16} />
            <div className="text-sm font-medium">
              {toolCall.status === "completed"
                ? "Code executed"
                : "Running code interpreter..."}
            </div>
          </div>
        </div>
        <div className="ml-4 mt-2 rounded-xl border border-border/60 bg-muted py-2">
          <div className="mx-6 p-2 text-xs">
            <SyntaxHighlighter
              customStyle={{
                backgroundColor: "transparent",
                padding: "8px 0",
                margin: 0,
              }}
              language="python"
              style={syntaxTheme}
            >
              {toolCall.code || ""}
            </SyntaxHighlighter>
          </div>
        </div>
        {toolCall.files && toolCall.files.length > 0 && (
          <div className="ml-4 mt-2 flex flex-wrap gap-2">
            {toolCall.files.map((f) => (
              <a
                key={f.file_id}
                href={`/api/container_files/content?file_id=${f.file_id}${
                  f.container_id ? `&container_id=${f.container_id}` : ""
                }${
                  f.filename
                    ? `&filename=${encodeURIComponent(f.filename)}`
                    : ""
                }`}
                download
                className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted/80"
              >
                {f.filename || f.file_id}
                <Download size={12} />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ToolCall({ toolCall }: ToolCallProps) {
  const { theme } = useTheme();
  const syntaxTheme = useMemo(
    () => (theme === "dark" ? duotoneDark : coy),
    [theme]
  );

  return (
    <div className="flex justify-start pt-2">
      {(() => {
        switch (toolCall.tool_type) {
          case "function_call":
            return <ApiCallCell toolCall={toolCall} syntaxTheme={syntaxTheme} />;
          case "file_search_call":
            return <FileSearchCell toolCall={toolCall} />;
          case "web_search_call":
            return <WebSearchCell toolCall={toolCall} />;
          case "mcp_call":
            return <McpCallCell toolCall={toolCall} syntaxTheme={syntaxTheme} />;
          case "code_interpreter_call":
            return (
              <CodeInterpreterCell
                toolCall={toolCall}
                syntaxTheme={syntaxTheme}
              />
            );
          default:
            return null;
        }
      })()}
    </div>
  );
}
