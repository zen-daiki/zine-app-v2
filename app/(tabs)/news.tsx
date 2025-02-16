import { Text, View, StyleSheet, FlatList, Pressable } from 'react-native';
import { useMicroCMS } from '@/hooks/useMicroCMS';
import { Loading } from '@/components/Loading';
import { ErrorMessage } from '@/components/ErrorMessage';
import { router } from 'expo-router';
import { formatDate } from '@/utils/date';
import type { BlogsType } from '@/libs/microcms';

export default function NewsScreen() {
  const { data: blogs, loading, error } = useMicroCMS<BlogsType>('blogs');

  if (loading) return <Loading />;

  if (error) return <ErrorMessage message={error.message} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={blogs}
        renderItem={({ item }) => (
          <Pressable
            style={styles.blogItem}
            onPress={() => router.push({
              pathname: '/(news)/[newsId]',
              params: { newsId: item.id }
            })}
          >
            <View style={styles.blogContent}>
              <View style={styles.metaData}>
                <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
                <Text style={styles.category}>{item.category.name}</Text>
              </View>
              <Text style={styles.title}>{item.title}</Text>
            </View>
          </Pressable>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
  },
  listContainer: {
    padding: 16,
  },
  blogItem: {
    backgroundColor: '#2d3238',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  blogContent: {
    padding: 14,
  },
  metaData: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
  },
  dateText: {
    color: '#fff',
    fontSize: 12,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 6,
  },
  category: {
    color: '#000',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 4,
    fontSize: 12,
  },
});
