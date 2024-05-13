import { selectPostEntities, selectPostsIds, useGetPostsQuery, useRequestNextPostPageMutation } from "../posts/postApiSlice"
import { useSelector } from "react-redux"
import PostCard from "./PostCard"
import { useEffect, useState, useRef, useCallback } from "react"

const PostList = () => {

  const [page, setPage] = useState(0)

  const {
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetPostsQuery('', {
    refetchOnMountOrArgChange: true,
  })

  const [requestNextPostPage] = useRequestNextPostPageMutation()

  useEffect(() => {
    if(page === 0) return
    requestNextPostPage({ page, author: ''})
  }, [page])

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

  const ids = useSelector(selectPostsIds)
  const postEntities = useSelector(selectPostEntities)

  let content

  if(isLoading) {
    content = <p>Loading...</p>
  } else if (isError && 'data' in error) {
    console.log(error)
    content = <p>Error</p>
  } else if (isSuccess && ids?.length > 0) {
    content = ids.map((id, i)=> {
      if(ids.length - 1 === i) {
        return <PostCard key={id} id={id} post={postEntities[id]} ref={postRef} />
      }
      return <PostCard key={id} id={id} post={postEntities[id]} />
    })
  } else if (isSuccess && ids?.length === 0) {
    content = <p>No posts to show...</p>
  }

  return (
    <section>
      { content }
    </section>
  )
}

export default PostList