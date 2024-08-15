import { useGetCurrUser } from "@/lib/react-query/queries"
import { checkIsLiked } from "@/lib/utils"
import { PostStatsProps } from "@/types/Interfaces"
import { Models } from "appwrite"
import { useState } from "react"
import { useLocation } from "react-router-dom"

const PostStats = ({post, userId} : PostStatsProps) => {
  const loc = useLocation() //url location, not geographical
  //gets the id of the people who liked the post
  const likeslist = post.likes.map((user: Models.Document) => user.$id)
  
  const [likes, setLikes] = useState<string[]>(likeslist)
  const [isSaved, setIsSaved] = useState<boolean>(false)

  const {data: currUser} = useGetCurrUser()

  const savedPostRec = currUser?.save.find(
    (record: Models.Document) => record.post.$id ===post.$id
  )

  const handleLikePost = (e : React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    //<> event is of type mouse event on an image
    e.stopPropagation() //only the specific event handler is triggered
    
    let likesarray = [...likes]

    if (likesarray.includes(userId)){
      likesarray = likesarray.filter((id) => id !== userId)
      //if user already liked it, unlikes it
    }else{
      likesarray.push(userId) //user name added to likes list
    }

    setLikes(likesarray)
    //likePost({postId: post.$id, likesarray})
  }

  const handleSavePost = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.stopPropagation()

  }

  const containerStyles = location.pathname.startsWith('/profile')
  ? "w-full" : "";

  return (
    <div
      className={`flex justify-between items-center z-20 ${containerStyles}`}>
      <div className="flex gap-2 mr-5">
        <img
          src={`${
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }`}
          alt="like"
          width={20}
          height={20}
          onClick={(e) => handleLikePost(e)}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>

      <div className="flex gap-2">
        <img
          src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
          alt="share"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={(e) => handleSavePost(e)}
        />
      </div>
    </div>
  );
}

export default PostStats
