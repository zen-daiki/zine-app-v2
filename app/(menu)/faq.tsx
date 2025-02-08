import { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Pressable,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMicroCMS } from '../../hooks/useMicroCMS';
import type { FaqType } from '../../libs/microcms';
import { Loading } from '../../components/Loading';
import { ErrorMessage } from '../../components/ErrorMessage';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const FaqItem = ({ item }: { item: FaqType }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.faqItem}>
      <Pressable
        style={styles.questionContainer}
        onPress={toggleExpand}
        android_ripple={{ color: '#3f464e' }}
      >
        <Text style={styles.question}>{item.question}</Text>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color="#fff"
        />
      </Pressable>
      {isExpanded && (
        <View style={styles.answerContainer}>
          <Text style={styles.answer}>{item.answer}</Text>
        </View>
      )}
    </View>
  );
};

export default function FaqScreen() {
  const { data: faqs, loading, error } = useMicroCMS<FaqType>('faq');

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={faqs}
        renderItem={({ item }) => <FaqItem item={item} />}
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
  faqItem: {
    backgroundColor: '#2d3238',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  questionContainer: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  question: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  answerContainer: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: '#363b42',
  },
  answer: {
    color: '#ddd',
    fontSize: 14,
    lineHeight: 20,
  },
});
