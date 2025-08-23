export type Post = {
  id: string;
  title: string;
  slug: string;
  thumbnail?: { url: string; width?: number; height?: number };
  body?: string; // rich editor (HTML)
};

export type MicroCMSList<T> = {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
};
