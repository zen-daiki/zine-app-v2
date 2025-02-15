import { View, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { router, useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { pickImage } from '@/libs/image';
import { getBook, updateBook, SavedBook } from '@/libs/storage';

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
  const { page } = useLocalSearchParams<{ page: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const [book, setBook] = useState<SavedBook | null>(null);
  const [selectedLayout, setSelectedLayout] = useState<LayoutOption>('textOnly');
  const [pageImage, setPageImage] = useState('');
  const [pageText, setPageText] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // 初期データの読み込み
  useEffect(() => {
    const loadBook = async () => {
      try {
        const savedBook = await getBook();
        if (savedBook) {
          setBook(savedBook);
          // 現在のページのデータがあれば読み込む
          const currentPageData = savedBook.pages?.[currentPage - 1];
          if (currentPageData) {
            setSelectedLayout(currentPageData.layout as LayoutOption);
            setPageImage(currentPageData.content.img || '');
            setPageText(currentPageData.content.text || '');
          } else {
            // ページデータがない場合は初期値をセット
            setSelectedLayout('textOnly');
            setPageImage('');
            setPageText('');
          }
        }
      } catch (error) {
        console.error('本の読み込みに失敗しました:', error);
      } finally {
        setIsInitialLoad(false);
      }
    };
    loadBook();
  }, []); // 初回のみ実行

  // ページ番号が変更された時のデータ読み込み
  useEffect(() => {
    if (!isInitialLoad && book) {
      const currentPageData = book.pages?.[currentPage - 1];
      if (currentPageData) {
        setSelectedLayout(currentPageData.layout as LayoutOption);
        setPageImage(currentPageData.content.img || '');
        setPageText(currentPageData.content.text || '');
      } else {
        setSelectedLayout('textOnly');
        setPageImage('');
        setPageText('');
      }
    }
  }, [currentPage, book, isInitialLoad]);

  // 現在のページデータを保存する関数
  const saveCurrentPage = async () => {
    if (!book) return;

    const pageContent = {
      page: currentPage,
      layout: selectedLayout,
      content: {
        img: pageImage,
        text: pageText,
      },
    };

    const updatedPages = [...(book.pages || [])];
    // 配列の長さを確認して必要なら拡張
    while (updatedPages.length < currentPage) {
      updatedPages.push({
        page: updatedPages.length + 1,
        layout: 'textOnly',
        content: { img: '', text: '' }
      });
    }
    updatedPages[currentPage - 1] = pageContent;

    const updatedBook = await updateBook(book.id, {
      pages: updatedPages,
    });

    setBook(updatedBook);
    return updatedBook;
  };

  const handleImagePick = async () => {
    const result = await pickImage();
    if (result) {
      setPageImage(result);
    }
  };

  const handleBack = async () => {
    if (currentPage > 1) {
      try {
        // 現在のページを保存
        await saveCurrentPage();
        // 前のページに戻る
        setCurrentPage(currentPage - 1);
      } catch (error) {
        console.error('ページの保存に失敗しました:', error);
      }
    } else {
      router.push('/(edit)/editBookCover');
    }
  };

  const handleSavePage = async () => {
    try {
      // 現在のページを保存
      const updatedBook = await saveCurrentPage();
      if (updatedBook) {
        // フィールドをリセット（次のページ用）
        setSelectedLayout('textOnly');
        setPageImage('');
        setPageText('');
        // 次のページへ進む
        setCurrentPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('ページの保存に失敗しました:', error);
    }
  };

  const handleFinish = async () => {
    if (!book) return;

    try {
      // 現在のページを保存
      await saveCurrentPage();
      router.push('/(menu)/check-storage');
    } catch (error) {
      console.error('ページの保存に失敗しました:', error);
    }
  };

  const isPageContentValid = (): boolean => {
    if (!selectedLayout) return false;

    switch (selectedLayout) {
      case 'fullImage':
        return !!pageImage;
      case 'imageWithText':
        return !!pageImage && !!pageText.trim();
      case 'textOnly':
        return !!pageText.trim();
      default:
        return false;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={handleBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{currentPage}ページ目</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>レイアウトを選択</Text>
          <View style={styles.layoutOptions}>
            {layoutOptions.map((option) => (
              <Pressable
                key={option.id}
                style={[
                  styles.layoutOption,
                  selectedLayout === option.id && styles.layoutOptionSelected,
                ]}
                onPress={() => {
                  setSelectedLayout(option.id);
                  // レイアウト変更時にフィールドをリセット
                  if (option.id === 'textOnly') {
                    setPageImage('');
                  }
                }}
              >
                <Text style={styles.layoutOptionText}>{option.label}</Text>
              </Pressable>
            ))}
          </View>

          {selectedLayout !== 'textOnly' && (
            <View style={styles.imageSection}>
              <Pressable style={styles.imageContainer} onPress={handleImagePick}>
                {pageImage ? (
                  <Image source={{ uri: pageImage }} style={styles.pageImage} resizeMode="cover" />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Ionicons name="image-outline" size={48} color="#666" />
                    <Text style={styles.placeholderText}>タップして画像を選択</Text>
                  </View>
                )}
              </Pressable>
            </View>
          )}

          {selectedLayout !== 'fullImage' && (
            <TextInput
              label="テキスト"
              value={pageText}
              onChangeText={setPageText}
              style={styles.input}
              mode="outlined"
              outlineColor="#FFD700"
              activeOutlineColor="#FFD700"
              textColor="#000000"
              multiline
              numberOfLines={4}
              theme={{
                colors: {
                  background: '#FFFFFF',
                },
              }}
            />
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleSavePage}
          style={styles.button}
          labelStyle={styles.buttonLabel}
          disabled={!isPageContentValid()}
          buttonColor="#FFFFFF"
        >
          次のページへ
        </Button>
        <Button
          mode="outlined"
          onPress={handleFinish}
          style={[styles.button, styles.finishButton]}
          labelStyle={[styles.buttonLabel, styles.finishButtonLabel]}
        >
          完了
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    paddingLeft: 16,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginRight: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  layoutOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  layoutOption: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#2d3238',
    borderWidth: 1,
    borderColor: '#666',
  },
  layoutOptionSelected: {
    borderColor: '#FFD700',
    backgroundColor: '#3d4248',
  },
  layoutOptionText: {
    color: '#ffffff',
    fontSize: 14,
  },
  imageSection: {
    marginBottom: 24,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#2d3238',
    borderRadius: 12,
    overflow: 'hidden',
  },
  pageImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
  },
  input: {
    marginBottom: 16,
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#25292e',
    borderTopWidth: 1,
    borderTopColor: '#333',
    gap: 8,
  },
  button: {
    height: 48,
    justifyContent: 'center',
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  finishButton: {
    borderColor: '#FFD700',
  },
  finishButtonLabel: {
    color: '#FFD700',
  },
});