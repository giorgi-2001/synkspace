import apiSlice from "../../app/api/apiSlice"
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"
import { User } from "../users/userApiSlice"
import { likePost, dislikePost } from "../auth/authSlice"

interface PostData {
    body: string,
    author: string | User,
}

export interface Post extends PostData {
    _id: string,
    likes: number,
    createdAt: string,
    updatedAt: string
}

const postsAdapter = createEntityAdapter({
    selectId: (post: Post) => post._id
})

const initialState = postsAdapter.getInitialState()

type InitState = typeof initialState

const postApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPosts: builder.query({
            query: (author: string) => `/posts?author=${author}`,

            transformResponse: (res: Post[]) => {
                return postsAdapter.setAll(initialState, res)
            },

            providesTags: (res: InitState | undefined) => res ?
            [
                { type: 'Posts', id: 'LIST' },
                ...res.ids.map((id: string )=> ({ type: 'Posts' as const , id }))
            ] : [
                { type: 'Posts', id: 'LIST' }
            ]
        }),

        requestNextPostPage: builder.mutation({
            query: ({ page, author }: { page: number, author: string }) => ({
                url: `/posts?page=${page}&author=${author}`,
                method: 'GET'
            }),

            onQueryStarted: async ({ author }, { dispatch, queryFulfilled }) => {
                try {
                    const res = await queryFulfilled
                    const ids: string[] = res.data.map((post: Post) => post._id)
                    const posts: Post[] = res.data

                    dispatch(postApiSlice.util.updateQueryData('getPosts', author, (draft) => {
                        ids.forEach(id => draft.ids.push(id))
                        posts.forEach(post => draft.entities[post._id] = post)
                    }))
                } catch (error) {
                    console.log(error)
                }
            }
        }),

        createPost: builder.mutation({
            query: (data: PostData) => ({
                url: '/posts',
                method: 'POST',
                body: data
            }),

            invalidatesTags: [{ type: 'Posts', id: 'LIST' }]
        }),

        updatePost: builder.mutation({
            query: ({ body, id }: { body: string, id: string }) => ({
                url: `/posts/${id}`,
                method: 'PATCH',
                body: { body }
            }),

            invalidatesTags: (_res, _err, { id }) => [{ type: 'Posts', id }]
        }),

        deletePost: builder.mutation({
            query: (id: string) => ({
                url: `/posts/${id}`,
                method: 'DELETE'
            }),

            invalidatesTags: (_res, _err, id) => [{ type: 'Posts', id }]
        }),

        likePost: builder.mutation({
            query: ({ id }: {id: string, author: string}) => ({
                url: `/posts/like/${id}`,
                method: 'PATCH'
            }),

            onQueryStarted: async ({ id, author}, { dispatch, getState, queryFulfilled }) => {
                const optimisticUpdate = dispatch(postApiSlice.util.updateQueryData('getPosts', author, (draft) => {
                    const myState = getState() as RootState
                    const isLiked = myState.auth?.user?.liked_posts.includes(id)
                    const post = draft.entities[id]

                    if(isLiked) {
                        draft.entities[id] = { ...post, likes: post.likes - 1 }
                        dispatch(dislikePost(id))
                    } else {
                        draft.entities[id] = { ...post, likes: post.likes + 1 }
                        dispatch(likePost(id))
                    }
                }))

                try {
                    await queryFulfilled
                } catch (error) {
                    optimisticUpdate.undo()
                }
            }
        })
    })
})


export const {
    useGetPostsQuery,
    useCreatePostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
    useLikePostMutation, 
    useRequestNextPostPageMutation
} = postApiSlice


const selectPostsResults = postApiSlice.endpoints.getPosts.select('')

const selectPostsData = createSelector(
    selectPostsResults,
    postsResults => postsResults.data
)

export const {
    selectById: selectPostById,
    selectIds: selectPostsIds,
    selectEntities: selectPostEntities
} = postsAdapter.getSelectors((state: RootState) => selectPostsData(state) 
    ?? initialState)