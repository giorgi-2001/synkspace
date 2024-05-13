import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useRef, useState } from "react"
import { User, useLazyGetUsersQuery } from "./userApiSlice"
import cld from "../../config/cloudinary"
import { fill } from "@cloudinary/url-gen/actions/resize"
import { Link } from "react-router-dom"

const SearchUsers = () => {

    const [windowOpen, setWindowOpen] = useState(false)
    const [keyword, setKeyword] = useState('')

    const timeOut = useRef<NodeJS.Timeout | undefined>()

    const [getUsers, {
        isLoading,
        isSuccess,
        error,
        isError,
        data: users
    }] = useLazyGetUsersQuery()

    useEffect(() => {
        clearTimeout(timeOut.current)

        const serchForUsers = async () => {
            await getUsers(keyword)
            setWindowOpen(true)
        }

        if (!keyword) return setWindowOpen(false)

        timeOut.current = setTimeout(() => {
            serchForUsers()
        }, 1000)

    }, [keyword])

    const getAvatarUrl = (avatar: string) => {
        return cld.image(avatar).resize(
            fill().width(40).height(40)
        ).toURL()
    }

    const handleClick = () => {
        setWindowOpen(false)
        setKeyword('')
    }

    let content

    if (isLoading) {
        content = <p className="p-2">Loading...</p>
    } else if (isError) {
        console.log(error)
        content = <p className="p-2">Error</p>
    } else if (isSuccess && !users?.length) {
        content = <p className="p-2">No Users Found</p>
    } else if (isSuccess && users?.length) {
        content = users.map((user: User) =>
            <li key={user._id}>
                <Link onClick={handleClick} className="flex items-center gap-4 p-2 rounded-md hover:bg-zinc-100 cursor-pointer" to={`/user/${user._id}`}>
                    <img className="object-cover rounded-full" src={getAvatarUrl(user.avatar)} alt="avatar" />
                    <p>{user.first_name + " " + user.last_name}</p>
                </Link>
            </li>)
    }

    return (
        <form className="relative">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search users..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="bg-zinc-100 border border-zinc-200 hover:bg-zinc-200 min-w-[220px] w-full block py-2 px-4 rounded-full focus:outline-amber-500 focus:hover:bg-zinc-100"
                />
                <div className="absolute right-4 bottom-1/2 translate-y-1/2 text-amber-500">
                    <FontAwesomeIcon size="lg" icon={faMagnifyingGlass} />
                </div>
            </div>

            {windowOpen &&
                <menu className="absolute top-12 bg-white border border-zinc-100 p-2 w-full rounded-md shadow-lg shadow-black/30">
                    {content}
                </menu>}
        </form>
    )
}

export default SearchUsers