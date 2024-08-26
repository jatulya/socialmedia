import { GridPostProps } from "@/types/Interfaces"
import { Link } from "react-router-dom";
import { PostStats } from "@/components/shared";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

const GridPostList = ({posts, showUser = true, showStats = true} : GridPostProps) => {
  const {user} = useContext(AuthContext)

  return (
    <ul className="grid-container">
      {posts.map((post) => (
        <li key={post.$id} className="relative min-w-80 h-80">
          <Link to={`/posts/${post.$id}`} className="grid-post_link">
            <img
              src={post.imageURL}
              alt="post"
              className="h-full w-full object-cover"
            />
          </Link>

          <div className="grid-post_user">
            {showUser && (
              <div className="flex items-center justify-start gap-2 flex-1">
                <img
                  src={
                    post.creator.imageUrl ||
                    "/assets/icons/profile.png"
                  }
                  alt="creator"
                  className="w-8 h-8 rounded-full"
                />
                <p className="line-clamp-1">{post.creator.name}</p>
              </div>
            )}
            {showStats && <PostStats post={post} userId={user.id} />}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default GridPostList
