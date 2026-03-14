<template>
  <div class="space-y-6 pb-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <button
        @click="handleClose"
        class="flex items-center gap-2 text-[#155dfc] hover:text-[#0d4acf] transition-colors"
      >
        <ChevronLeft class="w-4 h-4" />
        <span class="font-medium text-sm">Kembali ke Quiz</span>
      </button>
      
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200">
          <Clock class="w-4 h-4 text-gray-600" />
          <span class="font-medium text-sm text-gray-900">{{ formatTime(timeElapsed) }}</span>
        </div>
        
        <div v-if="isCompleted" class="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 rounded-lg">
          <Trophy class="w-4 h-4 text-white" />
          <span class="font-medium text-sm text-white">{{ points }} Points</span>
        </div>
      </div>
    </div>

    <!-- Main Info Card -->
    <Card class="border border-gray-200">
      <CardContent class="pt-6 pb-6">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h2 class="font-semibold text-neutral-950 mb-2">Debugging Challenge: Array & Condition</h2>
            <p class="text-sm text-gray-600 mb-4">
              Temukan dan perbaiki bug dalam kode untuk menghitung rata-rata dan cek kelulusan
            </p>
            
            <!-- Soal/Pertanyaan -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <h3 class="text-sm font-medium text-blue-900 mb-2">📝 Soal:</h3>
              <div class="space-y-2 text-sm text-blue-800">
                <p>Kamu diberikan kode JavaScript yang memiliki beberapa bug. Tugasmu adalah:</p>
                <ol class="list-decimal list-inside space-y-1 ml-2">
                  <li>Temukan bug pada fungsi <code class="bg-blue-100 px-1 py-0.5 rounded">hitungRataRata</code> yang menyebabkan error saat mengakses array</li>
                  <li>Perbaiki kondisi pada fungsi <code class="bg-blue-100 px-1 py-0.5 rounded">cekKelulusan</code> agar siswa dengan nilai 75 dianggap lulus</li>
                  <li>Gunakan code editor di bawah untuk memperbaiki kode</li>
                  <li>Klik tombol "Run Code" untuk menguji jawaban kamu</li>
                </ol>
                <p class="mt-2 font-medium">💡 Petunjuk: Perhatikan kondisi loop dan operator perbandingan!</p>
              </div>
            </div>
          </div>
          <Badge variant="outline" class="bg-orange-100 text-orange-700 border-orange-200">
            <Bug class="w-3 h-3 mr-1" />
            {{ totalBugs }} Bugs
          </Badge>
        </div>

        <!-- Progress -->
        <div class="mb-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-600">Progress Debugging</span>
            <span class="text-sm font-medium text-gray-900">
              {{ fixedBugs }}/{{ totalBugs }} Bugs Fixed
            </span>
          </div>
          <Progress :value="progressPercentage" class="h-2" />
        </div>

        <!-- Bugs List -->
        <div class="space-y-2">
          <div
            v-for="bug in bugsFound"
            :key="bug.id"
            :class="[
              'flex items-start gap-3 p-3 rounded-lg border',
              bug.fixed
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            ]"
          >
            <CheckCircle2 v-if="bug.fixed" class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <XCircle v-else class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-medium text-gray-900">Line {{ bug.line }}</span>
                <Badge v-if="bug.fixed" variant="outline" class="bg-green-100 text-green-700 border-green-300 text-xs">
                  Fixed
                </Badge>
              </div>
              <p class="text-sm text-gray-700">{{ bug.description }}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Code Editor -->
    <Card class="border border-gray-200">
      <CardContent class="pt-6 pb-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <Terminal class="w-5 h-5 text-gray-600" />
            <h3 class="font-medium text-neutral-950">Code Editor</h3>
          </div>
          <Button
            @click="showHint = !showHint"
            variant="outline"
            size="sm"
            class="gap-2"
          >
            <Lightbulb class="w-4 h-4" />
            {{ showHint ? 'Hide' : 'Show' }} Hint
          </Button>
        </div>

        <div v-if="showHint" class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div class="flex gap-2">
            <Lightbulb class="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <div>
              <p class="text-sm font-medium text-yellow-900 mb-1">Hints:</p>
              <ul class="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                <li>Check the loop boundary condition - array indices start at 0</li>
                <li>Review the comparison operator for the passing grade (75)</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="relative">
          <Textarea
            v-model="code"
            class="font-mono text-sm min-h-[400px] bg-gray-50 border-gray-300 pl-14"
            placeholder="Write your code here..."
          />
          <div class="absolute top-0 left-0 w-12 bg-gray-200 h-full border-r border-gray-300 pointer-events-none">
            <div
              v-for="(line, idx) in codeLines"
              :key="idx"
              class="text-xs text-gray-600 text-center leading-[24px] font-mono"
            >
              {{ idx + 1 }}
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between mt-4">
          <Button
            @click="runCode"
            :disabled="isRunning"
            class="gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            <Play class="w-4 h-4" />
            {{ isRunning ? 'Running...' : 'Run Code' }}
          </Button>

          <Button
            @click="resetCode"
            variant="outline"
            size="sm"
          >
            Reset Code
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Test Cases -->
    <Card class="border border-gray-200">
      <CardContent class="pt-6 pb-6">
        <h3 class="font-medium text-neutral-950 mb-4">Test Cases</h3>
        <div class="space-y-3">
          <div
            v-for="test in tests"
            :key="test.id"
            :class="[
              'p-3 rounded-lg border',
              test.passed === true
                ? 'bg-green-50 border-green-200'
                : test.passed === false
                ? 'bg-red-50 border-red-200'
                : 'bg-gray-50 border-gray-200'
            ]"
          >
            <div class="flex items-start gap-3">
              <CheckCircle2 v-if="test.passed === true" class="w-5 h-5 text-green-600 flex-shrink-0" />
              <XCircle v-else-if="test.passed === false" class="w-5 h-5 text-red-600 flex-shrink-0" />
              <AlertCircle v-else class="w-5 h-5 text-gray-400 flex-shrink-0" />
              
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900 mb-1">
                  Test Case {{ test.id }}
                </p>
                <div class="space-y-1">
                  <p class="text-xs text-gray-600">
                    <span class="font-medium">Input:</span> {{ test.input }}
                  </p>
                  <p class="text-xs text-gray-600">
                    <span class="font-medium">Expected:</span> {{ test.expectedOutput }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Console Output -->
    <Card class="border border-gray-200">
      <CardContent class="pt-6 pb-6">
        <h3 class="font-medium text-neutral-950 mb-4">Console Output</h3>
        <div class="bg-gray-900 rounded-lg p-4 min-h-[200px] font-mono text-sm">
          <p v-if="output.length === 0" class="text-gray-500">Click "Run Code" to see output...</p>
          <div v-else class="space-y-1">
            <div
              v-for="(line, idx) in output"
              :key="idx"
              :class="[
                line.includes('✅')
                  ? 'text-green-400'
                  : line.includes('❌')
                  ? 'text-red-400'
                  : line.includes('⚠️')
                  ? 'text-yellow-400'
                  : line.includes('🎉')
                  ? 'text-blue-400'
                  : 'text-gray-300'
              ]"
            >
              {{ line }}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Completion Modal -->
    <Card v-if="isCompleted" class="border-2 border-blue-500 shadow-lg">
      <CardContent class="pt-6 pb-6">
        <div class="text-center">
          <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy class="w-8 h-8 text-white" />
          </div>
          <h3 class="font-semibold text-neutral-950 mb-2">Debugging Selesai!</h3>
          <p class="text-sm text-gray-600 mb-4">
            Selamat! Kamu berhasil memperbaiki semua bug dalam waktu {{ formatTime(timeElapsed) }}
          </p>
          <div class="flex items-center justify-center gap-6 mb-6">
            <div class="text-center">
              <p class="text-2xl font-bold text-blue-600">{{ points }}</p>
              <p class="text-xs text-gray-600">Points</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-blue-600">{{ fixedBugs }}/{{ totalBugs }}</p>
              <p class="text-xs text-gray-600">Bugs Fixed</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-blue-600">{{ formatTime(timeElapsed) }}</p>
              <p class="text-xs text-gray-600">Time</p>
            </div>
          </div>
          <Button
            @click="handleClose"
            class="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            Kembali ke Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Textarea } from './ui/textarea';
