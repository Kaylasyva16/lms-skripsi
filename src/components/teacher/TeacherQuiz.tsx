import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, Copy, BarChart3, Eye } from "lucide-react";
import QuizCreator from "./QuizCreator";

interface Quiz {
  id: string;
  title: string;
  kelas: string;
  description: string;
  totalQuestions: number;
  duration: number; // in minutes
  questionTypes: string[];
  status: "draft" | "published";
  createdAt: string;
  submissions: number;
  averageScore: number;
}

interface TeacherQuizProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export const TeacherQuiz: React.FC<TeacherQuizProps> = ({ onNavigate, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreator, setShowCreator] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "draft" | "published">("all");
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        throw new Error("Token login tidak ditemukan");
      }

      const res = await fetch("http://localhost:5000/api/quizzes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Gagal mengambil data kuis");
      }

      const data = await res.json();
      console.log("DATA QUIZ:", data);
      setQuizzes(data);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) || quiz.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === "all" || quiz.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleCreateQuiz = () => {
    setSelectedQuiz(null);
    setShowCreator(true);
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setShowCreator(true);
  };

  const handleDeleteQuiz = async (quizId: string) => {
    const ok = confirm("Apakah Anda yakin ingin menghapus kuis ini?");
    if (!ok) return;

    try {
      const res = await fetch(`http://localhost:5000/api/quizzes/${quizId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Gagal menghapus kuis");
      }

      setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan saat menghapus");
    }
  };

  const handleDuplicateQuiz = async (quiz: Quiz) => {
    try {
      const res = await fetch(`http://localhost:5000/api/quizzes/${quiz.id}/duplicate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Gagal menduplikasi kuis");
      }

      const newQuiz = await res.json();
      setQuizzes((prev) => [newQuiz, ...prev]);
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan saat duplikasi");
    }
  };

  const handleSaveQuiz = async (quizData: any) => {
    try {
      let savedQuiz;

      if (selectedQuiz?.id || quizData.id) {
        const quizId = selectedQuiz?.id || quizData.id;

        const res = await fetch(`http://localhost:5000/api/quizzes/${quizId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(quizData),
        });

        if (!res.ok) {
          throw new Error("Gagal memperbarui kuis");
        }

        savedQuiz = await res.json();

        setQuizzes((prev) => prev.map((q) => (String(q.id) === String(savedQuiz.id) ? savedQuiz : q)));
      } else {
        const res = await fetch("http://localhost:5000/api/quizzes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(quizData),
        });

        if (!res.ok) {
          throw new Error("Gagal membuat kuis");
        }

        savedQuiz = await res.json();

        setQuizzes((prev) => [savedQuiz, ...prev]);
      }

      if (savedQuiz.status === "published") {
        setShowCreator(false);
        setSelectedQuiz(null);
        fetchQuizzes();
      }

      return savedQuiz;
    } catch (err: any) {
      throw new Error(err.message || "Terjadi kesalahan saat menyimpan");
    }
  };

  if (showCreator) {
    return (
      <div className="p-8">
        <QuizCreator quiz={selectedQuiz} onSave={handleSaveQuiz} onCancel={() => setShowCreator(false)} />
      </div>
    );
  }

  if (loading) {
    return <div className="p-8">Memuat data kuis...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Kelola Kuis</h1>
              <p className="text-sm text-gray-500 mt-1">Buat dan kelola berbagai tipe kuis interaktif untuk siswa</p>
            </div>
            <button onClick={handleCreateQuiz} className="inline-flex items-center gap-2 whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-sm transition">
              <Plus className="w-4 h-4 mr-2" />
              Buat Kuis Baru
            </button>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari kuis..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Status Filter */}
              <div className="flex gap-2">
                <button onClick={() => setFilterStatus("all")} className={`px-4 py-2 rounded-lg transition-colors ${filterStatus === "all" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  Semua ({quizzes.length})
                </button>
                <button onClick={() => setFilterStatus("published")} className={`px-4 py-2 rounded-lg transition-colors ${filterStatus === "published" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  Dipublikasi ({quizzes.filter((q) => q.status === "published").length})
                </button>
                <button onClick={() => setFilterStatus("draft")} className={`px-4 py-2 rounded-lg transition-colors ${filterStatus === "draft" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  Draft ({quizzes.filter((q) => q.status === "draft").length})
                </button>
              </div>
            </div>
          </div>

          {/* Quiz List */}
          {filteredQuizzes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-12 px-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Tidak ada kuis ditemukan</h3>
              <p className="text-sm text-gray-500 mt-1 mb-6">{searchQuery ? "Coba kata kunci lain" : "Mulai dengan membuat kuis baru"}</p>
              {!searchQuery && (
                <button onClick={handleCreateQuiz} className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                  Buat Kuis Pertama
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredQuizzes.map((quiz) => (
                <div key={quiz.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-gray-800">{quiz.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm ${quiz.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{quiz.status === "published" ? "Dipublikasi" : "Draft"}</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">
                        Kelas: <span className="text-gray-700">{quiz.kelas || "-"}</span>
                      </p>
                      <p className="text-gray-600 mb-4">{quiz.description}</p>

                      {/* Quiz Info */}
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full" />
                          {quiz.totalQuestions} Soal
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full" />
                          {quiz.duration} Menit
                        </div>
                        {quiz.status === "published" && (
                          <>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full" />
                              {quiz.submissions} Pengerjaan
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                              Rata-rata: {quiz.averageScore}%
                            </div>
                          </>
                        )}
                      </div>

                      {/* Question Types */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {(quiz.questionTypes || []).map((type, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      {quiz.status === "published" && (
                        <button onClick={() => alert("Lihat statistik: " + quiz.title)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Lihat Statistik">
                          <BarChart3 className="w-5 h-5" />
                        </button>
                      )}
                      <button onClick={() => alert("Preview: " + quiz.title)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Preview">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDuplicateQuiz(quiz)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Duplikat">
                        <Copy className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleEditQuiz(quiz)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDeleteQuiz(quiz.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherQuiz;
