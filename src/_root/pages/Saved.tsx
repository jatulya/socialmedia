import {GridPostList, Loader} from "@/components/shared"
import { useGetCurrUser } from "@/lib/react-query/queries"
import { Models } from "appwrite"

const Saved = () => {
  const {data: currUser} = useGetCurrUser()

  const savedPosts = currUser?.save.map(
    (savePost: Models.Document) => ({
      ...savePost.post, //keeps all attributes in post
      creator : { imageUrl : currUser.imageURL} //new attr added
    })
  ).reverse()

   return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/save.png"
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>

      {!currUser ? (
        <Loader />
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          {savedPosts.length === 0 ? (
            <p className="text-light-4">No available posts</p>
          ) : (
            <GridPostList posts={savedPosts} showStats={false} />
          )}
        </ul>
      )}
    </div>
  );
}

export default Saved
