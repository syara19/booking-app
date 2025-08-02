import { LoginForm } from "@/components/pages/login-form"
import { Navbar } from "@/components/ui/Navbar"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function LoginPage() {

  const session = await getServerSession(authOptions)
  if (session) {
    redirect("/")
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </>
  )
}
