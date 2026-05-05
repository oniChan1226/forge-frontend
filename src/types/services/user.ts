
export interface User {
  _id: string;
  email: string;
  name: string;
  avatar?: string;
  age?: number;
  gender?: "male" | "female" | "other";
  createdAt: string;
  updatedAt: string;
}