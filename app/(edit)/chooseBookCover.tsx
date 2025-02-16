import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COVER_OPTIONS } from '@/constants/covers';
import { CoverOptionItem } from '@/components/CoverOption';

export default function ChooseCoverScreen() {
  const { size } = useLocalSearchParams<{ size: string }>();

  const handleChooseCover = (coverType: string) => {
    router.push({
      pathname: '/(edit)/editBookCover',
      params: {
        size,
        coverType,
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.push('/(edit)/chooseBookSize')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>カバーデザイン選択</Text>
        </View>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          {COVER_OPTIONS.map((cover, index) => (
            <CoverOptionItem
              key={cover.id}
              cover={cover}
              onSelect={handleChooseCover}
              isMiddle={index > 0}
              isLast={index === COVER_OPTIONS.length - 1}
            />
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
});