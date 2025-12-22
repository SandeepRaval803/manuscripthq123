"use client";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ManuscriptSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-2 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 mx-auto" />
            <Skeleton className="h-4 w-24 mx-auto" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 mx-auto" />
            <Skeleton className="h-4 w-24 mx-auto" />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-36" />
      </CardFooter>
    </Card>
  );
}
