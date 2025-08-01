import { Hotel, Room } from "@/lib/generated/prisma";

export interface RoomFormProps {
    room?: Room;
    hotels: Hotel[];
}