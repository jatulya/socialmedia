import './globals.css'

import { Route, Routes } from 'react-router-dom'
import Signin from './_auth/forms/Signin'
import Signup from './_auth/forms/Signup'
import { Home, Explore, Saved, CreatePost,
  Profile, EditPost, PostDetails, UpdateProfile, AllUsers,
} from "@/_root/pages";
import AuthLayout from './_auth/AuthLayout'
import RootLayout from './_root/RootLayout'

//toast
import { Toaster } from "@/components/ui/toaster"

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
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:id" element={<EditPost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />
        </Route>
      </Routes>

      <Toaster />
    </main>
  )
}
export default App

/* nesting routing wraps the child components inside the parent component (eg: signup and signin in authlayout)

index element = {<Home/>} => when the url matches the home url (url = '/'), the RootLayout is rendered with home as child component 

rendering should be done using outlet in the code of the component to specify the position of the cop
 */
