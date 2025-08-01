import HotelForm from "@/components/pages/hotel-form";

interface PageProps {
    params: {
      id: string;
    } & Promise<any>;
  }
export default async function Page({ params }: PageProps) {
    console.log(params.id)
    const id = params.id
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            <div className="flex items-center">
                <div>
                    <h1 className="text-2xl font-bold font-headline">Edit Room</h1>
                    <p className="text-muted-foreground">Fill in the form below to edit a existing room.</p>
                </div>
            </div>
            <HotelForm hotelId={id}  />
        </main>
    )
}