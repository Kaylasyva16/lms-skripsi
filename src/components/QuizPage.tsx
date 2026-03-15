import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Clock, Trophy, CheckCircle, CheckCircle2, XCircle, Award, Play, BookOpen, Target, Timer, ChevronLeft, ChevronRight, Flag, GripVertical, Sparkles, Flame, Bug, Puzzle, GitBranch, Cpu, Code2 } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// Types for questions
type QuestionType = "multiple-choice" | "essay" | "matching" | "logic-flow" | "debugging" | "simulation" | "drag-drop";
type DifficultyLevel = "Mudah" | "Sedang" | "Sulit";

interface BaseQuestion {
  id: number;
  type: QuestionType;
  question: string;
  points: number;
  difficulty: DifficultyLevel;
}

interface MultipleChoiceQuestion extends BaseQuestion {
  type: "multiple-choice";
  options: string[];
  correctAnswer: number;
}

interface EssayQuestion extends BaseQuestion {
  type: "essay";
  sampleAnswer?: string;
  keywords?: string[];
  minWords?: number;
}

interface MatchingQuestion extends BaseQuestion {
  type: "matching";
  leftItems: string[];
  rightItems: string[];
  correctMatches: Record<number, number>;
}

interface LogicFlowQuestion extends BaseQuestion {
  type: "logic-flow";
  flowSteps: string[];
  blanks: number[];
  options: string[];
  correctAnswers: number[];
}

interface DebuggingQuestion extends BaseQuestion {
  type: "debugging";
  code: string;
  errorLines: number[];
  options: string[];
  correctAnswer: number;
}

interface SimulationQuestion extends BaseQuestion {
  type: "simulation";
  scenario: string;
  instruction: string;
  steps: string[];
  correctOrder: number[];
  explanation?: string;
}

interface DragDropQuestion extends BaseQuestion {
  type: "drag-drop";
  items: string[];
  correctOrder: number[];
}

type Question = MultipleChoiceQuestion | EssayQuestion | MatchingQuestion | LogicFlowQuestion | DebuggingQuestion | SimulationQuestion | DragDropQuestion;

// Quiz 1: Multiple Choice - Percabangan IF
const quiz1Questions: Question[] = [
  {
    id: 1,
    type: "multiple-choice",
    difficulty: "Mudah",
    question: "Apa fungsi utama dari statement IF dalam pemrograman?",
    options: ["Untuk mengulang blok kode tertentu", "Untuk membuat keputusan berdasarkan kondisi", "Untuk mendeklarasikan variabel", "Untuk menampilkan output ke layar"],
    correctAnswer: 1,
    points: 10,
  },
  {
    id: 2,
    type: "multiple-choice",
    difficulty: "Mudah",
    question: 'Operator relasional mana yang digunakan untuk memeriksa "sama dengan"?',
    options: ["=", "==", "===", "!="],
    correctAnswer: 1,
    points: 10,
  },
  {
    id: 3,
    type: "multiple-choice",
    difficulty: "Sedang",
    question: 'Perhatikan kode:\nint nilai = 85;\nif (nilai >= 80) cout << "A";\nelse if (nilai >= 70) cout << "B";\n\nApa output dari kode tersebut?',
    options: ["A", "B", "A B", "Error"],
    correctAnswer: 0,
    points: 20,
  },
  {
    id: 4,
    type: "multiple-choice",
    difficulty: "Sedang",
    question: "Operator logika mana yang menghasilkan TRUE jika SALAH SATU kondisi bernilai TRUE?",
    options: ["&&", "||", "!", "=="],
    correctAnswer: 1,
    points: 20,
  },
  {
    id: 5,
    type: "multiple-choice",
    difficulty: "Sulit",
    question: 'Perhatikan kode:\nint x = 5, y = 10;\nif (x > 3 && y < 15) cout << "Benar";\nelse cout << "Salah";\n\nApa output kode tersebut?',
    options: ["Benar", "Salah", "Error", "Tidak ada output"],
    correctAnswer: 0,
    points: 30,
  },
  {
    id: 6,
    type: "multiple-choice",
    difficulty: "Sulit",
    question: "Kapan sebaiknya menggunakan SWITCH-CASE dibanding IF-ELSE?",
    options: ["Ketika menggunakan operator logika kompleks", "Ketika kondisi hanya mengecek satu variabel dengan banyak nilai tetap", "Ketika kondisi sangat kompleks", "Tidak ada perbedaan"],
    correctAnswer: 1,
    points: 30,
  },
  {
    id: 7,
    type: "essay",
    difficulty: "Sedang",
    question: "Jelaskan perbedaan antara IF dan IF-ELSE statement beserta contoh penggunaannya masing-masing!",
    points: 25,
    minWords: 30,
    keywords: ["kondisi", "else", "alternatif", "true", "false", "validasi"],
    sampleAnswer:
      "IF statement hanya menjalankan kode jika kondisi true, sedangkan IF-ELSE menyediakan alternatif kode yang dijalankan jika kondisi false. Contoh IF: validasi input sederhana \"if (umur >= 18) cout << 'Boleh masuk'\". Contoh IF-ELSE: \"if (nilai >= 70) cout << 'Lulus'; else cout << 'Tidak Lulus'\" untuk menampilkan kedua kemungkinan.",
  },
];

