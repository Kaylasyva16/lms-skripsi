import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Textarea } from './ui/textarea';
import { ChevronLeft, CheckCircle2, XCircle, Clock, AlertCircle, Edit2, Lock, Save, X } from 'lucide-react';

interface ProjectDetailPageProps {
  onClose: () => void;
}

const teamMembers = [
  { name: 'Ahmad Syarif', role: 'Project Leader', initials: 'AS', color: 'bg-[#2b7fff]' },
  { name: 'Budi Santoso', role: 'Database Designer', initials: 'BS', color: 'bg-[#2b7fff]' },
  { name: 'Citra Dewi', role: 'UI/UX Designer', initials: 'CD', color: 'bg-[#2b7fff]' },
];

const sintaksSteps = [
  { id: 1, title: 'Sintaks 1', subtitle: 'Identifikasi Masalah', unlocked: true },
  { id: 2, title: 'Sintaks 2', subtitle: 'Perencanaan Proyek', unlocked: true },
  { id: 3, title: 'Sintaks 3', subtitle: 'Penyusunan Jadwal', unlocked: true },
  { id: 4, title: 'Sintaks 4', subtitle: 'Pelaksanaan Proyek', unlocked: true },
  { id: 5, title: 'Sintaks 5', subtitle: 'Evaluasi & Refleksi', unlocked: true },
];

const stages = [
  {
    id: 1,
    title: 'Tahap 1: Orientasi',
    subtitle: 'Memahami konteks permasalahan',
    status: 'SELESAI',
    statusColor: 'bg-green-100 text-green-700 border-green-200',
    description: 'Minimarket membutuhkan sistem kasir yang efisien untuk mengelola transaksi penjualan, stok barang, dan laporan. Jika manual, stok sulit dilacak dan transaksi lama.',
    feedback: 'Feedback Guru',
    feedbackText: 'Bagus! Orientasi masalah sudah jelas sekali dan berorientasi pada kebutuhan real-world. Good job!',
  },
  {
    id: 2,
    title: 'Tahap 2: Rencana',
    subtitle: 'Merumuskan rencana secara jelas',
    status: 'SELESAI',
    statusColor: 'bg-green-100 text-green-700 border-green-200',
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
    statusColor: 'bg-red-100 text-red-700 border-red-200',
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
    statusColor: 'bg-gray-100 text-gray-700 border-gray-200',
    description: 'Sisihkan melakukan analisa mendetail tentang proses bisnis minimarket dari kasir, tracking stok hingga laporan penjualan.',
  },
];

