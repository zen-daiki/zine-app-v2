import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SavedBook {
  id: number;
  createdAt: string;
  size: string;
  cover: {
    color: string;
    imageUrl: string;
    title: string;
    subtitle: string;
  };
  pages: {
    layout: string;
    content: {
      img: string;
      text: string;
    };
  }[];
}

const STORAGE_KEY = 'saved_books';

export const TEST_BOOKS = [
  {
    id: 1,
    createdAt: new Date().toISOString(),
    size: 'vertical',
    cover: {
      color: '#FF0000',
      imageUrl: 'https://picsum.photos/320/440?random=1',
    },
    pages: [
      {
        layout: 'default',
        content: {
          img: '',
          text: '',
        },
      },
    ],
  },
] as const;

export const saveBook = async (bookData: Omit<SavedBook, 'id' | 'createdAt'>) => {
  try {
    // 既存のデータを取得
    const existingData = await getSavedBooks();
    
    const newBook: SavedBook = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      size: bookData.size,
      cover: bookData.cover,
      pages: [],
    };

    const updatedData = [...existingData, newBook];
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    
    return newBook;
  } catch (error) {
    console.error('本の保存に失敗しました:', error);
    throw error;
  }
};

export const getSavedBooks = async (): Promise<SavedBook[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('保存された画像の取得に失敗しました:', error);
    return [];
  }
};

export const getAllStorageData = async (): Promise<SavedBook[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error getting storage data:', error);
    return [];
  }
};

export const deleteBook = async (id: number) => {
  try {
    const existingData = await getSavedBooks();
    const updatedData = existingData.filter(item => item.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.error('本の削除に失敗しました:', error);
    throw error;
  }
};

export const deleteAllBooks = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to delete all books:', error);
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

export const handleAddTestData = async (existingData: SavedBook[]): Promise<void> => {
  try {
    const lastId = existingData.length > 0 
      ? Math.max(...existingData.map(item => item.id)) 
      : 0;

    const newData = TEST_BOOKS.map((item, index) => ({
      ...item,
      id: lastId + index + 1,
      createdAt: new Date().toISOString(),
    }));

    const updatedData = [...existingData, ...newData];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    return;
  } catch (error) {
    console.error('Error adding test data:', error);
    throw error;
  }
};

export const createEmptyBook = async (): Promise<SavedBook> => {
  try {
    const existingData = await getSavedBooks();
    
    const newBook: SavedBook = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      size: '',
      cover: {
        color: '',
        imageUrl: '',
        title: '',
        subtitle: '',
      },
      pages: [],
    };

    const updatedData = [...existingData, newBook];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    return newBook;
  } catch (error) {
    throw error;
  }
};
