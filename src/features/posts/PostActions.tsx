import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faShare, faThumbsUp, faComment } from "@fortawesome/free-solid-svg-icons"
import { useLikePostMutation } from "./postApiSlice"
import { useSelector } from "react-redux"
import { selectLikedPosts } from "../auth/authSlice"
import { MouseEventHandler } from "react"
import { useParams } from "react-router-dom"

type PostActionsProps = {
  id: string,
  onCommentClicked: MouseEventHandler<HTMLButtonElement>
}

const PostActions = ({ id, onCommentClicked }: PostActionsProps) => {

  const { id: author } = useParams()

  const [likePost] = useLikePostMutation()

  const likedPosts = useSelector(selectLikedPosts)
  const isLiked = likedPosts?.includes(id)

  return (
    <div className="py-1 border-y border-zinc-300 my-6 flex font-semibold text-zinc-600">
      <button onClick={() => likePost({ id, author: author ? author : '' })} className={`grow py-1 rounded-sm hover:bg-zinc-100 flex items-center justify-center gap-2 active:scale-95 ${isLiked && 'text-amber-500'}`}>
        <FontAwesomeIcon size="lg" icon={faThumbsUp} />
        <span className="hidden sm:inline">Like</span>
      </button>
      <button onClick={onCommentClicked} className="grow py-1 rounded-sm hover:bg-zinc-100 flex items-center justify-center gap-2 active:scale-95">
        <FontAwesomeIcon size="lg" icon={faComment} />
        <span className="hidden sm:inline">Comment</span>
      </button>
      <button className="grow py-1 rounded-sm hover:bg-zinc-100 flex items-center justify-center gap-2 active:scale-95">
        <FontAwesomeIcon size="lg" icon={faShare} />
        <span className="hidden sm:inline">Share</span>
      </button>
    </div>
  )
}

export default PostActions