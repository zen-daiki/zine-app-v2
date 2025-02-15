import { View, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { pickImage } from '@/libs/image';
import { getBook, saveBook, SavedBook } from '@/libs/storage';

// レイアウトオプションの定義
const layoutOptions = [
  { id: 'fullImage', label: '画像のみ' },
  { id: 'imageWithText', label: '画像とテキスト' },
  { id: 'textOnly', label: 'テキストのみ' },
] as const;

type LayoutOption = typeof layoutOptions[number]['id'];

// レイアウトごとのページコンテンツの型定義
type PageContent = {
  fullImage: {
    layout: 'fullImage';
    text: string;
    imageUrl: string;
    content: {
      img: string;
      text: string;
    };
  };
  imageWithText: {
    layout: 'imageWithText';
    text: string;
    imageUrl: string;
    content: {
      img: string;
      text: string;
    };
  };
  textOnly: {
    layout: 'textOnly';
    text: string;
    imageUrl: string;
    content: {
      img: string;
      text: string;
    };
  };
};

type PageData = PageContent[LayoutOption];

export default function EditPagesScreen() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLayout, setSelectedLayout] = useState<LayoutOption | ''>('');
  const [pageImage, setPageImage] = useState('');
  const [pageText, setPageText] = useState('');
  const [book, setBook] = useState<SavedBook | null>(null);

  // 初期データの読み込み
  useEffect(() => {
    const loadBook = async () => {
      const savedBook = await getBook();
      if (savedBook) {
        setBook(savedBook);
        // 現在のページのデータがあれば読み込む
        const currentPageData = savedBook.pages[currentPage - 1];
        if (currentPageData) {
          setSelectedLayout(currentPageData.layout as LayoutOption);
          setPageImage(currentPageData.imageUrl || '');
          setPageText(currentPageData.text || '');
        }
      }
    };
    loadBook();
  }, [currentPage]);

  const handleImagePick = async () => {
    const result = await pickImage();
    if (result) {
      setPageImage(result);
    }
  };

  const getPageContent = (layout: LayoutOption): PageData => {
    const baseContent = {
      content: {
        img: pageImage,
        text: pageText,
      },
    };

    switch (layout) {
      case 'fullImage':
        return {
          layout,
          text: '',
          imageUrl: pageImage,
          ...baseContent,
        };
      case 'imageWithText':
        return {
          layout,
          text: pageText,
          imageUrl: pageImage,
          ...baseContent,
        };
      case 'textOnly':
        return {
          layout,
          text: pageText,
          imageUrl: '',
          ...baseContent,
        };
    }
  };

  const handleSavePage = async () => {
    if (!book || !selectedLayout) return;

    try {
      const pageContent = getPageContent(selectedLayout);
      const updatedPages = [...(book.pages || [])];
      updatedPages[currentPage - 1] = pageContent;

      const updatedBook = {
        ...book,
        pages: updatedPages,
      };

      await saveBook(updatedBook);
      setBook(updatedBook);

      // 次のページへ進む
      setCurrentPage(currentPage + 1);
      // フォームをリセット
      setSelectedLayout('');
      setPageImage('');
      setPageText('');
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
    }
  };

  const handleFinish = () => {
    router.push('/(menu)/check-storage');
  };

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