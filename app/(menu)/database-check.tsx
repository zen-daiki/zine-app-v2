import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Book, getAllBooks, addBook } from "../../libs/sqlite";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

export default function DatabaseCheckScreen() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setIsLoading(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const bookData = await getAllBooks();
      console.log("Books loaded:", bookData);
      setBooks(bookData || []);
    } catch (error) {
      console.error("Error loading books:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTestData = async () => {
    try {
      setIsAdding(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const testBook: Omit<Book, "id"> = {
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        title: `テスト本 ${new Date().toLocaleTimeString()}`,
        booktype: "manga",
        color:
          "#" +
          Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0"),
        page_count: Math.floor(Math.random() * 200) + 1,
        status: "active",
        content: JSON.stringify({ pages: [] }),
      };

      await addBook(testBook);
      await loadBooks();
    } catch (error) {
      console.error("Error adding test book:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>DB Records</Text>
        <View style={styles.buttonContainer}>
          <Pressable
            onPress={addTestData}
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.buttonPressed,
            ]}
            disabled={isAdding}
          >
            {isAdding ? (
              <ActivityIndicator color="#007AFF" />
            ) : (
              <>
                <Ionicons name="add-circle-outline" size={20} color="#007AFF" />
                <Text style={styles.buttonText}>テストデータ追加</Text>
              </>
            )}
          </Pressable>
          <Pressable
            onPress={loadBooks}
            style={({ pressed }) => [
              styles.reloadButton,
              pressed && styles.buttonPressed,
            ]}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#007AFF" />
            ) : (
              <Ionicons name="reload" size={24} color="#007AFF" />
            )}
          </Pressable>
        </View>
      </View>
      <ScrollView>
        {books.map((book) => (
          <View key={book.id} style={styles.bookItem}>
            <View style={styles.bookHeader}>
              <Text style={styles.bookTitle}>{book.title}</Text>
              <View
                style={[styles.colorPreview, { backgroundColor: book.color }]}
              />
            </View>
            <Text style={styles.bookInfo}>ID: {book.id}</Text>
            <Text style={styles.bookInfo}>Type: {book.booktype}</Text>
            <Text style={styles.bookInfo}>Status: {book.status}</Text>
            <Text style={styles.bookInfo}>Pages: {book.page_count}</Text>
            <Text style={styles.bookInfo}>
              作成日: {new Date(book.created_at).toLocaleString()}
            </Text>
          </View>
        ))}
        {books.length === 0 && (
          <Text style={styles.emptyText}>データがありません</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 4,
  },
  buttonText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "600",
  },
  reloadButton: {
    padding: 8,
    borderRadius: 20,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  bookItem: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
    marginBottom: 8,
  },
  bookHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  bookInfo: {
    color: "#666",
    marginBottom: 4,
  },
  colorPreview: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 24,
    color: "#666",
  },
});
