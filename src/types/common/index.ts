
export interface ApiError {
    message: string;
    success: false;
    errorStack?: string;
}
export interface ApiResponse<T> {
    message: string;
    success: true;
    statusCode: number;
    data: T
}