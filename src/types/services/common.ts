export interface BaseErrorResponnse {
  message: string;
  stack?: string;
  success: boolean;
}

export type TimeStamps = {
  createdAt: string;
  updatedAt: string;
}