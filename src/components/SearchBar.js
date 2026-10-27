// src/components/SearchBar.js
// ------------------------------------------------------------
// LOCAL STATE + CALLBACK PROPS
// - queryText adalah local state milik SearchBar (isi TextInput).
// - Setiap perubahan teks dikirim ke parent lewat callback onChange,
//   sehingga parent (DiaryListScreen) bisa memfilter daftar.
// ------------------------------------------------------------
import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { COLORS, SPACE, RADIUS } from '../styles/tokens';

export default function SearchBar({ placeholder = 'Cari entri...', onChange }) {
  const [queryText, setQueryText] = useState('');

  const handleChange = (text) => {
    setQueryText(text); // 1) perbarui state lokal
    onChange?.(text);   // 2) beri tahu parent
  };

  return (
    <View style={styles.wrap}>
      <TextInput
        value={queryText}
        onChangeText={handleChange}
        placeholder={placeholder}
        placeholderTextColor={COLORS.muted}
        style={styles.input}
        accessibilityLabel="Kolom pencarian"
        clearButtonMode="while-editing"
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: SPACE.l,
    paddingVertical: SPACE.m,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    paddingHorizontal: SPACE.m,
    paddingVertical: 10,
    backgroundColor: '#fff',
    color: COLORS.text,
  },
});
