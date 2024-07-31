import { INewPost, INewUser} from "@/types/Interfaces";
import { ID, Query } from "appwrite";
import { account, appwriteConfig, avatar, db, storage } from "./config";

// user account stuff
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

export async function signinAcc(user:{email:string, password: string}) {
    try{
        const session = await account.createEmailPasswordSession(user.email, user.password)
        return session
    }catch (error){
        console.log(error)
    }
}

export async function getCurrUser() {
    try{
        const currAccount = await account.get()
        if (!currAccount) throw Error
        console.log(currAccount)
        
        const users = await db.listDocuments(
            appwriteConfig.dbId, 
            appwriteConfig.usersCollectionId,
            [Query.equal('accountID', currAccount.$id)]
        )
        if (!users) throw Error
        return users.documents[0]
    } catch(error){
        console.log(error)
    }
}

export async function signoutAcc() {
    try{      
        const session = await account.deleteSession("current")
        console.log(`session: ${session}`)
        return session
    }catch (error){
        console.log(error)
    }
}

//posts stuff
export async function uploadFile(file:File) {
    try{
        const fileUpload = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        )
        return fileUpload
    }catch(e){
        console.log(`error ${e} from uploading file`)
    }
}

export async function getFileUrl(fileId:string){
    try{
        const fileUrl = storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000, 2000, "top", 100
        )
    }
}

export async function createPost(post :INewPost){
    try{
        const uploadedFile = await uploadFile(post.file[0])
        if (!uploadedFile) throw Error

        const fileUrl = getFileUrl
    }catch(err){
        console.log(err)
    }
}