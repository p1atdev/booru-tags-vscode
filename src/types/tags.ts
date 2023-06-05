export interface TagItem {
  id: number;
  name: string;
  post_count: number;
  category: TagCategory;
  created_at: string;
  updated_at: string;
  is_deprecated: boolean;
  words: string[];
}

export enum TagCategory {
  general = 0,
  artist = 1,
  // unused
  copyright = 3,
  character = 4,
  meta = 5,
}

export interface SearchQuery {
  page?: number;
  commit?: string;
  search: {
    hide_empty?: "yes" | "no";
    order?: "count" | "newest" | "name";
    category?: TagCategory;
    has_artist?: "yes" | "no";
    has_wiki_page?: "yes" | "no";
    is_deprecated?: "yes" | "no";
  };
}
