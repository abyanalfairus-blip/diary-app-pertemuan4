// src/components/DiaryDetailModal.js
// ------------------------------------------------------------
// Modal detail entri: gambar mood, judul, tanggal, isi, tombol Tutup.
// Modal ini dikendalikan sepenuhnya oleh parent lewat props:
//   visible : boolean  -> !!selected di DiaryListScreen
//   entry   : object   -> entri yang sedang dipilih (state `selected`)
//   onClose : function -> parent memanggil setSelected(null)
//   liked   : boolean  -> status like entri ini (opsional)
// ------------------------------------------------------------
import React from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { COLORS, SPACE, RADIUS, TYPO } from '../styles/tokens';

export default function DiaryDetailModal({ visible, onClose, entry, liked = false }) {
  if (!entry) return null;

  const { title, date, body, moodImage } = entry;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose} // tombol Back Android menutup modal
    >
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.hero}>
            <Image source={moodImage} style={styles.heroImage} />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.date}>
              {date}
              {liked ? '  ·  ❤️ Disukai' : ''}
            </Text>
            <Text style={styles.body}>{body}</Text>

            <Pressable
              onPress={onClose}
              style={styles.button}
              accessibilityRole="button"
              accessibilityLabel="Tutup detail entri"
            >
              <Text style={styles.buttonText}>Tutup</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  hero: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#EEF2FF',
    borderBottomLeftRadius: RADIUS.card,
    borderBottomRightRadius: RADIUS.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: { width: 140, height: 140 },
  content: { padding: SPACE.l, gap: SPACE.s },
  title: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  date: { fontSize: TYPO.caption, color: COLORS.muted, marginBottom: SPACE.s },
  body: { fontSize: TYPO.body, color: COLORS.text, lineHeight: 20 },
  button: {
    marginTop: SPACE.l,
    padding: SPACE.m,
    minHeight: 48,
    justifyContent: 'center',
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
  },
  buttonText: { color: '#FFFFFF', fontWeight: '700' },
});
