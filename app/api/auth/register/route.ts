import { hashPassword } from "@/lib/hashPassword";
import { prisma } from "@/lib/prisma";
import {  registerSchema } from "@/lib/validate/auth";
import { UserData } from "@/types/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
      const bodyIsValid = registerSchema.safeParse(body);

      if(!bodyIsValid.success) {
        return NextResponse.json(
          { message: bodyIsValid.error.message },
          { status: 400 }
        );
      }

      const { username, email, password, role, customerDetails, adminDetails } = bodyIsValid.data;
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });
        if (existingUser) {
          return NextResponse.json(
            { message: "fullname already exists" },
            { status: 409 }
          );
        }
        const hashedPassword = await hashPassword(password);

        const userData:UserData = {
          username,
          email,
          password: hashedPassword,
          role,
        };
    
        if (role === 'CUSTOMER' && customerDetails) {
          userData.customer = {
            create: {
              fullName: customerDetails.fullName,
              phoneNumber: customerDetails.phoneNumber,
              address: customerDetails.address,
            },
          };
        } else if (role === 'ADMIN' && adminDetails) {
          userData.admin = {
            create: {
              fullName: adminDetails.fullName,
              phoneNumber: adminDetails.phoneNumber,
            },
          };
        }
    
        const newUser = await prisma.user.create({
          data: userData,
          include: {
            customer: true,
            admin: true,    
          },
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userWithoutPassword } = newUser;

        return NextResponse.json(
          { message: "User created successfully", user: userWithoutPassword },
          { status: 201 }
        );
      } catch (e) {
        if(e instanceof Error) {
          console.error(e.message);
        }
        console.error("Registration error:", e);
    
        if (e instanceof SyntaxError && e.message.includes("JSON")) {
          return NextResponse.json(
            { message: "Invalid request body format (JSON expected)" },
            { status: 400 }
          );
        }
    
        return NextResponse.json(
          { message: "Error creating user", details: (e as Error).message || "Unknown error" },
          { status: 500 }
        );
      }
}