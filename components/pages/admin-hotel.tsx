"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import RoomTable from "../ui/room-table";
import HotelTable from "../ui/hotel-table";



export default function AdminHotel() {
    return (
        <>
            <div className="flex items-center">
                <div>
                    <h1 className="text-2xl font-bold font-headline">Hotels</h1>
                    <p className="text-muted-foreground">Manage all Hotels in the system.</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <Button asChild>
                        <Link href="/admin/hotels/new">
                            <PlusCircle className="h-4 w-4" />
                            <span className="ml-2">Add Hotel</span>
                        </Link>
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Hotel List</CardTitle>
                    <CardDescription>A list of all hotels currently available.</CardDescription>
                </CardHeader>
                <CardContent>
                    <HotelTable />
                </CardContent>
            </Card>
        </>
    );
}