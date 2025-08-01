import { z } from "zod";
import { BookingStatus, PaymentStatus } from "../generated/prisma";

export const adminBookingUpdateSchema = z.object({
  bookingStatus: z.nativeEnum(BookingStatus).optional(),
  paymentStatus: z.nativeEnum(PaymentStatus).optional(),
});