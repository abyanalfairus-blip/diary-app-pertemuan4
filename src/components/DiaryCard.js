// src/components/DiaryCard.js
// ------------------------------------------------------------
// PRESENTATIONAL COMPONENT
// DiaryCard hanya menampilkan data yang diterima lewat PROPS.
// Kartu ini TIDAK punya useState untuk status like — status like
// dimiliki parent (DiaryListScreen). Saat ikon hati ditekan, kartu
// hanya "meminta" parent mengubah state lewat callback onToggleLike.
//
// Props:
//   title, date, preview : data teks entri
//   moodImage            : sumber gambar lokal (require(...))
//   liked                : boolean -> hati terisi / kosong
//   onPress              : callback -> membuka modal detail
//   onToggleLike         : callback -> minta parent ubah status like
//   variant              : 'list' | 'grid' (dari layout responsif P3)
// ------------------------------------------------------------
import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { COLORS, SPACE, RADIUS, TYPO } from '../styles/tokens';

export default function DiaryCard({
  title,
  date,
  preview,
  moodImage,
  liked = false,
  onPress = () => {},
  onToggleLike = () => {},
  variant = 'list',
}) {
  // Area konten (buka detail) dan tombol like dibuat BERSEBELAHAN,
  // bukan bersarang, supaya menekan hati tidak ikut membuka modal
  // dan tidak muncul error "button di dalam button" saat dijalankan di web.
  return (
    <View style={[styles.card, variant === 'grid' && styles.cardGrid]}>
      <Pressable
        onPress={onPress}
        android_ripple={{ color: COLORS.border }}
        style={({ pressed }) => [styles.main, { opacity: pressed ? 0.85 : 1 }]}
        accessible
        accessibilityRole="button"
        accessibilityLabel={`Entri ${title} tanggal ${date}`}
      >
        <Image source={moodImage} style={styles.mood} />

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.date}>{date}</Text>
          <Text style={styles.preview} numberOfLines={3} ellipsizeMode="tail">
            {preview}
          </Text>
        </View>
      </Pressable>

      {/* Tombol like: data `liked` + callback `onToggleLike` dari parent */}
      <Pressable
        onPress={onToggleLike}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={liked ? 'Batal suka' : 'Suka'}
      >
        <Text style={styles.like}>{liked ? '❤️' : '🤍'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: SPACE.m,
    padding: SPACE.m,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    minHeight: 88,
  },
  cardGrid: {},
  main: {
    flex: 1,
    flexDirection: 'row',
    gap: SPACE.m,
    alignItems: 'center',
  },
  mood: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.avatar,
    backgroundColor: '#EEF2FF',
  },
  content: { flex: 1 },
  title: { fontSize: TYPO.title, fontWeight: '700', color: COLORS.text },
  date: { fontSize: TYPO.caption, color: COLORS.muted, marginBottom: 6 },
  preview: { fontSize: TYPO.body, color: COLORS.text },
  like: { fontSize: 22, paddingHorizontal: 6 },
});
