import { createClient } from "microcms-js-sdk";
import Constants from 'expo-constants';

import type {
  MicroCMSQueries,
  MicroCMSImage,
  MicroCMSDate,
} from "microcms-js-sdk";
import type { NewsItem } from '@/types/news';

export type BlogsType = {
  id: string;
  title: string;
  content: string;
  eyecatch: MicroCMSImage;
  category: CategoryType;
} & MicroCMSDate;

export type FaqType = {
  id: string;
  question: string;
  answer: string;
} & MicroCMSDate;


export type CategoryType = {
  id: string;
  name: string;
  eyecatch: MicroCMSImage;
} & MicroCMSDate;

const { microCmsServiceDomain, microCmsApiKey } = Constants.expoConfig?.extra || {};

if (!microCmsServiceDomain || !microCmsApiKey) {
  throw new Error("MICROCMS_SERVICE_DOMAIN and MICROCMS_API_KEY are required in app.config.js");
}

export const client = createClient({
  serviceDomain: microCmsServiceDomain,
  apiKey: microCmsApiKey,
});

export async function getEntryList<T>(
  slug: string,
  page: number = 1,
  paePage: number = 12
) {
  const PER_PAGE = paePage;
  return await client.getList<T>({
    endpoint: slug,
    queries: {
      limit: PER_PAGE,
      offset: PER_PAGE * (page - 1),
    },
  });
}

export async function getAllEntries(slug: string) {
  try {
    return await client.getAllContents({
      endpoint: slug,
    });
  } catch {
    return null;
  }
}

export async function getEntryIds(slug: string) {
  return client
    .getAllContentIds({
      endpoint: slug,
    })
    .then((ids) => ids || [])
    .catch(() => []);
}

export async function getEntryListByCategory<T>(slug: string, cate: string) {
  return await client.getList<T>({
    endpoint: slug,
    queries: {
      filters: `category[equals]${cate}`,
    },
  });
}

export async function getEntryDetail<T>(
  contentId: string,
  slug: string,
  searchParams?: { draft_key?: string }
) {
  try {
    const draftKey = searchParams?.draft_key ?? undefined;
    const response = await client.getListDetail<T>({
      endpoint: slug,
      contentId,
      queries: { draftKey: draftKey },
    });
    return response;
  } catch {
    return null;
  }
}

export async function getCategoryList(slug: string, queries?: MicroCMSQueries) {
  return await client.getList<CategoryType>({
    endpoint: slug,
  });
}

export async function getPrevId(slug: string, entryId: string) {
  try {
    const entryIds = await getEntryIds(slug);
    const index = entryIds.findIndex((postId) => postId === entryId);
    return entryIds[index + 1];
  } catch {
    return null;
  }
}

export async function getNextId(slug: string, entryId: string) {
  try {
    const entryIds = await getEntryIds(slug);
    const index = entryIds.findIndex((postId) => postId === entryId);
    return entryIds[index - 1];
  } catch {
    return null;
  }
}

export const getNewsById = async (id: string): Promise<NewsItem> => {
  const response = await client.get({
    endpoint: 'blogs',
    contentId: id,
  });
  return response;
};
