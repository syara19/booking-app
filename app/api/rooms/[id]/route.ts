import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { roomSchema } from "@/lib/validate/room";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const roomId = params.id;
  const res = await prisma.room.findUnique({
    where: {
      id: roomId,
    },
  });
  return NextResponse.json(res);
}

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role === "ADMIN") {
    return NextResponse.json(
      {
        message: "unauthorized",
      },
      { status: 401 }
    );
  }

  try {
    const roomId = params.id;
    const body = await request.json();
    const validateData = roomSchema.safeParse(body);
    const existingRoom = await prisma.room.findUnique({
      where: {
        id: roomId,
      },
    });

    if (!existingRoom) {
      return NextResponse.json({ message: "room not found" }, { status: 404 });
    }

    const res = await prisma.room.update({
      where: {
        id: roomId,
      },
      data: {
        hotelId: validateData.data!.hotelId,
        roomNumber: validateData.data!.roomNumber,
        roomType: validateData.data!.roomType,
        pricePerNight: validateData.data!.pricePerNight,
        capacity: validateData.data!.capacity,
        description: validateData.data!.description,
        isAvailable: validateData.data!.isAvailable,
      },
    });
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  const awaitedParams = await params; 
  const { id } = awaitedParams;
  
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        {
          message: "unauthorized",
        },
        { status: 401 }
      );
    }
    const existingRoom = await prisma.room.findUnique({
      where: {
        id,
      },
    });
    console.log("id:", id, "db:", existingRoom?.id);
    console.log(existingRoom?.id === id);
    if (!existingRoom) {
      return NextResponse.json({ message: "room not found" }, { status: 404 });
    }

    const res = await prisma.room.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ message: "room deleted" }, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 }
    );
  }
}
