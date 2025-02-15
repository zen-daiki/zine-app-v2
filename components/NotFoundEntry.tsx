import { View, Text, StyleSheet } from 'react-native';

export function NotFoundEntry() {
  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>お知らせが見つかりませんでした</Text>
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
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
