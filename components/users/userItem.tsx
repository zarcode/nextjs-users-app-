import React from 'react'
import { User, useUserDelete } from './usersApi'
import styles from './userItem.module.css'

interface UserItemProps {
    user: User
}

export default function UserItem({ user }: UserItemProps) {
    const deleteUserMutation = useUserDelete(user.id)

    const onDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        deleteUserMutation.mutate(e)
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
                >Delete</button>
            </div>
        </li>
    )
}
