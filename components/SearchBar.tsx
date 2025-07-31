import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  placeholder?: string;
  onSubmit: (text: string) => void;
  onMicPress: () => void;
}

export default function SearchBar({ placeholder = 'Ask anything…', onSubmit, onMicPress }: Props) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value.trim());
      setValue('');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => {}} style={styles.iconLeft}>
        <Ionicons name="camera" size={22} color="#888" />
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#888"
        value={value}
        onChangeText={setValue}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
      />

      <TouchableOpacity onPress={onMicPress} style={styles.iconRight}>
        <Ionicons name="mic" size={22} color="#888" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 24,
    paddingHorizontal: 12,
    height: 48,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});