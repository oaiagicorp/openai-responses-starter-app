"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { McpApprovalRequestItem } from "@/lib/assistant";

interface Props {
  item: McpApprovalRequestItem;
  onRespond: (approve: boolean, id: string) => void;
}

export default function McpApproval({ item, onRespond }: Props) {
  const [disabled, setDisabled] = useState(false);

  const handle = (approve: boolean) => {
    setDisabled(true);
    onRespond(approve, item.id);
  };

  return (
    <div className="flex flex-col">
      <div className="flex">
        <div className="mr-4 rounded-[16px] bg-card p-4 font-light text-card-foreground transition-colors md:mr-24">
          <div className="mb-2 text-sm text-foreground">
            Request to execute tool{" "}
            <span className="font-medium">{item.name}</span> on server{" "}
            <span className="font-medium">{item.server_label}</span>.
          </div>
          <div className="flex gap-2">
            <Button size="sm" disabled={disabled} onClick={() => handle(true)}>
              Approve
            </Button>
            <Button
              size="sm"
              disabled={disabled}
              onClick={() => handle(false)}
              variant="outline"
            >
              Decline
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
