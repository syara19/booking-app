import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hotelSchema } from "@/lib/validate/hotel";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function GET() {
  try {
    const hotels = await prisma.hotel.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(hotels);
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

    const validateData = hotelSchema.safeParse(body);
    if (!validateData.success) {
      return NextResponse.json(
        { message: "validation error" },
        { status: 400 }
      );
    }

    const res = await prisma.hotel.create({
      data: {
        name: validateData.data.name,
        city: validateData.data.city,
        address: validateData.data.address,
        description: validateData.data.description,
        starRating: validateData.data.starRating,
        checkInTime: validateData.data.checkInTime,
        checkOutTime: validateData.data.checkOutTime,
        imageUrl: validateData.data.imageUrl,
      },
    });
    return NextResponse.json(res);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 }
    );
  }
}
