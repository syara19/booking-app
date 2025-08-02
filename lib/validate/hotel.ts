import { z } from "zod";

export const hotelSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters").max(255),
    address: z.string().min(5, "Address must be at least 5 characters").max(255),
    city: z.string().min(2, "City is required").max(100),
    country: z.string().min(2, "Country is required").default("Indonesia").optional(),
    description: z.string().optional(),
    imageUrl: z.string().optional(), 
    starRating: z.number().min(0).max(5), 
    checkInTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
    checkOutTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
});

export type HotelFormValues = z.infer<typeof hotelSchema>;