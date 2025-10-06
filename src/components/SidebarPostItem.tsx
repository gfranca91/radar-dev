import Link from "next/link";

type Post = {
  id: number;
  slug: string;
  title: string;
  image_url: string | null;
};

export default function SidebarPostItem({ id, slug, title, image_url }: Post) {
  return (
    <Link href={`/post/${slug}`} className="flex items-center gap-3 group">
      <div className="flex-shrink-0">
        <img
          src={image_url || "https://placehold.co/150"}
          alt={title}
          className="rounded-md object-cover w-20 h-20"
        />
      </div>

      <div>
        <h4 className="font-semibold group-hover:text-blue-600 transition-colors">
          {title}
        </h4>
      </div>
    </Link>
  );
}
