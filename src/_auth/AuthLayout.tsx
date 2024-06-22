import { Outlet, Navigate } from "react-router-dom"

const AuthLayout = () => {

  const isAuthenticated = false

  return (
    <>
      authlayout
      {isAuthenticated ? (
        <Navigate to='/' />
      ) : (
        <>
          <section className="flex flex-1 justify-center items-center flex-col py-10">
            <Outlet />
          </section>

          <img 
            src='/assets/girlNbook.jpg'
            alt='book'
            className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
          />
        </>
      )
      }
    </>
  )
}

export default AuthLayout


/* $ the outlet only returns one component at a time 
   $ <></> is a fragment, it's a way to group elements without adding an extra dom node or div element
*/