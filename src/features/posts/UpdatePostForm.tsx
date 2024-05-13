import React, { MouseEventHandler } from "react"
import { FormEvent } from "react"
import { useState } from "react"
import { useUpdatePostMutation } from "./postApiSlice"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClose } from "@fortawesome/free-solid-svg-icons"
import { useSelector } from "react-redux"
import { selectUser } from "../auth/authSlice"
import cld from "../../config/cloudinary"
import { fill } from "@cloudinary/url-gen/actions/resize"

type UpdatePostFormProps = {
    body: string,
    id: string,
    setEdit: React.Dispatch<React.SetStateAction<boolean>>,
    onUpdateFormClicked: MouseEventHandler<HTMLDivElement>
}

const UpdatePostForm = React.forwardRef((
    { body: postBody, id, setEdit, onUpdateFormClicked }: UpdatePostFormProps,
    ref: React.ForwardedRef<null | HTMLDivElement>
) => {

    const [body, setBody] = useState(postBody)

    const canUpdate = [body, id].every(Boolean)

    const [UpdatePost, {isLoading}] = useUpdatePostMutation()

    const user = useSelector(selectUser)
    const src = cld.image(user?.avatar).resize(fill().width(40).height(40)).toURL()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(!canUpdate) return
        try {
            await UpdatePost({ body, id }).unwrap()
            setEdit(false)
        } catch (err) {
            console.log(err)
        }
    }

  return (
    <section onClick={onUpdateFormClicked} className="fixed inset-0 z-20 bg-black/70 flex justify-center px-4">
        <div ref={ref} className="h-fit w-full max-w-2xl mt-24 bg-white rounded-md">
            <div className="px-6 py-4 text-center relative border-b border-zinc-300">
                <h2 className="text-2xl font-semibold">
                    Edit Post
                </h2>
                <button onClick={() => setEdit(false)} className="w-9 h-9 bg-zinc-300 hover:bg-zinc-400 text-zinc-600 rounded-full absolute right-6 top-1/2 -translate-y-1/2">
                    <FontAwesomeIcon size="xl" icon={faClose} />
                </button>
            </div>

            <div className="px-6 py-4 flex gap-4 items-center">
                <img className="object-cover rounded-full" src={src} alt="avatar" />
                <p className="font-medium">{user?.first_name} {user?.last_name}</p>
            </div>

            <form className="px-6 pb-6" onSubmit={handleSubmit}>
                <label className="block absolute translate-x-[-200vw]" htmlFor="newPostInput">
                    Create new post
                </label>
                <textarea 
                    id="newPostInput"
                    rows={6}
                    className="w-full block rounded-md text-xl focus:outline-none resize-none "
                    placeholder={`What's on your mind, ${user?.first_name}?`}
                    value={body}
                    onChange={e => setBody(e.target.value)}
                ></textarea>
                <button disabled={!canUpdate || isLoading} className="py-2 w-full sm:w-1/4 block mx-auto bg-amber-500 mt-4 rounded-md text-amber-950 font-semibold hover:bg-amber-400 focus:bg-amber-300 disabled:opacity-50 disabled:hover:bg-amber-500 disabled:cursor-not-allowed">
                    Update
                </button>
            </form>
        </div>
    </section>
  )
})

export default UpdatePostForm