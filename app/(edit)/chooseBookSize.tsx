import { View, StyleSheet, ScrollView, Pressable, Text } from 'react-native';
import { router, useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SizeOption } from '@/components/SizeOption';
import { BOOK_SIZES } from '@/constants/book';
import type { BookSize } from '@/types/book';

export default function ChooseBookScreen() {
  const handleChooseSize = (size: BookSize['type']) => {
    router.push({
      pathname: '/(edit)/chooseBookCover',
      params: { size }
    });
  };

  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

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
          <Text style={styles.headerTitle}>サイズ選択（ID: {id}）</Text>
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