// Quiz 2: Drag & Drop - Alur Percabangan
const quiz2Questions: Question[] = [
  {
    id: 1,
    type: "drag-drop",
    difficulty: "Mudah",
    question: "Susun urutan eksekusi percabangan IF-ELSE dengan benar!",
    items: ["Evaluasi kondisi IF", "Jika TRUE, jalankan blok IF", "Jika FALSE, jalankan blok ELSE", "Lanjut ke statement setelah IF-ELSE", "Program selesai"],
    correctOrder: [0, 1, 2, 3, 4],
    points: 10,
  },
  {
    id: 2,
    type: "drag-drop",
    difficulty: "Mudah",
    question: "Susun urutan proses input-proses-output!",
    items: ["Input data", "Proses perhitungan", "Output hasil"],
    correctOrder: [0, 1, 2],
    points: 10,
  },
  {
    id: 3,
    type: "drag-drop",
    difficulty: "Sedang",
    question: "Susun langkah-langkah algoritma untuk mencari nilai maksimum dari array!",
    items: ["Inisialisasi max dengan elemen pertama", "Loop untuk setiap elemen array", "Bandingkan elemen dengan max", "Jika elemen > max, update max", "Return nilai max"],
    correctOrder: [0, 1, 2, 3, 4],
    points: 20,
  },
  {
    id: 4,
    type: "drag-drop",
    difficulty: "Sedang",
    question: "Susun tahapan dalam membuat flowchart yang benar!",
    items: ["Tentukan start dan end point", "Identifikasi proses utama", "Tambahkan decision points", "Hubungkan dengan flow lines", "Verifikasi alur logika"],
    correctOrder: [0, 1, 2, 3, 4],
    points: 20,
  },
  {
    id: 5,
    type: "drag-drop",
    difficulty: "Sulit",
    question: "Susun langkah-langkah algoritma Bubble Sort!",
    items: ["Mulai dari index pertama", "Bandingkan dua elemen berurutan", "Tukar jika elemen kiri > elemen kanan", "Lanjut ke pasangan berikutnya", "Ulangi sampai tidak ada pertukaran", "Array terurut"],
    correctOrder: [0, 1, 2, 3, 4, 5],
    points: 30,
  },
  {
    id: 6,
    type: "drag-drop",
    difficulty: "Sulit",
    question: "Susun langkah-langkah algoritma Binary Search!",
    items: [
      "Pastikan array sudah terurut",
      "Tentukan index low, high, dan mid",
      "Bandingkan target dengan elemen mid",
      "Jika target = mid, return index",
      "Jika target < mid, cari di kiri",
      "Jika target > mid, cari di kanan",
      "Ulangi hingga ketemu atau low > high",
    ],
    correctOrder: [0, 1, 2, 3, 4, 5, 6],
    points: 30,
  },
];

// Quiz 3: Matching
const quiz3Questions: Question[] = [
  {
    id: 1,
    type: "matching",
    difficulty: "Mudah",
    question: "Cocokkan perintah SQL dasar dengan fungsinya!",
    leftItems: ["SELECT", "INSERT", "UPDATE"],
    rightItems: ["Mengubah data", "Mengambil data", "Menambah data"],
    correctMatches: {
      0: 1,
      1: 2,
      2: 0,
    },
    points: 10,
  },
  {
    id: 2,
    type: "matching",
    difficulty: "Mudah",
    question: "Cocokkan tipe data dengan contohnya!",
    leftItems: ["INTEGER", "VARCHAR", "DATE"],
    rightItems: ["Teks dengan panjang variabel", "Tanggal", "Bilangan bulat"],
    correctMatches: {
      0: 2,
      1: 0,
      2: 1,
    },
    points: 10,
  },
  {
    id: 3,
    type: "matching",
    difficulty: "Sedang",
    question: "Cocokkan jenis JOIN dengan fungsinya!",
    leftItems: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN"],
    rightItems: ["Semua data dari tabel kanan", "Hanya data yang match di kedua tabel", "Semua data dari kedua tabel", "Semua data dari tabel kiri"],
    correctMatches: {
      0: 1,
      1: 3,
      2: 0,
      3: 2,
    },
    points: 20,
  },
  {
    id: 4,
    type: "matching",
    difficulty: "Sedang",
    question: "Cocokkan constraint dengan fungsinya!",
    leftItems: ["PRIMARY KEY", "FOREIGN KEY", "UNIQUE", "NOT NULL"],
    rightItems: ["Data tidak boleh kosong", "Identifikasi unik record", "Relasi antar tabel", "Nilai harus unik"],
    correctMatches: {
      0: 1,
      1: 2,
      2: 3,
      3: 0,
    },
    points: 20,
  },
  {
    id: 5,
    type: "matching",
    difficulty: "Sulit",
    question: "Cocokkan fungsi agregat SQL dengan kegunaannya!",
    leftItems: ["COUNT()", "AVG()", "MAX()", "SUM()", "MIN()"],
    rightItems: ["Nilai terkecil", "Nilai terbesar", "Jumlah total", "Rata-rata", "Jumlah baris"],
    correctMatches: {
      0: 4,
      1: 3,
      2: 1,
      3: 2,
      4: 0,
    },
    points: 30,
  },
  {
    id: 6,
    type: "matching",
    difficulty: "Sulit",
    question: "Cocokkan bentuk normal database dengan karakteristiknya!",
    leftItems: ["1NF", "2NF", "3NF", "BCNF"],
    rightItems: ["Tidak ada transitive dependency", "Setiap determinan adalah candidate key", "Tidak ada partial dependency", "Atomic values, no repeating groups"],
    correctMatches: {
      0: 3,
      1: 2,
      2: 0,
      3: 1,
    },
    points: 30,
  },
];

// Quiz 4: Logic Flow
const quiz4Questions: Question[] = [
  {
    id: 1,
    type: "logic-flow",
    difficulty: "Mudah",
    question: "Lengkapi flow logic berikut: START → [blank] → PROSES → OUTPUT → END",
    flowSteps: ["START", "[blank]", "PROSES", "OUTPUT", "END"],
    blanks: [1],
    options: ["INPUT", "DECISION", "LOOP", "FUNCTION"],
    correctAnswers: [0],
    points: 10,
  },
  {
    id: 2,
    type: "logic-flow",
    difficulty: "Mudah",
    question: "Jika x = 5, maka pada kondisi IF (x > 3), hasilnya adalah:",
    flowSteps: ["x = 5", "IF (x > 3)", "[blank]"],
    blanks: [2],
    options: ["TRUE", "FALSE", "NULL", "ERROR"],
    correctAnswers: [0],
    points: 10,
  },
  {
    id: 3,
    type: "logic-flow",
    difficulty: "Sedang",
    question: "Lengkapi flow: IF (nilai >= 70) THEN [blank] ELSE [blank]",
    flowSteps: ["IF (nilai >= 70)", "THEN [blank]", "ELSE [blank]"],
    blanks: [1, 2],
    options: ["LULUS", "TIDAK LULUS", "REMEDIAL", "SKIP"],
    correctAnswers: [0, 1],
    points: 20,
  },
  {
    id: 4,
    type: "logic-flow",
    difficulty: "Sedang",
    question: "Dalam nested IF, jika kondisi luar FALSE, maka kondisi dalam:",
    flowSteps: ["IF (outer)", "  IF (inner)", "    [blank]"],
    blanks: [2],
    options: ["Tidak dievaluasi", "Tetap dievaluasi", "Menjadi TRUE", "Error"],
    correctAnswers: [0],
    points: 20,
  },
  {
    id: 5,
    type: "logic-flow",
    difficulty: "Sulit",
    question: "FOR i=1 TO 3: total += i. Nilai total akhir adalah:",
    flowSteps: ["total = 0", "FOR i=1 TO 3", "  total += i", "END FOR", "total = [blank]"],
    blanks: [4],
    options: ["3", "6", "9", "12"],
    correctAnswers: [1],
    points: 30,
  },
  {
    id: 6,
    type: "logic-flow",
    difficulty: "Sulit",
    question: "WHILE (x < 10): x = x * 2. Jika x awal = 2, berapa kali loop?",
    flowSteps: ["x = 2", "WHILE (x < 10)", "  x = x * 2", "Loop count = [blank]"],
    blanks: [3],
    options: ["2 kali", "3 kali", "4 kali", "5 kali"],
    correctAnswers: [1],
    points: 30,
  },
];

