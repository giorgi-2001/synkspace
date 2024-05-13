import apiSlice from "../../app/api/apiSlice"
import { createEntityAdapter } from "@reduxjs/toolkit"
import { User } from "../users/userApiSlice"
import { likeComment, dislikeComment } from "../auth/authSlice"
import { RootState } from "../../app/store"

interface CommentData {
    post_id: string,
    parent_id?: string,
    text: string,
    replying_to?: string
}


export interface Comment extends CommentData {
    _id: string,
    author: User,
    likes: number,
    createdAt: string,
    updatedAt: string
}


const commentsAdapter = createEntityAdapter({
    selectId: (comment: Comment) => comment._id
})

const initialState = commentsAdapter.getInitialState()

const commentApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getComments: builder.query({
            query: (postId: string) => `/comments?postId=${postId}`,

            transformResponse: (res: Comment[]) => {
                return commentsAdapter.setAll(initialState, res)
            },

            providesTags: (res) => res ? [
                { type: 'Comments', id: 'LIST' },
                ...res.ids.map(id => ({ type: 'Comments' as const, id}))
            ] : [{ type: 'Comments', id: 'LIST' }]
        }),

        createComment: builder.mutation({
            query: (data: CommentData) => ({
                url: '/comments',
                method: 'POST',
                body: data
            }),

            invalidatesTags: [{ type: 'Comments', id: 'LIST' }]
        }),

        updateComment: builder.mutation({
            query: ({ text, id }: { text: string, id: string }) => ({
                url: `/comments/${id}`,
                method: 'PATCH',
                body: { text }
            }),

            invalidatesTags: (_res, _err, { id }) => [{ type: 'Comments', id }]
        }),

        deleteComment: builder.mutation({
            query: (id: string) => ({
                url: `/comments/${id}`,
                method: 'DELETE'
            }),

            invalidatesTags: (_res, _err, id) => [{ type: 'Comments', id }]
        }),

        likeComment: builder.mutation({
            query: ({ commentId }: Record<string, string>) => ({
                url: `/comments/like/${commentId}`,
                method: 'PATCH'
            }),

            onQueryStarted: async (
                { commentId, postId }, { queryFulfilled, dispatch, getState}
            ) => {
                const optimisticUpdate = dispatch(commentApiSlice
                    .util
                    .updateQueryData('getComments', postId, (draft) => {
                        const myState = getState() as RootState
                        const isLiked = myState.auth.user?.liked_comments.includes(commentId)
                        const comment = draft.entities[commentId]

                        if(isLiked) {
                            comment.likes = comment.likes - 1
                            dispatch(dislikeComment(commentId))
                        } else {
                            comment.likes = comment.likes + 1
                            dispatch(likeComment(commentId))
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
    useGetCommentsQuery,
    useCreateCommentMutation,
    useUpdateCommentMutation,
    useDeleteCommentMutation, 
    useLikeCommentMutation, 
} = commentApiSlice