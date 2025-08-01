import {  z } from "zod";

export const roomSchema = z.object({
  hotelId: z.string({}).min(1),
  roomNumber: z.string().min(1),
  roomType: z.enum(["STANDARD", "DELUXE", "SUITE", "FAMILY"]),
  pricePerNight: z.number().min(1),
  capacity: z.number().min(1),
  description: z.string().optional(),
  isAvailable: z.boolean(),
});

export type RoomFormValues = z.infer<typeof roomSchema>;
