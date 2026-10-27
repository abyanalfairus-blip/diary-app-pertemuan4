// src/components/EntryForm.js
// ------------------------------------------------------------
// CONTROLLED FORM
// - Setiap TextInput dikendalikan oleh state lokal (title, date, preview):
//   value={state} + onChangeText={setState}.
// - Tombol Simpan mengirim objek entri baru ke parent lewat onSubmit.
// - Setelah terkirim, semua state form dikosongkan kembali.
// ------------------------------------------------------------
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable, Text } from 'react-native';
import { COLORS, SPACE, RADIUS, TYPO } from '../styles/tokens';

// Tanggal hari ini dalam format YYYY-MM-DD (zona waktu perangkat)
const today = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export default function EntryForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(today());
  const [preview, setPreview] = useState('');

  // Validasi sederhana: judul & ringkasan wajib diisi
  const canSubmit = title.trim().length > 0 && preview.trim().length > 0;

  const submit = () => {
    if (!canSubmit) return;

    onSubmit?.({
      id: Date.now(),
      title: title.trim(),
      date: date.trim() || today(),
      preview: preview.trim(),
      body: preview.trim(),
      moodImage: require('../../assets/moods/default.png'),
    });

    // Reset form setelah data dikirim ke parent
    setTitle('');
    setDate(today());
    setPreview('');
  };

  return (
    <View style={styles.form}>
      <Text style={styles.heading}>Tambah Entri</Text>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Judul"
        placeholderTextColor={COLORS.muted}
        style={styles.input}
        accessibilityLabel="Judul entri"
      />

      <TextInput
        value={date}
        onChangeText={setDate}
        placeholder="YYYY-MM-DD"
        placeholderTextColor={COLORS.muted}
        style={styles.input}
        accessibilityLabel="Tanggal entri"
      />

      <TextInput
        value={preview}
        onChangeText={setPreview}
        placeholder="Ringkasan..."
        placeholderTextColor={COLORS.muted}
        style={[styles.input, styles.multiline]}
        accessibilityLabel="Ringkasan entri"
        multiline
      />

      <Pressable
        onPress={submit}
        disabled={!canSubmit}
        style={[styles.button, !canSubmit && styles.buttonDisabled]}
        accessibilityRole="button"
        accessibilityLabel="Simpan entri"
      >
        <Text style={styles.buttonText}>Simpan</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    padding: SPACE.l,
    gap: SPACE.s,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    backgroundColor: '#F9FAFB',
  },
  heading: {
    fontSize: TYPO.title,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACE.s,
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
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: SPACE.s,
    padding: SPACE.m,
    minHeight: 48,
    justifyContent: 'center',
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontWeight: '700' },
});