// Quiz 5: Debugging
const quiz5Questions: Question[] = [
  {
    id: 1,
    type: "debugging",
    difficulty: "Mudah",
    question: "Temukan error pada kode berikut:",
    code: `1: int x = 10;\n2: int y = 20\n3: int sum = x + y;\n4: print(sum);`,
    errorLines: [2],
    options: ["Baris 2: Kurang semicolon (;)", "Baris 1: Salah tipe data", "Baris 3: Operator salah", "Baris 4: Fungsi print salah"],
    correctAnswer: 0,
    points: 10,
  },
  {
    id: 2,
    type: "debugging",
    difficulty: "Mudah",
    question: "Ada bug pada kode ini:",
    code: `1: String name = "John";\n2: int age = "25";\n3: print(name + age);`,
    errorLines: [2],
    options: ["Baris 2: Tipe data int tidak bisa diisi string", "Baris 1: String salah", "Baris 3: Tidak bisa concat", "Tidak ada error"],
    correctAnswer: 0,
    points: 10,
  },
  {
    id: 3,
    type: "debugging",
    difficulty: "Sedang",
    question: "Perbaiki logic error:",
    code: `1: for(int i=0; i<5; i++){\n2:   if(i = 3){\n3:     print("Found");\n4:   }\n5: }`,
    errorLines: [2],
    options: ["Baris 2: Harus menggunakan == bukan =", "Baris 1: Loop salah", "Baris 3: Print salah", "Baris 5: Kurung kurang"],
    correctAnswer: 0,
    points: 20,
  },
  {
    id: 4,
    type: "debugging",
    difficulty: "Sedang",
    question: "Kenapa terjadi infinite loop?",
    code: `1: int i = 0;\n2: while(i < 10){\n3:   print(i);\n4: }`,
    errorLines: [2, 3],
    options: ["Tidak ada increment i++", "Kondisi while salah", "Print tidak perlu", "Tipe data salah"],
    correctAnswer: 0,
    points: 20,
  },
  {
    id: 5,
    type: "debugging",
    difficulty: "Sulit",
    question: "Array index out of bounds:",
    code: `1: int[] arr = {1,2,3};\n2: for(int i=0; i<=3; i++){\n3:   print(arr[i]);\n4: }`,
    errorLines: [2],
    options: ["Baris 2: Kondisi harus i<3 bukan i<=3", "Baris 1: Array salah", "Baris 3: Index salah", "Tidak ada error"],
    correctAnswer: 0,
    points: 30,
  },
  {
    id: 6,
    type: "debugging",
    difficulty: "Sulit",
    question: "Null pointer exception terjadi di:",
    code: `1: String text = null;\n2: int length = text.length();\n3: print(length);`,
    errorLines: [2],
    options: ["Baris 2: Memanggil method pada null object", "Baris 1: Deklarasi salah", "Baris 3: Print salah", "Baris 2: length() tidak ada"],
    correctAnswer: 0,
    points: 30,
  },
];

// Quiz 6: Simulation
const quiz6Questions: Question[] = [
  {
    id: 1,
    type: "simulation",
    difficulty: "Mudah",
    question: "Simulasi: Jumlahkan 5 + 3",
    scenario: "Susun langkah eksekusi operasi penjumlahan dengan benar",
    instruction: "Drag & drop langkah-langkah berikut sesuai urutan yang benar",
    steps: ["Input nilai 5", "Input nilai 3", "Proses: 5 + 3 = 8", "Output: 8"],
    correctOrder: [0, 1, 2, 3],
    explanation: "Urutan yang benar: Input kedua nilai → Proses penjumlahan → Output hasil",
    points: 10,
  },
  {
    id: 2,
    type: "simulation",
    difficulty: "Mudah",
    question: "Simulasi: Cek kondisi IF (7 > 5)",
    scenario: "Susun langkah eksekusi kondisional dengan benar",
    instruction: "Drag & drop langkah-langkah berikut sesuai urutan yang benar",
    steps: ["Baca nilai 7", "Baca nilai 5", "Evaluasi: 7 > 5", "Hasil: TRUE"],
    correctOrder: [0, 1, 2, 3],
    explanation: "Urutan yang benar: Baca nilai → Evaluasi kondisi → Hasil boolean",
    points: 10,
  },
  {
    id: 3,
    type: "simulation",
    difficulty: "Sedang",
    question: "Simulasi: Loop FOR dari 1 sampai 3",
    scenario: "Susun langkah eksekusi loop dengan benar",
    instruction: "Drag & drop langkah-langkah berikut sesuai urutan yang benar",
    steps: ["Inisialisasi i = 1", "Iterasi 1: i=1, print 1", "Iterasi 2: i=2, print 2", "Iterasi 3: i=3, print 3", "Loop selesai"],
    correctOrder: [0, 1, 2, 3, 4],
    explanation: "Urutan yang benar: Inisialisasi → Iterasi berurutan → Loop selesai",
    points: 20,
  },
  {
    id: 4,
    type: "simulation",
    difficulty: "Sedang",
    question: "Simulasi: Swap nilai a=5 dan b=10",
    scenario: "Susun langkah swap dua variabel dengan benar",
    instruction: "Drag & drop langkah-langkah berikut sesuai urutan yang benar",
    steps: ["Simpan a ke temp (temp=5)", "Salin b ke a (a=10)", "Salin temp ke b (b=5)", "Hasil: a=10, b=5"],
    correctOrder: [0, 1, 2, 3],
    explanation: "Urutan yang benar: Simpan a → Pindah b ke a → Pindah temp ke b → Selesai",
    points: 20,
  },
  {
    id: 5,
    type: "simulation",
    difficulty: "Sulit",
    question: "Simulasi: Bubble Sort untuk [3,1,2]",
    scenario: "Susun langkah algoritma Bubble Sort dengan benar",
    instruction: "Drag & drop langkah-langkah berikut sesuai urutan yang benar",
    steps: ["Mulai dari index 0", "Bandingkan 3 dan 1", "Swap: [1,3,2]", "Bandingkan 3 dan 2", "Swap: [1,2,3]", "Pass 1 selesai"],
    correctOrder: [0, 1, 2, 3, 4, 5],
    explanation: "Urutan yang benar: Mulai → Bandingkan pasangan berurutan → Swap jika perlu → Selesai",
    points: 30,
  },
  {
    id: 6,
    type: "simulation",
    difficulty: "Sulit",
    question: "Simulasi: Binary Search cari 7 di [1,3,5,7,9]",
    scenario: "Susun langkah algoritma Binary Search dengan benar",
    instruction: "Drag & drop langkah-langkah berikut sesuai urutan yang benar",
    steps: ["Set low=0, high=4, mid=2", "arr[2]=5, target 7>5", "Set low=3, high=4, mid=3", "arr[3]=7, target found!", "Return index 3"],
    correctOrder: [0, 1, 2, 3, 4],
    explanation: "Urutan yang benar: Hitung mid → Bandingkan → Geser range → Ketemu → Return",
    points: 30,
  },
];

