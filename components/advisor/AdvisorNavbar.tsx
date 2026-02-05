"use client";

import Link from "next/link";
import Image from "next/image";
import { User, LogOut, Sun, Moon, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AdvisorNavbarProps {
    advisorName: string;
    advisorRole: string;
    avatar?: string;
    activeTab: "bookings" | "availability" | "profile";
    onTabChange: (tab: "bookings" | "availability" | "profile") => void;
    onLogout: () => void;
}

export function AdvisorNavbar({
    advisorName,
    advisorRole,
    avatar,
    activeTab,
    onTabChange,
    onLogout,
}: AdvisorNavbarProps) {
    const { theme, setTheme } = useTheme();

    const getInitials = (name: string) =>
        name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();

    const navItems = [
        { title: "Bookings", id: "bookings" as const },
        { title: "Availability", id: "availability" as const },
    ];

    return (
        <header className="border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
            <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                {/* LOGO */}
                <Link href="/" className="flex items-center gap-3">
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
                </Link>

                {/* DESKTOP NAV */}
                <div className="hidden md:flex items-center gap-8 ml-3.5 mr-3.5">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`relative text-foreground font-medium hover:text-primary transition group ${activeTab === item.id && "text-primary"
                                }`}
                        >
                            {item.title}
                            <span
                                className={`absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-orange-500 group-hover:w-1/2 hover-effect group-hover:left-0 duration-150 ${activeTab === item.id && "w-1/2"
                                    }`}
                            />
                            <span
                                className={`absolute -bottom-0.5 right-1/2 w-0 h-0.5 bg-orange-500 group-hover:w-1/2 hover-effect group-hover:right-0 duration-150 ${activeTab === item.id && "w-1/2"
                                    }`}
                            />
                        </button>
                    ))}
                </div>

                {/* RIGHT SIDE UTILITIES */}
                <div className="flex items-center gap-4">
                    {/* Theme Toggle */}
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

                    {/* User Profile */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 hover:opacity-80 transition relative">
                                <div className="relative flex items-center justify-center">
                                    {/* RING */}
                                    <span className="absolute inset-0 avatar-ring avatar-ring-user" />

                                    {/* AVATAR */}
                                    <Avatar className="relative z-10 h-10 w-10 bg-background">
                                        <AvatarImage src={avatar || ""} />
                                        <AvatarFallback className="bg-primary text-primary-foreground">
                                            {getInitials(advisorName || "A")}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>

                                <div className="text-left hidden sm:block">
                                    <p className="text-sm font-medium text-foreground">
                                        {advisorName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{advisorRole}</p>
                                </div>
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => onTabChange("profile")}
                            >
                                <User className="mr-2 h-4 w-4" />
                                <span>My Profile</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                className="text-destructive cursor-pointer"
                                onClick={onLogout}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </nav>
        </header>
    );
}
