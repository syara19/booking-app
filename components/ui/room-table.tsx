"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation'; // Import useRouter
import { Room, Hotel } from '@/lib/generated/prisma'; // Sesuaikan path
import { Badge } from "./badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { useEffect, useState } from "react";

type RoomWithHotel = Room & {
    hotel: Pick<Hotel, 'name'>;
};

export default function RoomTable() {
    const { toast } = useToast();
    const router = useRouter(); // Inisialisasi useRouter
    const [rooms, setRooms] = useState<RoomWithHotel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await fetch('/api/rooms');
                if (!response.ok) {
                    throw new Error('Gagal mengambil data dari API.');
                }
                const data = await response.json();
                setRooms(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRooms();
    }, []);

    if (isLoading) {
        return <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">Loading...</main>;
    }

    if (error) {
        return <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">Error: {error}</main>;
    }

    const handleDelete = async (roomId: string) => {
        try {
            console.log(roomId)
            const response = await fetch(`/api/rooms/${roomId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });


            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal menghapus kamar.');
            }

            toast({
                title: "Kamar Dihapus",
                description: "Kamar berhasil dihapus.",
            });

            router.refresh();
        } catch (error: any) {
            toast({
                title: "Gagal Menghapus",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Room Type</TableHead>
                    <TableHead>Hotel</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Price/Night</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {rooms.map((room) => (
                    <TableRow key={room.id}>
                        <TableCell className="font-medium">
                            <div>{room.roomType}</div>
                            <div className="text-sm text-muted-foreground">Kamar #{room.roomNumber}</div>
                        </TableCell>
                        <TableCell>{room.hotel.name}</TableCell>
                        <TableCell>
                            <Badge variant={room.isAvailable ? 'default' : 'secondary'} className={room.isAvailable ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}>
                                {room.isAvailable ? "Tersedia" : "Tidak Tersedia"}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">${room.pricePerNight.toFixed(2)}</TableCell>
                        <TableCell className="flex justify-end">
                            <AlertDialog>
                                <DropdownMenu >
                                    <DropdownMenuTrigger asChild>
                                        <Button className="" aria-haspopup="true" size="icon" variant="ghost">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Toggle menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link href={`/admin/rooms/edit/${room.id}`}><Pencil className="mr-2 h-4 w-4" />Edit</Link>
                                        </DropdownMenuItem>
                                        <AlertDialogTrigger asChild>
                                            <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onSelect={(e) => e.preventDefault()}>
                                                <div className="flex items-center w-full"><Trash2 className="mr-2 h-4 w-4" />Delete</div>
                                            </DropdownMenuItem>
                                        </AlertDialogTrigger>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Tindakan ini tidak dapat diurungkan. Ini akan menghapus kamar <span className="font-bold"> {room.roomType} (#{room.roomNumber})</span> secara permanen.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(room.id)}>Hapus</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}