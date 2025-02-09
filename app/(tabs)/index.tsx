import { StyleSheet, View, Alert, Platform } from 'react-native';
import { useState, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import domtoimage from 'dom-to-image';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import Button from '@/components/Button';
import ImageViewer from '@/components/ImageViewer';
import IconButton from '@/components/IconButton';
import CircleButton from '@/components/CircleButton';
import EmojiPicker from '@/components/EmojiPicker';
import EmojiList from '@/components/EmojiList';
import EmojiSticker from '@/components/EmojiSticker';
import { saveImage } from '@/libs/storage';

const PlaceholderImage = require('@/assets/images/background-image_02.png');

export default function Index() {
  const imageRef = useRef<View | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pickedEmoji, setPickedEmoji] = useState<any>(null);
  const [status, requestPermission] = MediaLibrary.usePermissions();

  if (status === null) {
    requestPermission();
  }

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      alert('画像が選択されませんでした。');
    }
  };

  const onReset = () => {
    setShowAppOptions(false);
    setSelectedImage(null);
    setPickedEmoji(null);
  };

  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const onEmojiSelect = (emoji: any) => {
    setPickedEmoji(emoji);
    onModalClose();
  };

  const handleCreateNew = () => {
    router.push('/(edit)/chooseBook');
  };

  const onSaveImageAsync = async () => {
    if (!imageRef.current) return;

    if (Platform.OS !== 'web') {
      try {
        const localUri = await captureRef(imageRef, {
          height: 440,
          quality: 1,
        });

        if (localUri) {
          await saveImage({
            imageUri: localUri,
          });
          await MediaLibrary.saveToLibraryAsync(localUri);
          alert('保存しました');
          onReset();
        }
      } catch (e) {
        console.error('画像の保存に失敗しました:', e);
        alert('画像の保存に失敗しました。');
      }
    } else {
      try {
        const dataUrl = await domtoimage.toJpeg(imageRef.current, {
          quality: 0.95,
          width: 320,
          height: 440,
        });

        await saveImage({
          imageUri: dataUrl,
        });

        const link = document.createElement('a');
        link.download = 'sticker-smash.jpeg';
        link.href = dataUrl;
        link.click();
        alert('保存しました！');
        onReset();
      } catch (e) {
        console.error('画像の保存に失敗しました:', e);
        alert('画像の保存に失敗しました。');
      }
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === 'granted') {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setShowAppOptions(true);
      }
    } else {
      alert('カメラへのアクセスが許可されていません');
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
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
            <IconButton icon="refresh" label="リセット" onPress={onReset} />
            <CircleButton onPress={() => setIsModalVisible(true)} />
            <IconButton icon="save-alt" label="保存" onPress={onSaveImageAsync} />
          </View>
        </View>
      ) : (
        <View style={styles.footerContainer}>
          <View style={styles.buttonContainer}>
            <Button theme="primary" label="新しく作成する" onPress={handleCreateNew} />
            <Button theme="primary" label="写真を選択する" onPress={pickImageAsync} />
            <Button label="写真を取る" onPress={takePhoto} />
          </View>
        </View>
      )}
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={onEmojiSelect} onCloseModal={onModalClose} />
      </EmojiPicker>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
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
    flex: 1 / 3,
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    gap: 10,
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
