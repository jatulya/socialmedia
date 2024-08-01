import { INewPost, INewUser} from "@/types/Interfaces";
import { ID, ImageGravity, Query } from "appwrite";
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
        const fileUrl = await storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000, 2000, ImageGravity.Top, 
            100 
            //gravity how img is cropped/resized when it is previewed
        )
        return fileUrl
    } catch(e){
        console.log(`Error ${e} in getting file url`)
    }
}

export async function deleteFile(fileId: string){
    try{
        await storage.deleteFile(appwriteConfig.storageId, fileId)
        return {status:"ok"}
        //{status: ok} is a user defined object with a single property named "status" whose value is "ok". it is neither a interface type nor an enum
    }catch(e){
        console.log(`Error ${e} in deleting file`)
    }
}

export async function createPost(post :INewPost){
    try{
        const uploadedFile = await uploadFile(post.file[0])
        if (!uploadedFile) throw Error

        const fileUrl = await getFileUrl(uploadedFile.$id)
        console.log(`Url: ${fileUrl}`)

        if (!fileUrl){
            await deleteFile(uploadedFile.$id)
            throw Error
        }

        const tags = post.tags?.replace(/ /g, "").split(',') || []
        //remove whitespaces from the tags given and turn them into array. 
        // '/ /' represents the regular expression for space and g represents globally (more than one occurances of matching expression are replaced ). if no tags are given, an empty array is returned 

        const newPost = await db.createDocument(
            appwriteConfig.dbId,
            appwriteConfig.postsCollectionId, 
            ID.unique(),
            {
                creator: post.userId,
                imageURL: fileUrl,
                imageID: uploadedFile.$id,
                Tags: tags,
                caption: post.caption,
                Location : post.location
            }
        )

        if (!newPost){
            await deleteFile(uploadedFile.$id)
            throw Error
        }

        return newPost

    }catch(err){
        console.log(`Error ${err} in creating post`)
    }
}

/*
  $id is a property of appwrite 
  Error is a javascript object that represents any errors generated
*/