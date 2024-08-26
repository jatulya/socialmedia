import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import { PostValidation } from "@/lib/validation/schema"
import { PostFormProps } from "@/types/Interfaces"
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queries"
import { useContext } from "react"
import { AuthContext } from "@/context/AuthContext"
import { useToast } from "../ui/use-toast"
import { useNavigate } from "react-router-dom"
import { Loader, FileUploader } from "../shared"
 
const PostForm = ( {post, action} : PostFormProps ) => {
 
  const nav = useNavigate()
  const {user} = useContext(AuthContext)
  const {toast} = useToast()
    
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post?.caption || "", //optional chaining
      file: [], //handle multiple files
      location: post ? post?.location : "",
      tags: post ? post.tags.join(',') : ""
    },
  })

  const {mutateAsync: createPost, isPending: isLoadingCreate} = useCreatePost()
  const {mutateAsync: updatePost, isPending: isLoadingUpdate} = useUpdatePost()
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PostValidation>) {
    
    if (post && action === "Update"){
      const updatedPost = await updatePost({
        ...values, 
        postId : post.$id,
        imageId: post.imageID,
        imageUrl: post.imageURL,
      })

      if (!updatedPost){
        toast({
          title: 'Update post failed. Try Again later.',
        })
      }
      return nav(`/posts/${post.$id}`)
    }
    
    const newPost = await createPost({
      ...values, 
      userId: user.id,
    })

    if (!newPost){
      toast({ title : 'Creating post unsuccessful. Please try again later'})
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
                <FileUploader fieldChange ={field.onChange}
                />
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
            className="shad-button_dark_4"
            onClick={() => nav(-1)}>
            Cancel
          </Button>
          
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isLoadingCreate || isLoadingUpdate}>
            {(isLoadingCreate || isLoadingUpdate) && <Loader />}
            {action} Post
          </Button>
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
   the prop "post" is optional, thus we are using optional chaining (post?post?.caption)
 */