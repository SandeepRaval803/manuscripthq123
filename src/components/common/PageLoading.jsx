import React from "react";
import { LoadingSpinnerWithText } from "./LoadingSpinner";

export const PageLoading = ({ 
  message = "Loading page...", 
  showLogo = true,
  className = "" 
}) => {
  return (
    <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
      <LoadingSpinnerWithText 
        size="default" 
        text={message}
        showLogo={showLogo}
      />
    </div>
  );
};

export const ComponentLoading = ({ 
  message = "Loading...", 
  showLogo = false,
  className = "" 
}) => {
  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <LoadingSpinnerWithText 
        size="small" 
        text={message}
        showLogo={showLogo}
      />
    </div>
  );
};

export const InlineLoading = ({ 
  message = "Loading...", 
  showLogo = false,
  className = "" 
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <LoadingSpinnerWithText 
        size="small" 
        text={message}
        showLogo={showLogo}
      />
    </div>
  );
}; 