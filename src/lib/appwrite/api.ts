import { INewUser} from "@/types/Interfaces";
import { ID } from "appwrite";
import { account, avatar } from "./config";

export async function createUserAcc(user: INewUser ) {
    try{
        const newAccount = await account.create(ID.unique(), user.email, user.password, user.name)

        if (!newAccount) throw Error
        
        const avatarUrl = avatar.getInitials(user.name)
        const newUser = await saveUserToDB()

        return newAccount
    } catch(error){
        console.log(error)
        return error
    }
}

export async function saveUserToDB(user : {
    
}) {
    
}

