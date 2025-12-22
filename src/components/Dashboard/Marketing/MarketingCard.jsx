import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChartColumnDecreasing, ChartBar } from "lucide-react";
import React from "react";

export default function MainMarketing() {
  const handleRoute = () => {
    window.location.href = "https://agent.ai/agent/ManuscriptHQ-Marketing-Assistant";
  };
  return (
    <div className="flex flex-col justify-center h-full">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-white mx-12">
        <CardContent className="text-center ">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-primary/10 to-[#9B1C8C]/10 rounded-3xl flex items-center justify-center mx-auto">
              <ChartColumnDecreasing className="w-12 h-12 text-primary" />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                ManuscriptHQ Marketing Assistant
              </h3>
              <p className="text-slate-600 text-lg max-w-md mx-auto">
                A no-code AI assistant that helps indie authors create blurbs,
                social media posts, and launch strategies tailored to their
                book.
              </p>
            </div>
            <div className="space-y-3">
              <Button onClick={handleRoute} className="bg-primary">
                <ChartBar className="mr-2 h-5 w-5" />
                Try Now
              </Button>
              <p className="text-sm text-slate-500">
                Get full access to run, customize, and share this agent — plus
                hundreds more.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
