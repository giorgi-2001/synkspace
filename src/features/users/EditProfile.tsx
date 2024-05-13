import { ChangeEvent, FormEvent, useState } from "react"
import { useSelector } from "react-redux"
import { selectUser } from "../auth/authSlice"
import { useUpdateUserMutation } from "./userApiSlice"
import ImageHandler from "./ImageHandler"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import DelUserBtn from "./DelUserBtn"

const EditProfile = () => {

    const user = useSelector(selectUser)

    const [updateUser] = useUpdateUserMutation()

    const navigate = useNavigate()

    const [userData, setUserData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        username: user?.username || '',
        password: '',
        newPassword: ''
    })

    const [showPassword, setShowPassword] = useState(false)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setUserData(prev => ({ ...prev, [id]: value }))
    }

    const isPassword = userData.newPassword ? [userData.password, userData.newPassword].every(Boolean) : true

    const canSubmit = [
        userData.username,
        userData.first_name,
        userData.last_name
    ].every(Boolean) && isPassword

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!canSubmit) return
        try {
            const res = await updateUser(userData).unwrap()
            toast.success(res.message)
            navigate('/')
        } catch (error: any) {
            toast.error(error.data.message)
        }
    }

    return (
        <section className="w-full max-w-xl mx-auto p-6 bg-white rounded-md shadow-md shadow-black/20">
            <h2 className="text-2xl text-center font-medium text-amber-500 mb-6">
                Edit Profile
            </h2>
            <form onSubmit={handleSubmit} className="font-medium sm:grid grid-cols-2">
                <ImageHandler />
                <div>
                    <label className="text-zinc-600" htmlFor="first_name">First Name</label>
                    <input
                        type="text"
                        required
                        id="first_name"
                        autoComplete="off"
                        value={userData.first_name}
                        onChange={handleChange}
                        className="block w-full py-2 px-4 rounded-md bg-zinc-100 border border-zinc-200 mb-4 focus:outline-amber-500"
                    />

                    <label className="text-zinc-600" htmlFor="last_name">Last Name</label>
                    <input
                        type="text"
                        required
                        id="last_name"
                        autoComplete="off"
                        value={userData.last_name}
                        onChange={handleChange}
                        className="block w-full py-2 px-4 rounded-md bg-zinc-100 border border-zinc-200 mb-4 focus:outline-amber-500"
                    />

                    <label className="text-zinc-600" htmlFor="username">Username</label>
                    <input
                        type="text"
                        required
                        id="username"
                        autoComplete="off"
                        value={userData.username}
                        onChange={handleChange}
                        className="block w-full py-2 px-4 rounded-md bg-zinc-100 border border-zinc-200 mb-4 focus:outline-amber-500"
                    />

                </div>

                <div className="col-span-2 sm:grid grid-cols-2 gap-x-4">
                    <label className="text-zinc-600" htmlFor="password">Password</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={userData.password}
                        onChange={handleChange}
                        className="block w-full py-2 px-4 rounded-md bg-zinc-100 border border-zinc-200 mb-4 focus:outline-amber-500 row-start-2"
                    />

                    <label className="text-zinc-600" htmlFor="newPassword">
                        New Password
                    </label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="newPassword"
                        value={userData.newPassword}
                        onChange={handleChange}
                        className="block w-full py-2 px-4 rounded-md bg-zinc-100 border border-zinc-200 mb-4 focus:outline-amber-500"
                    />
                </div>

                <div className="flex gap-2 items-center col-span-2">
                    <input
                        className="block w-4 h-4"
                        type="checkbox"
                        id="showPas"
                        checked={showPassword}
                        onChange={() => setShowPassword(prev => !prev)}
                    />
                    <label className="text-zinc-600" htmlFor="showPas">Show Password</label>
                </div>

                <div className="flex flex-col gap-4 mt-6 w-full sm:w-1/2 mx-auto col-span-2">
                    <button disabled={!canSubmit} className="block py-2 bg-amber-500 rounded-md hover:bg-amber-400 focus:bg-amber-300 disabled:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed">
                        Update Profile
                    </button>
                    <DelUserBtn />
                </div>

            </form>
        </section>
    )
}

export default EditProfile