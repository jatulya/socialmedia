import { INewUser } from '@/types/Interfaces'
import {useInfiniteQuery, useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import { createUserAcc, signinAcc, signoutAcc } from '../appwrite/api'

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