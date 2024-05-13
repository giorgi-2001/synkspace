import { useSelector } from "react-redux"
import { Post } from "./postApiSlice"
import { User } from "../users/userApiSlice"
import cld from '../../config/cloudinary'
import { fill } from "@cloudinary/url-gen/actions/resize"
import { Link } from "react-router-dom"
import UpdatePostForm from "./UpdatePostForm"
import React, { MouseEventHandler, useCallback, useRef, useState } from "react"
import DeletePostModal from "./DeletePostModal"
import { formatDistance } from "date-fns"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash, faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { selectUser } from "../auth/authSlice"
import PostActions from "./PostActions"
import ShortenText from "../../components/ShortenText"
import CommentSection from "../comments/CommentSection"

type PostCardRef = React.ForwardedRef<HTMLDivElement>

type PostCardProps = {
    id: string,
    post: Post
}

const PostCard = React.forwardRef(({ id, post }: PostCardProps, ref: PostCardRef) => {

    const commentRef = useRef<null | HTMLInputElement>(null)
    const updatePostRef = useRef<null | HTMLDivElement>(null)

    const user = useSelector(selectUser)

    const [edit, setEdit] = useState(false)
    const [modal, setModal] = useState(false)

    const onCommentClicked: MouseEventHandler<HTMLButtonElement> = useCallback(() => {
        if (commentRef.current) {
            commentRef.current.focus()
        }
    }, [commentRef.current])

    const onUpdateFormClicked: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
        const target = e.target as Node
        const isInside = updatePostRef.current?.contains(target) || updatePostRef.current == target
        if (!isInside) setEdit(false)
    }, [updatePostRef.current])

    const author = post?.author as User

    if (!post || !author?._id) return null

    const isMyPost = user?._id === author._id

    const src = cld.image(author.avatar).resize(fill().width(40).height(40)).toURL()
    const createdAt = formatDistance(new Date(post.createdAt), new Date())

    const buttonBox = isMyPost ? (
        <div className="ml-auto flex gap-x-6 gap-y-2 flex-wrap justify-end">
            <button className="text-zinc-600 hover:text-zinc-400" onClick={() => setEdit(prev => !prev)}>
                <FontAwesomeIcon size="lg" icon={faPenToSquare} />
            </button>
            <button className="text-rose-500 hover:text-rose-300" onClick={() => setModal(true)}>
                <FontAwesomeIcon size="lg" icon={faTrash} />
            </button>
        </div>
    ) : null

    const editForm = edit
        ? <UpdatePostForm body={post.body}
            id={id}
            setEdit={setEdit}
            ref={updatePostRef}
            onUpdateFormClicked={onUpdateFormClicked}
        />
        : null

    return (
        <article className="p-6 bg-white rounded-md mb-4 shadow-sm shadow-black/20">
            <div className="flex gap-6 items-center">
                <Link to={`/user/${author._id}`}>
                    <img src={src} alt="avatar" className="object-cover rounded-full" />
                </Link>
                <div className="font-medium">
                    <Link className="hover:underline hover:text-amber-500" to={`/user/${author._id}`}>
                        <p>{author.first_name} {author.last_name}</p>
                    </Link>
                    <p className="text-sm text-zinc-600">{createdAt}</p>
                </div>

                {buttonBox}

            </div>

            <ShortenText text={post.body} styleString='py-4' wordCount={50} />

            <div className="flex gap-4 justify-between items-center">
                <p className="font-semibold">Likes: {post.likes}</p>
                {/* <Link className="italic font-medium text-zinc-500 hover:text-zinc-950 hover:underline" to={`/${id}`}>See full post...</Link> */}
            </div>

            {editForm}

            <PostActions id={id} onCommentClicked={onCommentClicked} />

            <CommentSection
                ref={commentRef}
                post={post}
            />

            {ref && <div ref={ref}></div>}

            {modal && <DeletePostModal id={id} setModal={setModal} />}

        </article>
    )
})

export default PostCard