// Quiz 7: Essay Questions
const quiz7Questions: Question[] = [
  {
    id: 1,
    type: "essay",
    difficulty: "Sedang",
    question: "Jelaskan apa itu nested IF dan berikan contoh kode nested IF untuk menentukan kelulusan siswa dengan syarat: nilai >= 70 DAN kehadiran >= 75%!",
    points: 30,
    minWords: 50,
    keywords: ["nested", "if", "bersarang", "kondisi", "didalam", "nilai", "kehadiran"],
    sampleAnswer:
      'Nested IF adalah IF didalam IF untuk kondisi bertingkat. Contoh:\n\nif (nilai >= 70) {\n  if (kehadiran >= 75) {\n    cout << "LULUS";\n  } else {\n    cout << "Tidak Lulus: Kehadiran kurang";\n  }\n} else {\n  cout << "Tidak Lulus: Nilai kurang";\n}\n\nNested IF berguna untuk validasi bertingkat dimana kondisi kedua hanya dicek jika kondisi pertama terpenuhi.',
  },
  {
    id: 2,
    type: "essay",
    difficulty: "Sedang",
    question: "Jelaskan perbedaan antara FOR loop dan WHILE loop! Kapan sebaiknya menggunakan masing-masing jenis loop tersebut?",
    points: 30,
    minWords: 50,
    keywords: ["for", "while", "iterasi", "counter", "kondisi", "pasti", "tidak pasti"],
    sampleAnswer:
      "FOR loop digunakan ketika jumlah iterasi sudah diketahui/pasti, memiliki struktur: inisialisasi, kondisi, increment dalam satu baris. Cocok untuk iterasi array atau counter tetap. WHILE loop digunakan ketika jumlah iterasi tidak pasti, tergantung kondisi dinamis. Cocok untuk validasi input atau menunggu kondisi tertentu. Contoh FOR: cetak 1-10. Contoh WHILE: input password sampai benar.",
  },
  {
    id: 3,
    type: "essay",
    difficulty: "Sulit",
    question: "Buatlah pseudocode untuk program yang menggunakan nested loop untuk mencetak pola segitiga angka berikut:\n1\n12\n123\n1234\n12345\n\nJelaskan logika dari setiap loop!",
    points: 35,
    minWords: 60,
    keywords: ["nested", "loop", "for", "outer", "inner", "baris", "kolom", "pola"],
    sampleAnswer:
      "Pseudocode:\n\nFOR i = 1 TO 5 DO\n  FOR j = 1 TO i DO\n    PRINT j\n  END FOR\n  PRINT newline\nEND FOR\n\nLogika: Loop OUTER (i) mengontrol jumlah baris (1-5). Loop INNER (j) mengontrol angka yang dicetak di setiap baris. Pada baris ke-i, j berjalan dari 1 sampai i, sehingga baris 1 cetak 1 angka, baris 2 cetak 2 angka, dst. Setiap selesai inner loop, print newline untuk baris baru.",
  },
  {
    id: 4,
    type: "essay",
    difficulty: "Sulit",
    question: "Jelaskan perbedaan antara BREAK dan CONTINUE dalam loop! Berikan contoh penggunaan masing-masing dalam konteks percabangan dan perulangan!",
    points: 35,
    minWords: 60,
    keywords: ["break", "continue", "keluar", "skip", "iterasi", "loop", "terminasi"],
    sampleAnswer:
      'BREAK digunakan untuk keluar dari loop sepenuhnya dan melanjutkan eksekusi setelah loop. Contoh: mencari angka dalam array, jika ketemu langsung break. CONTINUE digunakan untuk skip iterasi saat ini dan lanjut ke iterasi berikutnya. Contoh: cetak bilangan ganjil dengan "if(i%2==0) continue". BREAK menghentikan seluruh loop, CONTINUE hanya skip satu iterasi. Keduanya sering dikombinasi dengan IF untuk kontrol flow yang lebih presisi.',
  },
  {
    id: 5,
    type: "essay",
    difficulty: "Sulit",
    question: "Jelaskan mengapa nested loop 3 tingkat atau lebih perlu dihindari! Apa dampaknya terhadap performa program dan bagaimana cara mengoptimalkannya?",
    points: 40,
    minWords: 70,
    keywords: ["complexity", "performance", "O(n³)", "efisiensi", "optimasi", "algoritma"],
    sampleAnswer:
      "Nested loop meningkatkan time complexity secara eksponensial: 1 tingkat = O(n), 2 tingkat = O(n²), 3 tingkat = O(n³). Jika n=1000, nested 3 tingkat = 1 miliar iterasi! Dampaknya: program sangat lambat, boros memori dan CPU. Optimasi: 1) Gunakan algoritma lebih efisien (hash table, binary search), 2) Break/continue untuk kurangi iterasi tidak perlu, 3) Pisahkan logika ke fungsi terpisah, 4) Cache hasil yang sering digunakan, 5) Gunakan struktur data yang tepat.",
  },
];

