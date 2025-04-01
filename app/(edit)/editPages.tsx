import { View, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { pickImage } from '@/libs/image';
import { getBookById, updateBook, type SavedBook } from '@/libs/storage';
import { EditHeader } from '@/components/edit/EditHeader';
import { LoadingView } from '@/components/common/LoadingView';
import { ErrorText } from '@/components/common/ErrorText';

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

// ページフォームの状態の型定義
interface PageFormState {
  layout: LayoutOption;
  image: string;
  text: string;
}

// アプリケーションの状態の型定義
interface AppState {
  book: SavedBook | null;
  currentPage: number;
  isLoading: boolean;
  isInitialLoad: boolean;
  error: string | null;
}

export default function EditPagesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  // アプリケーションの状態
  const [appState, setAppState] = useState<AppState>({
    book: null,
    currentPage: 1,
    isLoading: false,
    isInitialLoad: true,
    error: null,
  });
  
  // ページフォームの状態
  const [pageForm, setPageForm] = useState<PageFormState>({
    layout: 'textOnly',
    image: '',
    text: '',
  });

  // 状態の更新ヘルパー関数
  const updateAppState = (updates: Partial<AppState>) => {
    setAppState(prev => ({ ...prev, ...updates }));
  };

  const updatePageForm = (updates: Partial<PageFormState>) => {
    setPageForm(prev => ({ ...prev, ...updates }));
  };

  // 初期データの読み込み
  useEffect(() => {
    const loadBook = async () => {
      if (!id) {
        updateAppState({ error: '本のIDが指定されていません', isInitialLoad: false });
        return;
      }

      try {
        updateAppState({ isLoading: true });
        const savedBook = await getBookById(Number(id));
        
        if (savedBook) {
          updateAppState({ book: savedBook });
          // 現在のページのデータがあれば読み込む
          const currentPageData = savedBook.pages?.[appState.currentPage - 1];
          if (currentPageData) {
            updatePageForm({
              layout: currentPageData.layout as LayoutOption,
              image: currentPageData.content.img || '',
              text: currentPageData.content.text || '',
            });
          } else {
            // 新しいページの場合はフォームをリセット
            updatePageForm({
              layout: 'textOnly',
              image: '',
              text: '',
            });
          }
        } else {
          updateAppState({ error: '本が見つかりませんでした' });
        }
      } catch (error) {
        console.error('本の読み込みに失敗しました:', error);
        updateAppState({ error: '本の読み込みに失敗しました' });
      } finally {
        updateAppState({ isLoading: false, isInitialLoad: false });
      }
    };

    loadBook();
  }, [id, appState.currentPage]);

  // ページコンテンツのバリデーション
  const isPageContentValid = (): boolean => {
    if (!pageForm.layout) return false;

    switch (pageForm.layout) {
      case 'fullImage':
        return !!pageForm.image;
      case 'imageWithText':
        return !!pageForm.image && !!pageForm.text.trim();
      case 'textOnly':
        return !!pageForm.text.trim();
      default:
        return false;
    }
  };

  // 現在のページデータを保存する関数
  const saveCurrentPage = async () => {
    if (!appState.book || !id) return null;

    // フィールドが空の場合は保存しない
    if (!isPageContentValid()) {
      return appState.book;
    }

    const pageContent: PageData = {
      page: appState.currentPage,
      layout: pageForm.layout,
      content: {
        img: pageForm.image,
        text: pageForm.text,
      },
    };

    let updatedPages = [...(appState.book.pages || [])];
    
    // 現在のページが配列の範囲内にある場合のみ更新
    if (appState.currentPage <= updatedPages.length) {
      updatedPages[appState.currentPage - 1] = pageContent;
    } else {
      // 新しいページを追加する場合
      updatedPages.push(pageContent);
    }

    try {
      const updatedBook = await updateBook(Number(id), {
        pages: updatedPages,
      });

      updateAppState({ book: updatedBook });
      return updatedBook;
    } catch (error) {
      console.error('ページの保存に失敗しました:', error);
      updateAppState({ error: 'ページの保存に失敗しました' });
      return null;
    }
  };

  // 画像選択ハンドラー
  const handleImagePick = async () => {
    const result = await pickImage();
    if (result) {
      // 画像が選択されたら、レイアウトを画像ありに変更
      updatePageForm({
        image: result,
        layout: pageForm.layout === 'textOnly' ? 'imageWithText' : pageForm.layout,
      });
    }
  };

  // 前のページに戻るハンドラー
  const handleBack = async () => {
    if (appState.currentPage > 1) {
      try {
        // 現在のページを保存
        await saveCurrentPage();
        // 前のページに戻る
        updateAppState({ currentPage: appState.currentPage - 1 });
      } catch (error) {
        console.error('ページの保存に失敗しました:', error);
        updateAppState({ error: 'ページの保存に失敗しました' });
      }
    } else {
      router.push({
        pathname: '/(edit)/editBookCover',
        params: { id }
      });
    }
  };

  // ページ保存と次ページへの移動ハンドラー
  const handleSavePage = async () => {
    try {
      // 現在のページを保存
      const updatedBook = await saveCurrentPage();
      if (updatedBook) {
        // フィールドをリセット（次のページ用）
        updatePageForm({
          layout: 'textOnly',
          image: '',
          text: '',
        });
        // 次のページへ進む
        updateAppState({ currentPage: appState.currentPage + 1 });
      }
    } catch (error) {
      console.error('ページの保存に失敗しました:', error);
      updateAppState({ error: 'ページの保存に失敗しました' });
    }
  };

  // 完了ハンドラー
  const handleFinish = async () => {
    try {
      // 現在のページを保存
      await saveCurrentPage();
      router.push('/');
    } catch (error) {
      console.error('ページの保存に失敗しました:', error);
      updateAppState({ error: 'ページの保存に失敗しました' });
    }
  };

  // レイアウトオプションを描画するコンポーネント
  const renderLayoutOptions = () => (
    <>
      <Text style={styles.sectionTitle}>レイアウトを選択</Text>
      <View style={styles.layoutOptions}>
        {layoutOptions.map((option) => (
          <Pressable
            key={option.id}
            style={[
              styles.layoutOption,
              pageForm.layout === option.id && styles.selectedLayoutOption,
            ]}
            onPress={() => updatePageForm({ layout: option.id })}
          >
            <Text style={styles.layoutOptionText}>{option.label}</Text>
          </Pressable>
        ))}
      </View>
    </>
  );

  // ページコンテンツを描画するコンポーネント
  const renderPageContent = () => (
    <>
      {(pageForm.layout === 'fullImage' || pageForm.layout === 'imageWithText') && (
        <View style={styles.imageSection}>
          <Text style={styles.sectionTitle}>画像</Text>
          <Pressable style={styles.imageContainer} onPress={handleImagePick}>
            {pageForm.image ? (
              <Image source={{ uri: pageForm.image }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="image-outline" size={48} color="#fff" />
                <Text style={styles.imagePlaceholderText}>タップして画像を選択</Text>
              </View>
            )}
          </Pressable>
        </View>
      )}

      {(pageForm.layout === 'textOnly' || pageForm.layout === 'imageWithText') && (
        <View style={styles.textSection}>
          <Text style={styles.sectionTitle}>テキスト</Text>
          <TextInput
            multiline
            numberOfLines={5}
            value={pageForm.text}
            onChangeText={(text) => updatePageForm({ text })}
            style={styles.textInput}
            placeholder="ここにテキストを入力..."
            placeholderTextColor="#aaa"
          />
        </View>
      )}
    </>
  );

  // ナビゲーションボタンを描画するコンポーネント
  const renderNavigationButtons = () => (
    <View style={styles.buttonsContainer}>
      <Button
        mode="contained"
        onPress={handleSavePage}
        style={styles.button}
        labelStyle={styles.buttonLabel}
        disabled={!isPageContentValid()}
      >
        保存して次のページへ
      </Button>
      <Button
        mode="outlined"
        onPress={handleFinish}
        style={[styles.button, styles.finishButton]}
        labelStyle={styles.finishButtonLabel}
      >
        完了
      </Button>
    </View>
  );

  // ローディング中の表示
  if (appState.isLoading && appState.isInitialLoad) {
    return <LoadingView message="本を読み込み中..." />;
  }

  return (
    <View style={styles.container}>
      <EditHeader
        title={`ページ ${appState.currentPage} の編集（ID: ${id}）`}
        onBackPress={handleBack}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          {appState.error && <ErrorText message={appState.error} />}
          
          {renderLayoutOptions()}
          {renderPageContent()}
          {renderNavigationButtons()}
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  layoutOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  layoutOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#3a3f44',
    borderWidth: 1,
    borderColor: '#3a3f44',
  },
  selectedLayoutOption: {
    borderColor: '#FFD700',
    backgroundColor: '#4a4f54',
  },
  layoutOptionText: {
    color: '#fff',
    fontSize: 14,
  },
  imageSection: {
    marginBottom: 16,
  },
  imageContainer: {
    aspectRatio: 4/3,
    backgroundColor: '#3a3f44',
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: '#fff',
    marginTop: 8,
  },
  textSection: {
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: '#3a3f44',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    height: 150,
    textAlignVertical: 'top',
  },
  buttonsContainer: {
    gap: 12,
    marginTop: 16,
  },
  button: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingVertical: 6,
  },
  buttonLabel: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
  },
  finishButton: {
    backgroundColor: 'transparent',
    borderColor: '#FFD700',
  },
  finishButtonLabel: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
});