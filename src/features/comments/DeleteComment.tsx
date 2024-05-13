import { MouseEventHandler, useState } from "react"
import { useDeleteCommentMutation } from "./commentApiSlice"

const DeleteComment = ({ id }: { id: string }) => {

    const [open, setOpen] = useState(false)

    const [deleteComment] = useDeleteCommentMutation()

    const handleDelete:MouseEventHandler<HTMLButtonElement> = () => {
        deleteComment(id)
    }

    const DeleteModal = open ? (
        <section className="fixed inset-0 bg-black/70 flex items-center justify-center px-4">
            <div className="bg-white p-6 rounded-md font-medium text-center shadow-black">
                <h2 className="text-2xl text-amber-500">Delete Comment?</h2>
                <p className="py-6 text-lg">
                    Do you really want to delete this comment?<br /> 
                    This will remove the comment forever<br />
                    and can not be undone!
                </p>
                <div className="flex justify-evenly gap-x-4 gap-y-1 flex-wrap">
                    <button onClick={handleDelete} className="py-2 w-2/5 bg-rose-500 hover:bg-rose-400 focus:bg-rose-300 rounded-md text-white">
                        Yes Delete
                    </button>
                    <button onClick={() => setOpen(false)} className="py-2 w-2/5 bg-zinc-500 hover:bg-zinc-400 focus:bg-zinc-300 rounded-md text-white">
                        No Cancel
                    </button>
                </div>
            </div>
        </section>
    ) : null

  return (
    <>
        <button onClick={() => setOpen(true)}>
            Delete Comment
        </button>

        { DeleteModal }
    </>
  )
}

export default DeleteComment