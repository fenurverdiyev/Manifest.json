import React, { useEffect, useState } from 'react';
import { Modal, View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import Voice, { SpeechResultsEvent } from 'react-native-voice';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  onClose: () => void;
  onResult: (text: string) => void;
}

export default function VoiceModal({ visible, onClose, onResult }: Props) {
  const [transcript, setTranscript] = useState('');
  const [isListening, setListening] = useState(false);

  useEffect(() => {
    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      if (e.value?.length) {
        setTranscript(e.value[0]);
      }
    };
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  useEffect(() => {
    if (visible) {
      startListening();
    } else {
      stopListening();
    }
  }, [visible]);

  const startListening = async () => {
    try {
      await Voice.start('en-US');
      setListening(true);
      setTranscript('');
    } catch (e) {
      console.error(e);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setListening(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleClose = () => {
    stopListening();
    if (transcript.trim()) {
      onResult(transcript.trim());
    }
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {isListening ? (
            <ActivityIndicator size="large" color="#0af" />
          ) : (
            <Ionicons name="mic" size={64} color="#0af" />
          )}
          <Text style={styles.text}>{transcript || 'Say something…'}</Text>

          <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
            <Ionicons name="close" size={32} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    backgroundColor: '#111',
    borderRadius: 16,
    alignItems: 'center',
    padding: 24,
  },
  text: {
    marginTop: 16,
    color: '#fff',
    textAlign: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});