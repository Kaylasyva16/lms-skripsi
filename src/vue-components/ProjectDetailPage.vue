<template>
  <div class="space-y-6 pb-8">
    <!-- Back Button -->
    <button
      @click="handleClose"
      class="flex items-center gap-2 text-[#155dfc] hover:text-[#0d4acf] transition-colors"
    >
      <ChevronLeft class="w-4 h-4" />
      <span class="font-medium text-sm tracking-[-0.15px]">Kembali ke Daftar Project</span>
    </button>

    <!-- Main Project Card -->
    <Card class="border border-[rgba(0,0,0,0.1)]">
      <CardContent class="pt-6 pb-6">
        <!-- Project Title & Status -->
        <div class="flex items-start justify-between mb-6">
          <div class="flex-1">
            <h3 class="text-base text-neutral-950 mb-1 tracking-[-0.31px]">Sistem Kasir Minimarket</h3>
            <p class="text-base text-[#717182] tracking-[-0.31px]">Progress Pengerjaan: Kelompok Alpha</p>
          </div>
          <Badge variant="outline" class="bg-[#eceef2] text-[#030213] border-0 text-xs font-medium h-[22px] px-3">
            <AlertCircle class="w-3 h-3 mr-1.5" />
            Belum Selesai
          </Badge>
        </div>

        <!-- Team Members -->
        <div class="mb-6">
          <p class="text-sm text-[#4a5565] mb-3 tracking-[-0.15px]">Anggota Kelompok:</p>
          <div class="flex flex-wrap gap-3">
            <div
              v-for="(member, idx) in teamMembers"
              :key="idx"
              class="bg-blue-50 rounded-[10px] px-3 py-2.5 flex items-center gap-3 min-w-[150px]"
            >
              <div :class="`${member.color} w-8 h-8 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0`">
                {{ member.initials }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-[#1c398e] leading-5 tracking-[-0.15px] truncate">{{ member.name }}</p>
                <p class="text-xs text-[#4a5565] leading-4 truncate">{{ member.role }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Overall Progress -->
        <div class="mb-4">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm text-[#4a5565] tracking-[-0.15px]">Progress Keseluruhan</p>
            <p class="text-sm text-[#1c398e] tracking-[-0.15px]">
              {{ completedStages }}/{{ totalStages }} Tahap Selesai
            </p>
          </div>
          <Progress :value="progressPercentage" class="h-3" />
        </div>

        <!-- Warning Alert -->
        <div class="bg-yellow-50 border border-[#fff085] rounded-[10px] p-4 flex gap-3">
          <AlertCircle class="w-5 h-5 text-[#D08700] flex-shrink-0 mt-0.5" />
          <div>
            <p class="text-sm text-[#733e0a] leading-5 tracking-[-0.15px] mb-1">
              Kelompok ini belum bisa dinilai karena belum menyelesaikan semua sintaks.
            </p>
            <p class="text-xs text-[#a65f00] leading-4">
              Siswa harus menyelesaikan 6 sintaks untuk mendapatkan nilai.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Sintaks Navigation -->
    <div class="bg-white rounded-[14px] border border-[rgba(0,0,0,0.1)] p-1">
      <div class="flex gap-1 overflow-x-auto">
        <button
          v-for="step in sintaksSteps"
          :key="step.id"
          @click="step.unlocked && (activeSintaks = step.id)"
          :disabled="!step.unlocked"
          :class="[
            'flex-1 min-w-[160px] rounded-[14px] px-2 py-3 flex flex-col items-center justify-center gap-1.5 transition-all',
            activeSintaks === step.id
              ? 'bg-[#2b7fff] text-white'
              : step.unlocked
              ? 'text-neutral-950 hover:bg-gray-50 cursor-pointer'
              : 'text-gray-400 bg-gray-100 cursor-not-allowed opacity-60'
          ]"
        >
          <div class="flex items-center gap-1.5">
            <Clock v-if="step.unlocked" class="w-4 h-4" />
            <Lock v-else class="w-4 h-4" />
            <span class="text-xs font-medium leading-4">{{ step.title }}</span>
          </div>
          <span :class="`text-xs leading-[15px] text-center ${activeSintaks === step.id ? 'opacity-80' : 'opacity-80'}`">
            {{ step.subtitle }}
          </span>
        </button>
      </div>
    </div>

    <!-- Stages Detail -->
    <div class="space-y-4">
      <h3 class="font-medium text-neutral-950">Tahap-tahap Pengerjaan</h3>
      
      <Card
        v-for="stage in stages"
        :key="stage.id"
        :class="[
          'border',
          stage.feedback ? 'bg-green-50 border-green-200' : 'bg-white border-gray-300'
        ]"
      >
        <CardContent class="pt-5 pb-5">
          <!-- Stage Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <CheckCircle2
                v-if="stage.status === 'SELESAI'"
                :class="[
                  'w-6 h-6 flex-shrink-0',
                  stage.feedback ? 'text-green-600' : 'text-gray-400'
                ]"
              />
              <XCircle v-else-if="stage.status === 'BELUM SELESAI'" class="w-6 h-6 text-gray-400 flex-shrink-0" />
              <Clock v-else class="w-6 h-6 text-gray-400 flex-shrink-0" />
              
              <div>
                <h4 class="font-medium text-neutral-950 mb-0.5">{{ stage.title }}</h4>
                <p class="text-sm text-[#4a5565]">{{ stage.subtitle }}</p>
              </div>
            </div>
            <Badge v-if="stage.feedback" variant="outline" class="bg-green-100 text-green-700 border-green-300 text-xs">
              Sudah Diberi Feedback
            </Badge>
          </div>

          <!-- Hasil Pengerjaan -->
          <div class="mb-4">
            <p class="text-xs font-medium text-gray-700 mb-2">Hasil Pengerjaan:</p>
            <div v-if="editingStageId === stage.id" class="space-y-3">
              <Textarea
                v-model="editedAnswer"
                class="w-full min-h-[120px] bg-white border-gray-300"
                placeholder="Tulis jawaban Anda di sini..."
              />
              <div class="flex gap-2">
                <Button
                  @click="handleSave"
                  size="sm"
                  class="gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  <Save class="w-4 h-4" />
                  Simpan Perubahan
                </Button>
                <Button
                  @click="handleCancel"
                  variant="outline"
                  size="sm"
                  class="gap-2"
                >
                  <X class="w-4 h-4" />
                  Batal
                </Button>
              </div>
            </div>
            <div
              v-else
              :class="[
                'p-3 rounded border',
                stage.feedback ? 'bg-white border-green-200' : 'bg-gray-50 border-gray-200'
              ]"
            >
              <p class="text-sm text-gray-600 leading-relaxed">
                {{ stageAnswers[stage.id] || stage.description }}
              </p>
            </div>
          </div>

          <!-- Feedback -->
          <div v-if="stage.feedback" class="bg-white rounded-lg border border-green-200 p-4 mb-4">
            <div class="flex items-center gap-2 mb-2">
              <CheckCircle2 class="w-4 h-4 text-green-600" />
              <p class="text-xs font-medium text-green-700">{{ stage.feedback }}:</p>
            </div>
            <p class="text-sm text-gray-600 leading-relaxed pl-6">{{ stage.feedbackText }}</p>
          </div>

          <!-- Artifact Link -->
          <div v-if="stage.artifactLink" class="mb-4">
            <p class="text-xs font-medium text-gray-700 mb-2">Artikel Referensi:</p>
            <a
              :href="stage.artifactLink"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm text-[#155dfc] hover:underline flex items-center gap-1"
            >
              <span>📎</span>
              {{ stage.artifactLink }}
            </a>
          </div>

          <!-- Task Note -->
          <div v-if="stage.taskNote" class="p-3 bg-yellow-50 rounded border border-yellow-200">
            <p class="text-sm text-yellow-800 leading-relaxed flex items-start gap-2">
              <span class="text-yellow-600">⚠️</span>
              {{ stage.taskNote }}
            </p>
          </div>

          <!-- Edit Button -->
          <Button
            v-if="stage.status !== 'BELUM MENGERJAKAN' && editingStageId !== stage.id"
            @click="handleEdit(stage.id)"
            variant="ghost"
            size="sm"
            :class="[
              'mt-3 gap-2',
              stage.feedback
                ? 'text-green-600 hover:text-green-700 hover:bg-green-100'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            <Edit2 class="w-4 h-4" />
            Edit Jawaban
          </Button>
        </CardContent>
      </Card>
    </div>

    <!-- Feedback Guru Summary -->
    <Card class="border border-gray-200">
      <CardContent class="pt-5 pb-5">
        <div class="flex items-start gap-2 mb-2">
          <span class="text-lg">💬</span>
          <h4 class="font-medium text-neutral-950">Feedback Guru</h4>
        </div>
        <p class="text-sm text-gray-600 leading-relaxed pl-7">
          Sintaks 1 sudah dikerjakan dengan baik. Hanya saja tahap ke-tahap perlu dijalankan secara lebih detail untuk memastikan 
          indikator yang ada terukur dengan baik.
        </p>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Textarea } from './ui/textarea';
