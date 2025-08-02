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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { useRouter } from "next/navigation"
import { Loader2Icon } from "lucide-react"
import Link from "next/link"
import { RegisterInput, registerSchema } from "@/lib/validate/auth"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"



export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"div">) {

    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const {
        register,
        watch,
        reset,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            role: "CUSTOMER"
        }
    })


    const watchRole = watch("role", "CUSTOMER")

    const onSubmit = async (data: RegisterInput) => {
        setLoading(true)
        setError("")
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
            reset()
            router.push("/login")
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            }
            setError("Something went wrong")
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Register an account</CardTitle>
                    <CardDescription>
                        Don&apos;t have an account?
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
                                <Label htmlFor="fullname">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="jhondoe"
                                    required
                                    {...register("username")}
                                />
                            </div>
                            {
                                errors.username && (
                                    <p className="text-red-800 text-xs">{errors.username.message}</p>
                                )
                            }
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
                                <Input placeholder="******" id="password" type="password" {...register("password")} required />
                            </div>
                            {
                                errors.password && (
                                    <p className="text-red-800 text-xs">{errors.password.message}</p>
                                )
                            }

                            { }


                            <div className="space-y-1">
                                <Label htmlFor="role">Role</Label>
                                <Select
                                    onValueChange={(value: 'CUSTOMER' | 'ADMIN') => {
                                        setValue('role', value)
                                    }}
                                    defaultValue={watchRole}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CUSTOMER">Customer</SelectItem>
                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
                            </div>

                            {watchRole === 'CUSTOMER' && (
                                <div className="space-y-4 p-4 border border-dashed rounded-md">
                                    <h3 className="text-lg font-semibold">Customer Details</h3>
                                    <div className="space-y-1">
                                        <Label htmlFor="customerDetails.fullName">Full Name</Label>
                                        <Input placeholder="John Doe" id="customerDetails.fullName" type="text" {...register('customerDetails.fullName')} />
                                        {errors.customerDetails?.fullName && <p className="text-red-500 text-sm">{errors.customerDetails.fullName.message}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <Label  htmlFor="customerDetails.phoneNumber">Phone Number</Label>
                                        <Input placeholder="0xxxxx" id="customerDetails.phoneNumber" type="text" {...register('customerDetails.phoneNumber')} />
                                        {errors.customerDetails?.phoneNumber && <p className="text-red-500 text-sm">{errors.customerDetails.phoneNumber.message}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="customerDetails.address">Address</Label>
                                        <Input placeholder="Sesame Street" id="customerDetails.address" type="text" {...register('customerDetails.address')} />
                                        {errors.customerDetails?.address && <p className="text-red-500 text-sm">{errors.customerDetails.address.message}</p>}
                                    </div>
                                    {errors.customerDetails && errors.customerDetails.message && (
                                        <Alert variant="destructive">
                                            {/* <ExclamationTriangleIcon className="h-4 w-4" /> */}
                                            <AlertTitle>Validation Error</AlertTitle>
                                            <AlertDescription>{errors.customerDetails.message}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>
                            )}

                            {watchRole === 'ADMIN' && (
                                <div className="space-y-4 p-4 border border-dashed rounded-md">
                                    <h3 className="text-lg font-semibold">Admin Details</h3>
                                    <div className="space-y-1">
                                        <Label htmlFor="adminDetails.fullName">Full Name</Label>
                                        <Input id="adminDetails.fullName" type="text" {...register('adminDetails.fullName')} />
                                        {errors.adminDetails?.fullName && <p className="text-red-500 text-sm">{errors.adminDetails.fullName.message}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="adminDetails.phoneNumber">Phone Number</Label>
                                        <Input id="adminDetails.phoneNumber" type="text" {...register('adminDetails.phoneNumber')} />
                                        {errors.adminDetails?.phoneNumber && <p className="text-red-500 text-sm">{errors.adminDetails.phoneNumber.message}</p>}
                                    </div>
                                    {errors.adminDetails && errors.adminDetails.message && (
                                        <Alert variant="destructive">
                                            {/* <ExclamationTriangleIcon className="h-4 w-4" /> */}
                                            <AlertTitle>Validation Error</AlertTitle>
                                            <AlertDescription>{errors.adminDetails.message}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>
                            )}

                            {error && (
                                <Alert variant="destructive">
                                    {/* <ExclamationTriangleIcon className="h-4 w-4" /> */}
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="flex flex-col gap-3">
                                <Button type="submit" className="w-full">
                                    {loading ? <Loader2Icon className="animate-spin" /> : "Register"}
                                </Button>
                                <Button disabled variant="outline" className="w-full btn-disabled">
                                    Login with Google
                                </Button>
                            </div>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Have an account?{" "}
                            <Link className="underline underline-offset-4" href="/login">Sign in</Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
