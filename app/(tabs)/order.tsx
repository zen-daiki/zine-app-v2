
import { Stack } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';

export default function OrderScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'ご注文履歴',
        }}
      />
      <Text style={styles.text}>Order screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});
