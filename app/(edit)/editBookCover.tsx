import { View, StyleSheet, ScrollView } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect, useRef } from "react";
import {
  updateBook,
  createEmptyBook,
  getBookById,
  type SavedBook,
} from "@/libs/storage";
import { LoadingView } from "@/components/common/LoadingView";
import { ErrorText } from "@/components/common/ErrorText";
import { EditHeader } from "@/components/edit/EditHeader";

const inputProps = {
  mode: "outlined" as const,
  outlineColor: "#FFD700",
  activeOutlineColor: "#FFD700",
  textColor: "#000000",
  theme: {
    colors: {
      background: "#FFFFFF",
    },
  },
};

// フォームの状態の型定義
interface FormState {
  title: string;
  subtitle: string;
}

// アプリケーションの状態の型定義
interface AppState {
  book: SavedBook | null;
  isLoading: boolean;
  error: string | null;
}

export default function EditBookCoverScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const titleInputRef = useRef<any>(null);
  const [formState, setFormState] = useState<FormState>({
    title: "",
    subtitle: "",
  });
  const [appState, setAppState] = useState<AppState>({
    book: null,
    isLoading: false,
    error: null,
  });

  /**
   * フォームの状態を更新し、エラーをクリアする
   */
  const updateFormState = (field: keyof FormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    if (appState.error) {
      setAppState((prev) => ({ ...prev, error: null }));
    }
  };

  /**
   * 本の初期化とフォームのリセットを行う
   */
  useEffect(() => {
    const initializeBook = async () => {
      try {
        setAppState((prev) => ({ ...prev, isLoading: true }));
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
            throw new Error("本が見つかりませんでした");
          }
        } else {
          // 新しい本を作成する場合
          book = await createEmptyBook();
        }

        setAppState((prev) => ({
          ...prev,
          book,
          isLoading: false,
        }));
      } catch (error) {
        setAppState((prev) => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : "予期せぬエラーが発生しました",
          isLoading: false,
        }));
      }
    };

    initializeBook();
  }, [id]);

  /**
   * フォームのバリデーションを行う
   */
  const validateForm = (): boolean => {
    if (!formState.title.trim()) {
      setAppState((prev) => ({
        ...prev,
        error: "タイトルは必須です",
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
      setAppState((prev) => ({ ...prev, isLoading: true }));

      const updatedBook = await updateBook(appState.book.id, {
        cover: {
          ...appState.book.cover,
          title: formState.title.trim(),
          subtitle: formState.subtitle.trim(),
        },
      });

      router.push({
        pathname: "/(edit)/editPages",
        params: { id: updatedBook.id },
      });
    } catch (error) {
      setAppState((prev) => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : "予期せぬエラーが発生しました",
        isLoading: false,
      }));
    }
  };

  if (appState.isLoading) {
    return <LoadingView message="読み込み中..." />;
  }

  return (
    <View style={styles.container}>
      <EditHeader
        title={`カバー編集（ID: ${id}）`}
        onBackPress={() =>
          router.push({
            pathname: "/(edit)/chooseBookCover",
            params: { id },
          })
        }
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {appState.error && <ErrorText message={appState.error} />}
          <TextInput
            ref={titleInputRef}
            label="タイトル（必須）"
            value={formState.title}
            onChangeText={(value) => updateFormState("title", value)}
            style={styles.input}
            {...inputProps}
          />
          <TextInput
            label="サブタイトル（任意）"
            value={formState.subtitle}
            onChangeText={(value) => updateFormState("subtitle", value)}
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
    backgroundColor: "#25292e",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  form: {
    gap: 16,
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    backgroundColor: "#FFD700",
    borderRadius: 8,
    paddingVertical: 6,
  },
  buttonLabel: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "bold",
  },
});
