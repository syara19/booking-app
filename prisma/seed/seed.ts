import {
  BookingStatus,
  PaymentStatus,
  RoomTypeEnum,
} from "@/lib/generated/prisma";
import { hashPassword } from "@/lib/hashPassword";
import { prisma } from "@/lib/prisma";

async function main() {
  const userCustomer = await prisma.user.upsert({
    where: { email: "jhondoe@mail.com" },
    update: {},
    create: {
      username: "jhondoe",
      email: "jhondoe@mail.com",
      password: await hashPassword("password"),
      role: "CUSTOMER",
    },
  });

  const userAdmin = await prisma.user.upsert({
    where: { email: "admin@mail.com" },
    update: {},
    create: {
      username: "admin",
      email: "admin@mail.com",
      password: await hashPassword("password"),
      role: "ADMIN",
    },
  });

  const customer = await prisma.customer.upsert({
    where: { userId: userCustomer.id },
    update: {},
    create: {
      userId: userCustomer.id,
      fullName: "John Doe",
      phoneNumber: "08123456789",
    },
  });

  const admin = await prisma.admin.upsert({
    where: { userId: userAdmin.id },
    update: {},
    create: {
      userId: userAdmin.id,
      fullName: "Admin",
      phoneNumber: "08123456789",
    },
  });

  const hotel1 = await prisma.hotel.upsert({
    where: { id: "hotel-uuid-1" },
    update: {},
    create: {
      name: "Grand Hyatt Jakarta",
      address: "Jl. M.H. Thamrin Kav. 28-30, Jakarta",
      city: "Jakarta",
      country: "Indonesia",
      imageUrl: "https://placehold.co/1920x1080.png",
      description: "Hotel mewah di pusat kota Jakarta.",
      starRating: 5.0,
      checkInTime: "12.00",
      checkOutTime: "10.00",
    },
  });

  const hotel2 = await prisma.hotel.upsert({
    where: { id: "hotel-uuid-2" },
    update: {},
    create: {
      name: "Hotel Santika Premiere Bintaro",
      address:
        "Jl. Boulevard Bintaro Jaya Sektor 7 Blok B7/N1, Tangerang Selatan",
      city: "Tangerang Selatan",
      country: "Indonesia",
      imageUrl: "https://placehold.co/1920x1080.png",
      description: "Hotel nyaman di area Bintaro.",
      starRating: 4.5,
      checkInTime: "12.00",
      checkOutTime: "10.00",
    },
  });

  const room1Hotel1 = await prisma.room.upsert({
    where: { hotelId_roomNumber: { hotelId: hotel1.id, roomNumber: "101" } },
    update: {},
    create: {
      hotelId: hotel1.id,
      roomNumber: "101",
      roomType: RoomTypeEnum.DELUXE,
      pricePerNight: 1500000,
      capacity: 2,
      description: "Kamar deluxe dengan pemandangan kota.",
      isAvailable: true,
    },
  });

  const room2Hotel1 = await prisma.room.upsert({
    where: { hotelId_roomNumber: { hotelId: hotel1.id, roomNumber: "205" } },
    update: {},
    create: {
      hotelId: hotel1.id,
      roomNumber: "205",
      roomType: RoomTypeEnum.SUITE,
      pricePerNight: 3000000,
      capacity: 4,
      description: "Suite mewah dengan ruang tamu terpisah.",
      isAvailable: true,
    },
  });

  const room1Hotel2 = await prisma.room.upsert({
    where: { hotelId_roomNumber: { hotelId: hotel2.id, roomNumber: "301" } },
    update: {},
    create: {
      hotelId: hotel2.id,
      roomNumber: "301",
      roomType: RoomTypeEnum.STANDARD,
      pricePerNight: 750000,
      capacity: 2,
      description: "Kamar standar yang nyaman.",
      isAvailable: true,
    },
  });

  const booking1 = await prisma.booking.upsert({
    where: { id: "booking-uuid-1" },
    update: {},
    create: {
      id: "booking-uuid-1",
      customerId: customer.id,
      roomId: room1Hotel1.id,
      checkInDate: new Date("2025-08-10"),
      checkOutDate: new Date("2025-08-12"),
      totalPrice: 3000000.0,
      bookingStatus: BookingStatus.CONFIRMED,
      paymentStatus: PaymentStatus.PAID,
    },
  });
  console.log(`Created booking with id: ${booking1.id}`);

  const booking2 = await prisma.booking.upsert({
    where: { id: "booking-uuid-2" },
    update: {},
    create: {
      id: "booking-uuid-2",
      customerId: customer.id,
      roomId: room1Hotel2.id,
      checkInDate: new Date("2025-09-01"),
      checkOutDate: new Date("2025-09-03"),
      totalPrice: 1500000.0,
      bookingStatus: BookingStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
    },
  });
  console.log(`Created booking with id: ${booking2.id}`);

  const payment1 = await prisma.payment.upsert({
    where: { bookingId: booking1.id },
    update: {},
    create: {
      bookingId: booking1.id,
      amount: 3000000.0,
      paymentMethod: "Credit Card",
      transactionId: "TRX123456789",
      status: PaymentStatus.PAID,
    },
  });
  console.log(`Created payment for booking id: ${payment1.bookingId}`);

  const review1 = await prisma.review.upsert({
    where: { bookingId: booking1.id },
    update: {},
    create: {
      bookingId: booking1.id,
      customerId: customer.id,
      rating: 5,
      comment:
        "Pengalaman menginap yang luar biasa! Kamar bersih dan staf ramah.",
    },
  });
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
