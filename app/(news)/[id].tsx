import { useLocalSearchParams, Stack } from 'expo-router';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { formatDate } from '@/utils/date';
import { useEffect, useState } from 'react';
import { getNewsById } from '@/libs/microcms';
import type { NewsItem } from '@/types/news';

export default function NewsDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        if (id) {
          const data = await getNewsById(id);
          setNewsItem(data);
        }
      } catch (error) {
        console.error('ニュースの取得に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!newsItem) {
    return (
      <View style={styles.container}>
        <Text>お知らせが見つかりませんでした。</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'お知らせ',
          headerStyle: {
            backgroundColor: '#25292e',
          },
          headerTintColor: '#fff',
        }} 
      />
      <ScrollView style={styles.content}>
        <View style={styles.metaData}>
          <Text style={styles.date}>{formatDate(newsItem.createdAt)}</Text>
          <Text style={styles.category}>{newsItem.category.name}</Text>
        </View>
        <Text style={styles.title}>{newsItem.title}</Text>
        <Text style={styles.body}>{newsItem.body}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  metaData: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginRight: 10,
  },
  category: {
    fontSize: 14,
    color: '#666',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
});
