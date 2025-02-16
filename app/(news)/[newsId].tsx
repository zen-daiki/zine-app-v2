import { useLocalSearchParams, Stack, router } from 'expo-router';
import { View, StyleSheet, ScrollView, Text, Pressable } from 'react-native';
import { formatDate } from '@/utils/date';
import { useEffect, useState } from 'react';
import { getBlogsById } from '@/libs/microcms';
import type { BlogsType } from '@/libs/microcms';
import { Ionicons } from '@expo/vector-icons';
import { Loading } from '@/components/Loading';
import { NotFoundEntry } from '@/components/NotFoundEntry';
import HTMLView from 'react-native-htmlview';

export default function NewsDetailScreen() {
  const { newsId } = useLocalSearchParams();
  const [news, setNews] = useState<BlogsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getBlogsById(newsId as string);
        setNews(data);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [newsId]);

  if (isLoading) return <Loading />;

  if (!news) return <NotFoundEntry />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>お知らせ</Text>
        </View>
      </View>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.contentContainer}>
          <Text style={styles.date}>{formatDate(news.createdAt)}</Text>
          <Text style={styles.title}>{news.title}</Text>
          <HTMLView
            value={news.content}
            stylesheet={{
              p: styles.body,
              a: styles.link,
              ul: styles.list,
              li: styles.listItem,
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    marginRight: 16,
  },
  contentContainer: {
    padding: 16,
  },
  date: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  body: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  link: {
    color: '#4a9eff',
    textDecorationLine: 'underline',
  },
  list: {
    marginVertical: 8,
  },
  listItem: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    marginLeft: 16,
  },
});
