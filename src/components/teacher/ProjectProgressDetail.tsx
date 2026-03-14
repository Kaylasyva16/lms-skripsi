import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { ArrowLeft, CheckCircle2, Clock, Lock, FileText, Users, MessageSquare, AlertCircle, XCircle, Circle, Edit2, Send } from "lucide-react";

interface ProjectProgressDetailProps {
  onBack: () => void;
  groupData: {
    id: number;
    name: string;
    members: Array<{ name: string; avatar: string; role: string }>;
    type: "group" | "individual";
  };
  projectTitle: string;
}

export default function ProjectProgressDetail({ onBack, groupData, projectTitle }: ProjectProgressDetailProps) {
  const [activeTab, setActiveTab] = useState("sintaks1");
  const [editingFeedback, setEditingFeedback] = useState<{ sintaksId: string; stageId: number } | null>(null);
  const [feedbackValue, setFeedbackValue] = useState("");

  // Data struktur sintaks dengan tahap-tahap untuk Kelompok Alpha (belum selesai)
  const sintaksStructureAlpha = [
    {
      id: "sintaks1",
      number: 1,
      title: "Identifikasi Masalah",
      description: "Mengidentifikasi dan merumuskan masalah yang akan diselesaikan",
      stages: [
        {
          id: 1,
          title: "Orientasi Masalah",
          description: "Memahami konteks permasalahan",
          completed: true,
          status: "completed",
          feedback: "Bagus! Orientasi masalah sudah jelas dan konteks permasalahan sudah dipahami dengan baik.",
          content: "Minimarket membutuhkan sistem kasir yang efisien untuk mengelola transaksi penjualan, stok barang, dan laporan keuangan secara digital.",
        },
        {
          id: 2,
          title: "Rumusan Masalah",
          description: "Merumuskan masalah secara jelas",
          completed: true,
          status: "completed",
          feedback: "Rumusan masalah sudah terstruktur dengan baik. Pertanyaan penelitian sudah mencakup aspek utama dari sistem kasir.",
          content: "Bagaimana membuat sistem kasir yang efisien dan mudah digunakan untuk minimarket dengan fitur manajemen produk, transaksi, dan laporan penjualan?",
        },
        {
          id: 3,
          title: "Menentukan Indikator",
          description: "Menetapkan indikator keberhasilan",
          completed: true,
          status: "needs-revision",
          feedback: "Indikator keberhasilan perlu ditambahkan dengan metrik yang lebih spesifik. Contoh: waktu transaksi < 2 menit, tingkat kesalahan < 1%, dll.",
          content: "Indikator: Sistem dapat melakukan transaksi dengan cepat, mengelola stok barang, dan menghasilkan laporan penjualan.",
        },
        {
          id: 4,
          title: "Analisis Masalah",
          description: "Menganalisis akar permasalahan",
          completed: true,
          status: "in-progress",
          feedback: null,
          content: "Sedang melakukan analisis mendalam tentang proses bisnis minimarket dan kebutuhan fitur sistem kasir.",
        },
      ],
      status: "in-progress",
      feedback: "Sintaks 1 sudah dikerjakan dengan baik. Harap segera revisi tahap 3 untuk menambahkan indikator yang lebih terukur.",
    },
    {
      id: "sintaks2",
      number: 2,
      title: "Perencanaan Proyek",
      description: "Membuat perencanaan proyek secara detail",
      stages: [
        {
          id: 1,
          title: "Tujuan dan Deskripsi Proyek",
          description: "Menentukan tujuan dan deskripsi lengkap proyek",
          completed: false,
          status: "not-started",
          feedback: null,
          content: null,
        },
        {
          id: 2,
          title: "Menentukan Fitur Proyek",
          description: "Menentukan fitur-fitur yang akan dibuat",
          completed: false,
          status: "not-started",
          feedback: null,
          content: null,
        },
        {
          id: 3,
          title: "Menentukan Tools & Bahasa Pemrograman",
          description: "Memilih tools dan bahasa pemrograman yang akan digunakan",
          completed: false,
          status: "not-started",
          feedback: null,
          content: null,
        },
      ],
      status: "locked",
      feedback: null,
    },
    {
      id: "sintaks3",
      number: 3,
      title: "Penyusunan Jadwal",
      description: "Menyusun timeline dan jadwal pengerjaan",
      stages: [
        {
          id: 1,
          title: "Menentukan Durasi Proyek",
          description: "Menentukan durasi waktu pengerjaan proyek secara keseluruhan",
          completed: false,
          status: "not-started",
          feedback: null,
          content: null,
        },
        {
          id: 2,
          title: "Pembagian Tugas Anggota",
          description: "Membagi tugas kepada setiap anggota kelompok",
          completed: false,
          status: "not-started",
          feedback: null,
          content: null,
        },
        {
          id: 3,
          title: "Menyusun Timeline",
          description: "Membuat timeline detail pengerjaan proyek",
          completed: false,
          status: "not-started",
          feedback: null,
          content: null,
        },
      ],
      status: "locked",
      feedback: null,
    },
    {
      id: "sintaks4",
      number: 4,
      title: "Pelaksanaan Proyek",
      description: "Mengimplementasikan proyek sesuai rencana",
      stages: [
        {
          id: 1,
          title: "Log Aktivitas - Minggu 1",
          description: "Catat aktivitas coding minggu pertama (misal: Menulis program percabangan, setup project, dll)",
          completed: true,
          status: "completed",
          feedback: "Aktivitas minggu pertama sangat produktif dengan progress yang solid.",
          content:
            "Setup project Java dengan Maven. Implementasi login system dengan if-else validation. Membuat class User, Admin, Cashier. Setup MySQL database & koneksi JDBC. Membuat GUI Login menggunakan Java Swing. Total: 28 jam coding.",
        },
        {
          id: 2,
          title: "Log Aktivitas - Minggu 2",
          description: "Catat aktivitas coding minggu kedua (misal: Menulis program perulangan, integrasi database, dll)",
          completed: true,
          status: "completed",
          feedback: "Progress sangat baik dengan implementasi fitur core yang kompleks.",
          content:
            "Implementasi CRUD Produk dengan prepared statement. Loop (for/while) untuk display data produk dalam JTable. Implementasi transaksi penjualan dengan array list. Membuat receipt printer dengan perulangan. Switch-case untuk menu navigation. Total: 32 jam coding.",
        },
        {
          id: 3,
          title: "Log Aktivitas - Minggu 3",
          description: "Catat aktivitas coding minggu ketiga (misal: Testing fitur, debugging, dll)",
          completed: true,
          status: "completed",
          feedback: "Testing dan integrasi berjalan sangat lancar.",
          content:
            "Integrasi barcode scanner API. Implementasi laporan dengan JasperReports (perulangan untuk generate data). Testing semua fitur secara menyeluruh. Bug fixing: null pointer exception, connection timeout. Code refactoring untuk clean code. Total: 30 jam coding + testing.",
        },
        {
          id: 4,
          title: "Log Aktivitas - Minggu 4",
          description: "Catat aktivitas coding minggu keempat (misal: Finalisasi, bug fixing, dll)",
          completed: true,
          status: "completed",
          feedback: "Finalisasi project sangat rapi dan production-ready.",
          content:
            "Implementasi dashboard dengan chart analytics (loop untuk kalkulasi). Backup & restore database function. Final testing & UAT. UI/UX improvement & polishing. Performance optimization. Documentation & code commenting. Total: 30 jam finalisasi.",
        },
      ],
      status: "completed",
      feedback: "Log aktivitas sangat detail dan menunjukkan progress yang konsisten setiap minggu. Excellent work!",
    },
    {
      id: "sintaks5",
      number: 5,
      title: "Evaluasi & Refleksi",
      description: "Melakukan evaluasi dan refleksi proyek",
      stages: [
        {
          id: 1,
          title: "Evaluasi Hasil",
          description: "Melakukan evaluasi terhadap hasil project yang telah dibuat",
          completed: false,
          status: "not-started",
          feedback: null,
          content: null,
        },
        {
          id: 2,
          title: "Revisi Proyek",
          description: "Melakukan revisi proyek apabila diperlukan berdasarkan evaluasi",
          completed: false,
          status: "not-started",
          feedback: null,
          content: null,
        },
        {
          id: 3,
          title: "Refleksi Pembelajaran",
          description: "Merefleksikan pembelajaran dan pengalaman selama mengerjakan proyek",
          completed: false,
          status: "not-started",
          feedback: null,
          content: null,
        },
      ],
      status: "locked",
      feedback: null,
    },
  ];

  // Data struktur sintaks untuk Kelompok Beta (sudah selesai semua)
  const sintaksStructureBeta = [
    {
      id: "sintaks1",
      number: 1,
      title: "Identifikasi Masalah",
      description: "Mengidentifikasi dan merumuskan masalah yang akan diselesaikan",
      stages: [
        {
          id: 1,
          title: "Orientasi Masalah",
          description: "Memahami konteks permasalahan",
          completed: true,
          status: "completed",
          feedback: "Excellent! Konteks masalah sudah dipahami dengan sangat baik.",
          content: "Minimarket X membutuhkan sistem kasir digital untuk meningkatkan efisiensi transaksi dan pengelolaan inventory.",
        },
        {
          id: 2,
          title: "Rumusan Masalah",
          description: "Merumuskan masalah secara jelas",
          completed: true,
          status: "completed",
          feedback: "Perfect! Rumusan masalah sangat terstruktur dan mencakup semua aspek penting.",
          content: "Bagaimana membuat sistem kasir minimarket yang dapat mengelola transaksi, inventory, dan laporan penjualan secara real-time?",
        },
        {
          id: 3,
          title: "Menentukan Indikator",
          description: "Menetapkan indikator keberhasilan",
          completed: true,
          status: "completed",
          feedback: "Outstanding! Indikator sangat spesifik dan terukur dengan baik.",
          content: "Indikator: Waktu transaksi < 2 menit, Akurasi stok 99%, Response time < 1 detik, User satisfaction > 85%",
        },
        {
          id: 4,
          title: "Analisis Masalah",
          description: "Menganalisis akar permasalahan",
          completed: true,
          status: "completed",
          feedback: "Great work! Analisis mendalam dan komprehensif.",
          content: "Analisis lengkap tentang proses bisnis minimarket, bottleneck, dan requirement sistem yang dibutuhkan telah selesai.",
        },
      ],
      status: "completed",
      feedback: "Sintaks 1 diselesaikan dengan sangat baik. Semua tahap telah dikerjakan dengan detail dan profesional.",
    },
    {
      id: "sintaks2",
      number: 2,
      title: "Perencanaan Proyek",
      description: "Membuat perencanaan proyek secara detail",
      stages: [
        {
          id: 1,
          title: "Tujuan dan Deskripsi Proyek",
          description: "Menentukan tujuan dan deskripsi lengkap proyek",
          completed: true,
          status: "completed",
          feedback: "Excellent! Tujuan dan deskripsi proyek sangat jelas dan terstruktur dengan baik.",
          content:
            "Tujuan: Membuat sistem kasir minimarket untuk meningkatkan efisiensi transaksi hingga 40%, mengurangi error input hingga 95%, dan menghasilkan laporan real-time. Deskripsi: Aplikasi desktop berbasis Java yang user-friendly dengan fitur lengkap untuk operasional minimarket.",
        },
        {
          id: 2,
          title: "Menentukan Fitur Proyek",
          description: "Menentukan fitur-fitur yang akan dibuat",
          completed: true,
          status: "completed",
          feedback: "Perfect! Fitur-fitur yang dipilih sudah sesuai dengan kebutuhan dan sangat feasible.",
          content: "Fitur Utama: (1) Login & Autentikasi, (2) Transaksi Penjualan dengan barcode scanner, (3) Manajemen Produk & Stok, (4) Laporan Penjualan Harian/Bulanan, (5) Dashboard Analytics, (6) Backup & Restore Data.",
        },
        {
          id: 3,
          title: "Menentukan Tools & Bahasa Pemrograman",
          description: "Memilih tools dan bahasa pemrograman yang akan digunakan",
          completed: true,
          status: "completed",
          feedback: "Great choice! Tools dan bahasa pemrograman yang dipilih sangat tepat untuk project ini.",
          content: "Bahasa: Java 17. Framework: Java Swing untuk GUI. Database: MySQL 8.0. Tools: IntelliJ IDEA, MySQL Workbench, Git, JasperReports untuk laporan. Design Pattern: MVC (Model-View-Controller).",
        },
      ],
      status: "completed",
      feedback: "Perencanaan project sangat matang dan terorganisir dengan baik. Semua aspek sudah dipikirkan dengan detail!",
    },
    {
      id: "sintaks3",
      number: 3,
      title: "Penyusunan Jadwal",
      description: "Menyusun timeline dan jadwal pengerjaan",
      stages: [
        {
          id: 1,
          title: "Menentukan Durasi Proyek",
          description: "Menentukan durasi waktu pengerjaan proyek secara keseluruhan",
          completed: true,
          status: "completed",
          feedback: "Durasi proyek ditentukan dengan sangat realistis dan terukur.",
          content: "Durasi proyek: 4 minggu (28 hari kerja) dengan estimasi 120 jam total. Periode: 1 Nov - 28 Nov 2025 dengan buffer 1 minggu untuk revisi.",
        },
        {
          id: 2,
          title: "Pembagian Tugas Anggota",
          description: "Membagi tugas kepada setiap anggota kelompok",
          completed: true,
          status: "completed",
          feedback: "Pembagian tugas sangat proporsional dan memanfaatkan keahlian masing-masing anggota.",
          content: "DK (Dewi): UI/UX & Frontend (40 jam). EP (Eko): Backend & Database (50 jam). FH (Fitri): Testing & Documentation (30 jam). Semua anggota: Code review & integration (total 20 jam).",
        },
        {
          id: 3,
          title: "Menyusun Timeline",
          description: "Membuat timeline detail pengerjaan proyek",
          completed: true,
          status: "completed",
          feedback: "Timeline sangat terstruktur dengan checkpoint yang jelas di setiap minggu.",
          content: "Week 1: Design & Setup (1-7 Nov). Week 2: Core Development (8-14 Nov). Week 3: Integration & Testing (15-21 Nov). Week 4: Finalisasi & Documentation (22-28 Nov). Daily standup setiap jam 15:00.",
        },
      ],
      status: "completed",
      feedback: "Penjadwalan project sangat profesional dan komprehensif dengan pembagian tugas yang adil.",
    },
    {
      id: "sintaks4",
      number: 4,
      title: "Pembuatan Project",
      description: "Log aktivitas selama pengerjaan pembuatan project",
      stages: [
        {
          id: 1,
          title: "Log Aktivitas - Minggu 1",
          description: "Catat aktivitas coding minggu pertama (misal: Menulis program percabangan, setup project, dll)",
          completed: true,
          status: "completed",
          feedback: "Aktivitas minggu pertama sangat produktif dengan progress yang solid.",
          content:
            "Setup project Java dengan Maven. Implementasi login system dengan if-else validation. Membuat class User, Admin, Cashier. Setup MySQL database & koneksi JDBC. Membuat GUI Login menggunakan Java Swing. Total: 28 jam coding.",
        },
        {
          id: 2,
          title: "Log Aktivitas - Minggu 2",
          description: "Catat aktivitas coding minggu kedua (misal: Menulis program perulangan, integrasi database, dll)",
          completed: true,
          status: "completed",
          feedback: "Progress sangat baik dengan implementasi fitur core yang kompleks.",
          content:
            "Implementasi CRUD Produk dengan prepared statement. Loop (for/while) untuk display data produk dalam JTable. Implementasi transaksi penjualan dengan array list. Membuat receipt printer dengan perulangan. Switch-case untuk menu navigation. Total: 32 jam coding.",
        },
        {
          id: 3,
          title: "Log Aktivitas - Minggu 3",
          description: "Catat aktivitas coding minggu ketiga (misal: Testing fitur, debugging, dll)",
          completed: true,
          status: "completed",
          feedback: "Testing dan integrasi berjalan sangat lancar.",
          content:
            "Integrasi barcode scanner API. Implementasi laporan dengan JasperReports (perulangan untuk generate data). Testing semua fitur secara menyeluruh. Bug fixing: null pointer exception, connection timeout. Code refactoring untuk clean code. Total: 30 jam coding + testing.",
        },
        {
          id: 4,
          title: "Log Aktivitas - Minggu 4",
          description: "Catat aktivitas coding minggu keempat (misal: Finalisasi, bug fixing, dll)",
          completed: true,
          status: "completed",
          feedback: "Finalisasi project sangat rapi dan production-ready.",
          content:
            "Implementasi dashboard dengan chart analytics (loop untuk kalkulasi). Backup & restore database function. Final testing & UAT. UI/UX improvement & polishing. Performance optimization. Documentation & code commenting. Total: 30 jam finalisasi.",
        },
      ],
      status: "completed",
      feedback: "Log aktivitas sangat detail dan menunjukkan progress yang konsisten setiap minggu. Excellent work!",
    },
    {
      id: "sintaks5",
      number: 5,
      title: "Evaluasi & Refleksi",
      description: "Melakukan evaluasi dan refleksi proyek",
      stages: [
        {
          id: 1,
          title: "Evaluasi Hasil",
          description: "Melakukan evaluasi terhadap hasil project yang telah dibuat",
          completed: true,
          status: "completed",
          feedback: "Evaluasi sangat mendalam dan objektif dengan analisis yang komprehensif.",
          content:
            "Evaluasi dilakukan terhadap: (1) Functionality - semua fitur berjalan 100%, (2) Performance - response time avg 0.8s, (3) Usability - user satisfaction 92%, (4) Code Quality - clean code & documented, (5) Achievement - efisiensi transaksi meningkat 42%, error berkurang 96%. Semua target indikator tercapai dan melebihi ekspektasi.",
        },
        {
          id: 2,
          title: "Revisi Proyek",
          description: "Melakukan revisi proyek apabila diperlukan berdasarkan evaluasi",
          completed: true,
          status: "completed",
          feedback: "Revisi dilakukan dengan sangat baik untuk meningkatkan kualitas project.",
          content:
            "Berdasarkan evaluasi dan feedback, dilakukan revisi: (1) Optimisasi query database untuk performa lebih cepat, (2) Perbaikan UI/UX berdasarkan user feedback, (3) Penambahan error handling di 3 fitur, (4) Update dokumentasi dengan detail troubleshooting, (5) Improvement pada report generation speed. Semua revisi telah di-test dan verified.",
        },
        {
          id: 3,
          title: "Refleksi Pembelajaran",
          description: "Merefleksikan pembelajaran dan pengalaman selama mengerjakan proyek",
          completed: true,
          status: "completed",
          feedback: "Refleksi sangat baik dan mencakup semua aspek penting.",
          content:
            "Pembelajaran: (1) Pentingnya analisis masalah yang mendalam, (2) Perencanaan project yang matang, (3) Penggunaan tools dan bahasa pemrograman yang tepat, (4) Manajemen waktu yang efektif, (5) Kerjasama tim yang baik. Pengalaman: (1) Menghadapi tantangan teknis dan menemukan solusinya, (2) Meningkatkan keterampilan pemrograman, (3) Memahami proses pengembangan perangkat lunak dari awal hingga akhir.",
        },
      ],
      status: "completed",
      feedback: "Evaluasi dan revisi dilakukan dengan sangat profesional. Project diselesaikan dengan kualitas excellent!",
    },
  ];

  // Pilih data sintaks berdasarkan groupData.id
  const getSintaksStructure = () => {
    if (groupData.id === 2) {
      return sintaksStructureBeta; // Kelompok Beta - semua completed
    }
    return sintaksStructureAlpha; // Kelompok Alpha atau lainnya - belum selesai
  };

  const [sintaksData, setSintaksData] = useState(getSintaksStructure());

  // Calculate overall progress
  const totalStages = sintaksData.reduce((sum, sintaks) => sum + sintaks.stages.length, 0);
  const completedStages = sintaksData.reduce((sum, sintaks) => sum + sintaks.stages.filter((s) => s.status === "completed").length, 0);
  const overallProgress = (completedStages / totalStages) * 100;

  // Calculate sintaks completion
  const completedSintaks = sintaksData.filter((s) => s.stages.every((stage) => stage.status === "completed")).length;

  const canBeGraded = completedSintaks === 5;

  const isSintaksUnlocked = (index: number) => {
    // Sintaks pertama selalu unlocked
    if (index === 0) return true;

    // Cek apakah sintaks sebelumnya sudah completed
    const previousSintaks = sintaksData[index - 1];
    return previousSintaks.stages.every((stage) => stage.status === "completed");
  };

  const getStageStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return { label: "Selesai", color: "bg-green-500", textColor: "text-green-900" };
      case "needs-revision":
        return { label: "Perlu Direvisi", color: "bg-red-500", textColor: "text-red-900" };
      case "in-progress":
        return { label: "Sedang Mengerjakan", color: "bg-gray-500", textColor: "text-gray-900" };
      default:
        return { label: "Belum Mulai", color: "bg-gray-300", textColor: "text-gray-700" };
    }
  };

  const getSintaksStatus = (sintaks: (typeof sintaksData)[0]) => {
    const allCompleted = sintaks.stages.every((s) => s.status === "completed");
    if (allCompleted) return { label: "Selesai", color: "bg-green-500", icon: CheckCircle2 };
    if (sintaks.status === "locked") return { label: "Terkunci", color: "bg-gray-400", icon: Lock };
    if (sintaks.status === "in-progress") return { label: "Sedang Dikerjakan", color: "bg-blue-500", icon: Clock };
    return { label: "Belum Mulai", color: "bg-gray-400", icon: AlertCircle };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={onBack} className="mb-6 text-blue-600">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Daftar Project
        </Button>

        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="mb-2">{projectTitle}</CardTitle>
                <CardDescription className="text-base">Progress Pengerjaan: {groupData.type === "group" ? groupData.name : groupData.name}</CardDescription>
              </div>
              {canBeGraded ? (
                <Badge className="bg-green-500">
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Siap Dinilai
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Belum Selesai
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Members */}
            {groupData.type === "group" && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-3">Anggota Kelompok:</p>
                <div className="flex flex-wrap gap-3">
                  {groupData.members.map((member, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-blue-500 text-white text-xs">{member.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm text-blue-900">{member.name}</p>
                        <p className="text-xs text-gray-600">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Overall Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Progress Keseluruhan</p>
                <p className="text-sm text-blue-900">
                  {completedSintaks}/5 Sintaks Selesai ({completedStages}/{totalStages} Tahap)
                </p>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>

            {!canBeGraded && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-900">Kelompok ini belum bisa dinilai karena belum menyelesaikan semua sintaks.</p>
                  <p className="text-xs text-yellow-700 mt-1">Siswa harus menyelesaikan 5 sintaks untuk mendapatkan nilai.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sintaks Tabs */}
        <Card>
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full bg-gray-100 rounded-2xl p-2 flex gap-2 mb-6 h-auto">
                {sintaksData.map((sintaks, index) => {
                  const status = getSintaksStatus(sintaks);
                  const StatusIcon = status.icon;

                  const isActive = activeTab === sintaks.id;
                  const isCompleted = sintaks.stages.every((s) => s.status === "completed");
                  const isLocked = sintaks.status === "locked";

                  return (
                    <TabsTrigger
                      key={sintaks.id}
                      value={sintaks.id}
                      disabled={!isSintaksUnlocked(index)}
                      className={`flex-1 rounded-xl px-4 py-4 transition-all h-auto
    ${isActive ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md" : !isSintaksUnlocked(index) ? "opacity-50 cursor-not-allowed" : "bg-transparent text-gray-700 hover:bg-white"}
  `}
                    >
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : isLocked ? <Lock className="w-4 h-4 opacity-60" /> : <StatusIcon className="w-4 h-4" />}
                          <span className="text-sm font-medium">Sintaks {sintaks.number}</span>
                        </div>
                        <p className="text-xs opacity-90 leading-tight">{sintaks.title}</p>
                      </div>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {sintaksData.map((sintaks, index) => {
                const status = getSintaksStatus(sintaks);
                const StatusIcon = status.icon;
                const completedStagesCount = sintaks.stages.filter((s) => s.status === "completed").length;
                const sintaksProgress = (completedStagesCount / sintaks.stages.length) * 100;

                return (
                  <TabsContent key={sintaks.id} value={sintaks.id} className="space-y-6">
                    {/* Sintaks Header */}
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-blue-900 mb-2">
                            Sintaks {sintaks.number}: {sintaks.title}
                          </h3>
                          <p className="text-gray-600 text-sm">{sintaks.description}</p>
                        </div>
                        <Badge className={status.color}>
                          <StatusIcon className="w-4 h-4 mr-1" />
                          {status.label}
                        </Badge>
                      </div>

                      {/* Sintaks Progress */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-gray-600">Progress Sintaks {sintaks.number}</p>
                          <p className="text-sm text-blue-900">
                            {sintaks.stages.filter((s) => s.status === "completed").length}/{sintaks.stages.length} Tahap Selesai
                          </p>
                        </div>
                        <Progress value={sintaksProgress} className="h-2" />

                        {/* Stage status summary */}
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {sintaks.stages.filter((s) => s.status === "in-progress").length > 0 && (
                            <Badge variant="outline" className="text-xs text-gray-700">
                              {sintaks.stages.filter((s) => s.status === "in-progress").length} Sedang Dikerjakan
                            </Badge>
                          )}
                          {sintaks.stages.filter((s) => s.status === "needs-revision").length > 0 && (
                            <Badge variant="outline" className="text-xs text-red-700">
                              {sintaks.stages.filter((s) => s.status === "needs-revision").length} Perlu Direvisi
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stages */}
                    <div className="space-y-4">
                      <h4 className="text-blue-900">Tahap-tahap Pengerjaan</h4>

                      <div className="grid gap-4">
                        {sintaks.stages.map((stage) => {
                          const getStageIcon = () => {
                            switch (stage.status) {
                              case "completed":
                                return { Icon: CheckCircle2, color: "text-green-600" };
                              case "needs-revision":
                                return { Icon: XCircle, color: "text-red-600" };
                              case "in-progress":
                                return { Icon: Clock, color: "text-gray-600" };
                              default:
                                return { Icon: Circle, color: "text-gray-400" };
                            }
                          };

                          const { Icon: StageIcon, color: iconColor } = getStageIcon();

                          const getBorderColor = () => {
                            switch (stage.status) {
                              case "completed":
                                return "border-green-200 bg-green-50";
                              case "needs-revision":
                                return "border-red-200 bg-red-50";
                              case "in-progress":
                                return "border-gray-300 bg-gray-50";
                              default:
                                return "border-gray-200 bg-white";
                            }
                          };

                          return (
                            <Card key={stage.id} className={`border-2 ${getBorderColor()}`}>
                              <CardContent className="pt-4">
                                <div className="flex items-start gap-3 mb-3">
                                  <div className={`mt-1 ${iconColor}`}>
                                    <StageIcon className="w-6 h-6" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                      <h5 className="text-blue-900">
                                        Tahap {stage.id}: {stage.title}
                                      </h5>
                                      {stage.status !== "not-started" && <Badge className={getStageStatusBadge(stage.status).color + " text-xs"}>{getStageStatusBadge(stage.status).label}</Badge>}
                                    </div>
                                    <p className="text-sm text-gray-600">{stage.description}</p>
                                  </div>
                                </div>

                                {/* Stage Content - Show for stages that have been worked on */}
                                {(stage.status === "completed" || stage.status === "needs-revision" || stage.status === "in-progress") && (
                                  <div className="ml-9 space-y-3">
                                    {/* Hasil Pengerjaan */}
                                    {stage.content && (
                                      <div className="space-y-2">
                                        <Label className="text-xs text-gray-600">Hasil Pengerjaan:</Label>
                                        <div className="p-3 bg-white rounded-lg border text-sm text-gray-700">{stage.content}</div>
                                      </div>
                                    )}

                                    {/* Status Pengerjaan */}
                                    <div className="space-y-2">
                                      <Label className="text-xs text-gray-600">Status Pengerjaan:</Label>
                                      <div>
                                        {(() => {
                                          const statusBadge = getStageStatusBadge(stage.status);
                                          return <Badge className={statusBadge.color}>{statusBadge.label}</Badge>;
                                        })()}
                                      </div>
                                    </div>

                                    {/* Feedback Guru */}
                                    {stage.feedback && (
                                      <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                          <Label className="text-xs text-gray-600">Feedback Guru:</Label>
                                          {editingFeedback?.sintaksId === sintaks.id && editingFeedback?.stageId === stage.id ? (
                                            <Button
                                              size="sm"
                                              onClick={() => {
                                                // Save feedback
                                                // TODO: Implement save logic here
                                                setEditingFeedback(null);
                                                setFeedbackValue("");
                                              }}
                                              className="h-7 px-3 bg-blue-500 hover:bg-blue-600"
                                            >
                                              <Send className="w-3 h-3 mr-1" />
                                              Kirim
                                            </Button>
                                          ) : (
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => {
                                                setEditingFeedback({ sintaksId: sintaks.id, stageId: stage.id });
                                                setFeedbackValue(stage.feedback || "");
                                              }}
                                              className="h-7 px-3"
                                            >
                                              <Edit2 className="w-3 h-3 mr-1" />
                                              Edit
                                            </Button>
                                          )}
                                        </div>

                                        {editingFeedback?.sintaksId === sintaks.id && editingFeedback?.stageId === stage.id ? (
                                          <Textarea value={feedbackValue} onChange={(e) => setFeedbackValue(e.target.value)} className="min-h-[100px] text-sm" placeholder="Tulis feedback untuk siswa..." />
                                        ) : (
                                          <div
                                            className={`p-3 rounded-lg border text-sm ${
                                              stage.status === "needs-revision"
                                                ? "bg-red-50 border-red-200 text-red-900"
                                                : stage.status === "completed"
                                                ? "bg-green-50 border-green-200 text-green-900"
                                                : "bg-gray-50 border-gray-200 text-gray-900"
                                            }`}
                                          >
                                            <div className="flex gap-2">
                                              <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                              <p>{stage.feedback}</p>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* Artikel Referensi */}
                                    {stage.id === 2 && sintaks.number === 1 && (
                                      <div className="space-y-2">
                                        <Label className="text-xs text-gray-600">Artikel Referensi:</Label>
                                        <a href="#" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                          <FileText className="w-4 h-4" />
                                          https://pintar.com/cara-membuat-rumusan-masalah
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>

                    {/* Feedback Guru */}
                    {sintaks.feedback && (
                      <Card className="border-blue-200 bg-blue-50">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-base">
                            <MessageSquare className="w-5 h-5 text-blue-600" />
                            Feedback Guru
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-700">{sintaks.feedback}</p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
