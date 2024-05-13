import { useState, useEffect, useRef, FormEvent } from "react"
import { useLoginMutation } from "./authApiSlice"

const LoginPage = () => {

  const inputRef = useRef<null | HTMLInputElement>(null)

  const [showPass, setShowPass] = useState(false)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login, { isLoading }] = useLoginMutation()

  useEffect(() => {
    inputRef?.current?.focus()
  }, [])

  const allValid = [username, password].every(Boolean)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(!allValid) return
    login({ username, password })
  }

  return (
    <form onSubmit={handleSubmit}>

      <label className="font-semibold text-zinc-700" htmlFor="username">
        Username
        <input
          ref={inputRef} 
          type="text"
          id="username" 
          required
          autoComplete="off"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="block w-full py-2 px-4 rounded-md mb-4 bg-zinc-200 focus:outline-amber-500"
        />
      </label>

      <label className="font-semibold text-zinc-700" htmlFor="password">
        Password
        <input 
          type={showPass ? 'text' : 'password'}
          id="password" 
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="block w-full py-2 px-4 rounded-md mb-4 bg-zinc-200 focus:outline-amber-500"
        />
      </label>

      <div className="flex gap-3 items-center mb-6">
        <input 
          type="checkbox" 
          id="showPass"
          checked={showPass}
          onChange={() => setShowPass(prev => !prev)}
          className="block w-4 h-4"
        />
        <label className="font-semibold text-zinc-700" htmlFor="showPass">Show Password</label>
      </div>
      <button disabled={!allValid || isLoading } className="py-2 px-8 block w-fit mx-auto rounded-md text-amber-950 font-semibold bg-amber-500 hover:bg-amber-400 focus:bg-amber-300 disabled:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed">
        Log In
      </button>
    </form>
  )
}

export default LoginPage