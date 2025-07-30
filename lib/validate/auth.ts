import { LoginInput } from "@/types/auth"
import {  z, ZodType } from "zod"

export const loginSchema = z.object({
    email: z.email({
        message: "Email is required"
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters"
    })
})

export type LoginInput = z.infer<typeof loginSchema>

