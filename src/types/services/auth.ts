import type { loginSchema, signupSchema } from "@/schemas/auth/auth";
import type z from "zod";

export type SignupDTO = z.infer<typeof signupSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;

export type User = {
  id: string;
  email: string;
  name: string;
};

export type LoginResponse = {
  accessToken: string;
  user: User;
};
