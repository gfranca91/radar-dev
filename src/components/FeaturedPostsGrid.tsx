import FeaturedPostCard from "./FeaturedPostCard";
import type { Post } from "../types";

type FeaturedPostsGridProps = {
  mainPost: Post;
  secondaryPosts: Post[];
};

export default function FeaturedPostsGrid({
  mainPost,
  secondaryPosts,
}: FeaturedPostsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-4 h-[300px] md:h-[500px] mb-8">
      <div className="md:col-span-1 md:row-span-2">
        <FeaturedPostCard post={mainPost} isMain={true} />
      </div>

      {secondaryPosts.map((post) => (
        <div key={post.id}>
          <FeaturedPostCard post={post} />
        </div>
      ))}
    </div>
  );
}
