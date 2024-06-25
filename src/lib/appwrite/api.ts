import { INewUser} from "@/types/Interfaces";
import { ID } from "appwrite";
import { account, appwriteConfig, avatar, db } from "./config";

//toast

export async function createUserAcc(user: INewUser ) {
    try{
        const newAccount = await account.create(
            ID.unique(), 
            user.email, 
            user.password, 
            user.name
        )

        if (!newAccount) throw Error
        
        const avatarUrl = avatar.getInitials(user.name)
        const newUser = await saveUserToDB({
            accountID : newAccount.$id, //the id is created by appwrite
            email: newAccount.email, //we could also give user.email
            name: newAccount.name, 
            imageURL : avatarUrl,
            username : user.username
        })

        return newUser
    } catch(error){
        console.log(error)
        return error
    }
}

export async function saveUserToDB(user : {
    accountID : string,
    email: string,
    name: string, 
    imageURL : URL,
    username? : string
}) {
    try{
        const newuser = await db.createDocument(
            appwriteConfig.dbId,
            appwriteConfig.usersCollectionId, 
            ID.unique(),
            user,
        )
        return newuser
    }catch (error){
        console.log(error)
    }
}

