import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useRef } from 'react';
import { updateBook, createEmptyBook, type SavedBook } from '@/libs/storage';

// 共通の入力フィールドのプロパティ
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
  const { size, coverType } = useLocalSearchParams<{ size: string; coverType: string }>();

  const titleInputRef = useRef<any>(null);

  // フォームの状態
  const [formState, setFormState] = useState({
    title: '',
    subtitle: '',
  });

  // アプリケーションの状態
  const [appState, setAppState] = useState({
    book: null as SavedBook | null,
    isLoading: false,
    error: null as string | null,
  });

  // フォームの状態を更新する関数
  const updateFormState = (field: keyof typeof formState, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
    // エラーをクリア
    if (appState.error) {
      setAppState(prev => ({ ...prev, error: null }));
    }
  };

  // 本を初期化する
  useEffect(() => {
    const initializeBook = async () => {
      try {
        const newBook = await createEmptyBook();
        setAppState(prev => ({ ...prev, book: newBook, error: null }));
        // フォームをリセット
        setFormState({
          title: '',
          subtitle: '',
        });
        // タイトル入力にフォーカス
        setTimeout(() => {
          titleInputRef.current?.focus();
        }, 100);
      } catch (error) {
        setAppState(prev => ({
          ...prev,
          error: '本の初期化に失敗しました',
        }));
        console.error('本の初期化に失敗しました:', error);
      }
    };

    initializeBook();
  }, [size, coverType]);

  // フォームを検証する
  const validateForm = () => {
    if (!formState.title.trim()) {
      setAppState(prev => ({
        ...prev,
        error: 'タイトルを入力してください',
      }));
      return false;
    }
    return true;
  };

  // 次のページへ進む
  const handleNext = async () => {
    if (!appState.book || !validateForm()) return;

    setAppState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const updatedBook = await updateBook(appState.book.id, {
        cover: {
          ...appState.book.cover,
          color: coverType || '#FF0000',
          title: formState.title.trim(),
          subtitle: formState.subtitle.trim(),
        },
        size: size || 'vertical',
      });

      setAppState(prev => ({ ...prev, book: updatedBook }));
      router.push('/(edit)/editPages?page=1');
    } catch (error) {
      setAppState(prev => ({
        ...prev,
        error: '表紙の保存に失敗しました',
      }));
      console.error('表紙の保存に失敗しました:', error);
    } finally {
      setAppState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.push('/(edit)/chooseBookCover')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>カバーの編集</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <TextInput
            ref={titleInputRef}
            label="タイトル"
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

          {appState.error && (
            <Text style={styles.errorText}>{appState.error}</Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleNext}
          style={styles.button}
          labelStyle={styles.buttonLabel}
          disabled={appState.isLoading || !formState.title.trim()}
          loading={appState.isLoading}
          buttonColor="#FFFFFF"
        >
          次へ
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
  input: {
    marginBottom: 16,
  },
  errorText: {
    color: '#ff4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
  },
  button: {
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 16,
    color: '#000000',
  },
});
