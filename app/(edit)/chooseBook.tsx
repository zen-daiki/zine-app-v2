import { Text, View, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';

const SquareImage = require('@/assets/images/chooseBook_01.png');
const RectangleImage = require('@/assets/images/chooseBook_02.png');

export default function ChooseBookScreen() {
  const handleChooseSize = (size: 'vertical' | 'square' | 'horizontal') => {
    // TODO: サイズ選択後の処理
    console.log(`Selected size: ${size}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>サイズ選択</Text>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <Pressable
            style={styles.option}
            onPress={() => handleChooseSize('vertical')}
          >
            <Image source={SquareImage} style={styles.image} resizeMode="cover" />
            <View style={styles.textContainer}>
              <Text style={styles.title}>たてなが</Text>
              <Text style={styles.size}>102×102mm</Text>
              <Text style={styles.price}>1,360円(税込)より</Text>
            </View>
          </Pressable>

          <Pressable
            style={[styles.option, styles.middleOption]}
            onPress={() => handleChooseSize('square')}
          >
            <Image source={SquareImage} style={styles.image} resizeMode="cover" />
            <View style={styles.textContainer}>
              <Text style={styles.title}>ましかく</Text>
              <Text style={styles.size}>102×102mm</Text>
              <Text style={styles.price}>1,360円(税込)より</Text>
            </View>
          </Pressable>

          <Pressable
            style={[styles.option, styles.lastOption]}
            onPress={() => handleChooseSize('horizontal')}
          >
            <Image source={RectangleImage} style={styles.image} resizeMode="cover" />
            <View style={styles.textContainer}>
              <Text style={styles.title}>よこなが</Text>
              <Text style={styles.size}>102×152mm</Text>
              <Text style={styles.price}>1,750円(税込)より</Text>
            </View>
          </Pressable>
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
    paddingBottom: 32, // 下部に余白を追加
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
  size: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    color: '#333',
  },
});
