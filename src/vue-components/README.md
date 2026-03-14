# 🎓 LMS PjBL - Vue 3 Components

Komponen Vue 3 dengan Composition API dan Tailwind CSS untuk Learning Management System berbasis Project-Based Learning.

## 📁 Struktur File

```
vue-components/
├── ProjectDetailPage.vue          # Halaman detail project dengan feedback & edit
├── DebuggingPuzzlePage.vue       # Halaman debugging challenge dengan compiler
├── ui/
│   ├── card.vue                  # Card container component
│   ├── card-content.vue          # Card content wrapper
│   ├── badge.vue                 # Badge/label component
│   ├── button.vue                # Button component dengan variants
│   ├── progress.vue              # Progress bar component
│   └── textarea.vue              # Textarea input component
└── README.md                     # Dokumentasi
```

## 🚀 Instalasi & Setup

### 1. Install Dependencies

```bash
# Install Vue 3
npm install vue@latest

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install Lucide Icons untuk Vue
npm install lucide-vue-next
```

### 2. Konfigurasi Tailwind CSS

Tambahkan di `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./vue-components/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neutral-950': '#0a0a0a',
      },
    },
  },
  plugins: [],
}
```

### 3. Import CSS di `main.ts`

```typescript
import { createApp } from 'vue'
import './style.css'  // Tailwind CSS
import App from './App.vue'

createApp(App).mount('#app')
```

### 4. Tambahkan di `style.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 📦 Cara Menggunakan

### ProjectDetailPage Component

```vue
<template>
  <div>
    <ProjectDetailPage :on-close="handleClose" />
  </div>
</template>

<script setup lang="ts">
import ProjectDetailPage from './vue-components/ProjectDetailPage.vue';

const handleClose = () => {
  console.log('Navigate back to project list');
  // Implementasi navigasi
};
</script>
```

**Props:**
- `onClose: () => void` - Callback untuk menutup halaman detail

**Fitur:**
- ✅ Progress tracking dengan visual bar
- ✅ Tahap-tahap pengerjaan dengan status (Selesai, Belum Selesai, Belum Mengerjakan)
- ✅ Background hijau untuk tahap yang sudah diberi feedback
- ✅ Edit jawaban dengan textarea
- ✅ Simpan dan batal edit
- ✅ Artifact links dan task notes

### DebuggingPuzzlePage Component

```vue
<template>
  <div>
    <DebuggingPuzzlePage :on-close="handleClose" />
  </div>
</template>

<script setup lang="ts">
import DebuggingPuzzlePage from './vue-components/DebuggingPuzzlePage.vue';

const handleClose = () => {
  console.log('Navigate back to quiz list');
  // Implementasi navigasi
};
</script>
```

**Props:**
- `onClose: () => void` - Callback untuk menutup halaman debugging

**Fitur:**
- ✅ Code editor dengan line numbers
- ✅ Compiler simulation dengan syntax checking
- ✅ Bug tracking system (realtime detection)
- ✅ Test cases otomatis
- ✅ Console output dengan warna syntax
- ✅ Timer & points system
- ✅ Hint system dengan penalty
- ✅ Completion screen dengan trophy animation

## 🎨 UI Components

### Card & CardContent

```vue
<template>
  <Card class="border border-gray-200">
    <CardContent class="pt-6 pb-6">
      <p>Content here</p>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent } from './ui/card';
</script>
```

### Badge

```vue
<template>
  <Badge variant="outline" class="bg-green-100 text-green-700">
    Status Badge
  </Badge>
</template>

<script setup lang="ts">
import { Badge } from './ui/badge';
</script>
```

**Variants:** `default` | `outline` | `secondary` | `destructive`

### Button

```vue
<template>
  <Button
    @click="handleClick"
    variant="default"
    size="default"
  >
    Click Me
  </Button>
</template>

<script setup lang="ts">
import { Button } from './ui/button';

const handleClick = () => {
  console.log('Button clicked');
};
</script>
```

**Variants:** `default` | `outline` | `ghost` | `destructive` | `secondary` | `link`
**Sizes:** `default` | `sm` | `lg` | `icon`

### Progress

```vue
<template>
  <Progress :value="75" class="h-2" />
</template>

<script setup lang="ts">
import { Progress } from './ui/progress';
</script>
```

**Props:**
- `value: number` - Progress value (0-100)

### Textarea

