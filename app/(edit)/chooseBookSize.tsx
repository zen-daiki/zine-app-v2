import { View, StyleSheet, ScrollView, Pressable, Text } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SizeOption } from '@/components/SizeOption';
import type { BookSize } from '@/types/book';

const SquareImage = require('@/assets/images/chooseBook_01.png');
const RectangleImage = require('@/assets/images/chooseBook_02.png');

const BOOK_SIZES: BookSize[] = [
  {
    id: '1',
    type: 'vertical',
    title: '長方形',
    size: '102×102mm',
    price: '1,360円(税込)より',
    image: SquareImage,
  },
  {
    id: '2',
    type: 'square',
    title: '正方形',
    size: '102×102mm',
    price: '1,360円(税込)より',
    image: RectangleImage,
  },
];

export default function ChooseBookScreen() {
  const handleChooseSize = (size: BookSize['type']) => {
    router.push({
      pathname: '/(edit)/chooseBookCover',
      params: { size }
    });
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
          <Text style={styles.headerTitle}>サイズ選択</Text>
        </View>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          {BOOK_SIZES.map((book, index) => (
            <SizeOption
              key={book.id}
              book={book}
              isMiddle={index > 0}
              isLast={index === BOOK_SIZES.length - 1}
              onPress={handleChooseSize}
            />
          ))}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    marginLeft: 16,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginRight: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
});