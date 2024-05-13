import React, { useState } from "react"
import { useSelector } from "react-redux"
import { selectUser } from "../auth/authSlice"
import cld from "../../config/cloudinary"
import { fill } from "@cloudinary/url-gen/actions/resize"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleRight } from "@fortawesome/free-solid-svg-icons"
import { FormEvent } from "react"
import { useCreateCommentMutation } from "./commentApiSlice"

type InputRef = React.ForwardedRef<null | HTMLInputElement>

type CreateCommentFormProps = {
    postId: string
}

const CreateCommentForm = React.forwardRef((props: CreateCommentFormProps, ref: InputRef) => {

    const {
        postId
    } = props

    const user = useSelector(selectUser)
    const [createComment] = useCreateCommentMutation()

    const [text, setText] = useState('')

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(!text) return
        try {
            await createComment({ post_id: postId, text })
            setText('')
        } catch (error) {
            console.log(error)
        }
    }

    const src = cld.image(user?.avatar).resize(fill().width(40).height(40)).toURL()

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 items-center">
        <img className="object-cover rounded-full" src={src} alt="avatar" />
        <div className="relative grow">
            <input
                ref={ref} 
                type="text"
                aria-label="create comment" 
                placeholder="Write a comment..."
                className="py-2 px-4 pr-12 w-full rounded-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 placeholder:text-zinc-500 focus:outline-amber-500 focus:hover:bg-zinc-100"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-amber-500">
                <FontAwesomeIcon size="xl" icon={faCircleRight} />
            </button>
        </div>
    </form>
  )
})

export default CreateCommentForm