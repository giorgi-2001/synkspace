import cld from '../../config/cloudinary'
import { fill } from '@cloudinary/url-gen/actions/resize'
import { Comment } from './commentApiSlice'
import formatDistance from '../../utils/formatDistance'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faEllipsis } from '@fortawesome/free-solid-svg-icons'
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import ifIsLeft from '../../utils/ifIsLeft'
import DeleteComment from './DeleteComment'
import { Post } from '../posts/postApiSlice'
import { useSelector } from 'react-redux'
import { selectUser } from '../auth/authSlice'
import { User } from '../users/userApiSlice'
import ReplyForm from './ReplyForm'
import EditCommentForm from './EditCommentForm'
import LikeComment from './LikeComment'
import ShortenText from '../../components/ShortenText'
import { Link } from 'react-router-dom'

type CommentCardProps = {
    comment: Comment,
    allComments?: Comment[],
    post: Post
}

const CommentCard = ({ comment, allComments, post }: CommentCardProps) => {

    const buttonRef = useRef<HTMLDivElement | null>(null)
    const menuRef = useRef<HTMLMenuElement | null>(null)

    const [menuOpen, setMenuOpen] = useState(false)
    const [replyFormOpen, setReplyFormOpen] = useState(false)
    const [editFormOpen, setEditFormOpen] = useState(false)

    const [page, setPage] = useState(0)

    const user = useSelector(selectUser)

    const isMenuBtnLeft = useMemo(() => ifIsLeft(buttonRef.current), [buttonRef.current])

    useEffect(() => {
        document.addEventListener('click', (e) => {
            const target = e.target as Node
            const isInside = target == menuRef.current
                || menuRef.current?.contains(target)

            if (isInside) return

            const isBtnItself = target === buttonRef.current
                || buttonRef.current?.contains(target)

            if (isBtnItself) return

            setMenuOpen(false)
        })
    }, [])

    const src = cld.image(comment.author.avatar).resize(
        fill().width(40).height(40)
    ).toURL()

    const distance = formatDistance(comment.createdAt)

    const postAuthor = post.author as User
    const isMyPost = user?._id === postAuthor._id
    const isMyComment = user?._id === comment.author._id

    let menuChildren: ReactNode

    if (isMyComment) {
        menuChildren = (
            <>
                <li>
                    <button onClick={() => setEditFormOpen(true)}>
                        Edit Comment
                    </button>
                </li>
                <li>
                    <DeleteComment id={comment._id} />
                </li>
            </>
        )
    } else if (!isMyComment && isMyPost) {
        menuChildren = <li><DeleteComment id={comment._id} /></li>
    }

    const replies = allComments?.filter(reply => reply.parent_id === comment._id)
        .sort((a, b) => {
            const timeA = new Date(a.createdAt).getTime()
            const timeB = new Date(b.createdAt).getTime()
            return timeA - timeB
        })

    const replyElements = replies
        ?.slice(0, page * 10)
        ?.map(reply => <CommentCard
            key={reply._id}
            comment={reply}
            post={post}
        />)

    const showSeeMoreBtn = Array.isArray(replies)
        && replies?.length > 0
        && replies?.length !== replyElements?.length

    const commentBody = editFormOpen
        ? <EditCommentForm
            comment={comment}
            setEditFormOpen={setEditFormOpen}
        />
        : (
            <article className={`flex sm:gap-4 gap-2 items-start mb-3 group`}>
                <Link className='shrink-0' to={`/user/${comment?.author?._id}`}>
                    <img className='object-fill rounded-full' src={src} alt="avatar" />
                </Link>
                <div>
                    <div className="w-fit bg-zinc-100 border border-zinc-200 py-2 px-4 rounded-3xl relative">
                        <Link to={`/user/${comment?.author?._id}`}>
                            <p className='text-sm font-semibold'>
                                {comment.author.first_name} {comment.author.last_name}
                            </p>
                        </Link>
                        <div>
                            {comment.replying_to &&
                                <span className="font-medium text-amber-500">
                                    {`@${comment.replying_to} `}
                                </span>}
                            <ShortenText text={comment.text} wordCount={30} styleString='inline' />
                        </div>
                        <div className={`${comment.likes === 0 && 'hidden'} bg-white p-0.5 absolute -right-3 ${comment.likes > 1 && '-right-6'} -bottom-2 rounded-full shadow-sm shadow-black/50 flex items-center`}>
                            <span className="p-1 flex justify-center items-center aspect-square overflow-clip bg-amber-500 rounded-full text-white">
                                <FontAwesomeIcon size="xs" icon={faThumbsUp} />
                            </span>
                            {comment.likes > 1 && <span className="block text-sm text-zinc-500 px-1">2</span>}
                        </div>
                    </div>
                    <div className="w-full px-2 flex gap-x-4 gap-y-1 flex-wrap text-sm font-semibold">
                        <p>{distance}</p>
                        <LikeComment postId={post._id} commentId={comment._id} />
                        <button
                            onClick={() => setReplyFormOpen(prev => !prev)}
                        >
                            Reply
                        </button>
                    </div>
                </div>
                <div className={`relative ${!isMyPost && !isMyComment && 'hidden'}`}>
                    <div ref={buttonRef} className="w-[14px]">
                        <button onClick={() => setMenuOpen(prev => !prev)} className={`text-zinc-600 group-hover:block ${menuOpen ? 'block' : 'hidden'}`}>
                            <FontAwesomeIcon icon={faEllipsis} />
                        </button>
                    </div>
                    <menu ref={menuRef} className={`${menuOpen ? 'block' : 'hidden'} bg-white p-4 rounded-md border border-zinc-300 shadow-lg shadow-black/20 absolute z-[5] w-max ${isMenuBtnLeft ? 'left-0' : 'right-0'}`}>
                        {menuChildren}
                    </menu>
                </div>
            </article>
        )

    return (
        <section className={`relative ${replies?.length && 'before:block before:w-0.5 before:bg-zinc-300 before:absolute before:left-[18px] before:bottom-6 before:top-14'}`}>

            {
                commentBody
            }


            {replyFormOpen
                && <ReplyForm
                    comment={comment}
                    post_id={post._id}
                    parent_id={comment.parent_id ? comment.parent_id : comment._id}
                    replying_to={`${comment.author.first_name} ${comment.author.last_name}`}
                    setReplyFormOpen={setReplyFormOpen}
                />}

            <div className={`${!replies?.length && 'hidden'} mb-3 ml-4 pl-6`}>
                {replyElements}
            </div>

            {showSeeMoreBtn && <button
                className="font-bold mb-3 ml-20 hover:opacity-70"
                onClick={() => setPage(prev => prev + 1)}
            >
                {replyElements?.length === 0 ? 'See Replies' : 'See More Replies'}
            </button>}

        </section>
    )
}

export default CommentCard