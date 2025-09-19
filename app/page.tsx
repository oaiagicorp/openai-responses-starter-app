"use client";
import Assistant from "@/components/assistant";
import ToolsPanel from "@/components/tools-panel";
import ThemeToggle from "@/components/theme-toggle";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useConversationStore from "@/stores/useConversationStore";

export default function Main() {
  const [isToolsPanelOpen, setIsToolsPanelOpen] = useState(false);
  const router = useRouter();
  const { resetConversation } = useConversationStore();

  // After OAuth redirect, reinitialize the conversation so the next turn
  // uses the connector-enabled server configuration immediately
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isConnected = new URLSearchParams(window.location.search).get("connected");
    if (isConnected === "1") {
      resetConversation();
      router.replace("/", { scroll: false });
    }
  }, [router, resetConversation]);

  return (
    <div className="relative flex h-screen w-full justify-center">
      <div className="absolute left-4 top-4 z-30 flex items-center gap-2">
        <ThemeToggle />
      </div>
      <div className="w-full md:w-[70%]">
        <Assistant />
      </div>
      <div className="hidden w-[30%] md:block">
        <ToolsPanel />
      </div>
      {/* Hamburger menu for small screens */}
      <div className="absolute top-4 right-4 md:hidden">
        <button
          onClick={() => setIsToolsPanelOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Open tools panel"
        >
          <Menu size={20} />
        </button>
      </div>
      {/* Overlay panel for ToolsPanel on small screens */}
      {isToolsPanelOpen && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/30 backdrop-blur-sm transition-colors dark:bg-black/60">
          <div className="flex h-full w-full max-w-sm flex-col bg-background p-4 shadow-lg">
            <div className="mb-4 flex justify-end">
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => setIsToolsPanelOpen(false)}
                aria-label="Close tools panel"
              >
                <X size={20} />
              </button>
            </div>
            <ToolsPanel />
          </div>
        </div>
      )}
    </div>
  );
}
