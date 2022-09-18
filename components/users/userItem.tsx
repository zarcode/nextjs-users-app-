import React from 'react'
import { User } from './usersApi'

interface UserItemProps {
    user: User
}

export default function UserItem({user}: UserItemProps) {
  return (
    <li>
        <h3>{user.name}</h3>
        <p>{user.email}</p>
        <p>{user.gender}</p>
    </li>
  )
}
