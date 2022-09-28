import React from 'react'
import Link from 'next/link'
import { User, useUserDelete } from './usersApi'
import styles from './userItem.module.css'
import { useQueryClient } from "@tanstack/react-query";
interface UserItemProps {
    user: User
}

const Spinner = () => {
    return (
        <span className={styles.spinnerWrapper} role="spinner">
            <svg className={styles.spinner} viewBox="0 0 10 10">
                <circle className={styles.path} cx="5" cy="5" r="4" fill="none" strokeWidth="2"></circle>
            </svg>
        </span>
    );
  };
  

export default function UserItem({ user }: UserItemProps) {
    const deleteUserMutation = useUserDelete(user.id)
    const queryClient = useQueryClient();

    const onDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        const confirmed = confirm("Are you sure you want to delete user?");
        if (confirmed) {
            deleteUserMutation.mutate(user.id,
                {
                    onSuccess: () => {
                        queryClient.invalidateQueries(['users']);
                    }
                }
            )
        }
    }

    const deleteUserMutationError = deleteUserMutation.error as Error

    return (
        <>
            {deleteUserMutation.isError && (<div>Error: {deleteUserMutationError.message}</div>)}
            <li className={styles["user-item"]}>
                <div className={styles["user-item__meta"]}>
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                    <p>{user.gender}</p>
                </div>
                <div className={styles["user-item__actions"]}>
                    <Link href={`/users/edit/${user.id}`}>Edit</Link>
                    <button
                        onClick={onDelete}
                        disabled={deleteUserMutation.isLoading ? true : false}
                    >Delete {deleteUserMutation.isLoading && <Spinner/>}</button>
                </div>
            </li>
        </>
    )
}
