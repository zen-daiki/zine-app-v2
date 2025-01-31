
import { View, Text, StyleSheet } from 'react-native';

type ErrorMessageProps = {
  message: string;
};

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>エラーが発生しました</Text>
      <Text style={styles.errorDetail}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  errorDetail: {
    color: '#ff8787',
    fontSize: 14,
    textAlign: 'center',
  },
});
