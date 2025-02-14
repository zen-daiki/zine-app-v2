import * as ImagePicker from 'expo-image-picker';

interface ImagePickerOptions {
  aspect?: [number, number];
  allowsEditing?: boolean;
  quality?: number;
}

export const pickImage = async (options: ImagePickerOptions = {}) => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  if (status !== 'granted') {
    throw new Error('写真へのアクセス許可が必要です');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: options.allowsEditing ?? true,
    aspect: options.aspect ?? [3, 4],
    quality: options.quality ?? 1,
  });

  if (result.canceled) {
    return null;
  }

  return result.assets[0].uri;
};
