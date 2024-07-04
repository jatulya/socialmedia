import React from 'react'
import { Button } from '../ui/button'
import { signoutAcc } from '@/lib/appwrite/api'
import { useSignoutAcc } from '@/lib/react-query/queries'

const Topbar = () => {
  return (
    <section className='topbar'>
      <div className="flex-between py-4 px-5"> 
      
      </div>
      <div className='flex gap-4'>
        <Button variant="ghost" className='shad-button_ghost' onClick={useSignoutAcc}>
            <img src="/assets/logout.png" alt="logout" />
        </Button>
      </div>
    </section>
  )
}

export default Topbar
