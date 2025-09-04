import React from "react";

const LoadingMessage: React.FC = () => {
  return (
    <div className="text-sm">
      <div className="flex flex-col">
        <div className="flex">
          <div className="mr-4 rounded-[16px] px-4 py-2 md:mr-24 bg-card text-foreground font-light">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingMessage;
