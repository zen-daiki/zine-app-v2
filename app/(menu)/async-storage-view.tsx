import { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Pressable, Alert, Text } from 'react-native';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSavedImages, deleteImage, deleteAllImages, type SavedImage } from '@/libs/storage';

const TEST_IMAGES = [
  {
    imageUri: 'https://picsum.photos/320/440?random=1',
    emoji: require('@/assets/images/emoji1.png'),
  },
  {
    imageUri: 'https://picsum.photos/320/440?random=2',
    emoji: require('@/assets/images/emoji2.png'),
  },
];

export default function AsyncStorageViewScreen() {
  const [savedImages, setSavedImages] = useState<SavedImage[]>([]);

  const loadSavedImages = async () => {
    const images = await getSavedImages();
    setSavedImages(images.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  };

  useEffect(() => {
    loadSavedImages();
  }, []);

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
            await deleteImage(id);
            await loadSavedImages();
          },
        },
      ],
    );
  };

  const handleAddTestData = async () => {
    try {
      const existingData = await getSavedImages();
      const newData = TEST_IMAGES.map((item, index) => ({
        id: `test-${Date.now()}-${index}`,
        imageUri: item.imageUri,
        emoji: item.emoji,
        createdAt: new Date(Date.now() - index * 60000).toISOString(), // 1分ずつ時間をずらす
      }));
      
      await AsyncStorage.setItem('saved_images', JSON.stringify([...existingData, ...newData]));
      await loadSavedImages();
      Alert.alert('成功', 'テストデータを追加しました');
    } catch (error) {
      console.error('テストデータの追加に失敗:', error);
      Alert.alert('エラー', 'テストデータの追加に失敗しました');
    }
  };

  const handleDeleteAllData = () => {
    Alert.alert(
      '全データ削除',
      '保存されている全ての画像を削除してもよろしいですか？',
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
              await deleteAllImages();
              await loadSavedImages();
              Alert.alert('成功', '全てのデータを削除しました');
            } catch (error) {
              console.error('データの削除に失敗:', error);
              Alert.alert('エラー', 'データの削除に失敗しました');
            }
          },
        },
      ],
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, styles.addButton]}
          onPress={handleAddTestData}
        >
          <Text style={styles.buttonText}>テストデータ追加</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.deleteButton]}
          onPress={handleDeleteAllData}
        >
          <Text style={styles.buttonText}>全データ削除</Text>
        </Pressable>
      </View>
      {savedImages.length > 0 ? (
        <FlatList
          data={savedImages}
          renderItem={({ item }) => (
            <Pressable
              style={styles.imageContainer}
              onLongPress={() => handleDelete(item.id)}
            >
              <Image
                source={{ uri: item.imageUri }}
                style={styles.image}
                contentFit="cover"
              />
              {item.emoji && (
                <Image
                  source={item.emoji}
                  style={styles.emoji}
                  contentFit="contain"
                />
              )}
              <Text style={styles.dateText}>
                {formatDate(item.createdAt)}
              </Text>
            </Pressable>
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            保存された画像はありません
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#2f3437',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 120,
  },
  addButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  list: {
    padding: 10,
  },
  imageContainer: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#2f3437',
  },
  image: {
    width: '100%',
    aspectRatio: 320/440,
  },
  emoji: {
    position: 'absolute',
    width: 40,
    height: 40,
    right: 10,
    bottom: 30,
  },
  dateText: {
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
    padding: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#ffffff',
  },
});