```vue
<template>
  <Textarea
    v-model="text"
    placeholder="Enter text..."
    class="min-h-[120px]"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Textarea } from './ui/textarea';

const text = ref('');
</script>
```

## 🎯 Fitur Utama

### 1. Project Detail Page
- **Feedback System**: Background hijau untuk tahap yang sudah diberi feedback guru
- **Edit Mode**: Textarea untuk mengedit jawaban dengan tombol Simpan & Batal
- **Progress Tracking**: Visual progress bar dan counter tahap selesai
- **Team Members**: Display anggota kelompok dengan avatar
- **Sintaks Navigation**: Tab navigation untuk 6 sintaks PjBL
- **Task Notes**: Warning dan catatan untuk setiap tahap

### 2. Debugging Puzzle Page
- **Interactive Code Editor**: Editor dengan line numbers dan syntax highlight
- **Bug Detection**: Automatic bug detection saat run code
- **Test Cases**: Automated test cases dengan visual feedback
- **Console Output**: Terminal-style console dengan colored output
- **Gamification**: Points system, timer, dan completion screen
- **Hint System**: Optional hints dengan point penalty

## 🔧 Customization

### Mengubah Warna Tema

Edit di `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: {
        50: '#e6f2ff',
        // ... custom colors
      }
    }
  }
}
```

### Menambah Stage/Tahap Baru

Edit array `stages` di `ProjectDetailPage.vue`:

```typescript
const stages = [
  // ... existing stages
  {
    id: 5,
    title: 'Tahap 5: Testing',
    subtitle: 'Pengujian sistem',
    status: 'BELUM MENGERJAKAN',
    description: 'Deskripsi tahap testing...',
  }
];
```

### Menambah Test Case Baru

Edit array `initialTestCases` di `DebuggingPuzzlePage.vue`:

```typescript
const initialTestCases: TestCase[] = [
  // ... existing test cases
  { 
    id: 4, 
    input: 'newTest(100)', 
    expectedOutput: 'Success', 
    passed: null 
  },
];
```

## 🌐 Integrasi dengan Router

### Vue Router Setup

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import ProjectDetailPage from '../vue-components/ProjectDetailPage.vue';
import DebuggingPuzzlePage from '../vue-components/DebuggingPuzzlePage.vue';

const routes = [
  {
    path: '/project/:id',
    name: 'ProjectDetail',
    component: ProjectDetailPage,
    props: (route) => ({
      onClose: () => router.push('/projects')
    })
  },
  {
    path: '/quiz/debugging/:id',
    name: 'DebuggingPuzzle',
    component: DebuggingPuzzlePage,
    props: (route) => ({
      onClose: () => router.push('/quiz')
    })
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
```

## 📱 Responsive Design

Semua komponen sudah responsive dengan breakpoint:
- Mobile: `< 640px`
- Tablet: `640px - 1024px`
- Desktop: `> 1024px`

## 🔐 TypeScript Support

Semua komponen menggunakan TypeScript dengan:
- Interface props yang type-safe
- Event emitters dengan typed parameters
- Computed properties dengan type inference

## 🎨 Icon Usage

Menggunakan `lucide-vue-next` untuk icons:

```vue
<script setup lang="ts">
import { 
  CheckCircle2, 
  XCircle, 
  Clock 
} from 'lucide-vue-next';
</script>

<template>
  <CheckCircle2 class="w-5 h-5 text-green-600" />
</template>
```

## 📝 Best Practices

1. **Composition API**: Gunakan `<script setup>` untuk cleaner code
2. **Reactive State**: Gunakan `ref()` untuk primitive values, `reactive()` untuk objects
3. **Computed**: Gunakan `computed()` untuk derived state
4. **Props Validation**: Definisikan interface untuk props
5. **Event Emitters**: Gunakan typed emits untuk type safety
6. **Lifecycle Hooks**: Gunakan `onMounted`, `onUnmounted` untuk side effects

## 🐛 Troubleshooting

### Icons tidak muncul
```bash
npm install lucide-vue-next
```

### Tailwind classes tidak bekerja
Pastikan `tailwind.config.js` sudah include path Vue components:
```js
content: ["./vue-components/**/*.{vue,js,ts,jsx,tsx}"]
```

### TypeScript errors
```bash
npm install --save-dev @types/node
```

## 📄 License

MIT License - Free to use untuk project pendidikan

## 👨‍💻 Author

Created for LMS PjBL SMK RPL Project

---

**Happy Coding! 🚀**
