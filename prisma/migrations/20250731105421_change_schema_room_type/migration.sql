/*
  Warnings:

  - You are about to drop the column `roomTypeId` on the `rooms` table. All the data in the column will be lost.
  - You are about to drop the `room_types` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `roomType` to the `rooms` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."RoomTypeEnum" AS ENUM ('STANDARD', 'DELUXE', 'SUITE', 'FAMILY');

-- DropForeignKey
ALTER TABLE "public"."rooms" DROP CONSTRAINT "rooms_roomTypeId_fkey";

-- AlterTable
ALTER TABLE "public"."rooms" DROP COLUMN "roomTypeId",
ADD COLUMN     "roomType" "public"."RoomTypeEnum" NOT NULL;

-- DropTable
DROP TABLE "public"."room_types";
