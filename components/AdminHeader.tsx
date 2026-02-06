"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation"; // Added useSearchParams
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
import { adminHeaderMenuData } from "@/constants/data"; // Import admin links
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

export function AdminHeader() {
    const { data: session } = useSession();
    const user = session?.user;

    const pathname = usePathname();
    const searchParams = useSearchParams(); // Get query params to check active tab
    const currentTab = searchParams.get("tab") || "requests"; // Default tab

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { theme, setTheme } = useTheme();

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
        <header className="border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
            <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                {/* LOGO */}
                <Link href="/admin" className="flex items-center gap-3">
                    <Image
                        src="/images/LogoBG_Removed-light.png"
                        alt="Smart AutoHub Logo"
                        width={120}
                        height={60}
                        className="object-contain block dark:hidden"
                        priority
                    />
                    <Image
                        src="/images/LogoBG_Removed-dark1.png"
                        alt="Smart AutoHub Logo"
                        width={120}
                        height={60}
                        className="object-contain hidden dark:block"
                        priority
                    />
                    {/* Optional: Add an 'Admin' badge next to logo */}
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-bold border border-primary/20">
                        ADMIN
                    </span>
                </Link>

                {/* DESKTOP NAV - ADMIN LINKS */}
                <div className="hidden md:flex items-center gap-8 ml-3.5 mr-3.5">
                    {adminHeaderMenuData.map((item) => {
                        // Check if this link is active based on the URL query parameter
                        const itemTab = item.href.split("=")[1];
                        const isActive = pathname === "/admin" && itemTab === currentTab;

                        return (
                            <Link
                                key={item.title}
                                href={item.href}
                                className={`relative text-foreground font-medium hover:text-primary transition group ${isActive && "text-primary"
                                    }`}
                            >
                                {item.title}
                                <span
                                    className={`absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-orange-500 group-hover:w-1/2 hover-effect group-hover:left-0 duration-150 ${isActive && "w-1/2"
                                        }`}
                                />
                                <span
                                    className={`absolute -bottom-0.5 right-1/2 w-0 h-0.5 bg-orange-500 group-hover:w-1/2 hover-effect group-hover:right-0 duration-150 ${isActive && "w-1/2"
                                        }`}
                                />
                            </Link>
                        );
                    })}
                </div>

                {/* MOBILE TOGGLE */}
                <button
                    className="md:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-muted"
                    onClick={() => setMobileMenuOpen((prev) => !prev)}
                >
                    {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>

                {/* USER PROFILE & THEME TOGGLE (Identical to primary navbar) */}
                <div className="hidden md:flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="relative"
                    >
                        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 hover:opacity-80 transition relative">
                                {notificationCount > 0 && (
                                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center animate-pulse z-10">
                                        {notificationCount > 9 ? "9+" : notificationCount}
                                    </span>
                                )}
                                <div className="relative flex items-center justify-center">
                                    <span className="absolute inset-0 avatar-ring avatar-ring-admin" />
                                    <Avatar className="relative z-10 h-10 w-10 bg-background">
                                        <AvatarImage src={user?.image || ""} />
                                        <AvatarFallback className="bg-primary text-primary-foreground">
                                            {getInitials(user?.name || "A")}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-medium text-foreground">{user?.name}</p>
                                    <p className="text-xs text-muted-foreground">Administrator</p>
                                </div>
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/" className="cursor-pointer">
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    <span>Public Homepage</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive cursor-pointer"
                                onClick={() => signOut({ callbackUrl: "/login" })}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </nav>

            {/* MOBILE MENU */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-card border-t border-border">
                    <div className="px-4 py-4 space-y-4">
                        {adminHeaderMenuData.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="block text-foreground hover:text-primary"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.title}
                            </Link>
                        ))}
                        {/* Mobile User controls... */}
                    </div>
                </div>
            )}
        </header>
    );
}
