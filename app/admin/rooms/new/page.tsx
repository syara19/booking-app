import RoomForm from "@/components/pages/room-form";

export default function NewRoomPage() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            <div className="flex items-center">
                <div>
                    <h1 className="text-2xl font-bold font-headline">Add New Room</h1>
                    <p className="text-muted-foreground">Fill in the form below to add a new room.</p>
                </div>
            </div>
            <RoomForm  />
        </main>
    )
}