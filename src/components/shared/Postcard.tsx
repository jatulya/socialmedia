import { Models } from 'appwrite'
import { Link } from 'react-router-dom'

const Postcard = ({post} : {post : Models.Document}) => {

    if (!post.creator) return;

  return (
    <div >
      <Link to={`/profile/${post.creator.$id}`}>
        <img src={ post.creator?.imageURL ||
                "/assets/icons/profile.png"
              }
              alt="creator"
              className="w-12 lg:h-12 rounded-full"
            />
      </Link> 
      <p className="base-medium lg:body-bold text-light-1">
              {post.creator?.name}
      </p>
    </div>
  )
}

export default Postcard
