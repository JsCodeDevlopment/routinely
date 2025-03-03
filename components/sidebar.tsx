"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, LogOut, ChevronLeft, Menu } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Logo from "@/public/logo.png";

export function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`flex flex-col justify-between h-full bg-gray-100 transition-all duration-300 ${
        isExpanded ? "w-64" : "w-16"
      }`}
    >
      <div>
        <div className="p-4 flex items-center justify-between">
          {isExpanded && <Image src={Logo} width={150} alt="logo" />}
          <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="icon"
            className={`${isExpanded ? "" : "mx-auto"}`}
          >
            {isExpanded ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </Button>
        </div>
        <nav className="space-y-2 p-2">
          <Link
            href="/dashboard"
            className={`flex items-center space-x-2 p-2 rounded-lg ${
              pathname === "/dashboard" ? "bg-gray-200" : "hover:bg-gray-200"
            }`}
          >
            <Home size={20} />
            {isExpanded && <span>Dashboard</span>}
          </Link>
          <Link
            href="/calendar"
            className={`flex items-center space-x-2 p-2 rounded-lg ${
              pathname === "/calendar" ? "bg-gray-200" : "hover:bg-gray-200"
            }`}
          >
            <Calendar size={20} />
            {isExpanded && <span>Calendar</span>}
          </Link>
        </nav>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-200 m-2"
      >
        <LogOut size={20} />
        {isExpanded && <span>Logout</span>}
      </button>
    </div>
  );
}
