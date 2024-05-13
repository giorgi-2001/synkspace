import { useLikeCommentMutation } from "./commentApiSlice"
import { useSelector } from "react-redux"
import { selectLikedComments } from "../auth/authSlice"

type LikeCommentProps = {
    postId: string,
    commentId: string
}

const LikeComment = ({ postId, commentId }: LikeCommentProps) => {

    const likedComments = useSelector(selectLikedComments)

    const isLiked = likedComments?.includes(commentId)

    const [likeComment] = useLikeCommentMutation()

    const handleClick = () => {
        likeComment({ postId, commentId })
    }

  return (
    <button className={isLiked ? 'text-amber-500 hover:text-amber-400 font-bold' : 'hover:text-zinc-700'} onClick={handleClick}>
        Like
    </button>
  )
}

export default LikeComment