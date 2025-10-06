type Author = {
  name: string;
  picture_url: string | null;
  bio: string | null;
};

export default function AuthorBio({ author }: { author: Author }) {
  if (!author) return null;

  return (
    <div className="not-prose mt-12 border-t border-gray-200 pt-8 flex items-center gap-4">
      <img
        src={author.picture_url || "https://i.pravatar.cc/150"}
        alt={author.name}
        className="w-20 h-20 rounded-full object-cover"
      />
      <div>
        <h3 className="text-xl font-bold">{author.name}</h3>
        <p className="text-gray-600 mt-1">{author.bio}</p>
      </div>
    </div>
  );
}
