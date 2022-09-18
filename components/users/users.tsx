import React, {useEffect} from "react"
import {
    useQueryClient
} from "@tanstack/react-query"
import { useUsersData, getUsers } from "./usersApi";
import UserItem from "./userItem";

export default function Users() {
    const queryClient = useQueryClient()
    const [page, setPage] = React.useState(1)
    const { isLoading, isError, isSuccess, isPreviousData, data, error } = useUsersData(page) 
     
    // Prefetch the next page!
    // useEffect(() => {
    //     if (data?.hasMore) {
    //         queryClient.prefetchQuery(['users', page + 1], () =>
    //             getUsers(page + 1),
    //         )
    //     }
    // }, [data, page, queryClient])

    return (
        <>
            {isLoading ? (
                <div>Loading...</div>
            ) : isError ? (
                <div>Error: {error.message}</div>
            ) : (
                <ul>
                    {data.users.map((user) => (
                        <UserItem key={user.id} user={user}/>
                    ))}
                </ul>
            )}
            <p>Current page: {page}</p>
            <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
            >Previous page</button>
            <button
                onClick={() => {
                    if (!isPreviousData && data?.hasMore) {
                        setPage(p => p + 1)
                    }
                }}
                disabled={isPreviousData || !data?.hasMore}
            >Next page</button>
        </>
    )
}
