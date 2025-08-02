"use client";

import { useToast } from "@/hooks/use-toast";
import { hotelSchema, HotelFormValues } from "@/lib/validate/hotel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { CldUploadButton, CloudinaryUploadWidgetResults } from "next-cloudinary";

export default function HotelForm({ hotelId }: { hotelId?: string }) {
    const [hotel, setHotel] = useState<HotelFormValues | null>(null);
    const [imageUrl, setImageUrl] = useState<string>("");
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const isEdit = !!hotelId;

    useEffect(() => {
        const fetchData = async () => {
            if (hotelId) {
                setIsLoading(true);
                try {
                    const responseHotel = await fetch(`/api/hotels/${hotelId}`);
                    if (!responseHotel.ok) throw new Error('Error fetching hotel');
                    const dataHotel = await responseHotel.json();
                    setHotel(dataHotel);
                    if (dataHotel.imageUrl) {
                        setImageUrl(dataHotel.imageUrl);
                    }
                } catch (err) {
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchData();
    }, [hotelId, toast]);

    const form = useForm<HotelFormValues>({
        resolver: zodResolver(hotelSchema),
        defaultValues: {
            name: '',
            address: '',
            city: '',
            country: 'Indonesia',
            description: '',
            starRating: 1,
            checkInTime: '14:00',
            checkOutTime: '12:00',
            imageUrl: '',
        } as HotelFormValues,
    });






    const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
        const newImageUrl = typeof result.info === 'object' && result.info !== null ? result.info.secure_url as string : '';
        setImageUrl(newImageUrl);
        form.setValue("imageUrl", newImageUrl);
        toast({
            title: "Upload Berhasil",
            description: "Gambar berhasil diunggah ke Cloudinary.",
        });
    };

    const onSubmit = async (data: HotelFormValues) => {
        setIsLoading(true);
        try {
            const url = isEdit ? `/api/hotels/${hotelId}` : '/api/hotels'
            const method = isEdit ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Something went wrong');
            }

            toast({
                title: isEdit ? "Hotel Diperbarui" : "Hotel Dibuat",
                description: `Hotel "${data.name}" telah berhasil ${isEdit ? 'diperbarui' : 'dibuat'}.`,
            });
            router.push('/admin/hotels');
            router.refresh();
        } catch (err) {
            console.error(err);
         
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        if (hotel && isEdit) {
            form.reset({
                ...hotel,
                starRating: Number(hotel.starRating),
                description: hotel.description || '',
                imageUrl: hotel.imageUrl || '',
            });
        }
    }, [hotel, isEdit, form]);
    if (isLoading && isEdit) {
        return (
            <div className="flex items-center justify-center w-full h-[480px]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>{isEdit ? "Edit Hotel" : "Buat Hotel Baru"}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nama Hotel</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Hotel Bahagia" {...field} disabled={isLoading} value={field.value} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="starRating"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bintang</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                max="5"
                                                placeholder="e.g., 4.5"
                                                {...field}
                                                disabled={isLoading}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kota</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Jakarta" {...field} disabled={isLoading} value={field.value} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Negara</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Indonesia" {...field} disabled={isLoading} value={field.value} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Alamat</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Jl. Contoh No. 123" {...field} disabled={isLoading} value={field.value} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Deskripsi</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Hotel ini menawarkan..." {...field} disabled={isLoading} value={field.value} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="checkInTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Waktu Check-in</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} disabled={isLoading} value={field.value} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="checkOutTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Waktu Check-out</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} disabled={isLoading} value={field.value} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Gambar Hotel</FormLabel>
                                    <FormControl>
                                        <CldUploadButton
                                            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                                            onSuccess={handleUploadSuccess}
                                            className="h-[200px] border-2 border-dashed flex items-center justify-center rounded-md"

                                        >
                                            {imageUrl ? (
                                                <div className="relative h-full w-full">
                                                    <Image
                                                        src={imageUrl}
                                                        alt="Hotel Preview"
                                                        fill
                                                        className="object-cover rounded-md"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="text-center text-gray-500">
                                                    <p>Pilih atau tarik gambar ke sini</p>
                                                    <p className="text-sm">(Max. 1MB)</p>
                                                </div>
                                            )}
                                        </CldUploadButton>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>Batal</Button>
                            <Button type="submit" disabled={isLoading || !imageUrl}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEdit ? 'Simpan Perubahan' : 'Buat Hotel'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}