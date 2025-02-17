import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useRef } from 'react';
import { updateBook, createEmptyBook, getBookById, type SavedBook } from '@/libs/storage';

const inputProps = {
  mode: 'outlined' as const,
  outlineColor: '#FFD700',
  activeOutlineColor: '#FFD700',
  textColor: '#000000',
  theme: {
    colors: {
      background: '#FFFFFF',
    },
  },
};

export default function EditBookCoverScreen() {
  const { size, coverType, id } = useLocalSearchParams<{ size: string; coverType: string; id?: string }>();
  const titleInputRef = useRef<any>(null);
  const [formState, setFormState] = useState({
    title: '',
    subtitle: '',
  });
  const [appState, setAppState] = useState({
    book: null as SavedBook | null,
    isLoading: false,
    error: null as string | null,
  });

  /**
   * フォームの状態を更新し、エラーをクリアする
   */
  const updateFormState = (field: keyof typeof formState, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
    if (appState.error) {
      setAppState(prev => ({ ...prev, error: null }));
    }
  };

  /**
   * 本の初期化とフォームのリセットを行う
   */
  useEffect(() => {
    const initializeBook = async () => {
      try {
        setAppState(prev => ({ ...prev, isLoading: true }));
        let book: SavedBook | null = null;

        if (id) {
          // 既存の本を編集する場合
          book = await getBookById(Number(id));
          if (book) {
            setFormState({
              title: book.cover.title,
              subtitle: book.cover.subtitle,
            });
          } else {
            throw new Error('本が見つかりませんでした');
          }
        } else {
          // 新しい本を作成する場合
          book = await createEmptyBook();
        }

        setAppState(prev => ({
          ...prev,
          book,
          isLoading: false,
        }));
      } catch (error) {
        setAppState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : '予期せぬエラーが発生しました',
          isLoading: false,
        }));
      }
    };

    initializeBook();
  }, [id]);

  /**
   * フォームのバリデーションを行う
   */
  const validateForm = () => {
    if (!formState.title.trim()) {
      setAppState(prev => ({
        ...prev,
        error: 'タイトルは必須です',
      }));
      return false;
    }
    return true;
  };

  /**
   * 次のページに進む
   */
  const handleNext = async () => {
    if (!validateForm() || !appState.book) return;

    try {
      setAppState(prev => ({ ...prev, isLoading: true }));

      const updatedBook = await updateBook(appState.book.id, {
        size: size || appState.book.size,
        cover: {
          ...appState.book.cover,
          title: formState.title.trim(),
          subtitle: formState.subtitle.trim(),
        },
      });

      router.push({
        pathname: '/(edit)/editPages',
        params: { id: updatedBook.id },
      });
    } catch (error) {
      setAppState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '予期せぬエラーが発生しました',
        isLoading: false,
      }));
    }
  };

  if (appState.isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>読み込み中...</Text>
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
          <Text style={styles.headerTitle}>カバー編集（ID: {id}）</Text>
        </View>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {appState.error && (
            <Text style={styles.errorText}>{appState.error}</Text>
          )}
          <TextInput
            ref={titleInputRef}
            label="タイトル（必須）"
            value={formState.title}
            onChangeText={(value) => updateFormState('title', value)}
            style={styles.input}
            {...inputProps}
          />
          <TextInput
            label="サブタイトル（任意）"
            value={formState.subtitle}
            onChangeText={(value) => updateFormState('subtitle', value)}
            style={styles.input}
            {...inputProps}
          />
          <Button
            mode="contained"
            onPress={handleNext}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            次へ
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
  form: {
    padding: 16,
    gap: 16,
  },
  input: {
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 24,
    backgroundColor: '#FFD700',
  },
  buttonLabel: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 14,
    marginBottom: 8,
  },
});