import {
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Edit2,
  Lock,
  Save,
  X
} from 'lucide-vue-next';

// Props
interface Props {
  onClose: () => void;
}

const props = defineProps<Props>();

// Data
const teamMembers = [
  { name: 'Ahmad Syarif', role: 'Project Leader', initials: 'AS', color: 'bg-[#2b7fff]' },
  { name: 'Budi Santoso', role: 'Database Designer', initials: 'BS', color: 'bg-[#2b7fff]' },
  { name: 'Citra Dewi', role: 'UI/UX Designer', initials: 'CD', color: 'bg-[#2b7fff]' },
];

const sintaksSteps = [
  { id: 1, title: 'Sintaks 1', subtitle: 'Identifikasi Masalah', unlocked: true },
  { id: 2, title: 'Sintaks 2', subtitle: 'Merencanakan Project', unlocked: false },
  { id: 3, title: 'Sintaks 3', subtitle: 'Menyusun Jadwal', unlocked: false },
  { id: 4, title: 'Sintaks 4', subtitle: 'Pembuatan Project', unlocked: false },
  { id: 5, title: 'Sintaks 5', subtitle: 'Hasil Project', unlocked: false },
  { id: 6, title: 'Sintaks 6', subtitle: 'Evaluasi', unlocked: false },
];

