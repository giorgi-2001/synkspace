import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom'

import Home from './pages/Home'
import MainLayout from './layouts/MainLayout'
import LoginLayout from './layouts/LoginLayout'
import LoginPage from './features/auth/LoginPage'
import SignupPage from './features/auth/SignupPage'
import RequireAuth from './features/auth/RequireAuth'
import NoAuth from './features/auth/NoAuth'
import Persist from './features/auth/Persist'
import UserPage from './features/users/UserPage'
import EditProfile from './features/users/EditProfile'
import Page404 from './pages/Page404'

const router = createBrowserRouter(createRoutesFromElements(
  <Route element={<Persist />}>

    <Route element={<RequireAuth />}>
      <Route path='/' element={<MainLayout />}>
        <Route index element={<Home />} />

        <Route path="user">
          <Route path=":id" element={<UserPage />} />
          <Route path="profile" element={<EditProfile />} />
        </Route>
      </Route>
    </Route>

    <Route element={<NoAuth />}>
      <Route element={<LoginLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
      </Route>
    </Route>

    <Route path="*" element={<Page404 />} />

  </Route>
))

const App = () => <RouterProvider router={router} />

export default App