import { FormEvent, useState } from "react"
import { fill } from "@cloudinary/url-gen/actions/resize"
import cld from "../../config/cloudinary"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleRight, faCircle } from "@fortawesome/free-solid-svg-icons"
import { Comment } from "./commentApiSlice"
import { useCreateCommentMutation } from "./commentApiSlice"

type ReplyFormProps = {
    comment: Comment
    post_id: string,
    replying_to: string,
    parent_id: string,
    setReplyFormOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ReplyForm = ({ post_id, parent_id, replying_to, comment, setReplyFormOpen }: ReplyFormProps) => {

    const [createComment] = useCreateCommentMutation()

    const [text, setText] = useState('')

    const src = cld.image(comment.author.avatar).resize(
        fill().width(40).height(40)
    ).toURL()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(!text) return
        try {
            await createComment({
                text,
                post_id,
                parent_id,
                replying_to
            })
            setReplyFormOpen(false)
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 items-end mb-4 pl-6 ml-4">
        <img className="object-cover rounded-full" src={src} alt="avatar" />
        <div className="relative grow">
            <div className="mb-1 text-sm font-semibold text-zinc-600 pl-4 flex gap-x-2 items-center">
                <p>Replying to {replying_to}</p>
                <span className="text-[8px]">
                    <FontAwesomeIcon size="2xs" icon={faCircle} />
                </span>
                <button type="button" onClick={() => setReplyFormOpen(false)}>Cancel</button>
            </div>
            <input
                type="text"
                aria-label="create comment" 
                placeholder="Write a public reply..."
                className="py-2 px-4 pr-12 w-full rounded-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 placeholder:text-zinc-500 focus:outline-amber-500 focus:hover:bg-zinc-100"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button className="absolute right-4 bottom-[9px] text-zinc-400 hover:text-amber-500">
                <FontAwesomeIcon size="xl" icon={faCircleRight} />
            </button>
        </div>
    </form>
  )
}

export default ReplyForm