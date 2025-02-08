import { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { supabase } from '@/libs/supabase';

type ContactForm = {
  name: string;
  name_kana: string;
  email: string;
  tel: string;
  content: string;
};

const initialForm: ContactForm = {
  name: '',
  name_kana: '',
  email: '',
  tel: '',
  content: '',
};

export default function ContactScreen() {
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.content) {
      Alert.alert('エラー', '必須項目を入力してください');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('zine_contact')
        .insert([form]);

      if (error) throw error;

      Alert.alert('送信完了', 'お問い合わせを受け付けました。');
      setForm(initialForm);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('エラー', 'お問い合わせの送信に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>お問い合わせ</Text>
        
        <Text style={styles.label}>お名前 <Text style={styles.required}>*</Text></Text>
        <TextInput
          value={form.name}
          onChangeText={(text) => setForm({ ...form, name: text })}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: '#000000', placeholder: '#cccccc' } }}
          textColor="#000000"
          placeholder="山田 太郎"
        />

        <Text style={styles.label}>フリガナ</Text>
        <TextInput
          value={form.name_kana}
          onChangeText={(text) => setForm({ ...form, name_kana: text })}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: '#000000', placeholder: '#cccccc' } }}
          textColor="#000000"
          placeholder="ヤマダ タロウ"
        />

        <Text style={styles.label}>メールアドレス <Text style={styles.required}>*</Text></Text>
        <TextInput
          value={form.email}
          onChangeText={(text) => setForm({ ...form, email: text })}
          style={styles.input}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          theme={{ colors: { primary: '#000000', placeholder: '#cccccc' } }}
          textColor="#000000"
          placeholder="example@email.com"
        />

        <Text style={styles.label}>電話番号</Text>
        <TextInput
          value={form.tel}
          onChangeText={(text) => setForm({ ...form, tel: text })}
          style={styles.input}
          mode="outlined"
          keyboardType="phone-pad"
          theme={{ colors: { primary: '#000000', placeholder: '#cccccc' } }}
          textColor="#000000"
          placeholder="090-1234-5678"
        />

        <Text style={styles.label}>お問い合わせ内容 <Text style={styles.required}>*</Text></Text>
        <TextInput
          value={form.content}
          onChangeText={(text) => setForm({ ...form, content: text })}
          style={[styles.input, styles.multiline]}
          mode="outlined"
          multiline
          numberOfLines={6}
          theme={{ colors: { primary: '#000000', placeholder: '#cccccc' } }}
          textColor="#000000"
          placeholder="お問い合わせ内容をご記入ください"
        />

        <Text style={styles.requiredNote}>* 必須項目</Text>

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          style={styles.button}
          buttonColor="#ffffff"
          textColor="#000000"
        >
          送信する
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
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  multiline: {
    height: 120,
  },
  required: {
    color: '#ff4444',
    fontSize: 14,
  },
  requiredNote: {
    color: '#ff4444',
    marginBottom: 16,
    fontSize: 12,
  },
  button: {
    marginTop: 8,
    padding: 4,
  },
});
