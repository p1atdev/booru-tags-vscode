import { writeFile } from "node:fs/promises";
import { SearchQuery, TagCategory, TagItem } from "../types/tags";
import { CONSTANT } from "../constant";

const DANBOORU_TAGS_URL = "https://danbooru.donmai.us/tags.json";

// https://danbooru.donmai.us/tags.json?search[hide_empty]=yes&search[is_deprecated]=no&search[order]=count

const AVAILABLE_GENERAL_TAGS_SEARCH_QUERY: SearchQuery = {
  search: {
    hide_empty: "yes",
    is_deprecated: "no",
    order: "count",
    category: TagCategory.general,
  },
};

const AVAILABLE_CHARACTER_TAGS_SEARCH_QUERY: SearchQuery = {
  search: {
    hide_empty: "yes",
    is_deprecated: "no",
    order: "count",
    category: TagCategory.character,
  },
};

const AVAILABLE_COPYRIGHT_TAGS_SEARCH_QUERY: SearchQuery = {
  search: {
    hide_empty: "yes",
    is_deprecated: "no",
    order: "count",
    category: TagCategory.copyright,
  },
};

const AVAILABLE_ARTIST_TAGS_SEARCH_QUERY: SearchQuery = {
  search: {
    hide_empty: "yes",
    is_deprecated: "no",
    order: "count",
    category: TagCategory.artist,
  },
};

const AVAILABLE_META_TAGS_SEARCH_QUERY: SearchQuery = {
  search: {
    hide_empty: "yes",
    is_deprecated: "no",
    order: "count",
    category: TagCategory.meta,
  },
};

async function fetchTags(query: SearchQuery): Promise<TagItem[]> {
  const url = new URL(DANBOORU_TAGS_URL);

  for (const [key, value] of Object.entries(query)) {
    switch (key) {
      case "search": {
        for (const [searchKey, searchValue] of Object.entries(value)) {
          if (searchValue !== undefined && searchValue !== null) {
            url.searchParams.append(
              `search[${searchKey}]`,
              String(searchValue)
            );
          }
        }
        break;
      }
      case "page": {
        url.searchParams.append("page", String(value));
        break;
      }
      case "commit": {
        url.searchParams.append("commit", String(value));
      }
      default: {
        break;
      }
    }
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } else if (response.status === 429) {
    await new Promise((resolve) => setTimeout(resolve, 3000)); // 3s
    return fetchTags(query);
  }

  const tags = await response.json();

  return tags as TagItem[];
}

async function searchTags(
  query: SearchQuery,
  threads: number
): Promise<TagItem[]> {
  const tags: TagItem[] = [];

  // page 1 ~ 1000
  const index = Array.from({ length: 1000 }, (_, i) => i + 1);

  const tasks: Promise<void>[] = [];

  const batchCount = Math.ceil(1000 / threads);

  for (let i = 0; i < threads; i++) {
    const batchIndex = (() => {
      if (i === threads - 1) {
        return index.slice(i * batchCount);
      } else {
        return index.slice(i * batchCount, (i + 1) * batchCount);
      }
    })();

    const processIndex = async () => {
      for (const page of batchIndex) {
        try {
          const result = await fetchTags({ ...query, page });
          if (result.length === 0) {
            break;
          }
          tags.push(...result);
        } catch (error) {
          console.error(error);
          break;
        }

        console.log(`page ${page} done. ${tags.length} tags found.`);
      }
    };

    tasks.push(processIndex());
  }

  await Promise.all(tasks);

  return tags;
}

// ---

async function fetchAndSaveTags(
  query: SearchQuery,
  threads: number,
  filename: string
) {
  const generalTags = await searchTags(query, threads);

  await writeFile(filename, JSON.stringify(generalTags));
}

async function main() {
  await fetchAndSaveTags(
    AVAILABLE_GENERAL_TAGS_SEARCH_QUERY,
    2,
    CONSTANT.GENERAL_TAGS_JSON_PATH
  );
  await fetchAndSaveTags(
    AVAILABLE_CHARACTER_TAGS_SEARCH_QUERY,
    2,
    CONSTANT.CHARACTER_TAGS_JSON_PATH
  );
  await fetchAndSaveTags(
    AVAILABLE_COPYRIGHT_TAGS_SEARCH_QUERY,
    2,
    CONSTANT.COPYRIGHT_TAGS_JSON_PATH
  );
  await fetchAndSaveTags(
    AVAILABLE_ARTIST_TAGS_SEARCH_QUERY,
    2,
    CONSTANT.ARTIST_TAGS_JSON_PATH
  );
  await fetchAndSaveTags(
    AVAILABLE_META_TAGS_SEARCH_QUERY,
    2,
    CONSTANT.META_TAGS_JSON_PATH
  );

  console.log("done.");
}

main();
