"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Settings, LogOut, Menu, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { getInitials } from "@/lib/utils";
import { useState } from "react";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { BookingNotificationModal } from "@/components/layout/BookingNotificationModal";

type NavItem = {
  href: string;
  label: string;
  roles?: string[];
};

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", roles: ["MENTOR"] },
  { href: "/sessions", label: "Sessions" },
  { href: "/mentors", label: "Find Mentors", roles: ["MENTEE", "ADMIN"] },
  { href: "/services", label: "Services" },
  { href: "/messages", label: "Messages" },
  { href: "/programmes", label: "Programmes" },
  { href: "/admin", label: "Admin", roles: ["ADMIN"] },
];

interface TopNavProps {
  userId: string;
  userEmail: string;
  userRole: string;
  displayName?: string;
  avatarUrl?: string;
}

export function TopNav({ userId, userEmail, userRole, displayName, avatarUrl }: TopNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-blue-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/sessions" className="flex items-center gap-0.5 shrink-0">
          <span className="text-xl font-extrabold text-blue-700">Mentor</span>
          <span className="text-xl font-extrabold text-orange-500">Konnect</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {visibleItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {userRole === "MENTOR" && (
            <>
              <NotificationBell userId={userId} />
              <BookingNotificationModal userId={userId} />
            </>
          )}

          {/* Desktop user menu */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors"
            >
              <Avatar className="h-8 w-8 ring-2 ring-orange-200">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="text-xs bg-blue-600 text-white font-semibold">
                  {getInitials(displayName ?? userEmail)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700 hidden lg:block max-w-[120px] truncate">
                {displayName ?? userEmail}
              </span>
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 top-11 z-20 w-52 rounded-2xl border border-gray-100 bg-white shadow-xl py-2">
                  <div className="px-4 py-2.5 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {displayName ?? userEmail}
                    </p>
                    <p className="text-xs text-gray-400 capitalize mt-0.5">
                      {userRole.toLowerCase()}
                    </p>
                  </div>
                  <Link
                    href="/profile/edit"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-600 hover:bg-blue-50"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="border-t border-blue-100 bg-white md:hidden shadow-lg">
          <nav className="container max-w-7xl mx-auto px-4 py-3 space-y-1">
            {visibleItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-gray-100 pt-3 mt-3 space-y-1">
              <Link
                href="/profile/edit"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-blue-50"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
