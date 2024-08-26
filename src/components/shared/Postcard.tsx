import { AuthContext } from '@/context/AuthContext';
import { multiFormatDateString } from '@/lib/utils';
import { Models } from 'appwrite'
import { useContext } from 'react';
import { Link } from 'react-router-dom'
import PostStats from './PostStats';

const Postcard = ({post} : {post : Models.Document}) => {
  const {user} = useContext(AuthContext)
    if (!post.creator) return;
    console.log(post.creator)

    return (
      <div className="post-card">
        <div className="flex-between">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${post.creator.$id}`}>
              <img
                src={
                  post.creator?.imageURL ||
                  "/assets/icons/profile.png"
                }
                alt="creator"
                className="w-12 lg:h-12 rounded-full"
              />
            </Link>
  
            <div className="flex flex-col">
              <p className="base-medium lg:body-bold text-light-1">
                {post.creator.name}
              </p>
              <div className="flex-center gap-2 text-light-3">
                <p className="subtle-semibold lg:small-regular ">
                  {multiFormatDateString(post.$createdAt)}
                </p>
                •
                <p className="subtle-semibold lg:small-regular">
                  {post.location}
                </p>
              </div>
            </div>
          </div>
  
          <Link
            to={`/update-post/${post.$id}`}
            className={`${user.id !== post.creator.$id && "hidden"}`}>
            <img
              src={"/assets/icons/edit.png"}
              alt="edit"
              width={20}
              height={20}
            />
          </Link>
        </div>
  
        <Link to={`/posts/${post.$id}`}>
          <div className="small-medium lg:base-medium py-5">
            <p>{post.caption}</p>
            <ul className="flex gap-1 mt-2">
              {post.Tags.map((tag: string, index: string) => (
                <li key={`${tag}${index}`} className="text-light-3 small-regular">
                  #{tag}
                </li>
              ))}
            </ul>
          </div>
          <img
            src={post.imageURL || "/assets/icons/profile.png"}
            alt="post image"
            className="post-card_img"
          />
        
        </Link>
  
        <PostStats post={post} userId={user.id} />
      </div>
    );
}

export default Postcard
