import React, {useEffect} from "react"
import Link from 'next/link'
import { useUsersData } from "./usersApi";
import UserItem from "./userItem";
import styles from './usersList.module.css'

export const FIRST_PAGE = 1;

export default function Users() {
    const [page, setPage] = React.useState(FIRST_PAGE)
    const { isLoading, isError, isPreviousData, data, error } = useUsersData(page) 
     
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
            <h1>
            Users list
            </h1>
            <Link href="/users/add">Add user</Link>

            {isLoading ? (
                <div>Loading...</div>
            ) : isError ? (
                <div>Error: {error.message}</div>
            ) : (
                <ul className={styles["users-list"]}>
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
