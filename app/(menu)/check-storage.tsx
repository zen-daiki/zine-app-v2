import { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { Text, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

const STORAGE_KEY = '@saved_images';

const TEST_IMAGES = [
  {
    id: '1',
    imageUri: 'https://picsum.photos/320/440?random=1',
    emoji: require('@/assets/images/emoji2.png'),
    createdAt: new Date().toISOString(),
  },
];

export default function AsyncStorageViewScreen() {
  const [storageData, setStorageData] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const getAllStorageData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      const data = jsonValue ? JSON.parse(jsonValue) : [];
      setStorageData(data);
    } catch (error) {
      console.error('Error getting storage data:', error);
    }
  };

  const clearAllStorageData = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      setStorageData([]);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  };

  const handleAddTestData = async () => {
    try {
      // 既存のデータを取得
      const existingData = storageData;
      
      // 新しいデータを作成（IDは既存データの最後のID + 1）
      const lastId = existingData.length > 0 
        ? Math.max(...existingData.map(item => parseInt(item.id))) 
        : 0;

      const newData = TEST_IMAGES.map((item, index) => ({
        ...item,
        id: (lastId + index + 1).toString(),
        createdAt: new Date().toISOString(),
      }));

      // 既存のデータと新しいデータを結合
      const updatedData = [...existingData, ...newData];
      
      // 更新したデータを保存
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      setStorageData(updatedData);
    } catch (error) {
      console.error('Error adding test data:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getAllStorageData();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    getAllStorageData();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.content}>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleAddTestData}
            style={styles.addButton}
          >
            テストデータを追加
          </Button>
          <Button
            mode="contained-tonal"
            onPress={clearAllStorageData}
            style={styles.clearButton}
          >
            ストレージをクリア
          </Button>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="storage" size={24} color="#666" />
            <Text variant="titleLarge" style={styles.sectionTitle}>
              ストレージの状態
            </Text>
          </View>

          {storageData.length > 0 ? (
            <View style={styles.storageItem}>
              <Text variant="bodyMedium" style={[styles.storageValue, styles.preformatted]}>
                {JSON.stringify(storageData, null, 2)}
              </Text>
            </View>
          ) : (
            <Text variant="bodyMedium" style={styles.emptyMessage}>
              ストレージは空です
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: '#2d3238',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#fff',
    marginLeft: 8,
  },
  description: {
    color: '#ddd',
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#f44336',
  },
  addButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
  },
  storageItem: {
    backgroundColor: '#363b42',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  storageKey: {
    color: '#fff',
    marginBottom: 4,
  },
  storageValue: {
    color: '#ddd',
    fontFamily: 'monospace',
  },
  preformatted: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#1a1d20',
    borderRadius: 4,
  },
  emptyMessage: {
    color: '#ddd',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
