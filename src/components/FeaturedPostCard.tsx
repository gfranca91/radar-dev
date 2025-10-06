import Link from "next/link";

type FeaturedPostCardProps = {
  post: {
    slug: string;
    title: string;
    image_url: string | null;
  };
  isMain?: boolean;
};

export default function FeaturedPostCard({
  post,
  isMain = false,
}: FeaturedPostCardProps) {
  return (
    <Link
      href={`/post/${post.slug}`}
      className="relative block w-full h-full rounded-lg overflow-hidden group"
    >
      <img
        src={post.image_url || "https://placehold.co/1200x600"}
        alt={post.title}
        className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)]"></div>

      <div className="relative flex flex-col justify-end h-full p-6 text-white">
        <h2 className={`font-bold ${isMain ? "text-3xl" : "text-xl"}`}>
          {post.title}
        </h2>
      </div>
    </Link>
  );
}
