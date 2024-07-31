import { INewPost, INewUser } from '@/types/Interfaces'
import {useInfiniteQuery, useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import { createUserAcc, signinAcc, signoutAcc, createPost } from '../appwrite/api'
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
/*
queries --> fetch data  
mutations -> way to handle creating, updating or deleting data without the use of apis directly on the server 
*/
export const useCreatePost = () => {
    const queryClient = useQueryClient() //fetches current instance of queryclient with the details such as status (data) and fetchstatus 
    return useMutation({
        mutationFn: (post: INewPost) => createPost(post), 
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [QUERY_KEYS.GET_RECENT_POSTS]}) //invalidates the cache and refetches the data
        }
    })
}

/*
useQuery --> fetches data from the server
useMutation --> creates, updates or deletes data on the server
the actual implementation functions are called with the mutation 'coz -
    it refetches the data during any changes occured (updation, network connection) without manipulating stuff that need not be changed
  - it invalidates all cache entries automatically whenever necessary changes occurs
 */