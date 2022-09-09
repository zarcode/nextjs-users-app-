import React from 'react'
import { useQuery } from "react-query";
import { getUsers } from './usersApi';

export default function Users() {

    const { isLoading, isError, isSuccess, data, error } = useQuery(
        ["users"],
        getUsers
    );
      
    return (
        <>
        {isLoading && (
            <span>Loading</span>
        )}
        <div>users</div>
        </>
    )
}
