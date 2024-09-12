export interface ApiResponse<T> {
    total: number;
    message: string | null;
    success: boolean;
    starttime: number | null;
    status: number;
    query: string | null;
    endtime: number;
    data: T;
}