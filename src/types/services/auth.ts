import type { loginSchema, signupSchema } from "@/schemas/auth/auth";
import type z from "zod";

export type SignupDTO = z.infer<typeof signupSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  avatar?: string;
  age?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: AuthTokens;
}