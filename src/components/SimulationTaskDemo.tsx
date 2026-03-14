/**
 * SIMULATION TASK DEMO COMPONENT
 * 
 * Ini adalah komponen demo untuk menunjukkan cara kerja Simulation Task
 * dengan sistem Drag & Drop
 * 
 * CARA KERJA:
 * 1. User melihat langkah-langkah yang perlu disusun
 * 2. User drag & drop langkah ke urutan yang benar
 * 3. User klik "Run Simulation"
 * 4. Sistem menampilkan hasil benar/salah dengan penjelasan
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CheckCircle2, XCircle, Play, Cpu, GripVertical } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface DragItem {
  index: number;
  text: string;
}

function DraggableStep({ 
  step, 
  index, 
  moveStep 
}: { 
  step: string; 
  index: number; 
  moveStep: (from: number, to: number) => void 
}) {
  const [{ isDragging }, drag] = useDrag({
    type: 'step',
    item: { index, text: step },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const [, drop] = useDrop({
    accept: 'step',
    hover: (draggedItem: DragItem) => {
      if (draggedItem.index !== index) {
        moveStep(draggedItem.index, index);
        draggedItem.index = index;
      }
    }
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`flex items-center gap-3 p-4 rounded-lg border-2 bg-white cursor-move transition-all ${
        isDragging 
          ? 'opacity-50 border-indigo-500 shadow-lg' 
          : 'border-gray-200 hover:border-indigo-300 hover:shadow-md'
      }`}
    >
      <GripVertical className="w-5 h-5 text-gray-400" />
      <span className="flex-1 text-gray-700">{step}</span>
      <Badge className="bg-indigo-500">{index + 1}</Badge>
    </div>
  );
}

export function SimulationTaskDemo() {
  const correctSteps = [
    'Input nilai 5',
    'Input nilai 3',
    'Proses: 5 + 3 = 8',
    'Output: 8'
  ];

  const [steps, setSteps] = useState([...correctSteps]);
  const [hasRun, setHasRun] = useState(false);

  const moveStep = (fromIndex: number, toIndex: number) => {
    const newSteps = [...steps];
    const [movedItem] = newSteps.splice(fromIndex, 1);
    newSteps.splice(toIndex, 0, movedItem);
    setSteps(newSteps);
  };

  const runSimulation = () => {
    setHasRun(true);
  };

  const isCorrect = JSON.stringify(steps) === JSON.stringify(correctSteps);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-gray-900 mb-2">🎮 Simulation Task Demo</h1>
            <p className="text-gray-600">
              Sistem Drag & Drop untuk Simulasi Eksekusi Algoritma
            </p>
          </div>

          <Card className="border-2 border-indigo-200">
            <CardHeader>
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-2">
                  <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500">
                    Soal Demo
                  </Badge>
                  <Badge className="bg-green-500">
                    ⭐ Mudah - 10 poin
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-lg">
                Simulasi: Jumlahkan 5 + 3
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Instruksi */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
                  <p className="text-sm font-medium text-gray-900 mb-1 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-indigo-500" />
                    Susun langkah eksekusi operasi penjumlahan dengan benar
                  </p>
                  <p className="text-sm text-gray-600">
                    Drag & drop langkah-langkah berikut sesuai urutan yang benar
                  </p>
                </div>

                {/* Draggable Steps */}
                {!hasRun ? (
                  <>
                    <div className="space-y-3">
                      {steps.map((step, index) => (
                        <DraggableStep 
                          key={`${step}-${index}`}
                          step={step}
                          index={index}
                          moveStep={moveStep}
                        />
                      ))}
                    </div>

                    {/* Run Button */}
                    <Button
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 gap-2 h-12"
                      onClick={runSimulation}
                    >
                      <Play className="w-5 h-5" />
                      Run Simulation
                    </Button>
                  </>
                ) : (
                  /* Result Display */
                  <>
                    <div className={`rounded-lg p-6 border-2 ${
                      isCorrect
                        ? 'bg-green-50 border-green-500'
                        : 'bg-red-50 border-red-500'
                    }`}>
                      <div className="flex items-center gap-3 mb-4">
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                            <div>
                              <p className="font-bold text-green-700">Correct! ✓</p>
                              <p className="text-sm text-green-600">
                                Simulasi berjalan dengan urutan yang benar
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-8 h-8 text-red-500" />
                            <div>
                              <p className="font-bold text-red-700">Incorrect ✗</p>
                              <p className="text-sm text-red-600">
                                Urutan simulasi tidak tepat
                              </p>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Penjelasan */}
                      <div className="bg-white rounded-lg p-4 border mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Penjelasan:</p>
                        <p className="text-sm text-gray-600">
                          Urutan yang benar: Input kedua nilai → Proses penjumlahan → Output hasil
                        </p>
                      </div>

                      {/* Comparison */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4 border">
                          <p className="text-xs font-medium text-gray-600 mb-3">Urutan Anda:</p>
                          <div className="space-y-2">
                            {steps.map((step, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-gray-100">{idx + 1}</Badge>
                                <span className="text-sm text-gray-700">{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border">
                          <p className="text-xs font-medium text-green-600 mb-3">Urutan Benar:</p>
                          <div className="space-y-2">
                            {correctSteps.map((step, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-green-100 text-green-700">
                                  {idx + 1}
                                </Badge>
                                <span className="text-sm text-gray-700">{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Info: Tidak ada pengulangan */}
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-700 text-center">
                          💡 Jawaban sudah final. Lanjut ke soal berikutnya!
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-blue-100 text-sm mb-2">Step 1</p>
                  <p className="font-bold mb-2">Drag & Drop</p>
                  <p className="text-sm text-blue-100">
                    Susun langkah sesuai urutan yang benar
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-purple-100 text-sm mb-2">Step 2</p>
                  <p className="font-bold mb-2">Run Simulation</p>
                  <p className="text-sm text-purple-100">
                    Klik tombol untuk menjalankan simulasi
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-green-100 text-sm mb-2">Step 3</p>
                  <p className="font-bold mb-2">Get Feedback</p>
                  <p className="text-sm text-green-100">
                    Lihat hasil dan penjelasan lengkap
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>✨ Fitur Simulation Task</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span>🎯</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Interactive Learning</p>
                    <p className="text-sm text-gray-600">
                      User aktif menyusun urutan, bukan hanya memilih
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span>🧠</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Deep Understanding</p>
                    <p className="text-sm text-gray-600">
                      Melatih pemahaman flow algoritma secara mendalam
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span>👁️</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Visual Learning</p>
                    <p className="text-sm text-gray-600">
                      Melihat langkah demi langkah secara visual
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <span>⚡</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Final Answer</p>
                    <p className="text-sm text-gray-600">
                      Jawaban final setelah run - tidak ada pengulangan
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DndProvider>
  );
}
