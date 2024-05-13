import { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react"
import { useSignupMutation } from "../users/userApiSlice"
import { useLoginMutation  } from "./authApiSlice"
import { toast } from "react-toastify"

const userRegex = /^[a-zA-Z0-9_]{4,}$/
const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

const SignupPage = () => {

  const inputRef = useRef<null | HTMLInputElement>(null)

  const [showPass, setShowPass] = useState(false)

  const [values, setValues] = useState({
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    password2: ''
  })

  const [validUser, setValidUser] = useState(false)
  const [validPass, setValidPass] = useState(false)
  const [validPassConfirm, setValidPassConfirm] = useState(false)

  const [signup, { isLoading, isSuccess }] = useSignupMutation()
  const [login, { isLoading: loggingIn }] = useLoginMutation()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setValues(prev => ({ ...prev, [id]: value}))
  }

  useEffect(() => {
    inputRef?.current?.focus()
  }, [])

  useEffect(() => {
    if(!values.username) return setValidUser(true)
    setValidUser(userRegex.test(values.username))
  }, [values.username])

  useEffect(() => {
    if(!values.password) return setValidPass(true)
    setValidPass(passRegex.test(values.password))
  }, [values.password])

  useEffect(() => {
    if(!values.password2 || !values.password) return setValidPassConfirm(true)
    setValidPassConfirm(values.password === values.password2 && validPass)
  }, [values.password, values.password2])

  const allValid = Object.values(values).every(Boolean) && validPass && validUser && validPassConfirm

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(!allValid) return
    try {
      const { password2, ...dataToSend} = values
      const data = await signup(dataToSend).unwrap()
      toast.success(data.message)
    } catch (error: any) {
      toast.error(error.data.message)
    }
  }

  useEffect(() => {
    if(isSuccess) {
      const { username, password } = values
      login({ username, password })
    }
  }, [isSuccess])

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-x-4 sm:flex-row flex-col">
        <label className="font-semibold text-zinc-700" htmlFor="first_name">
          First Name
          <input 
            ref={inputRef}
            type="text"
            id="first_name" 
            required
            autoComplete="off"
            value={values.first_name}
            onChange={handleChange}
            className="block w-full py-2 px-4 rounded-md mb-4 bg-zinc-200 focus:outline-amber-500"
          />
        </label>

        <label className="font-semibold text-zinc-700" htmlFor="last_name">
          Last Name
          <input 
            type="text"
            id="last_name" 
            required
            autoComplete="off"
            value={values.last_name}
            onChange={handleChange}
            className="block w-full py-2 px-4 rounded-md mb-4 bg-zinc-200 focus:outline-amber-500"
          />
        </label>
      </div>

      <label className="font-semibold text-zinc-700" htmlFor="username">
        Username
        <input 
          type="text"
          id="username" 
          required
          autoComplete="off"
          value={values.username}
          onChange={handleChange}
          className={`block w-full py-2 px-4 rounded-md mb-4 ${!validUser ? 'outline outline-2 outline-red-500 bg-red-100 focus:outline-red-500' : 'bg-zinc-200 focus:outline-amber-500'}`}
        />
      </label>

      <label className="font-semibold text-zinc-700" htmlFor="password">
        Password
        <input 
          type={showPass ? 'text' : 'password'}
          id="password" 
          required
          value={values.password}
          onChange={handleChange}
          className={`block w-full py-2 px-4 rounded-md mb-4 ${(!validPassConfirm || !validPass) ? 'outline outline-2 outline-red-500 bg-red-100 focus:outline-red-500' : 'bg-zinc-200 focus:outline-amber-500'}`}
        />
      </label>

      <label className="font-semibold text-zinc-700" htmlFor="password2">
        Confirm Password
        <input 
          type={showPass ? 'text' : 'password'}
          id="password2" 
          required
          value={values.password2}
          onChange={handleChange}
          className={`block w-full py-2 px-4 rounded-md mb-4 ${(!validPassConfirm) ? 'outline outline-2 outline-red-500 bg-red-100 focus:outline-red-500' : 'bg-zinc-200 focus:outline-amber-500'}`}
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
      <button disabled={!allValid || isLoading || loggingIn} className="py-2 px-8 block w-fit mx-auto rounded-md text-amber-950 font-semibold bg-amber-500 hover:bg-amber-400 focus:bg-amber-300 disabled:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed">
        Sign Up
      </button>
    </form>
  )
}

export default SignupPage