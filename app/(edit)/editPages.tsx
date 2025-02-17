import { View, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { router, useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { pickImage } from '@/libs/image';
import { getBookById, updateBook, type SavedBook } from '@/libs/storage';

// レイアウトオプションの定義
const layoutOptions = [
  { id: 'textOnly', label: 'テキストのみ' },
  { id: 'fullImage', label: '画像のみ' },
  { id: 'imageWithText', label: '画像とテキスト' },
] as const;

type LayoutOption = typeof layoutOptions[number]['id'] | 'default';

// ページコンテンツの型定義
interface PageData {
  page: number;
  layout: LayoutOption;
  content: {
    img: string;
    text: string;
  };
}

export default function EditPagesScreen() {
  const router = useRouter();
  const { page, id } = useLocalSearchParams<{ page: string; id: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const [book, setBook] = useState<SavedBook | null>(null);
  const [selectedLayout, setSelectedLayout] = useState<LayoutOption>('textOnly');
  const [pageImage, setPageImage] = useState('');
  const [pageText, setPageText] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初期データの読み込み
  useEffect(() => {
    const loadBook = async () => {
      if (!id) {
        setError('本のIDが指定されていません');
        return;
      }

      try {
        const savedBook = await getBookById(Number(id));
        if (savedBook) {
          setBook(savedBook);
          // 現在のページのデータがあれば読み込む
          const currentPageData = savedBook.pages?.[currentPage - 1];
          if (currentPageData) {
            setSelectedLayout(currentPageData.layout as LayoutOption);
            setPageImage(currentPageData.content.img || '');
            setPageText(currentPageData.content.text || '');
          }
        } else {
          setError('本が見つかりませんでした');
        }
      } catch (error) {
        setError('本の読み込みに失敗しました');
        console.error('本の読み込みに失敗しました:', error);
      } finally {
        setIsInitialLoad(false);
      }
    };

    loadBook();
  }, [id, currentPage]);

  // 画像選択
  const handleSelectImage = async () => {
    if (!book) return;

    try {
      const result = await pickImage();
      if (result) {
        setPageImage(result);
        // 画像が選択されたら、レイアウトを画像ありに変更
        if (selectedLayout === 'textOnly') {
          setSelectedLayout('imageWithText');
        }
      }
    } catch (error) {
      console.error('画像の選択に失敗しました:', error);
    }
  };

  // ページデータの保存
  const handleSave = async () => {
    if (!book || !id) return;

    try {
      const updatedPages = [...(book.pages || [])];
      updatedPages[currentPage - 1] = {
        page: currentPage,
        layout: selectedLayout,
        content: {
          img: pageImage,
          text: pageText,
        },
      };

      await updateBook(Number(id), {
        pages: updatedPages,
      });

      router.push('/');
    } catch (error) {
      console.error('ページの保存に失敗しました:', error);
    }
  };

  if (isInitialLoad) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>読み込み中...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <Button
          mode="contained"
          onPress={() => router.back()}
          style={styles.errorButton}
        >
          戻る
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>ページ {currentPage} の編集（ID: {id}）</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>レイアウト</Text>
          <View style={styles.layoutOptions}>
            {layoutOptions.map((option) => (
              <Pressable
                key={option.id}
                style={[
                  styles.layoutOption,
                  selectedLayout === option.id && styles.selectedLayoutOption,
                ]}
                onPress={() => setSelectedLayout(option.id)}
              >
                <Text
                  style={[
                    styles.layoutOptionText,
                    selectedLayout === option.id && styles.selectedLayoutOptionText,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {(selectedLayout === 'fullImage' || selectedLayout === 'imageWithText') && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>画像</Text>
            <Pressable style={styles.imageContainer} onPress={handleSelectImage}>
              {pageImage ? (
                <Image source={{ uri: pageImage }} style={styles.image} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="image-outline" size={48} color="#fff" />
                  <Text style={styles.imagePlaceholderText}>
                    タップして画像を選択
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        )}

        {(selectedLayout === 'textOnly' || selectedLayout === 'imageWithText') && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>テキスト</Text>
            <TextInput
              multiline
              value={pageText}
              onChangeText={setPageText}
              style={styles.textInput}
              placeholder="テキストを入力"
              placeholderTextColor="#999"
            />
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            保存
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  errorText: {
    color: '#ff0000',
    fontSize: 16,
    marginBottom: 16,
  },
  errorButton: {
    backgroundColor: '#FFD700',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff20',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff20',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  layoutOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  layoutOption: {
    flex: 1,
    minWidth: '30%',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#2d3238',
    alignItems: 'center',
  },
  selectedLayoutOption: {
    backgroundColor: '#FFD700',
  },
  layoutOptionText: {
    color: '#fff',
    fontSize: 14,
  },
  selectedLayoutOptionText: {
    color: '#000',
  },
  imageContainer: {
    aspectRatio: 16 / 9,
    backgroundColor: '#2d3238',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: '#fff',
    marginTop: 8,
  },
  textInput: {
    backgroundColor: '#2d3238',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    padding: 16,
  },
  button: {
    backgroundColor: '#FFD700',
  },
  buttonLabel: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});