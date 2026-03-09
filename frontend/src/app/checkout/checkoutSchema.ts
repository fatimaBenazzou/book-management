import { z } from "zod";

export const checkoutFormSchema = z
  .object({
    deliveryMethod: z.enum(["pickup", "delivery"]),
    fullName: z.string(),
    phone: z.string(),
    street: z.string(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string(),
    instructions: z.string(),
    orderNotes: z
      .string()
      .max(500, "Order notes must be less than 500 characters"),
  })
  .superRefine((data, ctx) => {
    if (data.deliveryMethod === "delivery") {
      if (!data.street.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Street address is required",
          path: ["street"],
        });
      }
      if (!data.city.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "City is required",
          path: ["city"],
        });
      }
      if (!data.postalCode.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Postal code is required",
          path: ["postalCode"],
        });
      }
      if (!data.country.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Country is required",
          path: ["country"],
        });
      }
      if (!data.phone.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Phone number is required",
          path: ["phone"],
        });
      }
    }
  });
