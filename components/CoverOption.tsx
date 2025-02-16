import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import type { CoverOption } from '@/types/book';

type Props = {
  cover: CoverOption;
  onSelect: (type: string) => void;
  isMiddle?: boolean;
  isLast?: boolean;
};

export function CoverOptionItem({ cover, onSelect, isMiddle, isLast }: Props) {
  return (
    <Pressable
      style={[
        styles.option,
        isMiddle && styles.middleOption,
        isLast && styles.lastOption,
      ]}
      onPress={() => onSelect(cover.type)}
    >
      <Image source={cover.image} style={styles.image} resizeMode="cover" />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{cover.title}</Text>
        <Text style={styles.description}>カバーデザイン</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  middleOption: {
    marginTop: 16,
  },
  lastOption: {
    marginBottom: 16,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 16,
    borderRadius: 4,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});
