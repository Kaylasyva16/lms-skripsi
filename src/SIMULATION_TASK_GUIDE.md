# 🎮 Simulation Task - Drag & Drop System

## 📋 Overview
Simulation Task telah diperbarui menjadi sistem **Drag & Drop** yang interaktif. User dapat menyusun langkah-langkah eksekusi algoritma dengan cara drag & drop, kemudian menekan tombol "Run Simulation" untuk mengecek apakah urutannya benar atau salah.

---

## ⚙️ Cara Kerja

### 1. **Drag & Drop Steps**
- User melihat langkah-langkah yang diacak
- User dapat men-drag langkah ke posisi yang diinginkan
- Setiap langkah memiliki nomor urut yang dinamis

### 2. **Run Simulation**
- Setelah menyusun urutan, user klik tombol **"Run Simulation"**
- Sistem akan mengecek apakah urutan yang disusun sudah benar
- Menampilkan hasil: ✅ **Correct** atau ❌ **Incorrect**

### 3. **Feedback Visual**
- **Jika Benar (Correct):**
  - Background hijau
  - Ikon CheckCircle2
  - Pesan "Simulasi berjalan dengan urutan yang benar"
  
- **Jika Salah (Incorrect):**
  - Background merah
  - Ikon XCircle
  - Pesan "Urutan simulasi tidak tepat"

### 4. **Penjelasan Lengkap**
Setelah run simulation, ditampilkan:
- Penjelasan konsep
- Perbandingan "Urutan Anda" vs "Urutan Benar"
- Dapat langsung lanjut ke soal berikutnya (tidak ada pengulangan)

---

## 📝 Contoh Soal Simulation Task

### Level Mudah (10 poin):
1. **Simulasi: Jumlahkan 5 + 3**
   - Input nilai 5
   - Input nilai 3
   - Proses: 5 + 3 = 8
   - Output: 8

2. **Simulasi: Cek kondisi IF (7 > 5)**
   - Baca nilai 7
   - Baca nilai 5
   - Evaluasi: 7 > 5
   - Hasil: TRUE

### Level Sedang (20 poin):
3. **Simulasi: Loop FOR dari 1 sampai 3**
   - Inisialisasi i = 1
   - Iterasi 1: i=1, print 1
   - Iterasi 2: i=2, print 2
   - Iterasi 3: i=3, print 3
   - Loop selesai

4. **Simulasi: Swap nilai a=5 dan b=10**
   - Simpan a ke temp (temp=5)
   - Salin b ke a (a=10)
   - Salin temp ke b (b=5)
   - Hasil: a=10, b=5

### Level Sulit (30 poin):
5. **Simulasi: Bubble Sort untuk [3,1,2]**
   - Mulai dari index 0
   - Bandingkan 3 dan 1
   - Swap: [1,3,2]
   - Bandingkan 3 dan 2
   - Swap: [1,2,3]
   - Pass 1 selesai

6. **Simulasi: Binary Search cari 7 di [1,3,5,7,9]**
   - Set low=0, high=4, mid=2
   - arr[2]=5, target 7>5
   - Set low=3, high=4, mid=3
   - arr[3]=7, target found!
   - Return index 3

---

## 🔧 Technical Implementation

### Interface SimulationQuestion
```typescript
interface SimulationQuestion extends BaseQuestion {
  type: 'simulation';
  scenario: string;           // Deskripsi skenario
  instruction: string;        // Instruksi untuk user
  steps: string[];            // Array langkah-langkah
  correctOrder: number[];     // Urutan indeks yang benar
  explanation?: string;       // Penjelasan setelah run
}
```

### State Management
```typescript
const [simulationSteps, setSimulationSteps] = useState<string[]>([]);
const [simulationRun, setSimulationRun] = useState(false);
```

### Drag & Drop Function
```typescript
const moveSimulationItem = (fromIndex: number, toIndex: number) => {
  const newItems = [...simulationSteps];
  const [movedItem] = newItems.splice(fromIndex, 1);
  newItems.splice(toIndex, 0, movedItem);
  setSimulationSteps(newItems);
};
```

### Validation Logic
```typescript
const userAnswer = simulationSteps;
const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(currentQ.steps);
```

---

## 🎨 UI Components

### Draggable Item
- Menggunakan `react-dnd` untuk drag & drop
- Setiap item menampilkan:
  - Icon grip (GripVertical)
  - Text langkah
  - Badge nomor urut
  - Border biru saat di-drag
  - Hover effect

### Run Button
- Gradient indigo to purple
- Icon Play
- Wajib diklik sebelum bisa next ke soal berikutnya

### Result Display
- Grid 2 kolom untuk perbandingan
- Badge dengan nomor urut
- Color coding (hijau untuk benar)
- Tidak ada pengulangan - langsung bisa next

---

## ✨ Fitur Tambahan

### Auto-Save Progress
- Setiap perpindahan soal, urutan disimpan otomatis
- Bisa kembali ke soal sebelumnya dengan urutan tetap tersimpan
- State management yang robust

### Navigation Integration
- Tombol Previous/Next menyimpan state simulation
- **Tombol Next/Submit disabled sampai user klik "Run Simulation"**
- Indikator soal terjawab (hijau jika sudah di-run)
- Quick navigation ke soal tertentu

### Scoring System
- Benar = dapat full poin
- Salah = 0 poin
- Tidak ada partial scoring
- Total poin dihitung otomatis

---

## 🚀 Advantages

1. **Lebih Interaktif**: User aktif menyusun urutan, bukan hanya memilih
2. **Pembelajaran Lebih Dalam**: User harus memahami flow algoritma
3. **Visual Learning**: Melihat langkah demi langkah secara visual
4. **Immediate Feedback**: Langsung tahu benar/salah dengan penjelasan
5. **No Second Chance**: Jawaban final setelah run - melatih ketelitian sebelum submit

---

## 📊 Poin System

| Level     | Poin | Jumlah Soal | Total Poin |
|-----------|------|-------------|------------|
| Mudah     | 10   | 2           | 20         |
| Sedang    | 20   | 2           | 40         |
| Sulit     | 30   | 2           | 60         |
| **Total** |      | **6**       | **120**    |

---

## 🎯 Learning Objectives

Simulation Task dirancang untuk melatih:
- ✅ Pemahaman alur eksekusi algoritma
- ✅ Kemampuan berpikir logis dan sistematis
- ✅ Pemahaman step-by-step problem solving
- ✅ Konsep algoritma fundamental (loop, swap, sorting, searching)
- ✅ Debugging skills dengan melihat urutan yang salah

---

*Dokumentasi ini menjelaskan sistem Simulation Task yang telah diperbarui dengan fitur Drag & Drop interaktif.*
