import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const CATEGORIES = ['For You', 'Top Stories', 'Tech & Science', 'Sports', 'Business'];

const MOCK_ARTICLES = [
  {
    id: '1',
    title: 'Microsoft reveals which jobs AI threatens most',
    author: 'aaronmut',
  },
  {
    id: '2',
    title: 'NASA announces new lunar mission timeline',
    author: 'spacefan',
  },
  {
    id: '3',
    title: 'Global markets rally amid economic optimism',
    author: 'financeguru',
  },
];

export default function DiscoverScreen() {
  const renderCategory = (cat: string, idx: number) => (
    <TouchableOpacity key={idx} style={[styles.catBtn, idx === 0 && styles.catBtnActive]}>
      <Text style={[styles.catText, idx === 0 && styles.catTextActive]}>{cat}</Text>
    </TouchableOpacity>
  );

  const renderCard = ({ item }: { item: typeof MOCK_ARTICLES[0] }) => (
    <View style={styles.card}>
      <View style={styles.cardImagePlaceholder} />
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardAuthor}>{item.author}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.categoryRow}>{CATEGORIES.map(renderCategory)}</View>
      <FlatList
        data={MOCK_ARTICLES}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  categoryRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  catBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#111',
  },
  catBtnActive: {
    backgroundColor: '#333',
  },
  catText: {
    color: '#aaa',
    fontSize: 14,
  },
  catTextActive: {
    color: '#fff',
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 12,
  },
  cardImagePlaceholder: {
    height: 150,
    backgroundColor: '#222',
    borderRadius: 8,
    marginBottom: 8,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
  },
  cardAuthor: {
    color: '#888',
    fontSize: 12,
  },
});