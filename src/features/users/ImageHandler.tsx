import { useSelector } from "react-redux"
import { selectUser } from "../auth/authSlice"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import cld from "../../config/cloudinary"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faImage } from "@fortawesome/free-solid-svg-icons"
import { useUpdateAvatarMutation } from "./userApiSlice"
import { toast } from "react-toastify"

const ImageHandler = () => {

    const user = useSelector(selectUser)

    const [updateUser] = useUpdateAvatarMutation()

    const myAvatar = cld.image(user?.avatar).toURL()

    const [file, setFile] = useState<File | null>(null)
    const [src, setSrc] = useState(myAvatar)

    const [showBtn, setShowBtn] = useState(false)

    const btnRef = useRef<HTMLButtonElement | null>(null)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target
        if (files) {
            setFile(files[0])
        }
    }

    const handleClick = async () => {
        if (!file) return toast.warn("You have no file selected")

        try {
            await updateUser(file)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (!file) return setShowBtn(false)
        const url = URL.createObjectURL(file)
        setSrc(url)
        setShowBtn(true)
        btnRef.current?.focus()
    }, [file])

    return (
        <div className="p-5 pl-0">
            <label aria-label="click to choose a new Image" htmlFor="file" className="block w-full aspect-square rounded-md overflow-clip relative group cursor-pointer">
                <input
                    type="file"
                    id="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleChange}
                />
                <img src={src} alt="avatar" className="w-full h-full object-cover group-hover:opacity-40 transition duration-300" />
                <div className="absolute inset-0 grid place-items-center text-5xl text-amber-500 opacity-0 group-hover:opacity-80 transition duration-300">
                    <FontAwesomeIcon size="2xl" icon={faImage} />
                </div>
            </label>
            {showBtn && <button onClick={handleClick} ref={btnRef} aria-live="assertive" type="button" className="py-1 text-center w-full hover:opacity-80">
                Upload Image
            </button>}
        </div>
    )
}

export default ImageHandler