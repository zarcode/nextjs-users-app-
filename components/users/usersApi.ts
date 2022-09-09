import axios from "axios"

export const getUsers = async() => {
    const {data} = await axios.get("https://gorest.co.in/public/v2/users")
    return data
}