import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface TakePhotoResult {
  uri: string;
  success: boolean;
}

export const takePhoto = async (): Promise<TakePhotoResult> => {
  const isSimulator = Platform.OS === 'ios' && !Platform.isPad && !Platform.isTV;

  if (isSimulator) {
    alert('シミュレータではカメラを使用することができません');
    return { uri: '', success: false };
  }

  const { status } = await ImagePicker.requestCameraPermissionsAsync();

  if (status === 'granted') {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      return { uri: result.assets[0].uri, success: true };
    }
  } else {
    alert('カメラへのアクセスが許可されていません');
  }

  return { uri: '', success: false };
};
