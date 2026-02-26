import { z } from "zod";

export const addWebsiteSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 chars"),
  domain: z
    .string()
    .min(3, "Domain required")
    .regex(/^(?!https?:\/\/)([\w-]+\.)+[\w-]+$/, "Enter valid domain"),
  timezone: z.string().min(1, "Timezone required"),
});

export type AddWebsiteInput = z.infer<typeof addWebsiteSchema>;
