import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { ChevronLeft, Play, Check, Circle, Clock, Calendar, BookOpen, Star, Volume2, Maximize, Download, Share2, FileText, Eye } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

type Lesson = {
  id: number;
  title: string;
  type: "video" | "reading" | "pdf" | "practice" | "quiz";
  duration: string;
  completed: boolean;
  file_url?: string;
  pdfInfo?: {
    fileName: string;
    fileSize: string;
    pages: number;
    uploadDate: string;
    instructor: string;
    description: string;
  };
};

// fungsi untuk mengubah bytes → MB
const formatFileSize = (bytes: number) => {
  if (!bytes) return "";

  const mb = bytes / (1024 * 1024);
  return mb.toFixed(1) + " MB";
};

interface LessonContentPageProps {
  moduleId: number | null;
  onClose: (completed: boolean) => void;
}

export function LessonContentPage({ moduleId, onClose }: LessonContentPageProps) {
  const [modules, setModules] = useState<Lesson[]>([]);

  const moduleIdNumber = Number(moduleId);

  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null); // Set to PDF lesson

  console.log("MODULE ID:", moduleId);

  useEffect(() => {
    if (!moduleId) return;

    const siswaId = 1;
    fetch(`http://localhost:5000/api/modules/${moduleId}/materials?siswaId=${siswaId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("DATA MATERI:", data);

        const mapped = data.map((m: any) => ({
          id: m.id,
          title: m.title,
          type: (m.type || "pdf").toLowerCase(),
          duration: m.duration || "10 menit",
          file_url: m.file_url,
          completed: m.completed === true || m.completed === "true" || m.completed === "t" || m.completed === 1 || m.completed === "1",

          pdfInfo: {
            fileName: m.file_url,
            fileSize: formatFileSize(m.file_size),
            pages: m.pages,
            uploadDate: new Date(m.created_at).toLocaleDateString(),
            instructor: m.instructor,
            description: m.description,
          },
        }));

        setModules(mapped);

        const firstUnfinished = mapped.find((item: any) => !item.completed);
        setCurrentLesson(firstUnfinished || mapped[0] || null);
      })
      .catch((err) => {
        console.error("Gagal ambil materi:", err);
        setModules([]);
        setCurrentLesson(null);
      });
  }, [moduleId]);

  const [pdfZoom, setPdfZoom] = useState(100);
  const [pdfPage, setPdfPage] = useState(1);

  const completedCount = modules.filter((m) => m.completed).length;
  const progressPercentage = modules.length === 0 ? 0 : (completedCount / modules.length) * 100;

  const isLessonUnlocked = (index: number) => {
    if (index === 0) return true; // materi pertama selalu terbuka
    return modules[index - 1]?.completed === true; // buka jika materi sebelumnya selesai
  };

  const handleSelectLesson = (lesson: Lesson, index: number) => {
    if (!isLessonUnlocked(index) && !lesson.completed) return;
    setCurrentLesson(lesson);
  };

  const handleNextLesson = () => {
    if (isAllCompleted) {
      onClose(true);
      return;
    }

    if (!currentLesson) return;

    const currentIndex = modules.findIndex((m) => m.id === currentLesson.id);
    const nextIndex = currentIndex + 1;

    if (nextIndex < modules.length && isLessonUnlocked(nextIndex)) {
      setCurrentLesson(modules[nextIndex]);
    }
  };

  const currentIndex = currentLesson ? modules.findIndex((m) => m.id === currentLesson.id) : -1;

  const nextLessonUnlocked = currentIndex >= 0 && currentIndex + 1 < modules.length && isLessonUnlocked(currentIndex + 1);

  const isAllCompleted = modules.length > 0 && modules.every((m) => m.completed);

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "video":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "reading":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "pdf":
        return "bg-cyan-100 text-cyan-700 border-cyan-200";
      case "practice":
        return "bg-green-100 text-green-700 border-green-200";
      case "quiz":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "video":
        return "🎥 Video";
      case "reading":
        return "📖 Materi";
      case "pdf":
        return "📄 PDF";
      case "practice":
        return "✏️ Latihan";
      case "quiz":
        return "📝 Quiz";
      default:
        return type;
    }
  };

  const handlePdfZoomIn = () => {
    setPdfZoom((prev) => Math.min(prev + 10, 200));
  };

  const handlePdfZoomOut = () => {
    setPdfZoom((prev) => Math.max(prev - 10, 50));
  };

  const handlePdfNextPage = () => {
    if (currentLesson.pdfInfo && pdfPage < currentLesson.pdfInfo.pages) {
      setPdfPage((prev) => prev + 1);
    }
  };

  const handlePdfPrevPage = () => {
    if (pdfPage > 1) {
      setPdfPage((prev) => prev - 1);
    }
  };

  const handleComplete = async () => {
    if (!currentLesson) return;

    const userId = 1;
    const materiId = currentLesson.id;

    await fetch("http://localhost:5000/materi/selesai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        siswaId: userId,
        materiId: materiId,
      }),
    });

    // update status selesai
    const updatedModules = modules.map((m) => (m.id === materiId ? { ...m, completed: true } : m));

    setModules(updatedModules);

    // pindah ke materi berikutnya
    const currentIndex = updatedModules.findIndex((m) => m.id === materiId);
    const nextLesson = updatedModules[currentIndex + 1];
    const allCompleted = updatedModules.every((m) => m.completed);

    // kalau masih ada materi berikutnya, pindah otomatis
    if (!allCompleted && nextLesson) {
      setCurrentLesson(nextLesson);
    }
    // kalau semua selesai, tetap di materi terakhir
    if (allCompleted) {
      setCurrentLesson({
        ...currentLesson,
        completed: true,
      });
    }
  };

  // Helper total durasi
  const totalModules = modules.length;

  const totalMinutes = modules.reduce((total, module) => {
    const match = module.duration.match(/\d+/);
    const minutes = match ? parseInt(match[0], 10) : 0;
    return total + minutes;
  }, 0);

  const formatTotalDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} menit`;

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) return `${hours} jam`;
    return `${hours} jam ${remainingMinutes} menit`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button onClick={() => onClose(false)} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Kembali ke Daftar Materi</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video or PDF Card */}
            {currentLesson?.type === "pdf" ? (
              // PDF Card with Description and Download
              <Card className="border-0 overflow-hidden shadow-lg">
                {/* PDF Header with Gradient */}
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-8 text-white">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <Badge className="bg-white/20 text-white border-0 mb-3">📄 Materi PDF</Badge>
                      <h3 className="text-2xl font-bold mb-2">{currentLesson.pdfInfo?.fileName || "Materi_IF_Statement.pdf"}</h3>
                      <div className="flex items-center gap-4 text-sm opacity-90 flex-wrap">
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {currentLesson.pdfInfo?.fileSize}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {currentLesson.pdfInfo?.pages} halaman
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {currentLesson.pdfInfo?.uploadDate}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PDF Content */}
                <CardContent className="pt-6 pb-6">
                  {/* Instructor Info */}
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">{currentLesson.pdfInfo?.instructor?.charAt(0) || "P"}</div>
                    <div>
                      <p className="text-sm text-gray-600">Diunggah oleh</p>
                      <p className="font-semibold text-gray-900">{currentLesson.pdfInfo?.instructor}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Eye className="w-5 h-5 text-cyan-600" />
                      Tentang Materi PDF
                    </h4>
                    <p className="text-gray-700 leading-relaxed">{currentLesson.pdfInfo?.description}</p>
                  </div>

                  {/* Download Section */}
                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-xl p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Download Materi</h4>
                        <p className="text-sm text-gray-600 mb-4">Unduh file PDF ini untuk dipelajari secara offline. Pastikan kamu membaca seluruh materi dengan seksama.</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Check className="w-4 h-4 text-cyan-600" />
                          <span>Dapat dibaca kapan saja</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <Check className="w-4 h-4 text-cyan-600" />
                          <span>Bisa di-print untuk catatan</span>
                        </div>
                      </div>
                      <a href={`http://localhost:5000/uploads/${currentLesson?.file_url}`} target="_blank" rel="noopener noreferrer">
                        <Button className="gap-2">
                          <Download className="w-5 h-5" />
                          Unduh PDF
                        </Button>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              // Video Player (existing)
              <Card className="border-0 overflow-hidden shadow-lg">
                <div
                  className="relative h-[400px] bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center"
                  style={{
                    backgroundImage: "linear-gradient(150.642deg, rgba(21, 93, 252, 0.2) 0%, rgba(152, 16, 250, 0.2) 100%)",
                  }}
                >
                  {/* Decorative Blur Elements */}
                  <div className="absolute left-1/4 top-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
                  <div className="absolute right-1/4 top-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

                  {/* Play Button */}
                  <button className="relative z-10 w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110">
                    <Play className="w-10 h-10 text-white ml-1" />
                  </button>

                  {/* Video Controls */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                    <button className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-black/70 transition-colors">
                      <Volume2 className="w-5 h-5 text-white" />
                    </button>
                    <button className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-black/70 transition-colors">
                      <Download className="w-5 h-5 text-white" />
                    </button>
                    <div className="flex-1" />
                    <button className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-black/70 transition-colors">
                      <Maximize className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </Card>
            )}

            {/* Lesson Info */}
            <Card className="border border-gray-200">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-gray-900 mb-2">{currentLesson?.title}</h2>
                    <p className="text-gray-600">Pelajari konsep {currentLesson?.title.toLowerCase()} dalam pemrograman terstruktur dengan contoh kode yang mudah dipahami</p>
                  </div>
                  <Badge variant="outline" className={`ml-4 flex-shrink-0 ${getBadgeColor(currentLesson?.type)}`}>
                    {getTypeLabel(currentLesson?.type)}
                  </Badge>
                </div>

                {/* Meta Info */}
                <div className="flex items-center gap-6 text-sm text-gray-600 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{currentLesson?.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Terakhir diupdate: 10 Jan 2025</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>4.8/5 (245 rating)</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
                  <Button onClick={handleComplete} className="flex-1 gap-2 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90">
                    <Check className="w-4 h-4" />
                    Tandai Selesai
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Share2 className="w-4 h-4" />
                    Bagikan
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Lesson Description */}
            <Card className="border border-gray-200">
              <CardContent className="pt-6 pb-6">
                <h3 className="text-gray-900 mb-4">Deskripsi Pembelajaran</h3>
                <div className="space-y-3 text-gray-700">
                  <p>Pada materi ini, Anda akan mempelajari konsep dasar percabangan dalam pemrograman. Percabangan adalah struktur kontrol yang memungkinkan program membuat keputusan berdasarkan kondisi tertentu.</p>
                  <p>Anda akan memahami:</p>
                  <ul className="space-y-2 ml-5">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                      <span>Konsep dan logika percabangan dalam programming</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                      <span>Cara menggunakan operator relasional dan logika</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                      <span>Implementasi IF statement dalam berbagai kasus</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                      <span>Best practices dalam menulis kode percabangan</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Progress Card */}
            <Card className="border-0 bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpen className="w-5 h-5" />
                      <span className="text-sm opacity-90">Progress Kamu</span>
                    </div>
                    <p className="text-3xl font-bold">{Math.round(progressPercentage)}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm opacity-90">
                      {completedCount}/{modules.length}
                    </p>
                    <p className="text-xs opacity-75">Selesai</p>
                  </div>
                </div>
                <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                  <div className="bg-white h-full rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
                </div>
                <p className="text-xs opacity-75 mt-3">
                  Kamu sudah menyelesaikan {completedCount} dari {modules.length} materi pembelajaran
                </p>
              </CardContent>
            </Card>

            {/* Course Stats */}
            <Card className="border-0 bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg">
              <CardContent className="pt-6 pb-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 opacity-90" />
                      <span className="text-sm opacity-90">Total Durasi</span>
                    </div>
                    <p className="font-semibold">{formatTotalDuration(totalMinutes)}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 opacity-90" />
                      <span className="text-sm opacity-90">Total Modul</span>
                    </div>
                    <p className="font-semibold">{totalModules} modul</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Module List */}
            <Card className="border border-gray-200">
              <CardContent className="pt-6 pb-6">
                <h3 className="text-gray-900 mb-4">Daftar Materi</h3>
                <div className="space-y-2">
                  {modules.map((module, index) => {
                    const unlocked = isLessonUnlocked(index);
                    const clickable = unlocked || module.completed;

                    return (
                      <button
                        key={module.id}
                        onClick={() => handleSelectLesson(module, index)}
                        disabled={!clickable}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                          currentLesson?.id === module.id ? "bg-blue-50 border-blue-200" : clickable ? "hover:bg-gray-50 border-transparent" : "bg-gray-50 border-transparent opacity-60 cursor-not-allowed"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Status Icon */}
                          <div className="flex-shrink-0 mt-0.5">
                            {module.completed ? (
                              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            ) : clickable ? (
                              <Circle className="w-5 h-5 text-gray-300" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-[10px] text-gray-400">🔒</div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <p className={`text-sm font-medium ${module.completed ? "text-gray-700" : clickable ? "text-gray-900" : "text-gray-400"} ${module.completed ? "line-through" : ""}`}>
                                {index + 1}. {module.title}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-0.5 rounded ${getBadgeColor(module.type)}`}>{getTypeLabel(module.type)}</span>
                              <span className={`text-xs ${clickable ? "text-gray-500" : "text-gray-400"}`}>{module.duration}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Next Lesson Button */}
                <Button
                  onClick={() => {
                    handleNextLesson();

                    if (isAllCompleted) {
                      onClose(true);
                    }
                  }}
                  disabled={!nextLessonUnlocked && !isAllCompleted}
                  className="w-full mt-4 gap-2 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 disabled:opacity-50"
                >
                  <Play className="w-4 h-4" />
                  {isAllCompleted ? "Semua Materi Selesai" : "Lanjut ke Materi Berikutnya"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
