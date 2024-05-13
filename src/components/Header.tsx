import { NavLink } from "react-router-dom"
import logo from "../assets/logo2.png"
import LogoutBtn from "../features/auth/LogoutBtn"
import SearchUsers from "../features/users/SearchUsers"

const Header = () => {
  return (
    <header className="bg-white py-4">
      <nav className="w-full max-w-6xl mx-auto flex gap-6 items-center justify-end px-4 font-semibold">
        <NavLink to="/" className="block mr-auto sm:mr-0">
          <h1 aria-label="home page">
            <img className="w-36" src={logo} alt="logo" />
          </h1>
        </NavLink>
        <div className="mr-auto sm:block hidden">
          <SearchUsers />
        </div>
        <NavLink to="/user/profile" className="hover:text-amber-500">
          Profile
        </NavLink>
        <LogoutBtn />
      </nav>
      <div className="grow sm:hidden block mt-4 px-4">
        <SearchUsers />
      </div>
    </header>
  )
}

export default Header