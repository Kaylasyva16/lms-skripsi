import { useState, useEffect } from 'react';
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
} from 'lucide-react';

interface DebuggingPuzzlePageProps {
  onClose: () => void;
}

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

const testCases: TestCase[] = [
  { id: 1, input: '[85, 90, 78, 92, 88]', expectedOutput: 'Rata-rata: 86.6', passed: null },
  { id: 2, input: 'cekKelulusan(75)', expectedOutput: 'Lulus', passed: null },
  { id: 3, input: 'cekKelulusan(80)', expectedOutput: 'Lulus', passed: null },
];

const bugs: BugItem[] = [
  { id: 1, line: 3, description: 'Loop condition should use < instead of <=', fixed: false },
  { id: 2, line: 13, description: 'Condition should use >= instead of >', fixed: false },
];

export function DebuggingPuzzlePage({ onClose }: DebuggingPuzzlePageProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [bugsFound, setBugsFound] = useState<BugItem[]>(bugs);
  const [tests, setTests] = useState<TestCase[]>(testCases);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [points, setPoints] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isCompleted) {
      const timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const runCode = () => {
    setIsRunning(true);
    setOutput([]);
    
    setTimeout(() => {
      const newOutput: string[] = [];
      const updatedTests = [...tests];
      
      try {
        // Simulate code execution and bug detection
        const codeLines = code.split('\n');
        let hasError = false;
        
        // Check for specific bugs
        const hasLoopBug = codeLines.some(line => line.includes('i <= angka.length'));
        const hasConditionBug = codeLines.some(line => line.includes('if (nilai > 75)'));
        
        if (hasLoopBug) {
          newOutput.push('❌ Error: Array index out of bounds at line 3');
          newOutput.push('   TypeError: Cannot read property of undefined');
          hasError = true;
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
        const updatedBugs = bugsFound.map(bug => {
          if (bug.line === 3 && !hasLoopBug) return { ...bug, fixed: true };
          if (bug.line === 13 && !hasConditionBug) return { ...bug, fixed: true };
          return bug;
        });
        setBugsFound(updatedBugs);
        
        // Check completion
        const allBugsFixed = !hasLoopBug && !hasConditionBug;
        if (allBugsFixed && !isCompleted) {
          setIsCompleted(true);
          const basePoints = 100;
          const timeBonus = Math.max(0, 50 - Math.floor(timeElapsed / 10));
          const hintPenalty = showHint ? 20 : 0;
          const finalPoints = basePoints + timeBonus - hintPenalty;
          setPoints(finalPoints);
          newOutput.push('');
          newOutput.push('🎉 SEMUA BUG BERHASIL DIPERBAIKI!');
          newOutput.push(`   Points earned: ${finalPoints}`);
        }
        
        setTests(updatedTests);
        
      } catch (error) {
        newOutput.push('❌ Runtime Error: Unexpected error occurred');
      }
      
      setOutput(newOutput);
      setIsRunning(false);
    }, 1000);
  };

  const totalBugs = bugsFound.length;
  const fixedBugs = bugsFound.filter(b => b.fixed).length;
  const progressPercentage = (fixedBugs / totalBugs) * 100;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-[#155dfc] hover:text-[#0d4acf] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="font-medium text-sm">Kembali ke Quiz</span>
        </button>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="font-medium text-sm text-gray-900">{formatTime(timeElapsed)}</span>
          </div>
          
          {isCompleted && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 rounded-lg">
              <Trophy className="w-4 h-4 text-white" />
              <span className="font-medium text-sm text-white">{points} Points</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Info Card */}
      <Card className="border border-gray-200">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-semibold text-neutral-950 mb-2">Debugging Challenge: Array & Condition</h2>
              <p className="text-sm text-gray-600 mb-4">
                Temukan dan perbaiki bug dalam kode untuk menghitung rata-rata dan cek kelulusan
              </p>
              
              {/* Soal/Pertanyaan */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">📝 Soal:</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <p>Kamu diberikan kode JavaScript yang memiliki beberapa bug. Tugasmu adalah:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Temukan bug pada fungsi <code className="bg-blue-100 px-1 py-0.5 rounded">hitungRataRata</code> yang menyebabkan error saat mengakses array</li>
                    <li>Perbaiki kondisi pada fungsi <code className="bg-blue-100 px-1 py-0.5 rounded">cekKelulusan</code> agar siswa dengan nilai 75 dianggap lulus</li>
                    <li>Gunakan code editor di bawah untuk memperbaiki kode</li>
                    <li>Klik tombol "Run Code" untuk menguji jawaban kamu</li>
                  </ol>
                  <p className="mt-2 font-medium">💡 Petunjuk: Perhatikan kondisi loop dan operator perbandingan!</p>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200">
              <Bug className="w-3 h-3 mr-1" />
              {totalBugs} Bugs
            </Badge>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Progress Debugging</span>
              <span className="text-sm font-medium text-gray-900">
                {fixedBugs}/{totalBugs} Bugs Fixed
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Bugs List */}
          <div className="space-y-2">
            {bugsFound.map((bug) => (
              <div
                key={bug.id}
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  bug.fixed
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                {bug.fixed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-900">Line {bug.line}</span>
                    {bug.fixed && (
                      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 text-xs">
                        Fixed
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-700">{bug.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Code Editor */}
      <Card className="border border-gray-200">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-gray-600" />
              <h3 className="font-medium text-neutral-950">Code Editor</h3>
            </div>
            <Button
              onClick={() => setShowHint(!showHint)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Lightbulb className="w-4 h-4" />
              {showHint ? 'Hide' : 'Show'} Hint
            </Button>
          </div>

          {showHint && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-900 mb-1">Hints:</p>
                  <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                    <li>Check the loop boundary condition - array indices start at 0</li>
                    <li>Review the comparison operator for the passing grade (75)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="relative">
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="font-mono text-sm min-h-[400px] bg-gray-50 border-gray-300"
              placeholder="Write your code here..."
            />
            <div className="absolute top-0 left-0 w-12 bg-gray-200 h-full border-r border-gray-300 pointer-events-none">
              {code.split('\n').map((_, idx) => (
                <div
                  key={idx}
                  className="text-xs text-gray-600 text-center leading-[24px] font-mono"
                >
                  {idx + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <Button
              onClick={runCode}
              disabled={isRunning}
              className="gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              <Play className="w-4 h-4" />
              {isRunning ? 'Running...' : 'Run Code'}
            </Button>

            <Button
              onClick={() => setCode(initialCode)}
              variant="outline"
              size="sm"
            >
              Reset Code
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Cases */}
      <Card className="border border-gray-200">
        <CardContent className="pt-6 pb-6">
          <h3 className="font-medium text-neutral-950 mb-4">Test Cases</h3>
          <div className="space-y-3">
            {tests.map((test) => (
              <div
                key={test.id}
                className={`p-3 rounded-lg border ${
                  test.passed === true
                    ? 'bg-green-50 border-green-200'
                    : test.passed === false
                    ? 'bg-red-50 border-red-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {test.passed === true ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : test.passed === false ? (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Test Case {test.id}
                    </p>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Input:</span> {test.input}
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Expected:</span> {test.expectedOutput}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Console Output */}
      <Card className="border border-gray-200">
        <CardContent className="pt-6 pb-6">
          <h3 className="font-medium text-neutral-950 mb-4">Console Output</h3>
          <div className="bg-gray-900 rounded-lg p-4 min-h-[200px] font-mono text-sm">
            {output.length === 0 ? (
              <p className="text-gray-500">Click "Run Code" to see output...</p>
            ) : (
              <div className="space-y-1">
                {output.map((line, idx) => (
                  <div
                    key={idx}
                    className={`${
                      line.includes('✅')
                        ? 'text-green-400'
                        : line.includes('❌')
                        ? 'text-red-400'
                        : line.includes('⚠️')
                        ? 'text-yellow-400'
                        : line.includes('🎉')
                        ? 'text-blue-400'
                        : 'text-gray-300'
                    }`}
                  >
                    {line}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Completion Modal */}
      {isCompleted && (
        <Card className="border-2 border-blue-500 shadow-lg">
          <CardContent className="pt-6 pb-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-neutral-950 mb-2">Debugging Selesai!</h3>
              <p className="text-sm text-gray-600 mb-4">
                Selamat! Kamu berhasil memperbaiki semua bug dalam waktu {formatTime(timeElapsed)}
              </p>
              <div className="flex items-center justify-center gap-6 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{points}</p>
                  <p className="text-xs text-gray-600">Points</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{fixedBugs}/{totalBugs}</p>
                  <p className="text-xs text-gray-600">Bugs Fixed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{formatTime(timeElapsed)}</p>
                  <p className="text-xs text-gray-600">Time</p>
                </div>
              </div>
              <Button
                onClick={onClose}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                Kembali ke Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}