import React from 'react'
import { User, useUserDelete } from './usersApi'
import styles from './userItem.module.css'
import { useQueryClient } from "@tanstack/react-query";
interface UserItemProps {
    user: User
}

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

    return (
        <li className={styles["user-item"]}>
            <div className={styles["user-item__meta"]}>
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <p>{user.gender}</p>
            </div>
            <div className={styles["user-item__actions"]}>
                <button
                    onClick={() => { }}
                >Edit</button>
                <button
                    onClick={onDelete}
                    disabled={deleteUserMutation.isLoading ? true : false}
                >{deleteUserMutation.isLoading? "Deleting" : "Delete" }</button>
            </div>
        </li>
    )
}
