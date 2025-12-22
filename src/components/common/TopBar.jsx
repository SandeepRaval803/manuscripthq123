"use client";
import { useState, useEffect } from "react";
import { Bell, BookOpen, ChevronDown, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSidebar } from "./SidebarProvider";
import MobileSidebar from "./MobileSidebar";
import { useRouter } from "next/router";
import { useAuth } from "@/context/userContext";
import ManuscriptData from "./ManuscriptData";

export function TopBar({ refresh, setRefresh }) {
  const { toggleSidebar, isExpanded } = useSidebar();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isDesktop, setIsDesktop] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  useEffect(() => {
    function handleResize() {
      setIsDesktop(window.innerWidth >= 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarWidth = isExpanded ? "16rem" : "5rem";
  const getInitials = () => {
    if (!user?.firstName) return "NA";
    return user.firstName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header
      className={`fixed top-0 z-50 h-16 flex items-center gap-4 border-b bg-white px-4 left-0 w-full ${
        isDesktop ? "transition-all duration-300 ease" : ""
      }`}
      style={
        isDesktop
          ? {
              left: sidebarWidth,
              width: `calc(100% - ${sidebarWidth})`,
            }
          : {
              left: 0,
              width: "100%",
            }
      }
    >
      <div className="md:hidden">
        <MobileSidebar />
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="hidden md:flex text-primary"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Manuscript Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 border-[#eaa8f9] text-primary"
              >
                <BookOpen className="h-4 w-4" />
                <span className="max-w-[150px] truncate hidden sm:inline-block">
                  {user?.selectedManuscript?.title || "Select Manuscript"}
                </span>
                <span className="inline-block sm:hidden">Manuscript</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <ManuscriptData refresh={refresh} setRefresh={setRefresh} />
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            className="text-primary"
          >
            <Bell className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full ring-2 ring-[#eaa8f9]"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.profilePicture}
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback className="bg-[#eaa8f9] text-primary">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {user?.firstName
                  ? user?.firstName.charAt(0).toUpperCase() +
                    user?.firstName.slice(1)
                  : ""}{" "}
                {user?.lastName
                  ? user?.lastName.charAt(0).toUpperCase() +
                    user?.lastName.slice(1)
                  : ""}
                <br />
                <small>{user?.email}</small>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/settings")}
              >
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 dark:text-red-400"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
