import { useState, useRef } from 'react';
import { StyleSheet, View, Platform, Alert, Image, useWindowDimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as MediaLibrary from 'expo-media-library';
import { router, Stack } from 'expo-router';
import Button from '@/components/Button';
import ImageViewer from '@/components/ImageViewer';
import CircleButton from '@/components/CircleButton';
import EmojiSticker from '@/components/EmojiSticker';

const PlaceholderImage = require('@/assets/images/background-image_02.png');

export default function Index() {
  const { width } = useWindowDimensions();
  const imageHeight = width * 0.2; // 1:5のアスペクト比

  const [selectedImage, setSelectedImage] = useState('');
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pickedEmoji, setPickedEmoji] = useState(null);
  const imageRef = useRef<View>(null);

  const onReset = () => {
    setShowAppOptions(false);
    setSelectedImage('');
    setPickedEmoji(null);
  };

  const handleNavigateToCreate = () => {
    router.push('/(edit)/chooseBookSize');
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.mainContainer}>
        <View style={styles.imageContainer}>
          {showAppOptions ? (
            <View ref={imageRef} collapsable={false}>
              <ImageViewer 
                imgSource={selectedImage ? { uri: selectedImage } : PlaceholderImage}
                style={styles.image}
              />
              {pickedEmoji && (
                <EmojiSticker 
                  imageSize={40} 
                  stickerSource={pickedEmoji}
                />
              )}
            </View>
          ) : (
            <ImageViewer 
              imgSource={PlaceholderImage}
              style={styles.image}
            />
          )}
        </View>
        {showAppOptions ? (
          <View style={styles.optionsContainer}>
            <View style={styles.optionsRow}>
              <Button theme="primary" label="リセット" onPress={onReset} />
              <CircleButton onPress={() => setIsModalVisible(true)} />
            </View>
          </View>
        ) : (          
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
              <Button theme="primary" label="新しく作る" onPress={handleNavigateToCreate} />
            </View>
          </View>
        )}
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
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  footerContainer: {
    backgroundColor: 'transparent',
    width: '100%',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  optionsContainer: {
    alignItems: 'center',
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
