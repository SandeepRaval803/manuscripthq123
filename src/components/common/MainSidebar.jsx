"use client";

import {
  BookText,
  BarChartIcon as ChartBar,
  CheckSquare,
  HelpCircle,
  Home,
  Pen,
  Settings,
  CreditCard,
  Type,
  AlignHorizontalDistributeCenter,
  Lock,
  Palette,
  Baby,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarProvider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/userContext";
import { Badge } from "@/components/ui/badge";

export function MainSidebar() {
  const router = useRouter();
  const { user } = useAuth();
  const isPremiumUser = user?.subscription === "Premium";
  
  useEffect(() => {
      if (!localStorage.getItem("token")) {
        router.push("/");
      }
    }, [router]);
  const pathname = usePathname();
  const { isExpanded } = useSidebar();

  // width in pixels: 64 * 4 = 256, 20 * 4 = 80 (tailwind w-64 and w-20)
  const width = isExpanded ? 256 : 80;

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
    <div
      className="fixed left-0 top-0 z-50 hidden md:flex flex-col h-screen bg-background border-r border-border overflow-hidden"
      style={{
        width,
        transition: "width 300ms ease-in-out",
        marginLeft: 0,
      }}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-center py-2 mt-[3px]",
          isExpanded ? "px-4" : "px-2"
        )}
      >
        <Link href="/dashboard">
          {isExpanded ? (
            <Image
              src="/images/home/logo.png"
              alt="Logo"
              className="w-32"
              width={1000}
              height={1000}
            />
          ) : (
            <div className="flex items-center justify-center py-2 mt-[6px]">
              <Image
                src="/images/home/logo.png"
                alt="Logo"
                className="w-20"
                width={1000}
                height={1000}
              />
            </div>
          )}
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
                      "flex items-center gap-3 rounded-md text-sm font-medium cursor-not-allowed opacity-50",
                      isExpanded ? "px-3 py-2.5" : "py-2.5 justify-center"
                    )}
                    title={!isExpanded ? `${route.title} - Premium Feature` : undefined}
                  >
                    <route.icon className="h-5 w-5" />
                    {isExpanded && (
                      <>
                        <span>{route.title}</span>
                        <Lock className="h-4 w-4 ml-auto text-muted-foreground" />
                      </>
                    )}
                  </div>
                ) : (
                  <Link
                    href={route.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md text-sm font-medium",
                      isActive
                        ? "bg-primary text-white"
                        : "text-foreground hover:bg-[#eaa8f9]",
                      isExpanded ? "px-3 py-2.5" : "py-2.5 justify-center",
                      route.title === "Distribution" &&
                        "pointer-events-none opacity-50"
                    )}
                    title={!isExpanded ? route.title : undefined}
                  >
                    <route.icon className="h-5 w-5" />
                    {isExpanded && <span>{route.title}</span>}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Footer Menu */}
      <div
        className={cn(
          "py-4 border-t border-border",
          isExpanded ? "px-4" : "px-2"
        )}
      >
        <nav className="space-y-1">
          {bottomRoutes.map((route) => {
            const isDisabled = route.premiumOnly && !isPremiumUser;
            const isActive = pathname === route.href;
            
            return (
              <div key={route.href} className="relative">
                {isDisabled ? (
                  <div
                    className={cn(
                      "flex items-center gap-3 rounded-md text-sm font-medium cursor-not-allowed opacity-50",
                      isExpanded ? "px-3 py-2.5" : "py-2.5 justify-center"
                    )}
                    title={!isExpanded ? `${route.title} - Premium Feature` : undefined}
                  >
                    <route.icon className="h-5 w-5" />
                    {isExpanded && (
                      <>
                        <span>{route.title}</span>
                        <Lock className="h-4 w-4 ml-auto text-muted-foreground" />
                      </>
                    )}
                  </div>
                ) : (
                  <Link
                    href={route.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md text-sm font-medium",
                      isActive
                        ? "bg-primary text-white"
                        : "text-foreground hover:bg-[#eaa8f9]",
                      isExpanded ? "px-3 py-2.5" : "py-2.5 justify-center"
                    )}
                    title={!isExpanded ? route.title : undefined}
                  >
                    <route.icon className="h-5 w-5" />
                    {isExpanded && <span>{route.title}</span>}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
