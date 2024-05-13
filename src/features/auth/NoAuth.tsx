import { Outlet, Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectToken } from "./authSlice"

const NoAuth = () => {

    const token = useSelector(selectToken)

    if(!token) {
        return <Outlet />
    } else {
        return <Navigate to="/" />
    }
}

export default NoAuth