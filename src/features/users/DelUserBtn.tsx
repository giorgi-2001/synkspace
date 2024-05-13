import { useState } from "react"
import { useDeleteUserMutation } from "./userApiSlice"
import { toast } from "react-toastify"
import { useDispatch } from "react-redux"
import { logout } from "../auth/authSlice"

const DelUserBtn = () => {

    const [deleteUser] = useDeleteUserMutation()
    const dispatch = useDispatch()

    const [modalOpen, setModalOpen] = useState(false)

    const handleDelete = async () => {
        try {
            const res = await deleteUser(undefined).unwrap()
            toast.success(res.message)
            dispatch(logout())
        } catch (err) {
            console.log(err)
        }
    }

    const modal = (
        <div>
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center px-4">
                <article className="bg-white w-fit p-6 rounded-md text-center">
                    <h2 className="text-2xl text-amber-500 font-semibold">Do you want to delete the account?</h2>
                    <p className="py-6 text-lg font-medium">This will remove the account forever <br /> and can not be undone!</p>
                    <div className="flex justify-evenly flex-wrap gap-x-4 gap-y-1">

                        <button type="button" onClick={handleDelete} className="py-2 px-6 text-white font-semibold bg-rose-500 hover:bg-rose-400 focus:bg-rose-300 rounded-md">
                            Yes Delete
                        </button>

                        <button type="button" onClick={() => setModalOpen(false)} className="py-2 px-6 text-white font-semibold bg-zinc-500 hover:bg-zinc-400 focus:bg-zinc-300 rounded-md">
                            No Cancel
                        </button>
                    </div>
                </article>
            </div>
        </div>
    )

    return (
        <>
            <button type="button" onClick={() => setModalOpen(true)} className=" text-white block py-2 bg-rose-500 rounded-md hover:bg-rose-400 focus:bg-rose-300">
                Delete Account
            </button>
            {modalOpen && modal}
        </>
    )
}

export default DelUserBtn