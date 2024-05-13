import { Outlet } from 'react-router-dom'
import Header from '../components/Header'


const MainLayout = () => {
  return (
    <>
        <Header />

        <main className="grow py-6 px-4 bg-zinc-300">
            <Outlet />
        </main>
    </>
  )
}

export default MainLayout