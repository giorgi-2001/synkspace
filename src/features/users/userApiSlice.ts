import apiSlice from "../../app/api/apiSlice";
import { updateAvatar } from "../auth/authSlice";

interface UserData {
    first_name: string,
    last_name: string,
    username: string,
    password: string,
}

interface UpdateUserData {
    first_name: string,
    last_name: string,
    username: string,
    password?: string,
    newPassword?: string
}

export interface User {
    _id: string,
    first_name: string,
    last_name: string,
    username: string,
    avatar: string,
    liked_posts: string[],
    liked_comments: string[],
}


const userApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

        getUsers: builder.query({
            query: (keyword: string) => `/users?keyword=${keyword}`
        }),

        signup: builder.mutation({
            query: (data: UserData) => ({
                url: '/users',
                method: 'POST',
                body: data
            })
        }),

        updateUser: builder.mutation({
            query: (data: UpdateUserData) => {
                return {
                    url: '/users',
                    method: 'PATCH',
                    body: data
                }
            }
        }),

        deleteUser: builder.mutation({
            query: () => ({
                url: `/users`,
                method: 'DELETE'
            })
        }),

        updateAvatar: builder.mutation({
            query: (file: Blob) => {
                const formData = new FormData()
                formData.append('file', file)
                return {
                    url: '/users/avatar',
                    method: 'PATCH',
                    body: formData
                }
            },
            onQueryStarted: async (_, { queryFulfilled, dispatch }) => {
                try {
                    const res = await queryFulfilled
                    dispatch(updateAvatar(res.data.avatar))
                } catch (err) {
                    console.log(err)
                }
            }
        })
    })
})

export const {
    useGetUsersQuery,
    useLazyGetUsersQuery,
    useSignupMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useUpdateAvatarMutation
} = userApiSlice