import React, { useContext, useEffect } from 'react'
import { Button } from '../ui/button'
import { useSignoutAcc } from '@/lib/react-query/queries'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '@/context/AuthContext'

const Topbar = () => {
    const { mutate: signout, isSuccess } = useSignoutAcc()
    console.log(isSuccess)
    const nav = useNavigate()
    useEffect(() => {
        if (isSuccess) {
            nav('/signin')
        }
    }, [isSuccess])

    const {user} = useContext(AuthContext)

  return (
    <section className='topbar'>
      <div className="flex-between py-4 px-5"> 
        <Link to='\' className='flex gap-3 items-center'>
        <img 
            src='/assets/logo.png' alt='logo'
            width={130}
            height={130} /> -
        </Link>
      </div>

      <div className='flex gap-4'>
        <Button variant="ghost" className='shad-button_ghost' onClick={() => {signout}}>
            <img src="/assets/logout.png" alt="logout" />
        </Button>
        <Link to={`/profile/${user.id}`} className='flex-center gap-3' >
         <img src={user.imageUrl || '/assets/profile.png'}
         alt="profile" 
         className='w-8 h-8 rounded-full'/>
        </Link>
      </div>
    </section>
  )
}

export default Topbar
