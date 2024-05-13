import { createSlice } from "@reduxjs/toolkit"
import { User } from "../users/userApiSlice"
import { RootState } from "../../app/store"

type InitialStateType = {
    user: User | null,
    access_token: string
}

const initialState: InitialStateType = {
    user: null,
    access_token: ''
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, access_token } = action.payload
            state.user = user
            state.access_token = access_token
        },

        logout: (state) => {
            state.user = null
            state.access_token = ''
            localStorage.removeItem('refresh')
        },

        likePost: (state, action) => {
            if (!state.user) return
            state.user.liked_posts.push(action.payload)
        },

        dislikePost: (state, action) => {
            if (!state.user) return
            state.user.liked_posts = state.user.liked_posts.filter(postId => postId !== action.payload)
        },

        likeComment: (state, action) => {
            if (!state.user) return
            state.user.liked_comments.push(action.payload)
        },

        dislikeComment: (state, action) => {
            if (!state.user) return
            state.user.liked_comments = state.user.liked_comments.filter(commentId => commentId !== action.payload)
        },

        updateAvatar: (state, action) => {
            if (!state.user) return
            state.user.avatar = action.payload
        }
    }
})

export const {
    setCredentials,
    logout,
    likePost,
    dislikePost,
    likeComment,
    dislikeComment,
    updateAvatar
} = authSlice.actions

export default authSlice.reducer

export const selectUser = (state: RootState) => state.auth.user
export const selectToken = (state: RootState) => state.auth.access_token
export const selectLikedPosts = (state: RootState) => state.auth.user?.liked_posts
export const selectLikedComments = (state: RootState) => state.auth.user?.liked_comments