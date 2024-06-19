import { Route, Routes } from 'react-router-dom'

import './globals.css'
import Signin from './_auth/forms/Signin'
import Signup from './_auth/forms/Signup'
import {Home} from './_root/pages'
import AuthLayout from './_auth/AuthLayout'
import RootLayout from './_root/RootLayout'

const App = () => {
  return (
    <main className='flex h-screen'>
      <Routes>
        {/* public routes - seen before signin*/}
        <Route element={<AuthLayout/>}> {/* wrapping both forms */}
          <Route path='/signin' element={<Signin />} />
          <Route path='/signup' element={<Signup />} />
        </Route>
        {/* private routes - seen after signin*/}
        <Route element={<RootLayout/>}>
          <Route index element={<Home />} /> {/* index => default child route */}
        </Route>
      </Routes>
    </main>
  )
}

export default App
