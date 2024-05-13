import { useGetPostsQuery, useRequestNextPostPageMutation } from "../posts/postApiSlice"
import { useSelector } from "react-redux"
import PostCard from "../posts/PostCard"
import { useEffect, useState, useRef, useCallback } from "react"
import { selectUser } from "../auth/authSlice"
import { useParams } from "react-router-dom"
import CreatePostForm from "../posts/CreatePostForm"

const UserPage = () => {

    const { id } = useParams() as { id: string }
    const user = useSelector(selectUser)
    const isMyPage = user?._id === id

    const [page, setPage] = useState(0)

    const {
        data,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetPostsQuery(id, {
        refetchOnMountOrArgChange: true,
    })

    const [requestNextPostPage] = useRequestNextPostPageMutation()

    useEffect(() => {
        if(page === 0) return
        requestNextPostPage({ page, author: id })
    }, [page])

    useEffect(() => {
        if(!id) return
        setPage(0)
    }, [id])

    const observer = useRef<undefined | IntersectionObserver>()

    const postRef = useCallback((postRef: HTMLDivElement) => {
        if (isLoading) return

        if (observer.current) observer.current.disconnect()

        observer.current = new IntersectionObserver(posts => {
        if(posts[0].isIntersecting) {
            setPage(prev => prev + 1)
        }
        })

        if(postRef) observer.current.observe(postRef)

    }, [isLoading])

    let content

    if(isLoading) {
        content = <p>Loading...</p>
    } else if (isError && 'data' in error) {
        console.log(error)
        content = <p>Error</p>
    } else if (isSuccess && data.ids?.length > 0) {
        content = data.ids.map((id, i)=> {
        if(data.ids.length - 1 === i) {
            return <PostCard key={id} id={id} post={data.entities[id]} ref={postRef} />
        }
        return <PostCard key={id} id={id} post={data.entities[id]} />
        })
    } else if (isSuccess && data.ids?.length === 0) {
        content = <p>No posts to show...</p>
    }

    return (
        <section className="w-full max-w-2xl mx-auto">
            { isMyPage && <CreatePostForm />}
            { content }
        </section>
    )
}

export default UserPage