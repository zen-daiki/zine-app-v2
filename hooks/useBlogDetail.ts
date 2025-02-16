import { useState, useEffect } from 'react';
import { getBlogsById } from '@/libs/microcms';
import type { BlogsType } from '@/libs/microcms';

export const useBlogDetail = (blogId: string) => {
  const [blog, setBlog] = useState<BlogsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await getBlogsById(blogId);
        setBlog(data);
      } catch (error) {
        setError(error as Error);
        console.error('Failed to fetch blog:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  return { blog, isLoading, error };
};
