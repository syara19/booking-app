import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hotelSchema } from "@/lib/validate/hotel";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const roomId = params.id;
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
    const isValid = await prisma.hotel.findUnique({
      where: {
        id: roomId,
      },
    });

    if (!isValid) {
      return NextResponse.json({ message: "hotel not found" }, { status: 404 });
    }

    const res = await prisma.hotel.delete({
      where: {
        id: roomId,
      },
    });
    return NextResponse.json(
      { message: "hotel deleted successfully" },
      { status: 200 }
    );
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

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const hotelId = (await props.params).id;
  try {
    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
    });

    if (!hotel) {
      return NextResponse.json({ message: "Hotel not found" }, { status: 404 });
    }

    return NextResponse.json(hotel, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const hotelId = (await props.params).id;
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
    const validatedData = hotelSchema.parse(body);

    const updatedHotel = await prisma.hotel.update({
      where: { id: hotelId },
      data: {
        ...validatedData,
        starRating: parseFloat(validatedData.starRating as any),
      },
    });

    return NextResponse.json(
      { message: "Hotel updated successfully", hotel: updatedHotel },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: error.issues.map((i) => i.message) },
        { status: 400 }
      );
    }
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
