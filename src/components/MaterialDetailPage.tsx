import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { ChevronLeft, Clock, BarChart3, Lightbulb, CheckCircle2, Lock, PlayCircle, FileText, Code, Trophy } from "lucide-react";
import { LessonContentPage } from "./LessonContentPage";
import { useEffect } from "react";
import axios from "axios";

const getModuleGradient = (color?: string) => {
  switch (color) {
    case "purple":
      return "from-purple-500 to-purple-600";
    case "green":
      return "from-green-500 to-green-600";
    case "orange":
      return "from-orange-500 to-orange-600";
    case "pink":
      return "from-pink-500 to-pink-600";
    default:
      return "from-blue-500 to-blue-600";
  }
};

interface MaterialDetailPageProps {
  onClose: () => void;
}

export function MaterialDetailPage({ onClose }: MaterialDetailPageProps) {
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [showLessonContent, setShowLessonContent] = useState(false);

  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  function normalizeTopics(topics: any): string[] {
    if (Array.isArray(topics)) {
      return topics.map((t) => (typeof t === "string" ? t : t?.title ?? t?.name ?? "Topik"));
    }

    if (typeof topics === "string") {
      try {
        const parsed = JSON.parse(topics);
        if (Array.isArray(parsed)) {
          return parsed.map((t) => (typeof t === "string" ? t : t?.title ?? t?.name ?? "Topik"));
        }
        return [topics];
      } catch {
        return [topics];
      }
    }

    if (topics && typeof topics === "object") {
      return Object.values(topics).map((t: any) => (typeof t === "string" ? t : t?.title ?? t?.name ?? "Topik"));
    }

    return [];
  }

  const fetchModules = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/courses/1/modules", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const rawModules = res.data;

      const mapped = rawModules.map((m: any, index: number) => {
        const prevModule = rawModules[index - 1];

        const prevCompleted = Number(prevModule?.completed_materials ?? 0);
        const prevTotal = Number(prevModule?.total_materials ?? 0);

        return {
          id: m.id,
          title: m.title,
          subtitle: "",
          description: m.description,
          duration: m.duration,
          total: Number(m.total_materials ?? 0),
          completed: Number(m.completed_materials ?? 0),
          topics: normalizeTopics(m.topics),
          unlocked: index === 0 || prevCompleted >= prevTotal,
          level: "Beginner",
          bgGradient: getModuleGradient(m.color),
        };
      });

      setModules(mapped);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchModules();
  }, []);

  const totalLessons = modules.reduce((acc, m) => acc + m.total, 0);
  const completedLessons = modules.reduce((acc, m) => acc + m.completed, 0);

  const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const [showCompleteToast, setShowCompleteToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  if (loading) {
    return <div>Loading materi...</div>;
  }
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Back Button */}
      <button onClick={onClose} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
        <ChevronLeft className="w-4 h-4" />
        <span className="font-medium text-sm">Kembali ke Daftar Materi</span>
      </button>

      {/* Hero Section */}
      <Card className="border-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 shadow-lg">
        <CardContent className="pt-8 pb-8">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge Level */}
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
              <Code className="w-4 h-4" />
              <span className="text-sm font-medium">Pemrograman Terstruktur</span>
            </div>

            {/* Title */}
            <h2 className="text-gray-900 mb-4">Percabangan dan Perulangan</h2>

            {/* Description */}
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Kuasai struktur kontrol percabangan (IF, ELSE, SWITCH) dan perulangan (FOR, WHILE, DO-WHILE) dalam pemrograman terstruktur. Pelajari cara membuat keputusan dan iterasi yang efisien dalam kode.
            </p>

            {/* Meta Info */}
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Total 20-26 jam pembelajaran</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm">7 modul terstruktur</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Trophy className="w-4 h-4" />
                <span className="text-sm">Studi kasus real-world</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Progress */}
      <Card className="border border-gray-200">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-gray-900 mb-1">Progress Pembelajaran</h3>
              <p className="text-sm text-gray-600">
                {completedLessons} dari {totalLessons} pelajaran selesai
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">{Math.round(overallProgress)}%</p>
              <p className="text-xs text-gray-500">Keseluruhan</p>
            </div>
          </div>
          <Progress value={overallProgress} className="h-3" />
        </CardContent>
      </Card>

      {/* Module List */}
      <div className="space-y-4">
        <h3 className="text-gray-900">Daftar Modul</h3>

        {modules.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold text-gray-700">Belum ada materi</h2>
            <p className="text-gray-500 mt-2">Guru belum menambahkan materi pembelajaran</p>
          </div>
        ) : (
          modules.map((module, index) => (
            <Card
              key={module.id}
              className={`border-2 transition-all ${module.unlocked ? "border-gray-200 hover:border-blue-300 hover:shadow-md cursor-pointer" : "border-gray-100 bg-gray-50 opacity-75"} ${
                selectedModule === module.id ? "border-blue-400 shadow-lg" : ""
              }`}
              onClick={() => module.unlocked && setSelectedModule(module.id)}
            >
              <CardContent className="pt-6 pb-6">
                <div className="flex gap-6">
                  {/* Left Side - Icon & Info */}
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${module.bgGradient} flex items-center justify-center relative`}>
                      {module.unlocked ? <PlayCircle className="w-8 h-8 text-white" /> : <Lock className="w-8 h-8 text-white" />}
                      <div className="absolute -top-2 -left-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                        <span className="text-sm font-bold text-gray-700">{index + 1}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle - Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-gray-900 mb-1 truncate">{module.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{module.subtitle}</p>

                        {/* Progress */}
                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-sm text-gray-600">{module.total} pelajaran</span>
                          <div className="flex-1 max-w-[200px]"></div>
                        </div>
                      </div>

                      {/* Right Info */}
                      <div className="text-right ml-4 flex-shrink-0">
                        <p className="text-sm font-medium text-gray-700 mb-1">{module.duration}</p>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            module.level === "Beginner" ? "bg-green-50 text-green-700 border-green-200" : module.level === "Intermediate" ? "bg-orange-50 text-orange-700 border-orange-200" : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {module.level}
                        </Badge>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">{module.description}</p>

                    {/* Topics */}
                    {selectedModule === module.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs font-medium text-gray-700 mb-3">Yang akan dipelajari:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {(Array.isArray(module.topics) ? module.topics : []).map((topic, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{topic}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {module.unlocked && (
                      <div className="flex items-center gap-3 mt-4">
                        <Button
                          size="sm"
                          disabled={module.total === 0}
                          className={`gap-2 text-white bg-gradient-to-r ${module.bgGradient} disabled:opacity-50 disabled:cursor-not-allowed`}
                          onClick={() => {
                            if (module.total === 0) return;
                            setSelectedModule(module.id);
                            setShowLessonContent(true);
                          }}
                        >
                          <PlayCircle className="w-4 h-4" />
                          {module.total === 0 ? "Materi Belum Tersedia" : module.completed === module.total ? "Review Materi" : module.completed > 0 ? "Lanjutkan Belajar" : "Mulai Belajar"}
                        </Button>

                        {module.total > 0 && module.completed >= module.total && (
                          <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            Selesai
                          </span>
                        )}
                      </div>
                    )}

                    {/* Locked Message */}
                    {!module.unlocked && (
                      <div className="flex items-center gap-2 mt-4 text-gray-500">
                        <Lock className="w-4 h-4" />
                        <span className="text-sm">Selesaikan modul sebelumnya untuk membuka</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Additional Resources */}
      <Card className="border border-blue-200 bg-blue-50">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Code className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-gray-900 mb-2">💡 Tips Belajar Percabangan & Perulangan</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Buat flowchart terlebih dahulu sebelum menulis kode untuk memvisualisasikan logika</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Praktikkan dengan membuat variasi pola segitiga dan piramida untuk latihan loop</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Gunakan debugger untuk melihat step-by-step eksekusi percabangan dan perulangan</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Pahami kapan menggunakan FOR vs WHILE, dan IF vs SWITCH untuk efisiensi kode</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lesson Content Popup */}
      {showLessonContent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="min-h-screen">
            <LessonContentPage
              moduleId={selectedModule}
              onClose={(completed: boolean) => {
                setShowLessonContent(false);
                fetchModules();

                if (completed) {
                  setToastMessage("Materi berhasil diselesaikan");
                  setShowCompleteToast(true);

                  setTimeout(() => {
                    setShowCompleteToast(false);
                  }, 2500);
                }
              }}
            />
          </div>
        </div>
      )}
      {/* Toast Notification */}
      {showCompleteToast && (
        <div className="fixed top-6 right-6 z-[100]">
          <div className="bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
