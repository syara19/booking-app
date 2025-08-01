'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarContent, SidebarFooter } from '@/components/ui/sidebar';
import { LayoutDashboard, Hotel, Users, BedDouble, LogOut, Settings, DoorOpen, ShieldUser } from 'lucide-react';
import { ModeToggle } from './button-theme';

const navItems = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/hotels', icon: Hotel, label: 'Hotels' },
    { href: '/admin/rooms', icon: DoorOpen, label: 'Rooms' },
    { href: '/admin/bookings', icon: BedDouble, label: 'Bookings' },
    { href: '/admin/users', icon: Users, label: 'Users' },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <>
            <div className='w-full'>
                <SidebarHeader className="border-b border-sidebar-border">
                    <div className="p-2 flex gap-2">
                        <ShieldUser className='h-8 w-8' />
                        <div className='flex items-center'>
                            <h1 className="text-md  font-semibold">Admin Dashboard</h1>
                        </div>
                    </div>
                    <div className='flex justify-center mb-2'>
                        <ModeToggle />
                    </div>
                </SidebarHeader>

                <SidebarContent className="p-2">
                    <SidebarMenu>
                        {navItems.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname.startsWith(item.href)}
                                    tooltip={{ children: item.label, side: 'right' }}
                                >
                                    <Link href={item.href}>
                                        <item.icon />
                                        <span>{item.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarContent>

                <SidebarFooter className="mt-auto border-t border-sidebar-border p-2">
                    <SidebarMenu>
                        <SidebarMenuItem className='flex justify-center'>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={{ children: 'Settings', side: 'right' }}>
                                <Link href="/admin/settings">
                                    <Settings />
                                    <span>Settings</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={{ children: 'Logout', side: 'right' }}>
                                <Link href="/">
                                    <LogOut />
                                    <span>Logout</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </div>
        </>
    );
}