import {
  Play,
  ChevronLeft,
  Bug,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Clock,
  Trophy,
  AlertCircle,
  Terminal
} from 'lucide-vue-next';

// Props
interface Props {
  onClose: () => void;
}

const props = defineProps<Props>();

// Types
interface BugItem {
  id: number;
  line: number;
  description: string;
  fixed: boolean;
}

interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
  passed: boolean | null;
}

// Initial Code
const initialCode = `function hitungRataRata(angka) {
  let total = 0;
  for (let i = 0; i <= angka.length; i++) {
    total += angka[i];
  }
  return total / angka.length;
}

const nilai = [85, 90, 78, 92, 88];
console.log("Rata-rata:", hitungRataRata(nilai));

function cekKelulusan(nilai) {
  if (nilai > 75) {
    return "Lulus";
  }
  return "Tidak Lulus";
}

console.log(cekKelulusan(80));`;

const correctCode = `function hitungRataRata(angka) {
  let total = 0;
  for (let i = 0; i < angka.length; i++) {
    total += angka[i];
  }
  return total / angka.length;
}

const nilai = [85, 90, 78, 92, 88];
console.log("Rata-rata:", hitungRataRata(nilai));

function cekKelulusan(nilai) {
  if (nilai >= 75) {
    return "Lulus";
  }
  return "Tidak Lulus";
}

console.log(cekKelulusan(80));`;

