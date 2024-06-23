import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
//form imports
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel,FormMessage} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignupValidation } from "@/lib/validation/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Loader from "@/components/shared/Loader"

const Signin = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  })
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof SignupValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  const isLoading = false

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/books51.jpg" alt="logo"/>

        <p className="text-light-3 small-medium md:base-regular">
          To get access to my social media page, u gotta enter ur secret info brethren!!
        </p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="form w-full mt-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input 
                    type="text" 
                    placeholder="username" 
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
              {isLoading ? (
                <div className="flex-center gap-2">
                  <Loader/> Loading...
                </div>
              ) : "Log in "}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
              Don't have an account?
              <Link to='/signup'      
                className="text-primary-500 text-small-semibold ml-1">
                Sign Up
              </Link>             
          </p>
        </form>
      </div>
    </Form>
  )
}

export default Signin
