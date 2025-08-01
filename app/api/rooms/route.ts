import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { roomSchema } from "@/lib/validate/room";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function GET() {
  try {
    const res = await prisma.room.findMany({
      include: {
        hotel: {
          select: { name: true },
        },
      },
    });
    return NextResponse.json(res);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json(
      {
        message: "unauthorized",
      },
      { status: 401 }
    );
  }
  try {
    const body = await request.json();

    const validateData = roomSchema.safeParse(body);
    if (!validateData.success) {
      return NextResponse.json(
        { message: "validation error" },
        { status: 400 }
      );
    }
    console.log(validateData.data);
    const res = await prisma.room.create({
      data: {
        hotelId: validateData.data.hotelId,
        roomNumber: validateData.data.roomNumber,
        roomType: validateData.data.roomType,
        pricePerNight: validateData.data.pricePerNight,
        capacity: validateData.data.capacity,
        description: validateData.data.description,
        isAvailable: validateData.data.isAvailable,
      },
    });
    console.log(res)
    return NextResponse.json(
      { message: "room created successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    console.log(error);

    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 }
    );
  }
}
