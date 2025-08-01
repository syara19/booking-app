-- DropForeignKey
ALTER TABLE "public"."bookings" DROP CONSTRAINT "bookings_roomId_fkey";

-- AddForeignKey
ALTER TABLE "public"."bookings" ADD CONSTRAINT "bookings_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
