import React from "react"
import { useUsersData } from "./usersApi";

export default function Users() {

    const { isLoading, isError, isSuccess, data, error } = useUsersData() 
     
    if(isLoading) {
        return (<div>Loading...</div>) 
    }

    if(isError) {
        return (<div>Error</div>) 
    }

    return (
        data? 
        (
        <>
            {data.map((user) => (
                <div key={user.id}>{user.name}</div>
            ))}
        </>
        ) : null
    )
}
