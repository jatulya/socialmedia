import { Client, Account, Databases, Storage, Avatars } from "appwrite";

export const appwriteConfig = {
    projectId : import.meta.env.VITE_APPWRITE_PROJECT_ID,
    url : import.meta.env.VITE_APPWRITE_URL,
    dbId : import.meta.env.VITE_APPWRITE_DATABASE_ID,
    storageId :import.meta.env.VITE_APPWRITE_STORAGE_ID,
    usersCollectionId :import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
    postsCollectionId :import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID,
    savessCollectionId :import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID,
}

export const client = new Client()
client.setProject(appwriteConfig.projectId)
client.setEndpoint(appwriteConfig.url)

export const account = new Account(client)
export const db = new Databases(client)
export const storage = new Storage(client)
export const avatar = new Avatars(client)