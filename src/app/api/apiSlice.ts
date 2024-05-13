import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react"
import { RootState } from "../store"
import { logout, setCredentials } from "../../features/auth/authSlice"

const baseQuery = fetchBaseQuery({
    baseUrl: 'https://synkspace-api.onrender.com/api/v1',
    credentials: 'include',
    prepareHeaders: (headers: Headers, { getState }) => {
        const myState = getState() as RootState
        const token = myState.auth?.access_token

        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {

    let result = await baseQuery(args, api, extraOptions)

    if (result.error && result.error.status === 403) {

        console.log(result.error)

        const refresh_token = localStorage.getItem('refresh')

        const refreshResult = await baseQuery({
            url: '/auth/refresh',
            method: 'POST',
            body: { refresh_token }
        }, api, extraOptions)

        if (refreshResult.data) {
            api.dispatch(setCredentials(refreshResult.data))
            result = await baseQuery(args, api, extraOptions)
        } else {
            api.dispatch(logout())
        }
    }
    return result
}

const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    endpoints: () => ({}),
    tagTypes: ['Posts', 'Comments']
})

export default apiSlice
