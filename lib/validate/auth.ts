import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

export const baseUserSchema = loginSchema.extend({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters",
  }),
  role: z.enum(["CUSTOMER", "ADMIN"]),
});

export const customerDetailSchema = z.object({
  fullName: z.string().min(3, {
    message: "Fullname must be at least 3 characters",
  }),
  phoneNumber: z.string().min(3, {
    message: "Phone number must be at least 3 characters",
  }),
  address: z.string().min(3, {
    message: "Address must be at least 3 characters",
  }),
});

export const adminDetailSchema = z.object({
  fullName: z.string().min(3, {
    message: "Fullname must be at least 3 characters",
  }),
  phoneNumber: z.string().min(3, {
    message: "Phone number must be at least 3 characters",
  }),
});

export const registerSchema = baseUserSchema
  .extend({
    customerDetails: customerDetailSchema.optional(),
    adminDetails: adminDetailSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "CUSTOMER") {
      if (!data.customerDetails) {
        ctx.addIssue({
          code: "custom",
          message: "Detail customer diperlukan untuk role CUSTOMER.",
          path: ["customerDetails"],
        });
      } else {
        if (!data.customerDetails.address) {
          ctx.addIssue({
            code: "custom",
            message: "Alamat diperlukan untuk role CUSTOMER.",
            path: ["customerDetails", "address"],
          });
        }
      }
    } else if (data.role === "ADMIN") {
      if (!data.adminDetails) {
        ctx.addIssue({
          code: "custom",
          message: "Admin required for role ADMIN.",
          path: ["adminDetails"], 
        });
      }
    }
    if (data.customerDetails && data.adminDetails) {
      ctx.addIssue({
        code: "custom",
        message: "Customer required for role CUSTOMER.",
        path: ["customerDetails", "adminDetails"],
      });
    }
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
