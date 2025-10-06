import Link from "next/link";

type Post = {
  id: number;
  slug: string;
  title: string;
};

type SidebarProps = {
  posts: Post[];
};

export default function Sidebar({ posts }: SidebarProps) {
  const recentPosts = posts.slice(0, 5);

  return (
    <aside className="w-full md:w-1/3">
      <h2 className="text-2xl font-bold border-b-2 border-gray-800 pb-2 mb-6">
        Mais Recentes
      </h2>
      <div className="flex flex-col space-y-4">
        {recentPosts.map((post) => (
          <Link
            key={post.id}
            href={`/post/${post.slug}`}
            className="border-b border-gray-200 pb-2 hover:text-blue-600 transition-colors"
          >
            {post.title}
          </Link>
        ))}
      </div>
    </aside>
  );
}
