import { useContext, useEffect } from 'react'
import { Button } from '../ui/button'
import { useSignoutAcc } from '@/lib/react-query/queries'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '@/context/AuthContext'
import { sidebarLinks } from '@/_root/pages'
import { INavLink } from '@/types/Interfaces'


const Leftbar = () => {
    const {user} = useContext(AuthContext)
    const {pathname} = useLocation()
    const { mutate:signout, isSuccess } = useSignoutAcc()
    console.log(isSuccess)
    const nav = useNavigate()
    useEffect(() => {
        if (isSuccess) {
            nav('/sigin')
        }
    }, [isSuccess])


  return (
    <nav className='leftsidebar'>
      <div className='flex flex-col gap-11'>
        <Link to='\' className='flex gap-3 items-center'>
            <img 
              src='/assets/logo.png' alt='logo'
              width={170}
              height={36} /> 
        </Link>

        <Link to={`/profile/${user.id}`} className='flex items-center gap-3' >
            <img src={user.imageUrl || '/assets/profile.png'}
            alt="profile" 
            className='w-8 h-8 rounded-full'/>
            <div className="flex flex-col">
              <p className="body-bold">{user.name}</p>
              <p className="small-regular text-light-3">@{user.username}</p>
            </div>
        </Link>
        
        <ul className='flex flex-col gap-6'>
          {sidebarLinks.map((link:INavLink) =>{
             const isActive = pathname === link.route
            return (
              <li key={link.label} className={`leftsidebar-link group ${
                isActive && "bg-primary-500"
              }`}>
                <NavLink 
                  to={link.route}
                  className="flex gap-4 items-center p-4"
                >
                  <img src={link.imgURL}
                  alt={link.label}
                  className={`group-hover:invert-white ${
                    isActive && "invert-white"
                  }` }/>
                  {link.label}
                </NavLink>
              </li>
            )
          })}
        </ul>

        <Button variant="ghost"
          className='shad-button_ghost' 
          onClick={() => {signout()}}>
              <img src="/assets/logout.png" alt="logout" />
              <p className='small-medium lg:base-medium'>Logout</p>
        </Button>
      </div>
    </nav>
  )
}

export default Leftbar
