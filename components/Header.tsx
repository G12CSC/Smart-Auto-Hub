"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

import { Menu, X, User, LayoutDashboard, Shield, LogOut } from "lucide-react";
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

export function Header() {
    const { data: session } = useSession();
    const user = session?.user;

    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // ✅ Dynamic role check (from NextAuth session)
    const isAdmin = user?.role === "admin";

    const getInitials = (name: string) =>
        name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();

    return (
        <header className="bg-background border-b border-border sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

                {/* LOGO + WORDMARK */}
                <Link href="/" className="flex items-center gap-3">
                    <Image
                        src="/images/Logo.jpg"
                        alt="Smart AutoHub Logo"
                        width={120}
                        height={60}
                        className="object-contain"
                        priority
                    />

                    <div className="flex flex-col sm:flex-row leading-tight sm:items-center">
            <span className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
              Smart
            </span>
                        <span className="text-3xl font-extrabold sm:ml-2">
              <span className="text-black">Auto</span>
              <span className="text-red-700">Hub</span>
            </span>
                    </div>
                </Link>

                {/* DESKTOP NAV */}
                <div className="hidden md:flex items-center gap-8">
                    {headerMenuData.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className={`relative font-medium transition ${
                                pathname === item.href ? "text-primary" : "text-foreground"
                            }`}
                        >
                            {item.title}
                        </Link>
                    ))}
                </div>

                {/* DESKTOP AUTH */}
                <div className="hidden md:flex items-center gap-4">
                    {!user ? (
                        <>
                            <Button variant="outline" asChild>
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/register">Register</Link>
                            </Button>
                        </>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 hover:opacity-80 transition">
                                    <Avatar className="h-10 w-10 border-2 border-primary">
                                        <AvatarImage src={user.image || ""} />
                                        <AvatarFallback>
                                            {getInitials(user.name || "U")}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="text-left">
                                        <p className="text-sm font-medium">{user.name}</p>
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
                                    <Link href="/dashboard">
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        Dashboard
                                    </Link>
                                </DropdownMenuItem>

                                {isAdmin && (
                                    <DropdownMenuItem asChild>
                                        <Link href="/admin">
                                            <Shield className="mr-2 h-4 w-4" />
                                            Admin Panel
                                        </Link>
                                    </DropdownMenuItem>
                                )}

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
                    )}
                </div>

                {/* MOBILE MENU BUTTON */}
                <button
                    className="md:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                </button>
            </nav>

            {/* MOBILE MENU */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-card border-t border-border px-4 py-4 space-y-4">
                    {headerMenuData.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="block text-foreground"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {item.title}
                        </Link>
                    ))}

                    {!user ? (
                        <div className="flex gap-2 pt-4">
                            <Button variant="outline" className="flex-1" asChild>
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button className="flex-1" asChild>
                                <Link href="/register">Register</Link>
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="border-t pt-4" />

                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.image || ""} />
                                    <AvatarFallback>
                                        {getInitials(user.name || "U")}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="font-medium">
                  {user.name}
                                    {isAdmin && (
                                        <span className="text-destructive ml-1">(Admin)</span>
                                    )}
                </span>
                            </div>

                            <Link href="/dashboard">Dashboard</Link>

                            {isAdmin && <Link href="/admin">Admin Panel</Link>}

                            <button
                                onClick={() => signOut({ callbackUrl: "/login" })}
                                className="w-full text-left text-destructive"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            )}
        </header>
    );
}
