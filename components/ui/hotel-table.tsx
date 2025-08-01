import { Hotel } from "@/lib/generated/prisma";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { Badge } from "./badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { Button } from "./button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HotelTable() {
    // const { toast } = useToast();
    const router = useRouter();
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await fetch('/api/hotels'); // Ubah endpoint API
                if (!response.ok) {
                    throw new Error('Gagal mengambil data hotel dari API.');
                }
                const data = await response.json();
                setHotels(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHotels();
    }, []);

    console.log(hotels)

    if (isLoading) {
        return <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">Loading...</main>;
    }

    if (error) {
        return <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">Error: {error}</main>;
    }

    const handleDelete = async (hotelId: string) => {
        try {
            const response = await fetch(`/api/hotels/${hotelId}`, { // Ubah endpoint API
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal menghapus hotel.');
            }

            // toast({
            //     title: "Hotel Dihapus",
            //     description: "Hotel berhasil dihapus.",
            // });
            router.prefetch('/admin/hotels')
            // router.refresh();
        } catch (error: any) {
            // toast({
            //     title: "Gagal Menghapus",
            //     description: error.message,
            //     variant: "destructive",
            // });
            console.log(error)
        }
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Nama Hotel</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Check In/Check Out</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {hotels.map((hotel) => (
                    <TableRow key={hotel.id}>
                        <TableCell>
                            <Image src={hotel.imageUrl ?? "https://placehold.co/1920x1080.png"} alt="" className="rounded-md" width={100} height={100} />
                        </TableCell>
                        <TableCell className="font-medium">
                            <div>{hotel.name}</div>
                            <div className="text-sm text-muted-foreground">{hotel.description}</div>
                        </TableCell>
                        <TableCell>{hotel.city}, {hotel.country}</TableCell>
                        <TableCell>
                            <Badge variant="default">{+hotel.starRating} Bintang</Badge>
                        </TableCell>
                        <TableCell>
                            {hotel.checkInTime} - {hotel.checkOutTime}
                        </TableCell>
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
                                            <Link href={`/admin/hotels/edit/${hotel.id}`}><Pencil className="mr-2 h-4 w-4" />Edit</Link>
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
                                            Tindakan ini tidak dapat diurungkan. Ini akan menghapus hotel <span className="font-bold"> {hotel.name}</span> secara permanen.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(hotel.id)}>Hapus</AlertDialogAction>
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
