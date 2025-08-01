-- DropForeignKey
ALTER TABLE "public"."rooms" DROP CONSTRAINT "rooms_hotelId_fkey";

-- AddForeignKey
ALTER TABLE "public"."rooms" ADD CONSTRAINT "rooms_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "public"."hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