// Drag and Drop Components
interface DragItem {
  index: number;
  text: string;
}

function DraggableItem({ item, index, moveItem }: { item: string; index: number; moveItem: (from: number, to: number) => void }) {
  const [{ isDragging }, drag] = useDrag({
    type: "item",
    item: { index, text: item },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "item",
    hover: (draggedItem: DragItem) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`flex items-center gap-3 p-4 rounded-lg border-2 bg-white cursor-move transition-all ${isDragging ? "opacity-50 border-blue-500" : "border-gray-200 hover:border-blue-300 hover:shadow-md"}`}
    >
      <GripVertical className="w-5 h-5 text-gray-400" />
      <span className="flex-1 text-gray-700">{item}</span>
      <Badge className="bg-blue-500">{index + 1}</Badge>
    </div>
  );
}

function MatchingItem({ leftItem, index, selectedMatch, onSelect }: { leftItem: string; index: number; selectedMatch: number | null; onSelect: () => void }) {
  return (
    <button onClick={onSelect} className={`w-full text-left p-4 rounded-lg border-2 transition-all ${selectedMatch === index ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-200 hover:border-blue-300 bg-white"}`}>
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedMatch === index ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"}`}>{index + 1}</div>
        <span className="text-gray-700">{leftItem}</span>
      </div>
    </button>
  );
}

