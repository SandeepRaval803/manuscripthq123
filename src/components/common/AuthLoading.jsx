import React from "react";
import { LoadingSpinnerWithText } from "./LoadingSpinner";

export const AuthLoading = ({ message = "Checking authentication..." }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center justify-center gap-6">
        <LoadingSpinnerWithText 
          size="large" 
          text={message}
          showLogo={true}
        />
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Please wait while we verify your credentials
          </p>
        </div>
      </div>
    </div>
  );
};