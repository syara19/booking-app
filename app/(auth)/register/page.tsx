"use client"
import { RegisterForm } from "@/components/pages/register-form";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function RegisterPage() {
    const session = useSession();
    if (session.status === "authenticated") {
        redirect("/")
    }
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <RegisterForm />
            </div>
        </div>
    )
}