const getDifficultyColor = (difficulty: DifficultyLevel) => {
  switch (difficulty) {
    case "Mudah":
      return "bg-green-500 text-white";
    case "Sedang":
      return "bg-orange-500 text-white";
    case "Sulit":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

const getDifficultyIcon = (difficulty: DifficultyLevel) => {
  switch (difficulty) {
    case "Mudah":
      return "⭐";
    case "Sedang":
      return "⭐⭐";
    case "Sulit":
      return "⭐⭐⭐";
    default:
      return "";
  }
};

type ViewMode = "list" | "detail" | "quiz" | "result";

export function QuizPage() {
  // ===== ROLE SETUP =====
  const userRole: "student" | "teacher" = "student";
  // ganti ke 'teacher' kalau mau test akses penuh

  const isQuizAllowed = (_quiz: any) => true;

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedQuiz, setSelectedQuiz] = useState<(typeof quizzes)[0] | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizResult, setQuizResult] = useState<{ score: number; correct: number; total: number; totalPoints: number; earnedPoints: number } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleStartQuiz = async (quiz: any) => {
    if (!isQuizAllowed(quiz.type as QuestionType)) {
      toast.error("Kuis ini tidak tersedia untuk siswa.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/student/quizzes/${quiz.id}/questions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Quiz detail error:", text);
        throw new Error("Gagal mengambil detail kuis");
      }

      const data = await res.json();

      const filteredQuestions = data
        .filter((q: any) => q.type === "multiple-choice" || q.type === "essay")
        .map((q: any) => {
          if (q.type === "multiple-choice") {
            return {
              id: q.id,
              type: "multiple-choice" as const,
              question: q.questionText,
              points: q.points ?? 10,
              difficulty: q.payload?.difficulty ?? "Sedang",
              options: q.options?.map((opt: any) => opt.optionText) || [],
              correctAnswer: q.options?.findIndex((opt: any) => opt.isCorrect) ?? 0,
            };
          }

          return {
            id: q.id,
            type: "essay" as const,
            question: q.questionText,
            points: q.points ?? 10,
            difficulty: q.payload?.difficulty ?? "Sedang",
            minWords: q.payload?.minWords ?? 30,
            keywords: q.payload?.keywords ?? [],
            sampleAnswer: q.explanation ?? "",
          };
        });

      setSelectedQuiz(quiz);
      setQuizQuestions(filteredQuestions);
      setViewMode("detail");
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengambil detail kuis");
    }
  };

  const [quizzes, setQuizzes] = useState<any[]>([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/student/quizzes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Quiz list error:", text);
          throw new Error("Gagal memuat kuis");
        }

        const data = await res.json();

        const mapped = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          level: item.level ?? "Beginner",
          totalQuestions: item.totalQuestions,
          duration: item.duration,
          status: item.status ?? "available",
          subject: item.subject ?? "-",
          type: item.type,
          icon: item.icon ?? "📝",
          score: item.score ?? null,
          totalPoints: item.totalPoints ?? 0,
        }));

        setQuizzes(mapped);
      } catch (error) {
        console.error(error);
        toast.error("Gagal memuat kuis");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  // For drag and drop
  const [dragItems, setDragItems] = useState<string[]>([]);

  // For matching
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matches, setMatches] = useState<Record<number, number>>({});

  // For logic flow
  const [logicAnswers, setLogicAnswers] = useState<string[]>([]);

  // For simulation
  const [simulationSteps, setSimulationSteps] = useState<string[]>([]);
  const [simulationRun, setSimulationRun] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (viewMode === "quiz" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [viewMode, timeLeft]);

  const handleBeginQuiz = () => {
    if (selectedQuiz) {
      setViewMode("quiz");
      setCurrentQuestion(0);
      setAnswers({});
      setTimeLeft(selectedQuiz.duration * 60);
      setQuizResult(null);
      setMatches({});
      setSelectedLeft(null);
      setLogicAnswers([]);
      setSimulationSteps([]);
      setSimulationRun(false);

      const questions = quizQuestions;
      const firstQ = questions[0];

      if (firstQ.type === "drag-drop") {
        setDragItems([...(firstQ as DragDropQuestion).items]);
      } else if (firstQ.type === "logic-flow") {
        setLogicAnswers(new Array((firstQ as LogicFlowQuestion).blanks.length).fill(""));
      } else if (firstQ.type === "simulation") {
        setSimulationSteps([...(firstQ as SimulationQuestion).steps]);
      }
    }
  };

  const handleAnswerChange = (questionId: number, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newItems = [...dragItems];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    setDragItems(newItems);
  };

  const moveSimulationItem = (fromIndex: number, toIndex: number) => {
    const newItems = [...simulationSteps];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    setSimulationSteps(newItems);
  };

  const handleMatchingSelect = (leftIndex: number, rightIndex: number) => {
    if (selectedLeft === null) {
      setSelectedLeft(leftIndex);
    } else {
      const newMatches = { ...matches };
      newMatches[selectedLeft] = rightIndex;
      setMatches(newMatches);
      setSelectedLeft(null);
    }
  };

  const handleNextQuestion = () => {
    if (!selectedQuiz) return;

    const questions = quizQuestions;

    const currentQ = questions[currentQuestion];

    // Save current answer
    if (currentQ.type === "drag-drop") {
      handleAnswerChange(currentQ.id, [...dragItems]);
    } else if (currentQ.type === "matching") {
      handleAnswerChange(currentQ.id, { ...matches });
    } else if (currentQ.type === "logic-flow") {
      handleAnswerChange(currentQ.id, [...logicAnswers]);
    } else if (currentQ.type === "simulation") {
      handleAnswerChange(currentQ.id, [...simulationSteps]);
    }

    const nextIndex = currentQuestion + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestion(nextIndex);
      setSimulationRun(false);
      const nextQ = questions[nextIndex];

      if (nextQ.type === "drag-drop") {
        const savedAnswer = answers[nextQ.id];
        setDragItems(savedAnswer || [...(nextQ as DragDropQuestion).items]);
      } else if (nextQ.type === "matching") {
        const savedAnswer = answers[nextQ.id] || {};
        setMatches(savedAnswer);
        setSelectedLeft(null);
      } else if (nextQ.type === "logic-flow") {
        const savedAnswer = answers[nextQ.id] || [];
        setLogicAnswers(savedAnswer.length > 0 ? savedAnswer : new Array((nextQ as LogicFlowQuestion).blanks.length).fill(""));
      } else if (nextQ.type === "simulation") {
        const savedAnswer = answers[nextQ.id];
        setSimulationSteps(savedAnswer || [...(nextQ as SimulationQuestion).steps]);
      }
    }
  };

  const handlePrevQuestion = () => {
    if (!selectedQuiz) return;

    const questions = quizQuestions;

    const currentQ = questions[currentQuestion];

    if (currentQ.type === "drag-drop") {
      handleAnswerChange(currentQ.id, [...dragItems]);
    } else if (currentQ.type === "matching") {
      handleAnswerChange(currentQ.id, { ...matches });
    } else if (currentQ.type === "logic-flow") {
      handleAnswerChange(currentQ.id, [...logicAnswers]);
    } else if (currentQ.type === "simulation") {
      handleAnswerChange(currentQ.id, [...simulationSteps]);
    }

    const prevIndex = currentQuestion - 1;
    if (prevIndex >= 0) {
      setCurrentQuestion(prevIndex);
      setSimulationRun(false);
      const prevQ = questions[prevIndex];

      if (prevQ.type === "drag-drop") {
        const savedAnswer = answers[prevQ.id];
        setDragItems(savedAnswer || [...(prevQ as DragDropQuestion).items]);
      } else if (prevQ.type === "matching") {
        const savedAnswer = answers[prevQ.id] || {};
        setMatches(savedAnswer);
        setSelectedLeft(null);
      } else if (prevQ.type === "logic-flow") {
        const savedAnswer = answers[prevQ.id] || [];
        setLogicAnswers(savedAnswer.length > 0 ? savedAnswer : new Array((prevQ as LogicFlowQuestion).blanks.length).fill(""));
      } else if (prevQ.type === "simulation") {
        const savedAnswer = answers[prevQ.id];
        setSimulationSteps(savedAnswer || [...(prevQ as SimulationQuestion).steps]);
      }
    }
  };

  const handleSubmitQuiz = () => {
    if (!selectedQuiz) return;

    const questions = quizQuestions;

    const currentQ = questions[currentQuestion];

    if (currentQ.type === "drag-drop") {
      handleAnswerChange(currentQ.id, [...dragItems]);
    } else if (currentQ.type === "matching") {
      handleAnswerChange(currentQ.id, { ...matches });
    } else if (currentQ.type === "logic-flow") {
      handleAnswerChange(currentQ.id, [...logicAnswers]);
    } else if (currentQ.type === "simulation") {
      handleAnswerChange(currentQ.id, [...simulationSteps]);
    }

    let correct = 0;
    let earnedPoints = 0;
    let totalPoints = 0;

    questions.forEach((q) => {
      totalPoints += q.points;

      if (q.type === "multiple-choice") {
        if (answers[q.id] === q.correctAnswer) {
          correct++;
          earnedPoints += q.points;
        }
      } else if (q.type === "drag-drop") {
        const userAnswer = answers[q.id] || [];
        const correctSequence = q.correctOrder.map((i) => q.items[i]);
        const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(correctSequence);
        if (isCorrect) {
          correct++;
          earnedPoints += q.points;
        }
      } else if (q.type === "matching") {
        const userMatches = answers[q.id] || {};
        const allCorrect = Object.keys(q.correctMatches).every((key) => userMatches[key] === q.correctMatches[parseInt(key)]);
        if (allCorrect) {
          correct++;
          earnedPoints += q.points;
        }
      } else if (q.type === "logic-flow") {
        const userAnswers = answers[q.id] || [];
        const allCorrect = q.correctAnswers.every((ans, idx) => userAnswers[idx] === q.options[ans]);
        if (allCorrect) {
          correct++;
          earnedPoints += q.points;
        }
      } else if (q.type === "debugging") {
        if (answers[q.id] === q.correctAnswer) {
          correct++;
          earnedPoints += q.points;
        }
      } else if (q.type === "simulation") {
        const userAnswer = answers[q.id] || [];
        const correctSequence = q.correctOrder.map((i) => q.steps[i]);
        const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(correctSequence);
        if (isCorrect) {
          correct++;
          earnedPoints += q.points;
        }
      } else if (q.type === "essay") {
        const userAnswer = answers[q.id] || "";
        if (userAnswer && q.keywords) {
          const answerLower = userAnswer.toLowerCase();
          const keywordMatches = q.keywords.filter((keyword) => answerLower.includes(keyword.toLowerCase())).length;

          const keywordScore = (keywordMatches / q.keywords.length) * q.points;

          const wordCount = userAnswer
            .trim()
            .split(/\s+/)
            .filter((w) => w.length > 0).length;
          const wordScore = q.minWords && wordCount >= q.minWords ? 1 : 0.5;

          const finalScore = keywordScore * wordScore;
          earnedPoints += Math.round(finalScore);

          if (keywordMatches >= q.keywords.length * 0.6 && wordCount >= (q.minWords || 30)) {
            correct++;
          }
        }
      }
    });

    const score = Math.round((earnedPoints / totalPoints) * 100);
    setQuizResult({
      score,
      correct,
      total: questions.length,
      totalPoints,
      earnedPoints,
    });
    setViewMode("result");
    setShowSuccess(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-500 hover:bg-green-600";
      case "Intermediate":
        return "bg-blue-500 hover:bg-blue-600";
      case "Expert":
        return "bg-purple-500 hover:bg-purple-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  // LIST VIEW
  if (viewMode === "list") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-gray-900 mb-2">Kuis Gamifikasi 🎮</h2>
          <p className="text-gray-600">6 tipe kuis interaktif dengan level kesulitan bertingkat</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Total Kuis</p>
                  <p className="text-2xl font-bold">{quizzes.length}</p>
                </div>
                <BookOpen className="w-10 h-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm mb-1">Tipe Soal</p>
                  <p className="text-2xl font-bold">6</p>
                </div>
                <Sparkles className="w-10 h-10 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm mb-1">Level Soal</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <Flame className="w-10 h-10 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm mb-1">Total Poin</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <Trophy className="w-10 h-10 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...quizzes]
            .sort((a, b) => {
              const aAllowed = isQuizAllowed(a);
              const bAllowed = isQuizAllowed(b);

              // yang allowed tampil dulu
              if (aAllowed && !bAllowed) return -1;
              if (!aAllowed && bAllowed) return 1;

              return 0;
            })
            .map((quiz) => {
              const disabled = !isQuizAllowed(quiz);

              return (
                <Card key={quiz.id} className={`relative transition-shadow border-2 ${disabled ? "opacity-50 border-gray-200" : "hover:shadow-lg border-gray-200 hover:border-blue-300"}`}>
                  {disabled && <Badge className="absolute top-3 right-3 bg-red-500 text-white">🔒 Terkunci</Badge>}

                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-4xl mb-2">{quiz.icon}</div>
                      <Badge className={getLevelColor(quiz.level)}>{quiz.level}</Badge>
                    </div>
                    <CardTitle className="text-lg mb-2">{quiz.title}</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{quiz.description}</p>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <BookOpen className="w-4 h-4 text-blue-500" />
                        <span>{quiz.totalQuestions} Soal</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span>{quiz.duration} Menit</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-200">
                      <p className="text-xs text-gray-600 mb-2">Level Kesulitan:</p>
                      <div className="flex gap-1 flex-wrap">
                        <Badge variant="outline" className="text-xs bg-green-50 border-green-300">
                          ⭐ Mudah
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-orange-50 border-orange-300">
                          ⭐⭐ Sedang
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-red-50 border-red-300">
                          ⭐⭐⭐ Sulit
                        </Badge>
                      </div>
                    </div>

                    <Button
                      disabled={disabled}
                      className={`w-full gap-2 ${disabled ? "bg-gray-300 cursor-not-allowed" : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"}`}
                      onClick={() => {
                        if (!disabled) handleStartQuiz(quiz);
                      }}
                    >
                      <Play className="w-4 h-4" />
                      {disabled ? "Tidak Tersedia" : "Mulai Kuis"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </div>
    );
  }

  // DETAIL VIEW
  if (viewMode === "detail" && selectedQuiz) {
    const questions = quizQuestions;

    const difficultyCount = {
      mudah: questions.filter((q) => q.difficulty === "Mudah").length,
      sedang: questions.filter((q) => q.difficulty === "Sedang").length,
      sulit: questions.filter((q) => q.difficulty === "Sulit").length,
    };

    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

    return (
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{selectedQuiz.icon}</span>
              <h2 className="text-gray-900">{selectedQuiz.title}</h2>
            </div>
            <p className="text-gray-600">Siap untuk tantangan interaktif?</p>
          </div>
          <Button variant="outline" onClick={() => setViewMode("list")}>
            Kembali
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tentang Kuis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed mb-4">{selectedQuiz.description}</p>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm font-medium text-gray-900 mb-2">Tipe Kuis: {selectedQuiz.type}</p>
                  <p className="text-sm text-gray-600">
                    Semua soal dalam kuis ini menggunakan format <strong>{selectedQuiz.type}</strong>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  Distribusi Level Soal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center border-2 border-green-200">
                    <div className="text-2xl mb-2">⭐</div>
                    <p className="text-sm font-medium text-gray-900">Mudah</p>
                    <p className="text-2xl font-bold text-green-600">{difficultyCount.mudah}</p>
                    <p className="text-xs text-gray-600 mt-1">10 poin/soal</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center border-2 border-orange-200">
                    <div className="text-2xl mb-2">⭐⭐</div>
                    <p className="text-sm font-medium text-gray-900">Sedang</p>
                    <p className="text-2xl font-bold text-orange-600">{difficultyCount.sedang}</p>
                    <p className="text-xs text-gray-600 mt-1">20 poin/soal</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center border-2 border-red-200">
                    <div className="text-2xl mb-2">⭐⭐⭐</div>
                    <p className="text-sm font-medium text-gray-900">Sulit</p>
                    <p className="text-2xl font-bold text-red-600">{difficultyCount.sulit}</p>
                    <p className="text-xs text-gray-600 mt-1">30 poin/soal</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <CardHeader>
                <CardTitle className="text-white">Informasi Kuis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5" />
                  <div>
                    <p className="text-blue-100 text-sm">Jumlah Soal</p>
                    <p className="font-bold">{selectedQuiz.totalQuestions} Soal</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5" />
                  <div>
                    <p className="text-blue-100 text-sm">Durasi</p>
                    <p className="font-bold">{selectedQuiz.duration} Menit</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5" />
                  <div>
                    <p className="text-blue-100 text-sm">Level</p>
                    <p className="font-bold">{selectedQuiz.level}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5" />
                  <div>
                    <p className="text-blue-100 text-sm">Total Poin</p>
                    <p className="font-bold">{totalPoints} Poin</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 gap-2 h-12" onClick={handleBeginQuiz}>
              <Play className="w-5 h-5" />
              Mulai Mengerjakan
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // QUIZ VIEW - will continue in next message due to length
  if (viewMode === "quiz" && selectedQuiz) {
    const questions = quizQuestions;
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const currentQ = questions[currentQuestion];

    return (
      <div className="fixed inset-0 z-50 bg-[#eef5ff] overflow-auto">
        <DndProvider backend={HTML5Backend}>
          <div className="max-w-5xl mx-auto p-6 space-y-6">
            {/* HEADER */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">{selectedQuiz.title}</h2>

              <Button
                className="bg-red-500 hover:bg-red-600 text-white font-semibold"
                onClick={() => {
                  const confirmExit = window.confirm("Yakin ingin keluar dari kuis?");
                  if (confirmExit) {
                    setViewMode("list");
                    setSelectedQuiz(null);
                    setCurrentQuestion(0);
                    setAnswers({});
                    setQuizQuestions([]);
                    setTimeLeft(0);
                  }
                }}
              >
                Keluar Kuis
              </Button>
            </div>

            {/* TIMER + PROGRESS */}
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
              <CardContent className="p-4">
                <div className="flex justify-between mb-2">
                  <div>
                    <p className="text-sm opacity-90">Waktu Tersisa</p>
                    <p className="text-2xl font-bold">{formatTime(timeLeft)}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm opacity-90">Progress</p>
                    <p className="text-xl font-bold">
                      {currentQuestion + 1}/{questions.length}
                    </p>
                  </div>
                </div>

                <Progress value={progress} className="h-2 bg-white/30" />
              </CardContent>
            </Card>

            {/* QUESTION */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-2">
                  <Badge>Soal {currentQuestion + 1}</Badge>
                  <Badge variant="secondary">{currentQ.difficulty}</Badge>

                  <Badge className="ml-auto bg-yellow-400 text-black">{currentQ.points} poin</Badge>
                </div>

                <p className="text-lg font-semibold text-gray-800 mb-2">{currentQ.question}</p>

                {/* MULTIPLE CHOICE */}
                {currentQ.type === "multiple-choice" && (
                  <div className="space-y-3">
                    {currentQ.options.map((option: string, i: number) => {
                      const selected = answers[currentQ.id] === i;

                      return (
                        <div
                          key={i}
                          onClick={() => setAnswers({ ...answers, [currentQ.id]: i })}
                          className={`p-4 border rounded-lg cursor-pointer transition
                          ${selected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`}
                        >
                          {option}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ESSAY */}
                {currentQ.type === "essay" && (
                  <Textarea
                    value={answers[currentQ.id] || ""}
                    onChange={(e) =>
                      setAnswers({
                        ...answers,
                        [currentQ.id]: e.target.value,
                      })
                    }
                    placeholder="Tulis jawaban anda..."
                  />
                )}
              </CardContent>
            </Card>

            {/* NAVIGATION */}
            <div className="flex justify-between">
              <Button variant="outline" disabled={currentQuestion === 0} onClick={() => setCurrentQuestion(currentQuestion - 1)}>
                Sebelumnya
              </Button>

              {currentQuestion < questions.length - 1 ? (
                <Button onClick={() => setCurrentQuestion(currentQuestion + 1)}>Selanjutnya</Button>
              ) : (
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleSubmitQuiz}>
                  Selesai
                </Button>
              )}
            </div>
          </div>
        </DndProvider>
      </div>
    );
  }

  // RESULT VIEW
  if (viewMode === "result" && quizResult && selectedQuiz) {
    const isPassed = quizResult.score >= 70;

    return (
      <>
        {showSuccess && (
          <div className="fixed top-5 right-5 z-[9999]">
            <div className="flex items-center gap-3 bg-green-600 text-white px-5 py-3 rounded-xl shadow-2xl border border-green-700">
              <span className="text-lg">✅</span>
              <span className="font-semibold">Kuis berhasil diselesaikan!</span>
            </div>
          </div>
        )}
        <div className="space-y-6">
          <Card className={`${isPassed ? "bg-gradient-to-br from-green-500 to-emerald-600" : "bg-gradient-to-br from-blue-500 to-indigo-600"} text-white`}>
            <CardContent className="pt-8 pb-8 text-center">
              <div className="mb-4">{isPassed ? <Trophy className="w-20 h-20 mx-auto text-yellow-300 animate-bounce" /> : <CheckCircle className="w-20 h-20 mx-auto text-white" />}</div>
              <h2 className="text-white mb-2">{isPassed ? "🎉 Selamat! Kuis Selesai" : "✅ Kuis Selesai"}</h2>
              <p className="text-sm mb-6 opacity-90">{isPassed ? "Anda berhasil menyelesaikan kuis dengan baik!" : "Kuis telah selesai dikerjakan. Terus semangat belajar!"}</p>

              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 mb-6">
                <p className="text-sm opacity-90 mb-2">Nilai Anda</p>
                <p className="text-6xl font-bold mb-2">{quizResult.score}</p>
                <p className="text-sm opacity-90">
                  {quizResult.earnedPoints} dari {quizResult.totalPoints} poin • {quizResult.correct} dari {quizResult.total} soal benar
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm opacity-90 mb-1">Benar</p>
                  <p className="text-xl font-bold">{quizResult.correct}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <XCircle className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm opacity-90 mb-1">Salah</p>
                  <p className="text-xl font-bold">{quizResult.total - quizResult.correct}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <Award className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm opacity-90 mb-1">Poin</p>
                  <p className="text-xl font-bold">+{quizResult.earnedPoints}</p>
                </div>
              </div>

              {isPassed && <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-500 px-6 py-2 text-base">🏆 Badge: Quiz Master</Badge>}
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setViewMode("list");
                setSelectedQuiz(null);
              }}
            >
              Kembali ke Daftar Kuis
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600" onClick={handleBeginQuiz}>
              Kerjakan Ulang
            </Button>
          </div>
        </div>
      </>
    );
  }

  return null;
}
