import { Outlet } from "react-router-dom"
import { useRefreshMutation } from "./authApiSlice"
import { useEffect, useRef } from "react"

const Persist = () => {

    const [refresh, { isLoading }] = useRefreshMutation()

    const effectRan = useRef(false)

    useEffect(() => {

        if(effectRan.current === true) return

        const refresh_token = localStorage.getItem('refresh')

        if(!refresh_token) return

        refresh(undefined)

        return () => { effectRan.current = true }

    }, [])

    if(isLoading) {
        return <p>Loading...</p>
    } else {
        return <Outlet />
    }
}

export default Persist