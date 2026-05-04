export type LoginDto = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
};

export type LoginResponse = {
  accessToken: string;
  user: User;
};