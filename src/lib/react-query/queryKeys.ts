export enum QUERY_KEYS {
    // AUTH KEYS
    CREATE_USER_ACCOUNT = "createUserAccount",
  
    // USER KEYS
    GET_CURRENT_USER = "getCurrentUser",
    GET_USERS = "getUsers",
    GET_USER_BY_ID = "getUserById",
  
    // POST KEYS
    GET_POSTS = "getPosts",
    GET_INFINITE_POSTS = "getInfinitePosts",
    GET_RECENT_POSTS = "getRecentPosts",
    GET_POST_BY_ID = "getPostById",
    GET_USER_POSTS = "getUserPosts",
    GET_FILE_PREVIEW = "getFileUrl",
  
    //  SEARCH KEYS
    SEARCH_POSTS = "getSearchPosts",
  }

/*this is used for easy access for caching. All these represent cache keys
enums can also be used as enum keys{ Red, Yellow, Blue } or given explicit values to them. Enum defines a set of named values 
*/