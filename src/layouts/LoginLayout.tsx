import { Outlet, NavLink } from "react-router-dom"
import logo from "../assets/logo2.png"

const LoginLayout = () => {
  return (
    <main  className="min-h-screen px-4 bg-zinc-300 flex justify-center">
        <section className="bg-white p-6 my-4 rounded-md min-w-72 w-full max-w-96 sm:max-w-md h-fit shadow-md shadow-black/25">
            <header className="pb-2 border-b-4 border-zinc-300 mb-6">
                <h1 aria-label="SynkSpace">
                    <img className="w-40" src={logo} alt="logo" />
                </h1>
                <p className="mb-6 mt-1 font-medium text-sm text-amber-500">Where minds meet, Spaces Sync</p>
                
                <nav className="flex gap-4">
                    <NavLink className="font-semibold text-zinc-500" to="login">Sign In</NavLink>
                    <NavLink className="font-semibold text-zinc-500" to="signup">Sign Up</NavLink>
                </nav>
            </header>

            <Outlet />

        </section>
    </main>
  )
}

export default LoginLayout