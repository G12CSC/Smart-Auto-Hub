"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)

    const { data: session } = useSession()

    return (

        <header className="bg-background border-b border-border sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                    <Image
                        src="/images/whatsapp-20image-202025-11-14-20at-2011.jpg"
                        alt="Sameera Auto Traders Logo"
                        width={120}
                        height={60}
                        className="object-contain"
                        priority
                    />
                    <span className="text-2xl font-bold text-primary">Smart AutoHub</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-foreground hover:text-primary transition">
                        Home
                    </Link>
                    <Link href="/vehicles" className="text-foreground hover:text-primary transition">
                        Find a Car
                    </Link>
                    <Link href="/consultation" className="text-foreground hover:text-primary transition">
                        Book Consultation
                    </Link>
                    <Link href="/about" className="text-foreground hover:text-primary transition">
                        About Us
                    </Link>
                    <Link href="/contact" className="text-foreground hover:text-primary transition">
                        Contact
                    </Link>
                </div>

                {/* Auth Buttons */}
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

                {/* Mobile Menu Button */}
                <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-card border-t border-border">
                    <div className="px-4 py-4 space-y-4">
                        <Link href="/" className="block text-foreground hover:text-primary">
                            Home
                        </Link>
                        <Link href="/vehicles" className="block text-foreground hover:text-primary">
                            Find a Car
                        </Link>
                        <Link href="/consultation" className="block text-foreground hover:text-primary">
                            Book Consultation
                        </Link>
                        <Link href="/about" className="block text-foreground hover:text-primary">
                            About Us
                        </Link>
                        <Link href="/contact" className="block text-foreground hover:text-primary">
                            Contact
                        </Link>

                        {/* Auth mobile */}
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
