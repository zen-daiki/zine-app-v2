import { useState, useCallback } from 'react';
import { StyleSheet, View, FlatList, Pressable, Alert, Text, RefreshControl } from 'react-native';
import { Image } from 'expo-image';
import { useFocusEffect } from 'expo-router';
import { getSavedBooks, deleteBook, type SavedBook } from '@/libs/storage';

export default function EditingScreen() {
  const [savedBooks, setSavedBooks] = useState<SavedBook[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadSavedBooks = async () => {
    try {
      const books = await getSavedBooks();
      setSavedBooks(books.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (error) {
      console.error('保存された本の読み込みに失敗しました:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadSavedBooks();
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSavedBooks();
    }, [])
  );

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      '本の削除',
      'この本を削除してもよろしいですか？',
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBook(id);
              await loadSavedBooks();
            } catch (error) {
              console.error('本の削除に失敗しました:', error);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={savedBooks}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FFFFFF"
            colors={['#FFFFFF']}
          />
        }
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item.cover.imageUrl }}
                style={styles.image}
                contentFit="cover"
                transition={200}
              />
            </View>
            <View style={styles.textContainer}>
              <View>
                <Text style={styles.titleText} numberOfLines={1}>
                  {item.cover.title}
                </Text>
                {item.cover.subtitle && (
                  <Text style={styles.subtitleText} numberOfLines={1}>
                    {item.cover.subtitle}
                  </Text>
                )}
                <Text style={styles.dateText}>
                  {formatDateTime(item.createdAt)}
                </Text>
              </View>
              <Pressable style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteButtonText}>削除</Text>
              </Pressable>
            </View>
          </View>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              編集中のZINEはありません
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  list: {
    padding: 4,
    minHeight: '100%',
  },
  itemContainer: {
    flex: 1,
    margin: 4,
    flexDirection: 'row',
    backgroundColor: '#2d3238',
    borderRadius: 10,
    padding: 8,
  },
  imageContainer: {
    width: 80,
    aspectRatio: 320/440,
    borderRadius: 6,
    overflow: 'hidden',
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  titleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitleText: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 4,
  },
  dateText: {
    color: '#999',
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: '#ff0000',
    padding: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 600,
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
  },
});
