import { useState } from "react"
import { useDispatch } from "react-redux"
import { logout } from "./authSlice"

const LogoutBtn = () => {

    const [open, setOpen] = useState(false)

    const dispatch = useDispatch()


    const content = open ? (
        <div className="fixed inset-0 z-10 bg-black/70 flex items-center justify-center px-4">
            <div className="bg-white p-8 rounded-md font-semibold">
                <h2 className="text-center text-2xl mb-10">Do you want to Log Out?</h2>
                <div className="flex justify-evenly gap-x-4 gap-y-2 flex-wrap">
                    <button onClick={() => dispatch(logout())} className="py-2 w-32 text-center text-white rounded-md bg-rose-500 hover:bg-rose-400 focus:bg-rose-300">
                        Yes Logout
                    </button>
                    <button className="py-2 w-32 text-center text-white rounded-md bg-zinc-500 hover:bg-zinc-400 focus:bg-zinc-300" onClick={() => setOpen(false)}>
                        No Cancel
                    </button>
                </div>
            </div>
        </div>
    ) : null


  return (
    <>
        <button className="py-1 px-4 rounded-md text-sm text-white font-semibold bg-amber-500 border-2 border-transparent shadow-sm shadow-black/10 hover:text-amber-500 hover:bg-white hover:border-amber-500 transition-all duration-200" onClick={() => setOpen(prev => !prev)}>Logout</button>

        {content}

    </>
  )
}

export default LogoutBtn