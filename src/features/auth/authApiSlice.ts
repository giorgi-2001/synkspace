import { toast } from "react-toastify"
import apiSlice from "../../app/api/apiSlice"
import { logout, setCredentials } from "./authSlice"

interface Credentials {
    username: string,
    password: string
}

const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: (credentials: Credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials
            }),

            transformErrorResponse: (res) => {
                return res?.data
            },

            onQueryStarted: async(_arg, { queryFulfilled, dispatch }) => {
                try {
                    const res = await queryFulfilled
                    const { user, access_token, refresh_token } = res.data
                    dispatch(setCredentials({ user, access_token }))
                    localStorage.setItem('refresh', refresh_token)
                } catch (error: any) {
                    toast.error(error.error.message)
                }
            }
        }),

        refresh: builder.mutation({
            query: () => {
                const refresh_token = localStorage.getItem('refresh')
                return {
                    url: '/auth/refresh',
                    method: 'POST',
                    body: { refresh_token }
                }
            },

            onQueryStarted: async (_arg, { queryFulfilled, dispatch }) => {
                try {
                    const res = await queryFulfilled
                    const { user, access_token } = res.data
                    dispatch(setCredentials({ user, access_token }))
                } catch (error) {
                    dispatch(logout())
                    console.log(error)
                }
            }
        })
    })
})

export const {
    useLoginMutation,
    useRefreshMutation
} = authApiSlice