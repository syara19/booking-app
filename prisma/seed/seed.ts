import { BookingStatus, PaymentStatus } from "@/lib/generated/prisma";
import { Decimal } from "@/lib/generated/prisma/runtime/library";
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

  const roomTypeStandard = await prisma.roomType.upsert({
    where: { name: "Standard" },
    update: {},
    create: {
      name: "Standard",
      description: "A basic room with essential amenities.",
    },
  });

  const roomTypeDeluxe = await prisma.roomType.upsert({
    where: { name: "Deluxe" },
    update: {},
    create: {
      name: "Deluxe",
      description: "A more spacious room with enhanced amenities.",
    },
  });

  const roomTypeSuite = await prisma.roomType.upsert({
    where: { name: "Suite" },
    update: {},
    create: {
      name: "Suite",
      description: "Luxurious and expansive room with multiple areas.",
    },
  });

  const hotelA = await prisma.hotel.upsert({
    where: { id: "some-id-for-hotel-a" },
    update: {},
    create: {
      name: "Grand Hyatt Jakarta",
      address: "Jl. M.H. Thamrin Kav. 28-30, Jakarta Pusat",
      city: "Jakarta",
      country: "Indonesia",
      description: "A luxurious hotel in the heart of Jakarta.",
      starRating: new Decimal(4.8),
      checkInTime: new Date("2000-01-01T15:00:00Z"), // Example time
      checkOutTime: new Date("2000-01-01T12:00:00Z"), // Example time
    },
  });

  const hotelB = await prisma.hotel.upsert({
    where: { id: "some-id-for-hotel-b" },
    update: {},
    create: {
      name: "The Ritz-Carlton Bali",
      address: "Jalan Raya Nusa Dua Selatan, Lot III, Sawangan, Nusa Dua",
      city: "Denpasar",
      country: "Indonesia",
      description: "An exclusive resort offering stunning ocean views.",
      starRating: new Decimal(4.9),
      checkInTime: new Date("2000-01-01T15:00:00Z"),
      checkOutTime: new Date("2000-01-01T12:00:00Z"),
    },
  });

  const room1A = await prisma.room.upsert({
    where: { hotelId_roomNumber: { hotelId: hotelA.id, roomNumber: "101" } },
    update: {},
    create: {
      hotelId: hotelA.id,
      roomNumber: "101",
      roomTypeId: roomTypeStandard.id,
      pricePerNight: 1000000,
      capacity: 2,
      description: "Standard room with city view.",
      isAvailable: true,
    },
  });

  const room2A = await prisma.room.upsert({
    where: { hotelId_roomNumber: { hotelId: hotelA.id, roomNumber: "205" } },
    update: {},
    create: {
      hotelId: hotelA.id,
      roomNumber: "205",
      roomTypeId: roomTypeDeluxe.id,
      pricePerNight: 1500000,
      capacity: 3,
      description: "Deluxe room with pool view.",
      isAvailable: true,
    },
  });

  const room1B = await prisma.room.upsert({
    where: { hotelId_roomNumber: { hotelId: hotelB.id, roomNumber: "B1" } },
    update: {},
    create: {
      hotelId: hotelB.id,
      roomNumber: "B1",
      roomTypeId: roomTypeSuite.id,
      pricePerNight: 3000000,
      capacity: 4,
      description: "Ocean view suite with private balcony.",
      isAvailable: true,
    },
  });

  const booking1 = await prisma.booking.upsert({
    where: { id: "booking-id-1" }, // Use a static ID for initial upsert for demonstration
    update: {},
    create: {
      customerId: customer.id,
      roomId: room1A.id,
      checkInDate: new Date("2025-08-10"),
      checkOutDate: new Date("2025-08-12"),
      totalPrice: new Decimal(2000000), // 2 nights * 1,000,000
      bookingStatus: BookingStatus.CONFIRMED,
      paymentStatus: PaymentStatus.PAID,
    },
  });

  const booking2 = await prisma.booking.upsert({
    where: { id: "booking-id-2" },
    update: {},
    create: {
      customerId: customer.id,
      roomId: room2A.id,
      checkInDate: new Date("2025-09-01"),
      checkOutDate: new Date("2025-09-05"),
      totalPrice: new Decimal(6000000), // 4 nights * 1,500,000
      bookingStatus: BookingStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
    },
  });

  const booking3 = await prisma.booking.upsert({
    where: { id: "booking-id-3" },
    update: {},
    create: {
      customerId: customer.id,
      roomId: room1B.id,
      checkInDate: new Date("2025-07-20"),
      checkOutDate: new Date("2025-07-22"),
      totalPrice: new Decimal(6000000), // 2 nights * 3,000,000
      bookingStatus: BookingStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
    },
  });

  const payment1 = await prisma.payment.upsert({
    where: { bookingId: booking1.id },
    update: {},
    create: {
      bookingId: booking1.id,
      amount: booking1.totalPrice,
      paymentMethod: "Credit Card",
      transactionId: "TRX-12345",
      status: PaymentStatus.PAID,
    },
  });

  const payment3 = await prisma.payment.upsert({
    where: { bookingId: booking3.id },
    update: {},
    create: {
      bookingId: booking3.id,
      amount: booking3.totalPrice,
      paymentMethod: "Bank Transfer",
      transactionId: "TRX-67890",
      status: PaymentStatus.PAID,
    },
  });

  const review1 = await prisma.review.upsert({
    where: { bookingId: booking3.id },
    update: {},
    create: {
      bookingId: booking3.id,
      customerId: customer.id,
      rating: 5,
      comment: "Excellent stay! Highly recommend.",
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
