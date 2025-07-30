"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { loginSchema, LoginInput } from "@/lib/validate/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { Alert, AlertDescription } from "../ui/alert"
import { useRouter } from "next/navigation"
import { Loader2Icon } from "lucide-react"
import Link from "next/link"



export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginInput) => {
    setLoading(true)
    setError("")
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Something went wrong");
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <Alert>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="mail@example.com"
                  required
                  {...register("email")}
                />
              </div>
              {
                errors.email && (
                  <p className="text-red-800 text-xs">{errors.email.message}</p>
                )
              }
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register("password")} required />
              </div>
              {
                errors.password && (
                  <p className="text-red-800 text-xs">{errors.password.message}</p>
                )
              }
              <div className="flex flex-col gap-3">
                <Button {...(loading && { disabled: true })}  type="submit" className="w-full">
                  {loading ? <Loader2Icon className="animate-spin" /> : "Login"}
                </Button>
                <Button disabled variant="outline" className="w-full btn-disabled">
                  Login with Google
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link className="underline underline-offset-4" href="/register">Sign up</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
