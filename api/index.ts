import axios, { AxiosInstance } from "axios"
import {ApiRequestConfig, WithAbortFn} from "./types"

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api/'
    // baseURL: 'https://gorest.co.in/public/v2/'
});

const withAbort = (fn: WithAbortFn) => {
    const executor = (url: string, config: ApiRequestConfig) => fn(url, config)
    return executor
}

const api = (axios: AxiosInstance) => ({
    get: <T>(url: string, config: ApiRequestConfig) =>
        withAbort(axios.get)(url, config)
})

export default axiosInstance