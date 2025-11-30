"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"
import { headerMenuData } from "@/constants/data"
import { usePathname } from "next/navigation"

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { data: session } = useSession()
    const pathname = usePathname()

    return (
        <header className="bg-background border-b border-border sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

                {/* LOGO */}
                <Link href="/" className="flex items-center gap-3">
                    <Image
                        src="/images/Logo.jpg"
                        alt="Sameera Auto Traders Logo"
                        width={120}
                        height={60}
                        className="object-contain"
                        priority
                    />

                    {/* Stylish Smart + AutoHub */}
                    <div className="flex flex-col sm:flex-row leading-tight sm:items-center">
            <span className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent transition-all duration-400 hover:brightness-200">
              Smart
            </span>
                        <span className="text-3xl font-extrabold sm:ml-2">
              <span className="text-black hover:text-red-700">Auto</span>
              <span className="text-red-700 hover:text-orange-500">Hub</span>
            </span>
                    </div>
                </Link>

                {/* DESKTOP NAV */}
                <div className="hidden md:flex items-center gap-8">
                    {headerMenuData.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className={`relative text-foreground font-medium hover:text-primary transition group ${
                                pathname === item.href && "text-primary"
                            }`}
                        >
                            {item.title}

                            {/* Hover underline animation */}
                            <span className={`absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-orange-500 group-hover:w-1/2 group-hover:left-0 duration-150 ${
                                pathname === item.href && "w-1/2"
                            }`} />

                            <span className={`absolute -bottom-0.5 right-1/2 w-0 h-0.5 bg-orange-500 group-hover:w-1/2 group-hover:right-0 duration-150 ${
                                pathname === item.href && "w-1/2"
                            }`} />
                        </Link>
                    ))}
                </div>

                {/* DESKTOP AUTH */}
                <div className="hidden md:flex items-center gap-4">
                    {!session ? (
                        <>
                            <Button variant="outline" asChild>
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/register">Register</Link>
                            </Button>
                        </>
                    ) : (
                        <>
              <span className="text-sm text-muted-foreground">
                Hi, {session.user?.name || session.user?.email}
              </span>
                            <Button variant="destructive" onClick={() => signOut()}>
                                Logout
                            </Button>
                        </>
                    )}
                </div>

                {/* MOBILE MENU BUTTON */}
                <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* MOBILE MENU */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-card border-t border-border">
                    <div className="px-4 py-4 space-y-4">

                        {headerMenuData.map((item) => (
                            <Link key={item.href} href={item.href} className="block text-foreground hover:text-primary">
                                {item.title}
                            </Link>
                        ))}

                        {/* AUTH MOBILE */}
                        {!session ? (
                            <div className="flex gap-2 pt-4">
                                <Button variant="outline" asChild className="flex-1 bg-transparent">
                                    <Link href="/login">Login</Link>
                                </Button>
                                <Button asChild className="flex-1">
                                    <Link href="/register">Register</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="pt-4">
                                <p className="mb-2">Hi, {session.user?.name || session.user?.email}</p>
                                <Button className="w-full" variant="destructive" onClick={() => signOut()}>
                                    Logout
                                </Button>
                            </div>
                        )}

                    </div>
                </div>
            )}
        </header>
    )
}
