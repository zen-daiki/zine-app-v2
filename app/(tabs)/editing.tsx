import { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Pressable, Alert, Text } from 'react-native';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@saved_images';

type SavedImage = {
  id: string;
  imageUri: string;
  emoji?: any;
  createdAt: string;
};

export default function EditingScreen() {
  const [savedImages, setSavedImages] = useState<SavedImage[]>([]);

  const loadSavedImages = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      const data = jsonValue ? JSON.parse(jsonValue) : [];
      setSavedImages(data.sort((a: SavedImage, b: SavedImage) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (error) {
      console.error('Error loading saved images:', error);
    }
  };

  useEffect(() => {
    loadSavedImages();
  }, []);

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

  const handleDelete = (id: string) => {
    Alert.alert(
      '画像の削除',
      'この画像を削除してもよろしいですか？',
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
              const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
              if (jsonValue) {
                const data = JSON.parse(jsonValue);
                const filteredData = data.filter((item: SavedImage) => item.id !== id);
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredData));
                setSavedImages(filteredData.sort((a: SavedImage, b: SavedImage) => 
                  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                ));
              }
            } catch (error) {
              console.error('Error deleting image:', error);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={savedImages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item.imageUri }}
                style={styles.image}
                contentFit="cover"
                transition={200}
              />
              {item.emoji && (
                <Image
                  source={item.emoji}
                  style={styles.emoji}
                  contentFit="contain"
                  transition={200}
                />
              )}
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.dateText}>
                {formatDateTime(item.createdAt)}
              </Text>
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
              保存された画像はありません
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
  emoji: {
    position: 'absolute',
    width: '30%',
    height: '30%',
    top: '35%',
    left: '35%',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  dateText: {
    color: '#fff',
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: '#ff0000',
    padding: 8,
    borderRadius: 4,
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
    padding: 20,
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
