import { Models } from "appwrite";
import React from "react";

export type INavLink = {
    imgURL: string;
    route: string;
    label: string;
  };
  
  export type IUpdateUser = {
    userId: string;
    name: string;
    bio: string;
    imageId: string;
    imageUrl: URL | string;
    file: File[];
  };
  
  export type INewPost = {
    userId: string;
    caption: string;
    file: File[];
    location?: string;
    tags?: string;
  };
  
  export type IUpdatePost = {
    postId: string;
    caption: string;
    imageId: string;
    imageUrl: URL;
    file: File[];
    location?: string;
    tags?: string;
  };
  
  export type IUser = {
    id: string;
    name: string;
    username: string;
    email: string;
    imageUrl: string;
    bio: string;
  };
  
  export type INewUser = {
    name: string;
    email: string;
    username: string;
    password: string;
  };

  export type IContextType = {
    user: IUser;
    isLoading: boolean,
    isAuthenticated: boolean,
    setUser: React.Dispatch<React.SetStateAction<IUser>>;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>,
    checkAuthUser: () => Promise<boolean>,
  }

  export type PostFormProps = {
    post?: Models.Document; //? => this field is optional
    action: "Create" | "Update";
  };

  export type PostStatsProps = {
    post: Models.Document;
    userId: string;
  }

  export type GridPostProps = {
    posts: Models.Document[];
    showUser?: boolean;
    showStats?: boolean,
  }

  export type StabBlockProps = {
    value: string | number;
    label: string;
  }
  
  /*models contain many ts interfaces and types that represent the datamodels used by appwrite. these 
  models define the structure of data returned by appwrite's endpoints
  eg. User,
  export type Document = {
    $id: string;
    $collectionId: string;
    $databaseId: string;
    $createdAt: string;
    $updatedAt: string;
    [key: string]: any; // For additional custom fields
  }; 
  */