export function ProjectDetailPage({ onClose }: ProjectDetailPageProps) {
  const [activeSintaks, setActiveSintaks] = useState(1);
  const [editingStageId, setEditingStageId] = useState<number | null>(null);
  const [editedAnswer, setEditedAnswer] = useState('');
  const [stageAnswers, setStageAnswers] = useState<{ [key: number]: string }>({
    1: 'Minimarket membutuhkan sistem kasir yang efisien untuk mengelola transaksi penjualan, stok barang, dan laporan. Jika manual, stok sulit dilacak dan transaksi lama.',
    2: 'Bugomore membuat sistem kasir yang efisien dan mudah digunakan untuk minimarket dengan fitur manajemen produk, transaksi, dan laporan penjualan!',
    3: 'Indikator: Sistem dapat melakukan transaksi dengan cepat, mengelola stok barang, dan menghasilkan laporan penjualan!',
  });
  
  const completedStages = stages.filter(s => s.status === 'SELESAI').length;
  const totalStages = stages.length;
  const progressPercentage = (completedStages / totalStages) * 100;

  const handleEdit = (stageId: number) => {
    setEditingStageId(stageId);
    setEditedAnswer(stageAnswers[stageId] || '');
  };

  const handleSave = () => {
    if (editingStageId !== null) {
      setStageAnswers(prev => ({
        ...prev,
        [editingStageId]: editedAnswer
      }));
      setEditingStageId(null);
      setEditedAnswer('');
    }
  };

  const handleCancel = () => {
    setEditingStageId(null);
    setEditedAnswer('');
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Back Button */}
      <button
        onClick={onClose}
        className="flex items-center gap-2 text-[#155dfc] hover:text-[#0d4acf] transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="font-medium text-sm tracking-[-0.15px]">Kembali ke Daftar Project</span>
      </button>

      {/* Main Project Card */}
      <Card className="border border-[rgba(0,0,0,0.1)]">
        <CardContent className="pt-6 pb-6">
          {/* Project Title & Status */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h3 className="text-base text-neutral-950 mb-1 tracking-[-0.31px]">Sistem Kasir Minimarket</h3>
              <p className="text-base text-[#717182] tracking-[-0.31px]">Progress Pengerjaan: Kelompok Alpha</p>
            </div>
            <Badge variant="outline" className="bg-[#eceef2] text-[#030213] border-0 text-xs font-medium h-[22px] px-3">
              <AlertCircle className="w-3 h-3 mr-1.5" />
              Belum Selesai
            </Badge>
          </div>

          {/* Team Members */}
          <div className="mb-6">
            <p className="text-sm text-[#4a5565] mb-3 tracking-[-0.15px]">Anggota Kelompok:</p>
            <div className="flex flex-wrap gap-3">
              {teamMembers.map((member, idx) => (
                <div key={idx} className="bg-blue-50 rounded-[10px] px-3 py-2.5 flex items-center gap-3 min-w-[150px]">
                  <div className={`${member.color} w-8 h-8 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0`}>
                    {member.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#1c398e] leading-5 tracking-[-0.15px] truncate">{member.name}</p>
                    <p className="text-xs text-[#4a5565] leading-4 truncate">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overall Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-[#4a5565] tracking-[-0.15px]">Progress Keseluruhan</p>
              <p className="text-sm text-[#1c398e] tracking-[-0.15px]">
                {completedStages}/{totalStages} Tahap Selesai
              </p>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>

          {/* Warning Alert */}
          <div className="bg-yellow-50 border border-[#fff085] rounded-[10px] p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-[#D08700] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-[#733e0a] leading-5 tracking-[-0.15px] mb-1">
                Kelompok ini belum bisa dinilai karena belum menyelesaikan semua sintaks.
              </p>
              <p className="text-xs text-[#a65f00] leading-4">
                Siswa harus menyelesaikan 5 sintaks untuk mendapatkan nilai.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sintaks Navigation */}
      <div className="bg-white rounded-[14px] border border-[rgba(0,0,0,0.1)] p-1">
        <div className="flex gap-1 overflow-x-auto">
          {sintaksSteps.map((step) => (
            <button
              key={step.id}
              onClick={() => step.unlocked && setActiveSintaks(step.id)}
              disabled={!step.unlocked}
              className={`flex-1 min-w-[160px] rounded-[14px] px-2 py-3 flex flex-col items-center justify-center gap-1.5 transition-all ${
                activeSintaks === step.id
                  ? 'bg-[#2b7fff] text-white'
                  : step.unlocked
                  ? 'text-neutral-950 hover:bg-gray-50 cursor-pointer'
                  : 'text-gray-400 bg-gray-100 cursor-not-allowed opacity-60'
              }`}
            >
              <div className="flex items-center gap-1.5">
                {step.unlocked ? (
                  <Clock className="w-4 h-4" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                <span className="text-xs font-medium leading-4">{step.title}</span>
              </div>
              <span className={`text-xs leading-[15px] text-center ${activeSintaks === step.id ? 'opacity-80' : 'opacity-80'}`}>
                {step.subtitle}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Stages Detail */}
      <div className="space-y-4">
        <h3 className="font-medium text-neutral-950">Tahap-tahap Pengerjaan</h3>
        
        {stages.map((stage) => (
          <Card
            key={stage.id}
            className={`border ${
              stage.feedback ? 'bg-green-50 border-green-200' : 'bg-white border-gray-300'
            }`}
          >
            <CardContent className="pt-5 pb-5">
              {/* Stage Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {stage.status === 'SELESAI' ? (
                    <CheckCircle2 className={`w-6 h-6 flex-shrink-0 ${
                      stage.feedback ? 'text-green-600' : 'text-gray-400'
                    }`} />
                  ) : stage.status === 'BELUM SELESAI' ? (
                    <XCircle className="w-6 h-6 text-gray-400 flex-shrink-0" />
                  ) : (
                    <Clock className="w-6 h-6 text-gray-400 flex-shrink-0" />
                  )}
                  <div>
                    <h4 className="font-medium text-neutral-950 mb-0.5">{stage.title}</h4>
                    <p className="text-sm text-[#4a5565]">{stage.subtitle}</p>
                  </div>
                </div>
                {stage.feedback && (
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 text-xs">
                    Sudah Diberi Feedback
                  </Badge>
                )}
              </div>

              {/* Hasil Pengerjaan */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-700 mb-2">Hasil Pengerjaan:</p>
                {editingStageId === stage.id ? (
                  <div className="space-y-3">
                    <Textarea
                      value={editedAnswer}
                      onChange={(e) => setEditedAnswer(e.target.value)}
                      className="w-full min-h-[120px] bg-white border-gray-300"
                      placeholder="Tulis jawaban Anda di sini..."
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSave}
                        size="sm"
                        className="gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      >
                        <Save className="w-4 h-4" />
                        Simpan Perubahan
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <X className="w-4 h-4" />
                        Batal
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className={`p-3 rounded border ${
                    stage.feedback ? 'bg-white border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {stageAnswers[stage.id] || stage.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Feedback */}
              {stage.feedback && (
                <div className="bg-white rounded-lg border border-green-200 p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <p className="text-xs font-medium text-green-700">{stage.feedback}:</p>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed pl-6">{stage.feedbackText}</p>
                </div>
              )}

              {/* Artifact Link */}
              {stage.artifactLink && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-700 mb-2">Artikel Referensi:</p>
                  <a
                    href={stage.artifactLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#155dfc] hover:underline flex items-center gap-1"
                  >
                    <span>📎</span>
                    {stage.artifactLink}
                  </a>
                </div>
              )}

              {/* Task Note */}
              {stage.taskNote && (
                <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                  <p className="text-sm text-yellow-800 leading-relaxed flex items-start gap-2">
                    <span className="text-yellow-600">⚠️</span>
                    {stage.taskNote}
                  </p>
                </div>
              )}

              {/* Edit Button */}
              {stage.status !== 'BELUM MENGERJAKAN' && editingStageId !== stage.id && (
                <Button
                  onClick={() => handleEdit(stage.id)}
                  variant="ghost"
                  size="sm"
                  className={`mt-3 gap-2 ${
                    stage.feedback
                      ? 'text-green-600 hover:text-green-700 hover:bg-green-100'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Jawaban
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feedback Guru Summary */}
      <Card className="border border-gray-200">
        <CardContent className="pt-5 pb-5">
          <div className="flex items-start gap-2 mb-2">
            <span className="text-lg">💬</span>
            <h4 className="font-medium text-neutral-950">Feedback Guru</h4>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed pl-7">
            Sintaks 1 sudah dikerjakan dengan baik. Hanya saja tahap ke-tahap perlu dijalankan secara lebih detail untuk memastikan 
            indikator yang ada terukur dengan baik.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}