import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import { Users, BedDouble } from "lucide-react";
import Link from "next/link";

interface RoomListProps {
    hotelId: string;
}

export default function RoomList({ hotelId }: RoomListProps) {

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Available Rooms</CardTitle>
                <CardDescription>Select a room to proceed with your booking.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* {hotelRooms.map(room => ( */}
                    <Card key={1} className="overflow-hidden">
                        <div className="flex">
                            <div className="w-1/3 relative">
                                <Image 
                                    src="https://placehold.co/1920x1080.png" 
                                    alt="tumb"
                                    fill 
                                    className="object-cover" 
                                    data-ai-hint="hotel room"
                                />
                            </div>
                            <div className="w-2/3 p-4 flex flex-col justify-between">
                                <div>
                                    <h4 className="font-bold text-lg font-headline">type</h4>
                                    <div className="flex items-center text-sm text-muted-foreground mt-1 space-x-4">
                                        <span className="flex items-center"><Users className="mr-1 h-4 w-4" /> Capacity: </span>
                                        <span className="flex items-center"><BedDouble className="mr-1 h-4 w-4" /> type: bed</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">desc</p>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                     <p className="text-lg font-bold text-primary">
                                        {/* ${room.pricePerNight} */}
                                        price
                                        <span className="text-sm font-normal text-muted-foreground">/night</span>
                                    </p>
                                    <Button asChild>
                                        <Link href={`/book/`}>Book Now</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                 {/* ))} */}
            </CardContent>
        </Card>
    )
}