// Initial Data
const initialTestCases: TestCase[] = [
  { id: 1, input: '[85, 90, 78, 92, 88]', expectedOutput: 'Rata-rata: 86.6', passed: null },
  { id: 2, input: 'cekKelulusan(75)', expectedOutput: 'Lulus', passed: null },
  { id: 3, input: 'cekKelulusan(80)', expectedOutput: 'Lulus', passed: null },
];

const initialBugs: BugItem[] = [
  { id: 1, line: 3, description: 'Loop condition should use < instead of <=', fixed: false },
  { id: 2, line: 13, description: 'Condition should use >= instead of >', fixed: false },
];

// State
const code = ref(initialCode);
const output = ref<string[]>([]);
const isRunning = ref(false);
const bugsFound = ref<BugItem[]>([...initialBugs]);
const tests = ref<TestCase[]>([...initialTestCases]);
const timeElapsed = ref(0);
const showHint = ref(false);
const points = ref(0);
const isCompleted = ref(false);

let timerInterval: number | null = null;

// Computed
const codeLines = computed(() => code.value.split('\n'));
const totalBugs = computed(() => bugsFound.value.length);
const fixedBugs = computed(() => bugsFound.value.filter(b => b.fixed).length);
const progressPercentage = computed(() => (fixedBugs.value / totalBugs.value) * 100);

// Methods
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const runCode = () => {
  isRunning.value = true;
  output.value = [];
  
  setTimeout(() => {
    const newOutput: string[] = [];
    const updatedTests = [...tests.value];
    
    try {
      const codeLines = code.value.split('\n');
      
      const hasLoopBug = codeLines.some(line => line.includes('i <= angka.length'));
      const hasConditionBug = codeLines.some(line => line.includes('if (nilai > 75)'));
      
      if (hasLoopBug) {
        newOutput.push('❌ Error: Array index out of bounds at line 3');
        newOutput.push('   TypeError: Cannot read property of undefined');
        updatedTests[0].passed = false;
      } else {
        newOutput.push('✅ Function hitungRataRata executed successfully');
        newOutput.push('   Rata-rata: 86.6');
        updatedTests[0].passed = true;
      }
      
      if (hasConditionBug) {
        newOutput.push('⚠️  Test failed: cekKelulusan(75) returned "Tidak Lulus"');
        newOutput.push('   Expected: "Lulus"');
        updatedTests[1].passed = false;
      } else {
        newOutput.push('✅ cekKelulusan(75) → Lulus');
        updatedTests[1].passed = true;
      }
      
      if (!hasConditionBug) {
        newOutput.push('✅ cekKelulusan(80) → Lulus');
        updatedTests[2].passed = true;
      } else {
        newOutput.push('✅ cekKelulusan(80) → Lulus');
        updatedTests[2].passed = true;
      }
      
      // Update bugs found
      const updatedBugs = bugsFound.value.map(bug => {
        if (bug.line === 3 && !hasLoopBug) return { ...bug, fixed: true };
        if (bug.line === 13 && !hasConditionBug) return { ...bug, fixed: true };
        return bug;
      });
      bugsFound.value = updatedBugs;
      
      // Check completion
      const allBugsFixed = !hasLoopBug && !hasConditionBug;
      if (allBugsFixed && !isCompleted.value) {
        isCompleted.value = true;
        const basePoints = 100;
        const timeBonus = Math.max(0, 50 - Math.floor(timeElapsed.value / 10));
        const hintPenalty = showHint.value ? 20 : 0;
        const finalPoints = basePoints + timeBonus - hintPenalty;
        points.value = finalPoints;
        newOutput.push('');
        newOutput.push('🎉 SEMUA BUG BERHASIL DIPERBAIKI!');
        newOutput.push(`   Points earned: ${finalPoints}`);
      }
      
      tests.value = updatedTests;
      
    } catch (error) {
      newOutput.push('❌ Runtime Error: Unexpected error occurred');
    }
    
    output.value = newOutput;
    isRunning.value = false;
  }, 1000);
};

const resetCode = () => {
  code.value = initialCode;
  output.value = [];
  bugsFound.value = [...initialBugs];
  tests.value = [...initialTestCases];
};

const handleClose = () => {
  props.onClose();
};

// Lifecycle
onMounted(() => {
  timerInterval = window.setInterval(() => {
    if (!isCompleted.value) {
      timeElapsed.value++;
    }
  }, 1000);
});

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});

watch(isCompleted, (newVal) => {
  if (newVal && timerInterval) {
    clearInterval(timerInterval);
  }
});
</script>
