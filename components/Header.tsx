"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

import { Menu, X, LayoutDashboard, Shield, LogOut } from "lucide-react";
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
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    const isAdmin = "admin";

    return (
        <header className="bg-background border-b sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

                {/* LOGO */}
                <Link href="/" className="flex items-center gap-3">
                    <Image
                        src="/images/Logo.jpg"
                        alt="Logo"
                        width={110}
                        height={60}
                        className="object-contain"
                    />
                </Link>

                {/* DESKTOP NAV */}
                <div className="hidden md:flex items-center gap-8">
                    {headerMenuData.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className={`font-medium hover:text-orange-600 ${
                                pathname === item.href ? "text-orange-600" : ""
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
                                <button className="flex items-center gap-2">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={user.image || ""} />
                                        <AvatarFallback>{getInitials(user.name || "U")}</AvatarFallback>
                                    </Avatar>

                                    <div className="text-left">
                                        <p className="text-sm font-semibold">{user.name}</p>
                                        {isAdmin && (
                                            <p className="text-xs text-red-500">Admin</p>
                                        )}
                                    </div>
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard">
                                        <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                                    </Link>
                                </DropdownMenuItem>

                                {isAdmin && (
                                    <DropdownMenuItem asChild>
                                        <Link href="/admin">
                                            <Shield className="mr-2 h-4 w-4" /> Admin Panel
                                        </Link>
                                    </DropdownMenuItem>
                                )}

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => signOut({ callbackUrl: "/login" })}
                                >
                                    <LogOut className="mr-2 h-4 w-4" /> Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                {/* MOBILE MENU BUTTON */}
                <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                </button>
            </nav>

            {/* MOBILE MENU */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t p-4 space-y-4">

                    {headerMenuData.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="block text-gray-700"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {item.title}
                        </Link>
                    ))}

                    {!user ? (
                        <div className="flex gap-3 pt-4">
                            <Button variant="outline" className="flex-1" asChild>
                                <Link href="/login">Login</Link>
                            </Button>

                            <Button className="flex-1" asChild>
                                <Link href="/register">Register</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="pt-4 space-y-2">

                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={user.image || ""} />
                                    <AvatarFallback>{getInitials(user.name || "U")}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{user.name}</span>
                            </div>

                            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                                <div className="py-2">Dashboard</div>
                            </Link>

                            {isAdmin && (
                                <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                                    <div className="py-2">Admin Panel</div>
                                </Link>
                            )}

                            <button
                                onClick={() => signOut({ callbackUrl: "/login" })}
                                className="w-full text-left py-2 text-red-600"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}
