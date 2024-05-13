import { FormEvent, MouseEventHandler } from "react"
import { useState, useRef } from "react"
import { useCreatePostMutation } from "./postApiSlice"
import cld from "../../config/cloudinary"
import { fill } from "@cloudinary/url-gen/actions/resize"
import { useSelector } from "react-redux"
import { selectUser } from "../auth/authSlice"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClose } from "@fortawesome/free-solid-svg-icons"

const CreatePostForm = () => {

    const createPostRef = useRef<null | HTMLDivElement>(null)

    const [openForm, setOpenForm] = useState(false)

    const [body, setBody] = useState('')
    const user = useSelector(selectUser)

    const canCreate = [body, user].every(Boolean)

    const [createPost, {isLoading}] = useCreatePostMutation()

    const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
        if(!createPostRef.current) return
        const target = e.target as Node
        const isOutside = target !== createPostRef.current && !createPostRef.current.contains(target)
        if(!isOutside) return
        setOpenForm(false)
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(!canCreate) return
        try {
            await createPost({ body, author: user?._id ? user._id : '' }).unwrap()
            setBody('')
            setOpenForm(false)
        } catch (err) {
            console.log(err)
        }
    }

    const src = cld.image(user?.avatar).resize(fill().width(40).height(40)).toURL()

    const form = (
        <section onClick={handleClick} className="fixed inset-0 z-20 bg-black/70 flex justify-center px-4">
            <div ref={createPostRef} className="h-fit w-full max-w-2xl mt-24 bg-white rounded-md">
                <div className="px-6 py-4 text-center relative border-b border-zinc-300">
                    <h2 className="text-2xl font-semibold">Create Post</h2>
                    <button onClick={() => setOpenForm(false)} className="w-9 h-9 bg-zinc-300 hover:bg-zinc-400 text-zinc-600 rounded-full absolute right-6 top-1/2 -translate-y-1/2">
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
                        rows={4}
                        className="w-full block rounded-md text-xl focus:outline-none resize-none "
                        placeholder={`What's on your mind, ${user?.first_name}?`}
                        value={body}
                        onChange={e => setBody(e.target.value)}
                    ></textarea>
                    <button disabled={!canCreate || isLoading} className="py-2 w-full sm:w-1/4 block mx-auto bg-amber-500 mt-4 rounded-md text-amber-950 font-semibold hover:bg-amber-400 focus:bg-amber-300 disabled:opacity-50 disabled:hover:bg-amber-500 disabled:cursor-not-allowed">
                        Post
                    </button>
                </form>
            </div>
        </section>
    )

  return (
    <>
        <section className="bg-white p-6 rounded-md mb-4 flex gap-4 items-center shadow-sm shadow-black/20">
            <img className="object-cover rounded-full border border-zinc-300" src={src} alt="avatar" />
            <button onClick={() => setOpenForm(true)} className="w-full text-start text-lg text-zinc-500 py-2 px-4 bg-zinc-100 border border-zinc-200 rounded-full hover:bg-zinc-200 transition-colors">
                What's on your mind, {user?.first_name}?
            </button>
        </section>

        { openForm && form }
    </>
  )
}

export default CreatePostForm