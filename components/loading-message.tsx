import React from "react";

const LoadingMessage: React.FC = () => {
  return (
    <div className="text-sm text-foreground transition-colors">
      <div className="flex flex-col">
        <div className="flex">
          <div className="mr-4 rounded-[16px] bg-card px-4 py-2 font-light text-card-foreground transition-colors md:mr-24">
            <div className="h-3 w-3 animate-pulse rounded-full bg-primary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingMessage;
