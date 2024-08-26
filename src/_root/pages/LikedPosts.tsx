import { GridPostList, Loader } from "@/components/shared";
import { useGetCurrUser } from "@/lib/react-query/queries";

const LikedPosts = () => {
  const { data: currentUser } = useGetCurrUser();

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <>
      {currentUser.liked.length === 0 && (
        <p className="text-light-4">No liked posts</p>
      )}

      <GridPostList posts={currentUser.liked} showStats={false} />
    </>
  );
};

export default LikedPosts;