import { useDeletePostMutation } from "./postApiSlice"

type DeletePostModalProps = {
    setModal: React.Dispatch<React.SetStateAction<boolean>>,
    id: string
}

const DeletePostModal = ({ setModal, id }: DeletePostModalProps) => {

    const [deletePost] = useDeletePostMutation()

    const handleDelete = async () => {
        try {
            await deletePost(id).unwrap()
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center px-4">
        <article className="bg-white w-fit p-6 rounded-md text-center">
            <h2 className="text-2xl text-amber-500 font-semibold">Do you want to delete the post?</h2>
            <p className="py-6 text-lg font-medium">This will remove the post forever <br /> and can not be undone!</p>
            <div className="flex justify-evenly flex-wrap gap-x-4 gap-y-1">

                <button onClick={handleDelete} className="py-2 px-6 text-white font-semibold bg-rose-500 hover:bg-rose-400 focus:bg-rose-300 rounded-md">
                    Yes Delete
                </button>

                <button onClick={() => setModal(false)} className="py-2 px-6 text-white font-semibold bg-zinc-500 hover:bg-zinc-400 focus:bg-zinc-300 rounded-md">
                    No Cancel
                </button>
            </div>
        </article>
    </div>
  )
}

export default DeletePostModal