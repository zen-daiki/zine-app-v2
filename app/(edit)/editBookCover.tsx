import { View, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useRef } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { pickImage } from '@/libs/image';
import { saveBook, updateBook, getBook, createEmptyBook, type SavedBook } from '@/libs/storage';

export default function EditBookCoverScreen() {
  const { size, coverType } = useLocalSearchParams<{ size: string; coverType: string }>();
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [book, setBook] = useState<SavedBook | null>(null);
  const titleInputRef = useRef<any>(null);

  useEffect(() => {
    const initializeBook = async () => {
      try {
        const newBook = await createEmptyBook();
        setBook(newBook);
        setTitle('');
        setSubtitle('');
        setCoverImage('');
        setTimeout(() => {
          titleInputRef.current?.focus();
        }, 100);
      } catch (error) {
        console.error('本の初期化に失敗しました:', error);
      }
    };

    initializeBook();
  }, [size, coverType]);

  const handleImagePick = async () => {
    const result = await pickImage();
    if (result) {
      setCoverImage(result);
    }
  };

  const handleNext = async () => {
    if (!book) return;

    try {
      const updatedBook = await updateBook(book.id, {
        cover: {
          ...book.cover,
          color: coverType || '#FF0000',
          imageUrl: coverImage,
          title: title.trim(),
          subtitle: subtitle.trim(),
        },
        size: size || 'vertical',
      });

      setBook(updatedBook);
      router.push('/(edit)/editPages?page=1');
    } catch (error) {
      console.error('表紙の保存に失敗しました:', error);
    }
  };

  const handleBack = () => {
    router.push('/(edit)/chooseBookCover');
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
          <Text style={styles.headerTitle}>カバーの編集</Text>
        </View>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <Pressable style={styles.imageContainer} onPress={handleImagePick}>
            {coverImage ? (
              <Image source={{ uri: coverImage }} style={styles.coverImage} resizeMode="cover" />
            ) : (
              <View style={styles.placeholderContainer}>
                <Ionicons name="image-outline" size={48} color="#666" />
                <Text style={styles.placeholderText}>タップして画像を選択</Text>
              </View>
            )}
          </Pressable>
          <TextInput
            ref={titleInputRef}
            label="タイトル"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            mode="outlined"
            outlineColor="#FFD700"
            activeOutlineColor="#FFD700"
            textColor="#000000"
            theme={{
              colors: {
                background: '#FFFFFF',
              },
            }}
          />
          <TextInput
            label="サブタイトル（任意）"
            value={subtitle}
            onChangeText={setSubtitle}
            style={styles.input}
            mode="outlined"
            outlineColor="#FFD700"
            activeOutlineColor="#FFD700"
            textColor="#000000"
            theme={{
              colors: {
                background: '#FFFFFF',
              },
            }}
          />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleNext}
          style={styles.button}
          labelStyle={styles.buttonLabel}
          disabled={!title.trim()}
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
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#2d3238',
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
  },
  coverImage: {
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
});
