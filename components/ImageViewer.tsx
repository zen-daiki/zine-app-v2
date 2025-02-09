import { StyleSheet, View, ImageStyle } from 'react-native';
import { Image, type ImageSource } from "expo-image";

interface Props {
  imgSource: ImageSource;
  selectedImage?: string;
  style?: ImageStyle;
}

export default function ImageViewer({ imgSource, selectedImage, style }: Props) {
  const imageSource = selectedImage ? { uri: selectedImage } : imgSource;

  return (
    <View style={styles.container}>
      <Image
        source={imageSource}
        style={[styles.image, style]}
        contentFit="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
