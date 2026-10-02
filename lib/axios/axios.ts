import axios from "axios";

export async function post<TResponse, TRequest>(url: string, data: TRequest): Promise<TResponse> {
    const response = await axios.post<TResponse>(url, data);
    return response.data;
}

export async function get<TResponse, TParams = undefined>(url: string, params?: TParams): Promise<TResponse> {
    const response = await axios.get<TResponse>(url, { params });
    return response.data;
}
