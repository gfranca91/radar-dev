import Link from "next/link";
import Image from "next/image";
import type { Post } from "../types";

export default function SidebarPostItem(post: Post) {
  return (
    <Link href={`/post/${post.slug}`} className="flex items-center gap-3 group">
      <div className="flex-shrink-0">
        <Image
          src={post.image_url || "https://placehold.co/150"}
          alt={post.title}
          width={80}
          height={80}
          className="rounded-md object-cover w-20 h-20"
          unoptimized
        />
      </div>

      <div>
        <h4 className="font-semibold group-hover:text-blue-600 transition-colors">
          {post.title}
        </h4>
      </div>
    </Link>
  );
}
