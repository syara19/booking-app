"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Hotel,
    User,
    Calendar,
    Settings,
    LogOut,
    Menu,
    X,
    Shield
} from "lucide-react"
import { UserRole } from "@/lib/generated/prisma"
import { ModeToggle } from "./button-theme"

export function Navbar() {
    const { data: session } = useSession()

    console.log(session)
    const handleSignOut = () => {
        signOut({ callbackUrl: "/login" })
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                {/* Logo */}
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    <Hotel className="h-6 w-6" />
                    <span className="hidden font-bold sm:inline-block">
                        HotelBooking
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                    <Link href="/" className="transition-colors hover:text-foreground/80">
                        Beranda
                    </Link>
                    <Link href="/hotels" className="transition-colors hover:text-foreground/80">
                        Hotel
                    </Link>
                    {session && (
                        <Link href="/my-bookings" className="transition-colors hover:text-foreground/80">
                            Booking Saya
                        </Link>
                    )}
                      <ModeToggle />
                </nav>

                <div className="flex flex-1 items-center justify-end space-x-4">
                    {/* User Menu */}
                    {session ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <User className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {session.user.name || session.user.email}
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {session.user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                {session.user.role === UserRole.ADMIN && (
                                    <>
                                        <DropdownMenuItem asChild>
                                            <Link href="/admin/dashboard" className="flex items-center">
                                                <Shield className="mr-2 h-4 w-4" />
                                                <span>Admin Dashboard</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                    </>
                                )}

                                <DropdownMenuItem asChild>
                                    <Link href="/profile" className="flex items-center">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profil</span>
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem asChild>
                                    <Link href="/my-bookings" className="flex items-center">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        <span>Booking Saya</span>
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSignOut}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Keluar</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Button variant="ghost" asChild>
                                <Link href="/login">Masuk</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/register">Daftar</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>

        </header>
    )
}