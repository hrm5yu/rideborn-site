export type Post = {
  id: string;
  title: string;
  slug: string;
  thumbnail?: { url: string; width?: number; height?: number };
  body?: string; // rich editor (HTML)
};

export type MuseumItem = {
  id: string;
  title: string;
  slug: string;
  image?: { url: string; width?: number; height?: number };
};

export type MicroCMSList<T> = {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
};
