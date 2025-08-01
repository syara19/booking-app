import AdminSidebar from "@/components/ui/admin-sidebar";
import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
        redirect("/")
    }
    return (
        <SidebarProvider >
            <Sidebar>
                <AdminSidebar />
            </Sidebar>
            <SidebarInset>
                <div className="ml-53 ">
                {children}

                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}