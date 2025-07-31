import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import SearchBar from '../components/SearchBar';
import VoiceModal from '../components/VoiceModal';
import { askGemini } from '../config/gemini';

export default function HomeScreen() {
  const [voiceVisible, setVoiceVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);

  const handleAsk = async (query: string) => {
    try {
      setLoading(true);
      const result = await askGemini(query);
      setAnswer(result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Where{"\n"}knowledge{"\n"}begins</Text>

      <SearchBar onSubmit={handleAsk} onMicPress={() => setVoiceVisible(true)} />

      {loading && <ActivityIndicator style={{ marginTop: 24 }} />}
      {answer && !loading && (
        <View style={styles.answerBox}>
          <Text style={styles.answerText}>{answer}</Text>
        </View>
      )}

      <VoiceModal
        visible={voiceVisible}
        onClose={() => setVoiceVisible(false)}
        onResult={(text) => handleAsk(text)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    color: '#666',
    marginBottom: 32,
    lineHeight: 40,
    fontWeight: '300',
  },
  answerBox: {
    marginTop: 32,
    backgroundColor: '#111',
    padding: 16,
    borderRadius: 12,
  },
  answerText: {
    color: '#fff',
  },
});