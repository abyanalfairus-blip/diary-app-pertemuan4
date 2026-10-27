// src/screens/DiaryListScreen.js
// ------------------------------------------------------------
// CONTAINER COMPONENT — sumber kebenaran (single source of truth).
//
// STATE UTAMA
//   entries  : seluruh data diary
//   query    : kata kunci pencarian (dikirim SearchBar via onChange)
//   likedIds : Set berisi id entri yang disukai
//   selected : entri yang sedang dibuka di modal (null = tertutup)
//
// DERIVED STATE
//   filtered   : hasil filter entries + query (useMemo, tidak disimpan)
//   likedCount : jumlah entri yang disukai (dihitung dari likedIds)
//
// Layout responsif dari Pertemuan 3 tetap dipertahankan:
//   lebar < 600 px -> 1 kolom, lebar >= 600 px -> 2 kolom.
// ------------------------------------------------------------
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  useWindowDimensions,
} from 'react-native';

import { COLORS, SPACE, TYPO, BREAKPOINTS } from '../styles/tokens';
import DiaryCard from '../components/DiaryCard';
import DiaryDetailModal from '../components/DiaryDetailModal';
import SearchBar from '../components/SearchBar';
import EntryForm from '../components/EntryForm';

const INITIAL_ENTRIES = [
  {
    id: 1,
    title: 'Pagi yang Tenang',
    date: '2026-10-18',
    preview: 'Jalan pagi 20 menit dan menikmati udara segar.',
    body: 'Hari ini aku bangun lebih pagi dan berjalan kaki selama 20 menit. Udara terasa sejuk, jalanan masih sepi, dan pikiranku terasa jernih.',
    moodImage: require('../../assets/moods/happy.png'),
  },
  {
    id: 2,
    title: 'Produktif di Kampus',
    date: '2026-10-17',
    preview: 'Menyelesaikan modul praktikum dan berdiskusi dengan tim.',
    body: 'Hari ini cukup produktif karena beberapa target perkuliahan selesai. Diskusi dengan tim membahas cara menyusun komponen agar bisa dipakai ulang.',
    moodImage: require('../../assets/moods/focus.png'),
  },
  {
    id: 3,
    title: 'Senja di Taman',
    date: '2026-10-16',
    preview: 'Membaca buku sambil menikmati suasana senja.',
    body: 'Sore ini saya menikmati waktu di taman sambil membaca buku. Warna langit berubah dari jingga ke ungu dan suasananya sangat damai.',
    moodImage: require('../../assets/moods/calm.png'),
  },
];

export default function DiaryListScreen() {
  // ---------- STATE UTAMA ----------
  const [entries, setEntries] = useState(INITIAL_ENTRIES);
  const [query, setQuery] = useState('');
  const [likedIds, setLikedIds] = useState(new Set());
  const [selected, setSelected] = useState(null);

  // ---------- LAYOUT RESPONSIF (dari Pertemuan 3) ----------
  const { width } = useWindowDimensions();
  const twoCols = width >= BREAKPOINTS.tablet;

  // ---------- DERIVED STATE ----------
  // filtered dihitung dari entries & query; data asli tidak diubah.
  const filtered = useMemo(() => {
    if (!query.trim()) return entries;

    const q = query.toLowerCase();

    return entries.filter(
      (entry) =>
        entry.title.toLowerCase().includes(q) ||
        entry.preview.toLowerCase().includes(q) ||
        entry.date.toLowerCase().includes(q)
    );
  }, [entries, query]);

  const likedCount = likedIds.size;

  // ---------- EVENT HANDLER (dipanggil child lewat callback props) ----------
  const toggleLike = (id) => {
    // Jangan mutasi Set lama — buat Set baru agar React re-render
    setLikedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const addEntry = (newEntry) => {
    // Entri baru diletakkan paling atas (immutable update)
    setEntries((prev) => [newEntry, ...prev]);
  };

  // ---------- RENDER ----------
  const renderItem = ({ item }) => (
    <View style={[styles.itemWrap, twoCols && styles.itemWrap2]}>
      <DiaryCard
        title={item.title}
        date={item.date}
        preview={item.preview}
        moodImage={item.moodImage}
        liked={likedIds.has(item.id)}
        onToggleLike={() => toggleLike(item.id)}
        onPress={() => setSelected(item)}
        variant={twoCols ? 'grid' : 'list'}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Buku Harian</Text>
        <Text style={styles.stats}>
          {filtered.length}/{entries.length} entri · ❤️ {likedCount}
        </Text>
      </View>

      <SearchBar onChange={setQuery} />

      <FlatList
        // FlatList dibuat ulang saat jumlah kolom berubah (aturan numColumns)
        key={twoCols ? 'grid2' : 'list1'}
        data={filtered}
        numColumns={twoCols ? 2 : 1}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        extraData={likedIds}
        columnWrapperStyle={twoCols ? { gap: SPACE.m } : undefined}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        // Form ikut di-scroll bersama daftar agar layar kecil tetap lega
        ListHeaderComponent={<EntryForm onSubmit={addEntry} />}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {query.trim() ? `Tidak ada entri untuk "${query}".` : 'Belum ada entri.'}
          </Text>
        }
      />

      <DiaryDetailModal
        visible={!!selected}
        entry={selected}
        liked={selected ? likedIds.has(selected.id) : false}
        onClose={() => setSelected(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: SPACE.l,
    paddingTop: SPACE.l,
  },
  header: {
    fontSize: TYPO.h1,
    fontWeight: '700',
    color: COLORS.text,
  },
  stats: {
    fontSize: TYPO.caption,
    color: COLORS.muted,
    marginBottom: 4,
  },
  listContent: {
    padding: SPACE.l,
    gap: SPACE.m,
    paddingTop: 0,
  },
  itemWrap: { flex: 1 },
  itemWrap2: { flex: 1 / 2 },
  empty: {
    textAlign: 'center',
    color: COLORS.muted,
    marginTop: 40,
  },
});
