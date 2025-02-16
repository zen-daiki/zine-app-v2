import { Text, View, StyleSheet, Image, Pressable } from 'react-native';
import type { BookSize } from '@/types/book';

type Props = {
  book: BookSize;
  isMiddle?: boolean;
  isLast?: boolean;
  onPress: (type: BookSize['type']) => void;
};

export function SizeOption({ book, isMiddle, isLast, onPress }: Props) {
  return (
    <Pressable
      style={[
        styles.option,
        isMiddle && styles.middleOption,
        isLast && styles.lastOption,
      ]}
      onPress={() => onPress(book.type)}
    >
      <Image source={book.image} style={styles.image} resizeMode="cover" />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.size}>{book.size}</Text>
        <Text style={styles.price}>{book.price}</Text>
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
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  size: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: '#666',
  },
});
