import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
//form imports
import { Form, FormControl, FormField, FormItem, FormLabel,FormMessage} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SigninValidation } from "@/lib/validation/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Loader from "@/components/shared/Loader"

//toast
import { useToast } from "@/components/ui/use-toast"
//usecontext
import { AuthContext } from "@/context/AuthContext"
import { useSigninAcc } from "@/lib/react-query/queries"
import { useContext } from "react"

const Signin = () => {
  const { toast } = useToast()
  const nav = useNavigate()
  const {checkAuthUser, isLoading: isUserLoading} = useContext(AuthContext)

  const {mutateAsync: signInAcc} = useSigninAcc()

  // 1. Define your form.
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    const session = await signInAcc({
      email: values.email,
      password: values.password,
    })

    if(!session) {
      return toast ({title : "Log in failed. Please try again later"})
    }

    const isLoggedIn = await checkAuthUser()
    console.log("isLoggedIn" )
    if(isLoggedIn) {
      form.reset()
      nav("/")
    }else{
      return toast ({title : "Authenticated. Log in failed. Please try again later"})
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/logo.png" alt="logo"/>    

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-8">
          Log into your account
        </h2> 

        <p className="text-light-3 small-medium md:base-regular">
          To enter my bookverse, give me ur secret info.
        </p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="form w-full mt-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="email" 
                    className="shad-input"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="password" 
                    className="shad-input"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit"
            className="shad-button_primary">
              {isUserLoading ? (
                <div className="flex-center gap-2">
                  <Loader/> Loading...
                </div>
              ) : "Log in "}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
              Don't have an account?
              <Link to='/signup' className="text-primary-500 text-small-semibold ml-1">
                Sign up
              </Link>             
          </p>
        </form>
      </div>
    </Form>
  )
}

export default Signin
