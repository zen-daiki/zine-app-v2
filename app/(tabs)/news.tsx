import { Text, View, StyleSheet, FlatList, Button } from 'react-native';
import { useMicroCMS } from '@/hooks/useMicroCMS';
import type { BlogsType } from '@/libs/microcms';
import { Loading } from '@/components/Loading';
import { ErrorMessage } from '@/components/ErrorMessage';

export default function NewsScreen() {
  const { data: blogs, loading, error } = useMicroCMS<BlogsType>('blogs');

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={blogs}
        renderItem={({ item }) => (
          <View style={styles.blogItem}>
            <View style={styles.blogContent}>
              <View style={styles.metaData}>
                <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
                <Text style={styles.category}>{item.category.name}</Text>
              </View>
              <Text style={styles.title}>{item.title}</Text>
            </View>
          </View>
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
    marginTop: 4,
  },
  category: {
    color: '#000',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 4,
    fontSize: 12,
  },
});
