import AsyncStorage from '@react-native-async-storage/async-storage';
import { type ImageSource } from 'expo-image';

export interface SavedImage {
  id: string;
  imageUri: string;
  emoji?: ImageSource;
  createdAt: string;
}

const STORAGE_KEY = 'saved_images';

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
