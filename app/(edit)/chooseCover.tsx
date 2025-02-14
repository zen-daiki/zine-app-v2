import { Text, View, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { getSavedBooks, saveBook } from '@/libs/storage';

const Cover1Image = require('@/assets/images/chooseCover_01.webp');
const Cover2Image = require('@/assets/images/chooseCover_02.webp');
const Cover3Image = require('@/assets/images/chooseCover_03.webp');

type CoverOption = {
  id: string;
  type: string;
  title: string;
  image: any;
};

const COVER_OPTIONS: CoverOption[] = [
  {
    id: '1',
    type: 'orange',
    title: 'オレンジ',
    image: Cover1Image,
  },
  {
    id: '2',
    type: 'sky-blue',
    title: '水色',
    image: Cover2Image,
  },
  {
    id: '3',
    type: 'gray',
    title: 'グレー',
    image: Cover3Image,
  },
];

export default function ChooseCoverScreen() {
  const { size } = useLocalSearchParams<{ size: string }>();

  const handleChooseCover = async (coverType: CoverOption['type']) => {
    try {
      // 新規データを作成
      await saveBook({
        size: size || '',
        cover: {
          color: coverType,
          imageUrl: '',
        },
        pages: [],
      });

      // 次のステップへ進む
      router.push('/(edit)/editBook');
    } catch (error) {
      console.error('カバーの設定に失敗しました:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>カバーデザイン選択</Text>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          {COVER_OPTIONS.map((cover, index) => (
            <Pressable
              key={cover.id}
              style={[
                styles.option,
                index > 0 && styles.middleOption,
                index === COVER_OPTIONS.length - 1 && styles.lastOption,
              ]}
              onPress={() => handleChooseCover(cover.type)}
            >
              <Image source={cover.image} style={styles.image} resizeMode="cover" />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{cover.title}</Text>
              </View>
            </Pressable>
          ))}
          <View style={styles.content}>
            <Text>選択されたサイズ: {size}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  option: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  middleOption: {
    marginTop: 16,
  },
  lastOption: {
    marginTop: 16,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 200,
  },
  textContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
});
