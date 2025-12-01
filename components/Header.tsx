"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { headerMenuData } from "@/constants/data"
import { usePathname } from "next/navigation"
import path from "path"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();

  //MOCK AUTH
  const isLoggedIn = true;
  const userRole = "admin";
  const isAdmin = false;
  const userName = "Kavindu";

  const getInitials = (name: string) => {
    return name 
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

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
          {/* <span className="text-2xl font-bold text-primary">Smart AutoHub</span> */}

          {/* WORDMARK */}
          <div className="flex flex-col sm:flex-row leading-tight sm:items-center">
              
              {/* Smart */}
              <span className="text-3xl font-extrabold tracking-wide
                bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent transition-all duration-400 hover:brightness-200">
                Smart
              </span>

              {/* AutoHub grouped together */}
              <span className="text-3xl font-extrabold sm:ml-2">
                <span className="text-black hover:text-red-700">Auto</span>
                <span className="text-red-700 hover:text-orange-500">Hub</span>
              </span>
          </div>

        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {headerMenuData?.map((item) => (
            <Link 
              key={item?.title}
              href={item?.href}
              className={`relative text-foreground font-medium hover:text-primary transition group ${pathname === item?.href && "text-primary"}`}>
                {item?.title}
                <span className={`absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-orange-500 group-hover:w-1/2 hover-effect group-hover:left-0 duration-150 ${pathname === item?.href && "w-1/2"}`}/>                
                <span className={`absolute -bottom-0.5 right-1/2 w-0 h-0.5 bg-orange-500 group-hover:w-1/2 hover-effect group-hover:right-0 duration-150 ${pathname === item?.href && "w-1/2"}`}/>
            </Link>
          ))}


          {/* <Link href="/" className="text-foreground hover:text-primary transition">
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
          </Link> */}
        </div>

        {/* DESKTOP AUTH / PROFILE */}
        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {!isLoggedIn ? (
          <>
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Register</Link>
            </Button>
          </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-accent"
              >
                <User size={18} />
                {userName}
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card shadow-lg border rounded-lg p-2">
                  <Link href="/dashboard" className="block px-3 py-2 hover:bg-accent">Dashboard</Link>
                  <Link href="/bookings" className="block px-3 py-2 hover:bg-accent">My Bookings</Link>

                  {userRole === "admin" && (
                    <Link href="/admin" className="block px-3 py-2 hover:bg-accent text-red-600 font-semibold">
                      Admin Panel
                    </Link>
                  )}

                  <button className="block w-full text-left px-3 py-2 hover:bg-accent">Logout</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* ---------------- MOBILE MENU ---------------- */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <div className="px-4 py-4 space-y-4">
            {/* <Link href="/" className="block text-foreground hover:text-primary">
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
            </Link> */}

              {/* MAIN NAV */}
            {headerMenuData.map((item) => (
              <Link key={item.href} href={item.href} className="block text-foreground hover:text-primary">
                {item.title}
              </Link>
            ))}

            {/* ---------------- LOGGED-IN SECTION ---------------- */}

            {isLoggedIn && (
              <>
                <hr className="border-border" />

                {/* USER BLOCK */}
                <div className="flex items-center gap-2 text-sm font-medium">
                  <User size={18} className="text-primary" />
                  {userName} {userRole === "admin" && "(Admin)"}
                </div>

                <Link href="/dashboard" className="block hover:text-primary">Dashboard</Link>
                <Link href="/bookings" className="block hover:text-primary">My Bookings</Link>

                {userRole === "admin" && (
                  <Link href="/admin" className="block text-red-600 hover:text-red-700 font-semibold">
                    Admin Panel
                  </Link>
                )}

                <button className="block text-left w-full hover:text-primary pt-2">Logout</button>
              </>
            )}

            {/* ---------------- LOGGED-OUT SECTION ---------------- */}
            {!isLoggedIn && (
              <div className="flex gap-2 pt-4">
                <Button variant="outline" asChild className="flex-1 bg-transparent">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
