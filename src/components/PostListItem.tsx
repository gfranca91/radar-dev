import Link from "next/link";

type Post = {
  id: number;
  slug: string;
  title: string;
  image_url: string | null;
};

export default function PostListItem({ id, slug, title, image_url }: Post) {
  return (
    <Link href={`/post/${slug}`} className="flex items-center gap-4 group">
      <div className="w-1/3">
        <img
          src={image_url || "https://placehold.co/400x300"}
          alt={title}
          className="rounded-lg object-cover aspect-video"
        />
      </div>

      <div className="w-2/3">
        <h3 className="text-lg font-bold group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
      </div>
    </Link>
  );
}
