import React from "react";
import Image from "next/image";

export const LoadingSpinner = ({ size = "default", className = "", showLogo = true }) => {
  const sizeClasses = {
    small: "h-4 w-4",
    default: "h-8 w-8",
    large: "h-32 w-32",
  };

  const logoSizeClasses = {
    small: "h-6 w-6",
    default: "h-12 w-12",
    large: "h-24 w-24",
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      {showLogo && (
        <div className={`relative ${logoSizeClasses[size]}`}>
          <Image
            src="/images/home/logo.png"
            alt="ManuscriptHQ Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      )}
      <div
        className={`animate-spin rounded-full border-b-2 border-primary ${sizeClasses[size]}`}
      ></div>
    </div>
  );
};

export const FullScreenLoading = ({ showLogo = true }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <LoadingSpinner size="large" showLogo={showLogo} />
    </div>
  );
};

export const LoadingSpinnerWithText = ({ 
  size = "default", 
  className = "", 
  text = "Loading...",
  showLogo = true 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <LoadingSpinner size={size} showLogo={showLogo} />
      <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
    </div>
  );
}; 