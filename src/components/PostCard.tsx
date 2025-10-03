interface PostCardProps {
  title: string;
  image_url: string | null;
  tags: string[] | null;
}

export default function PostCard({ title, image_url, tags }: PostCardProps) {
  return (
    <div className="border rounded-lg p-4">
      {image_url && (
        <img
          src={image_url}
          alt={title}
          className="w-full h-48 object-cover rounded-t-lg mb-4"
        />
      )}

      <div className="flex flex-wrap gap-2 mb-2">
        {tags?.map((tag) => (
          <span
            key={tag}
            className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      <h2 className="text-xl font-bold">{title}</h2>
    </div>
  );
}
