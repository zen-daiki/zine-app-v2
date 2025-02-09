import { StyleSheet, View, FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import { useMicroCMS } from '@/hooks/useMicroCMS';
import type { FaqType } from '@/libs/microcms';
import { Loading } from '@/components/Loading';
import { ErrorMessage } from '@/components/ErrorMessage';
import Accordion from '@/components/Accordion';

export default function FaqScreen() {
  const { data: faqs, loading, error } = useMicroCMS<FaqType>('faq');

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!faqs) return <ErrorMessage message="データの取得に失敗しました" />;

  return (
    <View style={styles.container}>
      <FlatList
        data={faqs}
        renderItem={({ item }) => (
          <Accordion title={item.question}>
            <Text>{item.answer}</Text>
          </Accordion>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  listContainer: {
    padding: 16,
  },
});
