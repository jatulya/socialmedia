import { getCurrUser } from '@/lib/appwrite/api'
import { IContextType, IUser } from '@/types/Interfaces'
import {createContext, useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'

export const INITIAL_USER = {
    id : '', 
    name : '',
    email : '',
    password : '',
    username: '',
    imageUrl: '',
    bio: ''
}

const INITIAL_STATE = {
    user1: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUser: () => {},
    setIsAuthenticated: () => {},
    checkAuthUser: async () => false as boolean, // always returns a resolved promise with value which is explicitly specified as boolean
}

export const AuthContext = createContext<IContextType>(INITIAL_STATE)

const AuthProvider = ({children} :{children : React.ReactNode}) => {
    const [user1, setUser] = useState<IUser>(INITIAL_USER)
    const [isLoading, setIsLoading] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const nav = useNavigate()

    //this function has to be called everytime the page reloads; useEffect
    const checkAuthUser = async() => {
        try{
          const currAccount = await getCurrUser()
          if (currAccount){
            setUser({
              id: currAccount.$id,
              name: currAccount.name,
              email: currAccount.email,
              username: currAccount.username,
              imageUrl: currAccount.imageURL,
              bio: currAccount.bio
            })
            setIsAuthenticated(true)
            return true
          }
          return false
        }catch (error){
            console.log(error)
            return false
        }
        finally{
            setIsLoading(false)
        }
    }

    useEffect(()=> {
      if (localStorage.getItem('cookieFallback') =='[]' || localStorage.getItem('cookieFallback') == null) {
        nav('/signin')
      }
      checkAuthUser()
    },[])
    
    const value = { user1, setUser, isLoading, isAuthenticated, setIsAuthenticated, checkAuthUser}
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider


/* authprovider wraps the context in the children */