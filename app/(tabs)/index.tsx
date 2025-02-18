import { StyleSheet, View, Image, useWindowDimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import Button from '@/components/Button';
import ImageViewer from '@/components/ImageViewer';
import { createEmptyBook } from '@/libs/storage';

const PlaceholderImage = require('@/assets/images/background-image_02.png');

export default function Index() {
  const { width } = useWindowDimensions();
  const imageHeight = width * 0.2;

  const handleCreateNewBook = async () => {
    try {
      const newBook = await createEmptyBook();
      router.push({
        pathname: '/(edit)/chooseBookSize',
        params: { id: newBook.id.toString() }
      });
    } catch (error) {
      console.error('本の作成に失敗しました:', error);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.mainContainer}>
        <View style={styles.imageContainer}>
          <ImageViewer 
            imgSource={PlaceholderImage}
            style={styles.image}
          />
        </View>
        <View style={styles.footerContainer}>
          <Image
            source={PlaceholderImage}
            style={[
              styles.mainImage,
              {
                width: '100%',
                height: imageHeight,
              },
            ]}
            resizeMode="cover"
          />
        <View style={styles.buttonContainer}>
          <Button theme="primary" label="新しく作る" onPress={handleCreateNewBook} />
        </View>
      </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  mainContainer: {
    flex: 1,
  },
  mainImage: {
    width: '100%',
    marginBottom: 20,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  footerContainer: {
    backgroundColor: 'transparent',
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
});
