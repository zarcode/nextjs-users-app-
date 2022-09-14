import axios from "axios"
import { useQuery } from "@tanstack/react-query";

export const getUsers = async() => {
    const {data} = await axios.get("https://gorest.co.in/public/v2/users")
    return data
}

export interface User {
    id: number,
    name: string
}

export function useUsersData() {
    return useQuery<User[]>(
        ["users"],
        getUsers
    );
}