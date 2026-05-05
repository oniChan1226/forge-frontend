import type { loginSchema, signupSchema } from "@/schemas/auth/auth";
import type z from "zod";
import type { User } from "./user";

export type SignupDTO = z.infer<typeof signupSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}


export interface AuthResponse {
  user: User;
  token: AuthTokens;
}