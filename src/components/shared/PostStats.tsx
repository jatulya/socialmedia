import { useGetCurrUser } from "@/lib/react-query/queries"
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

  return (
    <div>
    </div>
  )
}

export default PostStats
