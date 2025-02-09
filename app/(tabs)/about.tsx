import { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { Text, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function EditingScreen() {
  const [storageData, setStorageData] = useState<{ [key: string]: string }>({});
  const [refreshing, setRefreshing] = useState(false);

  const getAllStorageData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const items = await AsyncStorage.multiGet(keys);
      const data: { [key: string]: string } = {};
      items.forEach(([key, value]) => {
        data[key] = value || '';
      });
      setStorageData(data);
    } catch (error) {
      console.error('Error getting storage data:', error);
    }
  };

  const clearAllStorageData = async () => {
    try {
      await AsyncStorage.clear();
      setStorageData({});
    } catch (error) {
      console.error('Error clearing storage:', error);
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
      <Stack.Screen
        options={{
          title: '編集',
          headerRight: () => (
            <Button
              mode="contained-tonal"
              onPress={clearAllStorageData}
              style={styles.clearButton}
            >
              クリア
            </Button>
          ),
        }}
      />
      <View style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="storage" size={24} color="#666" />
            <Text variant="titleLarge" style={styles.sectionTitle}>
              ストレージの状態
            </Text>
          </View>
          {Object.entries(storageData).length > 0 ? (
            Object.entries(storageData).map(([key, value]) => {
              // JSONとして解析可能な場合は整形して表示
              let formattedValue = value;
              try {
                const parsedValue = JSON.parse(value);
                formattedValue = JSON.stringify(parsedValue, null, 2);
              } catch {
                // JSON解析に失敗した場合は元の値をそのまま使用
              }

              return (
                <View key={key} style={styles.storageItem}>
                  <Text variant="titleMedium" style={styles.storageKey}>
                    {key}
                  </Text>
                  <Text variant="bodyMedium" style={[styles.storageValue, styles.preformatted]}>
                    {formattedValue}
                  </Text>
                </View>
              );
            })
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
  clearButton: {
    marginRight: 8,
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
