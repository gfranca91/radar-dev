import SidebarPostItem from "./SidebarPostItem";
import type { Post } from "../types";

type SidebarProps = {
  posts: Post[];
};

export default function Sidebar({ posts }: SidebarProps) {
  const recentPosts = posts.slice(0, 4);

  return (
    <aside className="w-full md:w-1/3">
      <h2 className="text-2xl font-bold border-b-2 border-gray-800 pb-2 mb-6">
        Mais Recentes
      </h2>
      <div className="flex flex-col space-y-6">
        {recentPosts.map((post) => (
          <SidebarPostItem key={post.id} {...post} />
        ))}
      </div>
    </aside>
  );
}
