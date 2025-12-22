"use client";

import { AlignHorizontalDistributeCenter, Menu, Lock, Palette, Baby } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import {
  BookText,
  BarChartIcon as ChartBar,
  CheckSquare,
  HelpCircle,
  Home,
  CreditCard,
  Pen,
  Settings,
  Type,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarProvider";
import { useAuth } from "@/context/userContext";
import { Badge } from "@/components/ui/badge";

export default function MobileSidebar() {
  const pathname = usePathname();
  const { isExpanded, toggleSidebar } = useSidebar();
  const { user } = useAuth();
  const isPremiumUser = user?.subscription === "Premium";

  const routes = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard",
      alwaysVisible: true,
    },
    {
      title: "Manuscript Manager",
      icon: BookText,
      href: "/dashboard/manuscript",
      premiumOnly: true,
    },
    {
      title: "Editor",
      icon: Pen,
      href: "/dashboard/editor",
      premiumOnly: true,
    },
    {
      title: "Formatting Wizard",
      icon: Type,
      href: "/dashboard/formatting-wizard",
      premiumOnly: true,
    },
    {
      title: "Children’s Book Wizard",
      icon: Baby,
      href: "/dashboard/childrens-book-wizard",
      premiumOnly: true,
    },
    {
      title: "Marketing",
      icon: ChartBar,
      href: "/dashboard/marketing",
      premiumOnly: true,
    },
    {
      title: "Cover Design",
      icon: Palette,
      href: "/dashboard/cover-design",
      premiumOnly: true,
    },
    {
      title: "Publishing Checklist",
      icon: CheckSquare,
      href: "/dashboard/publishing-checklist",
      alwaysVisible: true,
    },
    {
      title: "Distribution",
      icon: AlignHorizontalDistributeCenter,
      href: "/",
      premiumOnly: true,
    },
  ];

  const bottomRoutes = [
    {
      title: "Subscription",
      icon: CreditCard,
      href: "/dashboard/subscription",
      alwaysVisible: true,
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
      alwaysVisible: true,
    },
    {
      title: "Help",
      icon: HelpCircle,
      href: "/dashboard/help",
      alwaysVisible: true,
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-primary">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-center py-2 mt-[3px] px-4">
            <Link href="/dashboard">
              <Image
                src="/images/home/logo.png"
                alt="Logo"
                className="w-32"
                width={1000}
                height={1000}
              />
            </Link>
          </div>

          {/* Separator */}
          <div className="mx-2 h-[1px] bg-border" />

          {/* Main Menu */}
          <div className="flex-1 overflow-auto px-3 py-2">
            <nav className="space-y-1">
              {routes.map((route) => {
                const isDisabled = route.premiumOnly && !isPremiumUser;
                const isActive = pathname === route.href;
                
                return (
                  <div key={route.href} className="relative">
                    {isDisabled ? (
                      <div
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium cursor-not-allowed opacity-50"
                        )}
                        title={`${route.title} - Premium Feature`}
                      >
                        <route.icon className="h-5 w-5" />
                        <span>{route.title}</span>
                        <Lock className="h-4 w-4 ml-auto text-muted-foreground" />
                      </div>
                    ) : (
                      <Link
                        href={route.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium",
                          isActive
                            ? "bg-primary text-white"
                            : "text-foreground hover:bg-[#eaa8f9]",
                          route.title === "Distribution" &&
                            "pointer-events-none opacity-50"
                        )}
                      >
                        <route.icon className="h-5 w-5" />
                        <span>{route.title}</span>
                      </Link>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Footer Menu */}
          <div className="px-3 py-4 border-t border-border">
            <nav className="space-y-1">
              {bottomRoutes.map((route) => {
                const isDisabled = route.premiumOnly && !isPremiumUser;
                const isActive = pathname === route.href;
                
                return (
                  <div key={route.href} className="relative">
                    {isDisabled ? (
                      <div
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium cursor-not-allowed opacity-50"
                        )}
                        title={`${route.title} - Premium Feature`}
                      >
                        <route.icon className="h-5 w-5" />
                        <span>{route.title}</span>
                        <Lock className="h-4 w-4 ml-auto text-muted-foreground" />
                      </div>
                    ) : (
                      <Link
                        href={route.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium",
                          isActive
                            ? "bg-primary text-white"
                            : "text-foreground hover:bg-[#eaa8f9]"
                        )}
                      >
                        <route.icon className="h-5 w-5" />
                        <span>{route.title}</span>
                      </Link>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
