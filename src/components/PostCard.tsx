import Image from "next/image";
import Link from "next/link";
import type { Post } from "../types";

export default function PostCard(post: Post) {
  return (
    <Link
      href={`/post/${post.slug}`}
      className="block border rounded-lg p-4 hover:shadow-lg transition-shadow duration-200"
    >
      {post.image_url && (
        <Image
          src={post.image_url}
          alt={post.title}
          width={500}
          height={300}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}

      <div className="flex flex-wrap gap-2 mb-2">
        {post.tags?.map((tag) => (
          <Link
            key={tag}
            href={`/tags/${tag}`}
            className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full hover:bg-blue-200"
          >
            {tag}
          </Link>
        ))}
      </div>

      <h2 className="text-xl font-bold">{post.title}</h2>
    </Link>
  );
}
