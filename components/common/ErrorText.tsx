import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

interface ErrorTextProps {
  message: string;
}

export const ErrorText: React.FC<ErrorTextProps> = ({ message }) => {
  return <Text style={styles.errorText}>{message}</Text>;
};

const styles = StyleSheet.create({
  errorText: {
    color: '#ff0000',
    fontSize: 14,
    marginBottom: 8,
  },
});
