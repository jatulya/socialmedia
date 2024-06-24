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
import { createUserAcc } from "@/lib/appwrite/api"

const Signup = () => {
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
  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    const newUser = await createUserAcc(values)
    console.log(newUser)
  }

  const isLoading = false

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/logo.png" alt="logo"/>

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-8">
          Create a new account
        </h2>      

        <p className="text-light-3 small-medium md:base-regular">
          To use my social media page, u gotta give ur details brethren!!
        </p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="form w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input 
                    type="text" 
                    placeholder="name" 
                    className="shad-input"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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
              {isLoading ? (
                <div className="flex-center gap-2">
                  <Loader/> Loading...
                </div>
              ) : "Sign up "}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
              Already have an account?
              <Link to='/signin'      
                className="text-primary-500 text-small-semibold ml-1">
                Log in
              </Link>             
          </p>
        </form>
      </div>
    </Form>
  )
}

export default Signup