const stages = [
  {
    id: 1,
    title: 'Tahap 1: Orientasi',
    subtitle: 'Memahami konteks permasalahan',
    status: 'SELESAI',
    description: 'Minimarket membutuhkan sistem kasir yang efisien untuk mengelola transaksi penjualan, stok barang, dan laporan. Jika manual, stok sulit dilacak dan transaksi lama.',
    feedback: 'Feedback Guru',
    feedbackText: 'Bagus! Orientasi masalah sudah jelas sekali dan berorientasi pada kebutuhan real-world. Good job!',
  },
  {
    id: 2,
    title: 'Tahap 2: Rencana',
    subtitle: 'Merumuskan rencana secara jelas',
    status: 'SELESAI',
    description: 'Bugomore membuat sistem kasir yang efisien dan mudah digunakan untuk minimarket dengan fitur manajemen produk, transaksi, dan laporan penjualan!',
    feedback: 'Feedback Guru',
    feedbackText: 'Rencana sudah terstruktur dengan baik. Perhatikan penjabaran sudah mencakup aspek utama dari sistem kasir.',
    artifactLink: 'https://figma.com/rancang-minimarket-management',
  },
  {
    id: 3,
    title: 'Tahap 3: Memvalidasi',
    subtitle: 'Validasi dan tentang kelengkapan',
    status: 'BELUM SELESAI',
    description: 'Indikator: Sistem dapat melakukan transaksi dengan cepat, mengelola stok barang, dan menghasilkan laporan penjualan!',
    feedback: 'Feedback Guru',
    feedbackText: 'Indikator kelengkapan perlu diuraikankan dengan metrik yang lebih spesifik. Contoh: waktu transaksi < 2 menit, tingkat kesalahan < 1%, dll.',
    taskNote: 'Indikasi kelembapan perlu diuraiankan dengan metrik yang lebih spesifik. Contoh: waktu transaksi < 2 menit, tingkat kesalahan < 1%, dll.',
  },
  {
    id: 4,
    title: 'Tahap 4: Analisis',
    subtitle: 'Analisis dan permasalahan',
    status: 'BELUM MENGERJAKAN',
    description: 'Sisihkan melakukan analisa mendetail tentang proses bisnis minimarket dari kasir, tracking stok hingga laporan penjualan.',
  },
];

// State
const activeSintaks = ref(1);
const editingStageId = ref<number | null>(null);
const editedAnswer = ref('');
const stageAnswers = ref<Record<number, string>>({
  1: 'Minimarket membutuhkan sistem kasir yang efisien untuk mengelola transaksi penjualan, stok barang, dan laporan. Jika manual, stok sulit dilacak dan transaksi lama.',
  2: 'Bugomore membuat sistem kasir yang efisien dan mudah digunakan untuk minimarket dengan fitur manajemen produk, transaksi, dan laporan penjualan!',
  3: 'Indikator: Sistem dapat melakukan transaksi dengan cepat, mengelola stok barang, dan menghasilkan laporan penjualan!',
});

// Computed
const completedStages = computed(() => stages.filter(s => s.status === 'SELESAI').length);
const totalStages = computed(() => stages.length);
const progressPercentage = computed(() => (completedStages.value / totalStages.value) * 100);

// Methods
const handleClose = () => {
  props.onClose();
};

const handleEdit = (stageId: number) => {
  editingStageId.value = stageId;
  editedAnswer.value = stageAnswers.value[stageId] || '';
};

const handleSave = () => {
  if (editingStageId.value !== null) {
    stageAnswers.value[editingStageId.value] = editedAnswer.value;
    editingStageId.value = null;
    editedAnswer.value = '';
  }
};

const handleCancel = () => {
  editingStageId.value = null;
  editedAnswer.value = '';
};
</script>
