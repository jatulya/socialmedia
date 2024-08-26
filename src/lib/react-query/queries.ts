import { INewPost, INewUser, IUpdatePost } from '@/types/Interfaces'
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import { createUserAcc, signinAcc, signoutAcc, createPost, getRecentPosts, getCurrUser, getUsers, getPostById, likePost, savePost, unsavePost, updatePost, getUserById } from '../appwrite/api'
import { QUERY_KEYS } from './queryKeys'

//account queries
export const useCreateUserAcc = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAcc(user)
    })
}

export const useSigninAcc = () => {
    return useMutation({
        mutationFn: (user: {
            email:string,
        password: string,
    }) => signinAcc(user)
    })
}

export const useSignoutAcc = () => {
    console.log("entered queries")
    return useMutation({
        mutationFn: signoutAcc
    })
}

//users queries
export function useGetCurrUser () {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: getCurrUser
    })
}

export function useGetUserById (id:string) {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID],
        queryFn: () => getUserById(id),
        enabled: !!id,
    })
}

export const useGetUsers = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USERS],
        queryFn: getUsers
    })
}

//posts stuff
  //create post
export const useCreatePost = () => {
    const queryClient = useQueryClient() //fetches current instance of queryclient with the details such as status (data) and fetchstatus 
    return useMutation({
        mutationFn: (post: INewPost) => createPost(post), 
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [QUERY_KEYS.GET_RECENT_POSTS]}) 
            /*invalidates the cache and refetches the data => cache would be updated => 
            when the user navigates to home page, recently added post would also be displayed, 
            if not invalidate, refresh or cache expiration is required to see the new post
            */
        }
    })
}
  //update post
export const useUpdatePost = () => {
    const queryClient = useQueryClient() 
    return useMutation({
        mutationFn: (post: IUpdatePost) => updatePost(post), 
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [QUERY_KEYS.GET_RECENT_POSTS]})
            queryClient.invalidateQueries({queryKey: [QUERY_KEYS.GET_POSTS]})
            queryClient.invalidateQueries({queryKey: [QUERY_KEYS.GET_CURRENT_USER]})
        }
    })
}
  //fetch posts
export const useGetRecentPosts = () =>{
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS], //querykey expects an array
        queryFn : getRecentPosts //queryfn expects a function that returns a promise, QUERY_KEYS.GET_RECENT_POSTS is a constant
    })
}

export const useGetPostById = (postId?: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID],
        queryFn: () => getPostById(postId), //arrow function provided to pass the arguement
        enabled: !!postId, //since postId is optional, enabled make sure that query function is called only when postId is provided
    })
}
 //like post
export const useLikePost = () => {
    const queryClient = useQueryClient()
    return useMutation({
        //here, we used mutation function coz a change is being done in database
        mutationFn: ({postId, likesArray} : {postId: string, likesArray: string[]}) => 
            likePost(postId, likesArray),
            onSuccess: () => {             
                queryClient.invalidateQueries({queryKey: [QUERY_KEYS.GET_POST_BY_ID],}) 
                //to reflect the change in number of likes when the post is presented
                queryClient.invalidateQueries({queryKey: [QUERY_KEYS.GET_RECENT_POSTS],}) 
                //to update the position of this post recent posts 
                queryClient.invalidateQueries({queryKey: [QUERY_KEYS.GET_POSTS],})
                //next time all the posts are fetched, the like count is reflected
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CURRENT_USER],}) 
                //next time the data is fetched, the user's record that holds the posts they liked will be updated
            }
    })
}
 //save and unsave posts
export const useSavePost = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({userId, postId} : {userId:string; postId:string}) => savePost(userId, postId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [QUERY_KEYS.GET_RECENT_POSTS],})
            queryClient.invalidateQueries({queryKey: [QUERY_KEYS.GET_POSTS],})
            queryClient.invalidateQueries({queryKey: [QUERY_KEYS.GET_CURRENT_USER],})
        }
    })
}

export const useDeleteSavedPost = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (savedRecId:string) => unsavePost(savedRecId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [QUERY_KEYS.GET_RECENT_POSTS],})
            queryClient.invalidateQueries({queryKey: [QUERY_KEYS.GET_POSTS],})
            queryClient.invalidateQueries({queryKey: [QUERY_KEYS.GET_CURRENT_USER]})
        }
    })
}

/*
useQuery --> fetches data from the server and caches the response
 queryKey is checked for any cache responses under the given query key when the particular query is called
 if cache is there, that response is returned, else the function defined by queryfn is called

 useMutation --> creates, updates or deletes data on the server
the actual implementation functions are called with the mutation 'coz -
    it refetches the data during any changes occured (updation, network connection) without manipulating stuff that need not be changed
  - it invalidates all cache entries automatically whenever necessary changes occurs
 */