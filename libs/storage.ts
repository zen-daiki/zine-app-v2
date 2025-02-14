import AsyncStorage from '@react-native-async-storage/async-storage';
import { type ImageSource } from 'expo-image';

export interface SavedImage {
  id: string;
  imageUri: string;
  emoji?: ImageSource;
  createdAt: string;
}

const STORAGE_KEY = 'saved_images';

export const TEST_IMAGES = [
  {
    id: '1',
    imageUri: 'https://picsum.photos/320/440?random=1',
    emoji: require('@/assets/images/emoji2.png'),
    createdAt: new Date().toISOString(),
  },
];

export const saveImage = async (imageData: Omit<SavedImage, 'id' | 'createdAt'>) => {
  try {
    // 既存のデータを取得
    const existingData = await getSavedImages();
    
    // 新しいデータを作成
    const newImage: SavedImage = {
      id: Date.now().toString(),
      imageUri: imageData.imageUri,
      emoji: imageData.emoji,
      createdAt: new Date().toISOString(),
    };

    // データを追加
    const updatedData = [...existingData, newImage];
    
    // 保存
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    
    return newImage;
  } catch (error) {
    console.error('画像の保存に失敗しました:', error);
    throw error;
  }
};

export const getSavedImages = async (): Promise<SavedImage[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('保存された画像の取得に失敗しました:', error);
    return [];
  }
};

export const getAllStorageData = async (): Promise<SavedImage[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error getting storage data:', error);
    return [];
  }
};

export const deleteImage = async (id: string) => {
  try {
    const existingData = await getSavedImages();
    const updatedData = existingData.filter(item => item.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.error('画像の削除に失敗しました:', error);
    throw error;
  }
};

export const deleteAllImages = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to delete all images:', error);
    throw error;
  }
};

export const clearAllStorageData = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
};

export const handleAddTestData = async (existingData: SavedImage[]): Promise<SavedImage[]> => {
  try {
    const lastId = existingData.length > 0 
      ? Math.max(...existingData.map(item => parseInt(item.id))) 
      : 0;

    const newData = TEST_IMAGES.map((item, index) => ({
      ...item,
      id: (lastId + index + 1).toString(),
      createdAt: new Date().toISOString(),
    }));

    const updatedData = [...existingData, ...newData];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    return updatedData;
  } catch (error) {
    console.error('Error adding test data:', error);
    throw error;
  }
};

export const createEmptyImage = async (): Promise<SavedImage> => {
  try {
    const existingData = await getSavedImages();
    
    const newImage: SavedImage = {
      id: Date.now().toString(),
      imageUri: '',
      createdAt: new Date().toISOString(),
    };

    const updatedData = [...existingData, newImage];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    return newImage;
  } catch (error) {
    console.error('新規画像データの作成に失敗しました:', error);
    throw error;
  }
};