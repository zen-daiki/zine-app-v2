import { useState } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { router } from 'expo-router';
import { pickImage } from '@/libs/image';

export default function EditCoverScreen() {
  const [coverImage, setCoverImage] = useState<string>('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');

  const handlePickImage = async () => {
    try {
      const imageUri = await pickImage();
      if (imageUri) {
        setCoverImage(imageUri);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : '写真の選択に失敗しました');
    }
  };

  const handleNext = () => {
    // TODO: 次のステップの実装
    console.log('Next step with:', { coverImage, title, subtitle });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          {coverImage ? (
            <Image source={{ uri: coverImage }} style={styles.image} />
          ) : (
            <View style={styles.placeholderImage}>
              <Text variant="bodyLarge">表紙画像を選択してください</Text>
            </View>
          )}
          <Button
            mode="contained"
            onPress={handlePickImage}
            style={styles.button}
          >
            写真を選択
          </Button>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            label="タイトル"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="サブタイトル"
            value={subtitle}
            onChangeText={setSubtitle}
            mode="outlined"
            style={styles.input}
          />
        </View>

        <Button
          mode="contained"
          onPress={handleNext}
          style={styles.button}
          disabled={!title.trim()}
        >
          次へ
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  content: {
    padding: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  image: {
    width: 240,
    height: 320,
    marginBottom: 16,
    borderRadius: 8,
  },
  placeholderImage: {
    width: 240,
    height: 320,
    backgroundColor: '#2d3238',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderRadius: 8,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 16,
  },
});
