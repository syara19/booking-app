
import AdminRoom from "@/components/pages/admin-room";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
        redirect("/")
    }
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 ">
            <AdminRoom/>
        </main>
    )
}