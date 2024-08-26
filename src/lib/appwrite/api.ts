import { INewPost, INewUser, IUpdatePost} from "@/types/Interfaces";
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

export async function getUsers() {
    const queries= [Query.orderDesc("$createdAt"), Query.limit(10)] //contains query objects 

    try{
        const users = await db.listDocuments(
            appwriteConfig.dbId, appwriteConfig.usersCollectionId, queries
        )
        if (!users) throw Error
        return users
    } catch(error){
        console.log(`Error ${error}`)  
    }
    
}

export async function getUserById(id: string) {
    try{
        const user = await db.getDocument(appwriteConfig.dbId, appwriteConfig.usersCollectionId, id)
        if (!user) throw new Error('Did not get the user')
        return user
    }catch(e){
        console.log(`Error ${e} from getUserById`)
    }
}
//posts stuff
  //creating posts
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

  //updating post
export async function updatePost(post:IUpdatePost) {
    const hasFileToUpdate = post.file.length > 0

    try{
        let img = {
            imgUrl: post.imageUrl,
            imgId: post.imageId
        }
        //if there is a file to upload, create a new image object with the new file id
        if (hasFileToUpdate){
            const uploadedFile = await uploadFile(post.file[0])
            if (!uploadedFile)
                throw new Error('Could not upload new file')

            const fileUrl = await getFileUrl(uploadedFile.$id)
            if (!fileUrl){
                await deleteFile(uploadedFile.$id)
                throw new Error('Could not get the url')
            }

            img = {imgUrl: fileUrl, imgId: uploadedFile.$id}
        }

        const tags = post.tags?.replace(/ /g, "").split(',') || []    

        const updatedPost = await db.updateDocument(appwriteConfig.dbId, appwriteConfig.postsCollectionId, post.postId, {
            caption: post.caption,
            location: post.location,
            imageURL: img.imgUrl,
            imageID: img.imgId,
            tags: tags
        })

        if (!updatedPost){
            if (hasFileToUpdate) await deleteFile(img.imgId)
            throw new Error('Cannot update post')
        }

        //delete old files if files were updated
        if (hasFileToUpdate) {
            await deleteFile(post.imageId)
        }

        return updatedPost
    }catch(e){
        console.log(`${e} from updatepost api`)
    }
}
 //fetch posts stuff
export async function getRecentPosts(){
    try{
        const posts = await db.listDocuments(
            appwriteConfig.dbId,
            appwriteConfig.postsCollectionId,
            [Query.orderDesc("$createdAt"), Query.limit(10)]
        )
        
        if (!posts) throw Error

        return posts
    }catch(error){
        console.log(`Error ${error} from getRecentPosts`)
    }
}

export async function getPosts(){

}

export async function getPostById(postId? : string){
    if (!postId) throw new Error('No post ID')
    
    try{
        const post = await db.getDocument(appwriteConfig.dbId, 
            appwriteConfig.postsCollectionId, postId)
        if (!post) throw new Error('Did not get any doc from the database with the given postID')
        
        return post;
    }catch(e){
        console.log(`${e} from getPostsById`)
    }
}

  //like and save posts
export async function likePost(postId:string, likesArray: string[]){
    try{
        const addlike = await db.updateDocument(
            appwriteConfig.dbId, 
            appwriteConfig.postsCollectionId,
            postId, 
            { likes : likesArray, }
        )

        if (!addlike) throw new Error('likes cannot be added');
        return addlike
    }catch(e){
        console.log(`${e} from likePost`)
    }
}

export async function savePost(userId: string, postId:string){
    try{
        const savepost = await db.createDocument(
            appwriteConfig.dbId, 
            appwriteConfig.savessCollectionId,
            ID.unique(), 
            { user: userId, post: postId }
        )

        if (!savepost) throw Error
        return savepost
    }catch(e){
        console.log(`${e} from when post couldnt be saved`)
    }
}

export async function unsavePost( savedRecId:string) {
    try{
        const unsavepost = await db.deleteDocument(
            appwriteConfig.dbId,
            appwriteConfig.savessCollectionId,
            savedRecId
        )
        if (!unsavepost) throw Error
        return {status : "Ok"}
    }catch(e){
        console.log(`${e} from when post couldn't be unsaved`)
    }
    
}


/*
  $id is a property of appwrite 
  Error is a javascript object that represents any errors generated
*/