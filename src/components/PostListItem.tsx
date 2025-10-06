import Link from "next/link";

type Post = {
  id: number;
  slug: string;
  title: string;
  image_url: string | null;
  tags: string[] | null;
};

export default function PostListItem({
  id,
  slug,
  title,
  image_url,
  tags,
}: Post) {
  return (
    <div className="flex gap-4">
      <div className="w-1/3">
        <Link href={`/post/${slug}`}>
          <img
            src={image_url || "https://placehold.co/400x300"}
            alt={title}
            className="rounded-lg object-cover aspect-video"
          />
        </Link>
      </div>

      <div className="w-2/3">
        <div className="flex flex-wrap gap-2 mb-2">
          {tags?.slice(0, 2).map((tag) => (
            <Link
              key={tag}
              href={`/tags/${tag}`}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              #{tag}
            </Link>
          ))}
        </div>
        <Link href={`/post/${slug}`}>
          <h3 className="text-lg font-bold hover:text-blue-600 transition-colors">
            {title}
          </h3>
        </Link>
      </div>
    </div>
  );
}
