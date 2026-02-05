"use strict";
import Link from "next/link";
import { User, LogOut, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { useTheme } from "next-themes"; // Assuming next-themes is used, if not, skip or mock
// Just standard toggle for now, or use props if theme managed in parent layout

interface AdvisorNavbarProps {
    advisorName: string;
    advisorRole: string;
    avatar?: string;
    activeTab: "bookings" | "availability" | "profile";
    onTabChange: (tab: "bookings" | "availability" | "profile") => void;
    onLogout: () => void;
}

export function AdvisorNavbar({ advisorName, advisorRole, avatar, activeTab, onTabChange, onLogout }: AdvisorNavbarProps) {

    return (
        <header className="border-b border-border bg-card">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="font-bold text-xl text-primary">
                        Smart Auto Hub
                    </Link>

                    <nav className="hidden md:flex gap-6">
                        <button
                            onClick={() => onTabChange("bookings")}
                            className={`text-sm font-medium transition-colors hover:text-primary ${activeTab === "bookings" ? "text-primary" : "text-muted-foreground"
                                }`}
                        >
                            Bookings
                        </button>
                        <button
                            onClick={() => onTabChange("availability")}
                            className={`text-sm font-medium transition-colors hover:text-primary ${activeTab === "availability" ? "text-primary" : "text-muted-foreground"
                                }`}
                        >
                            Availability
                        </button>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    {/* Theme Toggle Placeholder */}
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                        <Sun className="h-5 w-5 scale-100 dark:scale-0 transition-all" />
                        {/* <Moon className="absolute h-5 w-5 rotate-90 scale-0 dark:scale-100 transition-all" /> */}
                    </Button>

                    <div className="flex items-center gap-3 pl-4 border-l border-border">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium leading-none">{advisorName}</p>
                            <p className="text-xs text-muted-foreground mt-1">{advisorRole}</p>
                        </div>

                        <div className="relative group">
                            <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center border border-border overflow-hidden">
                                {avatar ? (
                                    <img src={avatar} alt={advisorName} className="h-full w-full object-cover" />
                                ) : (
                                    <User className="h-5 w-5 text-muted-foreground" />
                                )}
                            </div>

                            {/* Simple dropdown for profile/logout */}
                            <div className="absolute right-0 top-full mt-2 w-48 bg-popover text-popover-foreground border border-border rounded shadow-lg p-1 hidden group-hover:block z-50">
                                <button
                                    onClick={() => onTabChange("profile")}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary rounded cursor-pointer text-left"
                                >
                                    <User className="h-4 w-4" />
                                    My Profile
                                </button>
                                <button
                                    onClick={onLogout}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded cursor-pointer text-left"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
