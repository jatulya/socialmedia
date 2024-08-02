import { INewPost, INewUser } from '@/types/Interfaces'
import {useInfiniteQuery, useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import { createUserAcc, signinAcc, signoutAcc, createPost, getRecentPosts, getCurrUser, getUsers } from '../appwrite/api'
import { QUERY_KEYS } from './queryKeys'

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

export const useGetRecentPosts = () =>{
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS], //querykey expects an array
        queryFn : getRecentPosts //queryfn expects a function that returns a promise, QUERY_KEYS.GET_RECENT_POSTS is a constant
    })
}

export async function useGetCurrUser () {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: getCurrUser
    })
}
export const useGetUsers = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USERS],
        queryFn: getUsers
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