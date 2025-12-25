"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

import {
  Menu,
  X,
  User,
  LayoutDashboard,
  Shield,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { headerMenuData } from "@/constants/data";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { localStorageAPI } from "@/lib/storage/localStorage";

export function Header() {
  const { data: session } = useSession();
  const user = session?.user;

  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  // ✅ Dynamic role check (from NextAuth session)
  const isAdmin = user?.role === "admin";
  // const isAdmin = useState(true)

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const [notificationCount, setNotificationCount] = useState<number>(0);

  useEffect(() => {
    const updateCount = () => {
      const count = localStorageAPI.getTotalNotificationCount();
      setNotificationCount(count);
    };

    updateCount();
    const interval = setInterval(updateCount, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* LOGO + WORDMARK */}
        <Link href="/" className="flex items-center gap-3">
          {/* Light mode logo */}
          <Image
            src="/images/LogoBG_Removed-light.png"
            alt="Smart AutoHub Logo"
            width={120}
            height={60}
            className="object-contain block dark:hidden"
            priority
          />
          {/* Dark mode logo */}
          <Image
            src="/images/LogoBG_Removed-dark1.png"
            alt="Smart AutoHub Logo"
            width={120}
            height={60}
            className="object-contain hidden dark:block"
            priority
          />

          {/* WORDMARK */}
          <div className="flex flex-col sm:flex-row leading-tight sm:items-center">
            {/* Smart */}
            <span
              className="text-3xl font-extrabold tracking-wide
                                bg-linear-to-r from-red-600 to-orange-500 bg-clip-text text-transparent
                                transition-all duration-400 hover:brightness-200"
            >
              Smart
            </span>

            {/* AutoHub */}
            <span className="text-3xl font-extrabold sm:ml-2">
              <span className="text-foreground hover:text-red-700 dark:text-backgound transition-colors">
                Auto
              </span>
              <span className="text-red-700 dark:text-orange-400 hover:text-orange-500 transition-colors">
                Hub
              </span>
            </span>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 ml-3.5 mr-3.5">
          {headerMenuData?.map((item) => (
            <Link
              key={item?.title}
              href={item?.href}
              className={`relative text-foreground font-medium hover:text-primary transition group ${
                pathname === item?.href && "text-primary"
              }`}
            >
              {item?.title}
              <span
                className={`absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-orange-500 group-hover:w-1/2 hover-effect group-hover:left-0 duration-150 ${
                  pathname === item?.href && "w-1/2"
                }`}
              />
              <span
                className={`absolute -bottom-0.5 right-1/2 w-0 h-0.5 bg-orange-500 group-hover:w-1/2 hover-effect group-hover:right-0 duration-150 ${
                  pathname === item?.href && "w-1/2"
                }`}
              />
            </Link>
          ))}
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-muted"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* DESKTOP AUTH */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {!user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="hover:opacity-80 transition"
                    title="Open account menu"
                  >
                    <Avatar className="h-10 w-10 border-2 border-border">
                      <AvatarFallback className="bg-muted">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Login to See your Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </>
          ) : (
            <>
              {/* // ---------- LOGGED IN VIEW ---------- */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:opacity-80 transition relative">
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center animate-pulse z-10">
                        {notificationCount > 9 ? "9+" : notificationCount}
                      </span>
                    )}
                    <div className="relative flex items-center justify-center">
                      {/* RING */}
                      <span
                        className={`
                                                    absolute inset-0 avatar-ring
                                                    ${
                                                      isAdmin
                                                        ? "avatar-ring-admin"
                                                        : "avatar-ring-user"
                                                    }
                                                    `}
                      />

                      {/* AVATAR */}
                      <Avatar className="relative z-10 h-10 w-10 bg-background">
                        <AvatarImage src={user.image || ""} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(user.name || "U")}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">
                        {user.name}
                      </p>
                      {isAdmin && (
                        <p className="text-xs text-muted-foreground">Admin</p>
                      )}
                    </div>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                      {(() => {
                        const notifications =
                          localStorageAPI.getNotifications();
                        const dashCount = Object.values(
                          notifications.dashboard
                        ).reduce((a: number, b: number) => a + b, 0);
                        return dashCount > 0 ? (
                          <span className="ml-auto h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                            {dashCount > 9 ? "9+" : dashCount}
                          </span>
                        ) : null;
                      })()}
                    </Link>
                  </DropdownMenuItem>

                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Admin Panel</span>
                        {(() => {
                          const notifications =
                            localStorageAPI.getNotifications();
                          const adminCount = Object.values(
                            notifications.admin
                          ).reduce((a: number, b: number) => a + b, 0);
                          return adminCount > 0 ? (
                            <span className="ml-auto h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                              {adminCount > 9 ? "9+" : adminCount}
                            </span>
                          ) : null;
                        })()}
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  {/* -------- DESKTOP LOGOUT -------- */}
                  <DropdownMenuItem
                    className="text-destructive cursor-pointer"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </nav>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <div className="px-4 py-4 space-y-4">
            {headerMenuData.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.title}
              </Link>
            ))}

            {!user ? (
              <>
                {/* <div className="border-t border-border my-4" /> */}
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    asChild
                  >
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button className="flex-1" asChild>
                    <Link href="/register">Register</Link>
                  </Button>
                </div>

                <button
                  className="flex items-center gap-2 text-foreground hover:text-primary py-2 w-full text-left"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <>
                      <Sun className="h-4 w-4" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-border my-4" />

                <div className="flex items-center gap-2 py-2">
                  <div className="relative flex items-center justify-center">
                    <span
                      className={`
                                            absolute inset-0 avatar-ring
                                            ${
                                              isAdmin
                                                ? "avatar-ring-admin"
                                                : "avatar-ring-user"
                                            }
                                            `}
                      style={{ filter: "blur(6px)" }}
                    />

                    <Avatar className="relative z-10 h-8 w-8 bg-background">
                      <AvatarImage src={user.image || ""} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {getInitials(user.name || "U")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <span className="font-medium text-foreground">
                    {user.name}
                    {isAdmin && (
                      <span className="text-destructive ml-1">(Admin)</span>
                    )}
                  </span>
                </div>

                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-foreground hover:text-primary py-2 pl-2 relative"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                  {(() => {
                    const notifications = localStorageAPI.getNotifications();
                    const dashCount = Object.values(
                      notifications.dashboard
                    ).reduce((a: number, b: number) => a + b, 0);
                    return dashCount > 0 ? (
                      <span className="ml-auto h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                        {dashCount > 9 ? "9+" : dashCount}
                      </span>
                    ) : null;
                  })()}
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 text-foreground hover:text-primary py-2 pl-2 relative"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Admin Panel</span>
                    {(() => {
                      const notifications = localStorageAPI.getNotifications();
                      const adminCount = Object.values(
                        notifications.admin
                      ).reduce((a: number, b: number) => a + b, 0);
                      return adminCount > 0 ? (
                        <span className="ml-auto h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                          {adminCount > 9 ? "9+" : adminCount}
                        </span>
                      ) : null;
                    })()}
                  </Link>
                )}

                {/* -------- MOBILE LOGOUT -------- */}
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex items-center gap-2 text-foreground hover:text-destructive py-2 pl-2 w-full text-left"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>

                <button
                  className="flex items-center gap-2 text-foreground hover:text-primary py-2 pl-2 w-full text-left"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <>
                      <Sun className="h-4 w-4" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
