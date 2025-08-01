"use client"
import { useToast } from "@/hooks/use-toast";
import { RoomTypeEnum } from "@/lib/generated/prisma";
import { RoomFormValues, roomSchema } from "@/lib/validate/room";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { HotelFormValues } from "@/lib/validate/hotel";
import { Switch } from "../ui/switch";


const roomTypes: RoomTypeEnum[] = ["STANDARD", "DELUXE", "SUITE", "FAMILY"];
export default function RoomForm({ roomId }: { roomId?: string }) {
    const [room, setRoom] = useState<RoomFormValues | null>(null);
    const [hotels, setHotels] = useState<HotelFormValues | null>(null);
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const isEdit = !!roomId;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch hotels
                const responseHotel = await fetch('/api/hotels');
                if (!responseHotel.ok) throw new Error('Error fetching hotels');
                const dataHotel = await responseHotel.json();
                setHotels(dataHotel);

                // Fetch specific room only if editing
                if (roomId) {
                    const responseRoom = await fetch(`/api/rooms/${roomId}`);
                    console.log(responseRoom)
                    if (!responseRoom.ok) throw new Error('Error fetching room');
                    const dataRoom = await responseRoom.json();
                    setRoom(dataRoom);
                }
            } catch (err) {
                console.log(err);
                toast({
                    title: "Error",
                    description: "Something went wrong",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [roomId]);

    console.log(room)

    const defaultValues: Partial<RoomFormValues> = room ? {
        ...room,
        roomType: room.roomType as RoomTypeEnum,
        description: room.description || '',
    } : {
        isAvailable: true,
        roomType: 'STANDARD',
        description: '',
        capacity: 1,
        pricePerNight: 1,
        roomNumber: '',
        hotelId: '',
    };


    const form = useForm<RoomFormValues>({
        resolver: zodResolver(roomSchema),
        defaultValues,
    });


    const onSubmit = async (data: RoomFormValues) => {
        setIsLoading(true);
        try {
            const url = isEdit ? `http://localhost:3000/api/rooms/${roomId}` : 'http://localhost:3000/api/rooms'
            const method = isEdit ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
            if (!res.ok) {
                throw new Error('Something went wrong')
            }
            toast({
                title: isEdit ? "Room Updated" : "Room Created",
                description: `Room "${data.roomType}" at room number "${data.roomNumber}" has been successfully ${isEdit ? 'updated' : 'created'}.`,
            });
            router.push('/admin/rooms')


        useEffect(() => {
            if (room && isEdit) {
              form.reset({
                ...room,
                roomType: room.roomType as RoomTypeEnum,
                description: room.description || '',
              });
            }
          }, [room, isEdit, form]);
        } catch (err) {
            console.log(err)
            toast({
                title: "Error",
                description: "Something went wrong",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false);
        }



        if (isLoading && roomId) {
            return (
                <div className="flex items-center justify-center w-full h-[480px]">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            )
        }
    };

    useEffect(() => {
        if (room && isEdit) {
            form.reset({
                ...room,
                roomType: room.roomType as RoomTypeEnum,
                description: room.description || '',
            });
        }
    }, [room, isEdit, form]);
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>{isEdit ? "Edit Room" : "Create New Room"}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="hotelId"
                            render={({ field }) => (
                                <FormItem className="">
                                    <FormLabel>Hotel</FormLabel>
                                    <Select disabled={isLoading} onValueChange={field.onChange} value={field.value}>
                                        <FormControl  >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a hotel" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent >
                                            {Array.isArray(hotels) && hotels?.map(hotel => (
                                                <SelectItem key={hotel.id} value={hotel.id}>{hotel.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="roomType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Room Type</FormLabel>
                                        <Select onValueChange={field.onChange} disabled={isLoading} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a room type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {roomTypes.map(type => (
                                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="roomNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Room Number</FormLabel>
                                        <FormControl>
                                            <Input

                                                placeholder="e.g., 101" {...field} disabled={isLoading} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="A luxurious room with..." {...field} disabled={isLoading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="pricePerNight"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price Per Night (Rp)</FormLabel>
                                        <FormControl>
                                            <Input

                                                type="number" placeholder="e.g., 250" {...field} disabled={isLoading}
                                                onChange={(e) => field.onChange(e.target.valueAsNumber || 1)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="capacity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Capacity</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="1" placeholder="e.g., 2" {...field} disabled={isLoading} onChange={(e) => field.onChange(e.target.valueAsNumber || 1)} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="isAvailable"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel >Available</FormLabel>
                                        <FormDescription>
                                            Is this room currently available for booking?
                                        </FormDescription>
                                    </div>
                                    <FormControl >
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {room ? 'Save Changes' : 'Create Room'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}

