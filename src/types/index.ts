export type Author = {
  name: string;
  picture_url: string | null;
  bio: string | null;
};

export type Post = {
  id: number;
  created_at: string;
  title: string;
  content: string | null;
  status: string;
  image_url: string | null;
  tags: string[] | null;
  slug: string;
  author_id: number | null;
  authors: Author | null;
};
