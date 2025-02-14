import { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { getAllStorageData, clearAllStorageData, handleAddTestData, type SavedImage } from '@/libs/storage';

export default function AsyncStorageViewScreen() {
  const [storageData, setStorageData] = useState<SavedImage[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStorageData = async () => {
    try {
      const data = await getAllStorageData();
      setStorageData(data);
    } catch (error) {
      console.error('Error getting storage data:', error);
    }
  };

  const handleClearStorage = async () => {
    try {
      await clearAllStorageData();
      setStorageData([]);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  };

  const handleTestDataAdd = async () => {
    try {
      const updatedData = await handleAddTestData(storageData);
      setStorageData(updatedData);
    } catch (error) {
      console.error('Error adding test data:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchStorageData();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchStorageData();
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
            onPress={handleTestDataAdd}
            style={styles.addButton}
          >
            テストデータを追加
          </Button>
          <Button
            mode="contained-tonal"
            onPress={handleClearStorage}
            style={styles.clearButton}
          >
            ストレージをクリア
          </Button>
        </View>
        <View style={styles.section}>
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
