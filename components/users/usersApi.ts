import axios, { AxiosRequestConfig, AxiosResponseHeaders } from "axios"
import { useQuery } from "@tanstack/react-query";
import api from '@/api'

type Headers = AxiosResponseHeaders & {
    "x-pagination-page": string,
    "x-pagination-pages": string, 
}

const hasMore = (headers: Headers) => parseInt(headers["x-pagination-page"]) < parseInt(headers["x-pagination-pages"])

export const getUsers = async(config: AxiosRequestConfig) => {
    const {data, headers} = await api.get(`https://gorest.co.in/public/v2/users`, config)
    return { users: data, hasMore: hasMore(headers as Headers) }
}

export interface User {
    id: number,
    name: string,
    email: string,
    gender: string
}

export interface UsersResponse {
    users: User[],
    hasMore: boolean
}

export function useUsersData(page: number) {
    return useQuery<UsersResponse, Error>(
        ["users", page],
        ({ signal }) => getUsers({ signal, params: { page } }),
        { keepPreviousData : true }
    );
}