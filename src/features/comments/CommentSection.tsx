import React, { useState } from 'react'
import CreateCommentForm from './CreateCommentForm'
import { useGetCommentsQuery } from './commentApiSlice'
import CommentCard from './CommentCard'
import { Post } from '../posts/postApiSlice'

type RefType = React.ForwardedRef<HTMLInputElement>

type CommentSectionProps = {
    post: Post
}

const CommentSection = React.forwardRef((props: CommentSectionProps, ref: RefType) => {

    const {
        post
    } = props

    const [page, setPage] = useState(1)

    const {
        data,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetCommentsQuery(post._id)

    let content 
    let rootComments

    if(isLoading) {
        content = <p>Loading...</p>
    } else if (isError) {
        content = <p>Error!</p>
        console.log(error)
    } else if (isSuccess) {
        const { entities } = data

        rootComments = Object.values(entities)
            .filter(comment => Boolean(!comment.parent_id))
            .map(comment => 
                <CommentCard 
                    key={comment._id} 
                    comment={comment} 
                    allComments={Object.values(entities)}
                    post={post}
                />)

        content = rootComments.slice(0, page === 1 ? page : page * 10)
    }

    const showBtn = Array.isArray(content) 
        && Array.isArray(rootComments)
        && rootComments?.length > 1
        && content.length !== rootComments.length


  return (
    <section>
        <section className="mb-6">
            { content }
        </section>

        { showBtn && <button onClick={() => setPage(prev => prev + 1)} className="mb-6 ml-14 font-semibold hover:text-black/70">
            See more comments...
        </button>}

        <CreateCommentForm 
            ref={ref}
            postId={post._id} 
        />
    </section>
  )
})

export default CommentSection