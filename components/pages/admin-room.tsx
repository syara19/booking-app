"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import RoomTable from "../ui/room-table";



export default function AdminRoom() {
    return (
        <>
            <div className="flex items-center">
                <div>
                    <h1 className="text-2xl font-bold font-headline">Rooms</h1>
                    <p className="text-muted-foreground">Manage all rooms in the system.</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <Button asChild>
                        <Link href="/admin/rooms/new">
                            <PlusCircle className="h-4 w-4" />
                            <span className="ml-2">Add Room</span>
                        </Link>
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Room List</CardTitle>
                    <CardDescription>A list of all rooms currently available in all hotels.</CardDescription>
                </CardHeader>
                <CardContent>
                    <RoomTable />
                </CardContent>
            </Card>
        </>
    );
}