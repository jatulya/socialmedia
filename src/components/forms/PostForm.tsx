import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import FileUploader from "../shared/FileUploader"
import { PostValidation } from "@/lib/validation/schema"
import { PostFormProps } from "@/types/Interfaces"
import { useCreatePost } from "@/lib/react-query/queries"
import { useContext } from "react"
import { AuthContext } from "@/context/AuthContext"
import {useToast } from "../ui/use-toast"
import { useNavigate } from "react-router-dom"
 
const PostForm = ( {post, action} : PostFormProps ) => {
  const nav = useNavigate()
  const {user} = useContext(AuthContext)
  const {toast} = useToast()
  
  const {mutateAsync: createPost, isPending: isLoadingCreate} = useCreatePost()
  
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "", //optional chaining
      file: [], //handle multiple files
      location: post ? post?.location : "",
      tags: post ? post.tags.join(',') : ""
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PostValidation>) {
    const newPost = await createPost({
      ...values, 
      //Spread operator '...' unpacks the object values and pass the properties listed in it as individual arguements to the function
      userId: user.id,
    })

    if (!newPost){
      toast({ title : 'Please try again later'})
    }
    nav('/')
    console.log(values)
  }

  return (
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}        
      className="flex flex-col gap-9 w-full  max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea placeholder="caption" 
                className="shad-textarea custom-scrollbar"{...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader 
                  fieldChange ={field.onChange}
                  mediaUrl = {post?.imageUrl}/>
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" 
                {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Tags (separated by " , ")</FormLabel>
              <FormControl>
                <Input type="text"
                className="shad-input" 
                placeholder="art, health, divine" {...field}/>
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end">
        <Button
            type="button"
            className="shad-button_dark_4" >
            Cancel
          </Button>
          <Button className="shad-button_primary whitespace-nowrap" type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  )
}

export default PostForm

/*
  <Input type=text classnam ="112" {..field}
   spreads all the properties of the field object onto the Input component 
   eg: field = { name:"username", onChange: handlechange} 
   so the Input component will have the properties name and onChange
 */