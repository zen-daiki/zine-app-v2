
import { Text, View, StyleSheet, FlatList } from 'react-native';
import { useMicroCMS } from '../../hooks/useMicroCMS';
import type { BlogsType } from '../../libs/microcms';
import { Loading } from '../../components/Loading';
import { ErrorMessage } from '../../components/ErrorMessage';

export default function NewsScreen() {
  const { data: blogs, loading, error } = useMicroCMS<BlogsType>('blogs');

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={blogs}
        renderItem={({ item }) => (
          <View style={styles.blogItem}>
            <View style={styles.blogContent}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.category}>{item.category.name}</Text>
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
    padding: 16,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  category: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 4,
  },
});
