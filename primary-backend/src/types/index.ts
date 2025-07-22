import { z } from "zod";

export const SignupSchema = z.object({
  name: z.string().min(3),
  email: z.email().min(2),
  password: z.string().min(6)
});

export const SigninSchema = z.object({
  email: z.email(),
  password: z.string(),
});


export const zapCreateSchema = z.object({
  triggerId:z.string(),
  triggerMetadata:z.any().optional()
})