import { AxiosRequestConfig, AxiosResponse, AxiosResponseHeaders } from "axios"
import { useQuery, useMutation, MutateOptions, useQueryClient } from "@tanstack/react-query";
import api from '@/api'
import { MouseEvent } from "react";

type Headers = AxiosResponseHeaders & {
    "x-pagination-page"?: string,
    "x-pagination-pages"?: string, 
}

const hasMore = (headers: Headers) => {
    if(headers["x-pagination-page"] && headers["x-pagination-pages"]) {
        return parseInt(headers["x-pagination-page"]) < parseInt(headers["x-pagination-pages"])
    } 
    return false
}

export const getUsers = async(config: AxiosRequestConfig) => {
    const {data, headers} = await api.get(`users`, config)
    return { users: data, hasMore: hasMore(headers as Headers) }
}

export const createUser = (user: SubmitUser) => {
    return api.post(`users`, user)
}

export const deleteUser = (id: number) => api.delete(`user/${1}`)

export interface User {
    id: number,
    name: string,
    email: string,
    gender: string
}

export type SubmitUser = Omit<User, 'id'>

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

type TMutateOptions = Pick<
    MutateOptions<User, Error, void, unknown>,
    'onSuccess' | 'onError' | 'onSettled'
>

export function useUserDelete(id: number) {
    return useMutation(deleteUser);
}

export function useUserCreate() {    
    return useMutation(createUser);
}
