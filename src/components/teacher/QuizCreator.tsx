import React, { useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2, GripVertical, Save, Edit } from "lucide-react";
import { QuestionEditor } from "./QuestionEditor";

interface Question {
  id: string;
  type: "multiple-choice" | "essay" | "drag-drop" | "matching" | "logic-flow" | "debugging" | "simulation";
  data: any;
  points: number;
}

interface QuizCreatorProps {
  quiz: any;
  onSave: (data: any) => Promise<any>;
  onCancel: () => void;
}

export const QuizCreator: React.FC<QuizCreatorProps> = ({ quiz, onSave, onCancel }) => {
  const [title, setTitle] = useState(quiz?.title || "");
  const [description, setDescription] = useState(quiz?.description || "");
  const [duration, setDuration] = useState(quiz?.duration || 30);
  const [status, setStatus] = useState<"draft" | "published">(quiz?.status || "draft");
  const [questions, setQuestions] = useState<Question[]>(quiz?.questions || []);
  const [editingQuestion, setEditingQuestion] = useState<{ question: Question | null; index: number } | null>(null);
  const [selectingTypeIndex, setSelectingTypeIndex] = useState<number | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<any>(quiz || null);
  const [savingQuiz, setSavingQuiz] = useState(false);
  const [kelas, setKelas] = useState(quiz?.kelas || "");
  const [kelasOptions, setKelasOptions] = useState<{ id: number; nama: string }[]>([]);

  const token = localStorage.getItem("token");

  // sync quiz dari parent ke state lokal
  useEffect(() => {
    setCurrentQuiz(quiz || null);
    setTitle(quiz?.title || "");
    setKelas(quiz?.kelas || "");
    setDescription(quiz?.description || "");
    setDuration(quiz?.duration || 30);
    setStatus(quiz?.status || "draft");
  }, [quiz]);

  const mapQuestionFromApi = (q: any): Question => {
    return {
      id: String(q.id),
      type: q.type,
      points: q.points,
      data: {
        question: q.questionText || "",
        explanation: q.explanation || "",
        guideline: q.payload?.guideline || "",
        options: (q.options || []).map((opt: any) => ({
          text: opt.optionText,
          isCorrect: opt.isCorrect,
        })),
        ...q.payload,
      },
    };
  };

  const buildQuestionPayload = (question: Question) => {
    if (question.type === "multiple-choice") {
      return {
        type: question.type,
        questionText: question.data.question || "",
        explanation: question.data.explanation || "",
        points: question.points,
        payload: {},
        options: (question.data.options || []).map((opt: any) => ({
          optionText: opt.text || "",
          isCorrect: !!opt.isCorrect,
        })),
      };
    }

    if (question.type === "essay") {
      return {
        type: question.type,
        questionText: question.data.question || "",
        explanation: question.data.explanation || "",
        points: question.points,
        payload: {
          guideline: question.data.guideline || "",
        },
        options: [],
      };
    }

    return {
      type: question.type,
      questionText: question.data.question || "",
      explanation: question.data.explanation || "",
      points: question.points,
      payload: question.data || {},
      options: [],
    };
  };

  // DEBUG
  useEffect(() => {
    console.log("QUESTIONS:", questions);
  }, [questions]);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!currentQuiz?.id || !token) return;

      try {
        const res = await fetch(`http://localhost:5000/api/quizzes/${currentQuiz.id}/questions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Gagal mengambil soal");
        }

        const data = await res.json();
        setQuestions(data.map(mapQuestionFromApi));
      } catch (err) {
        console.error("FETCH QUESTIONS ERROR:", err);
      }
    };

    fetchQuestions();
  }, [currentQuiz?.id, token]);

  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const res = await fetch("http://localhost:5000/public/kelas");

        if (!res.ok) {
          throw new Error("Gagal mengambil data kelas");
        }

        const data = await res.json();
        setKelasOptions(data);
      } catch (err) {
        console.error("FETCH KELAS ERROR:", err);
      }
    };

    fetchKelas();
  }, []);

  const questionTypes = [
    { id: "multiple-choice", label: "Pilihan Ganda", icon: "📝", active: true },
    { id: "essay", label: "Essay", icon: "✍️", active: true },
    { id: "matching", label: "Matching", icon: "🔗", active: false },
    { id: "logic-flow", label: "Logic Flow", icon: "🧩", active: false },
    { id: "debugging", label: "Debugging Puzzle", icon: "🐛", active: false },
    { id: "simulation", label: "Simulation", icon: "⚡", active: false },
    { id: "drag-drop", label: "Drag & Drop", icon: "🔄", active: false },
  ];

  const handleAddQuestion = () => {
    if (!currentQuiz?.id) {
      alert("Simpan kuis dulu sebelum menambahkan soal");
      return;
    }

    setSelectingTypeIndex(questions.length);
  };

  const handleEditQuestion = (question: Question, index: number) => {
    setEditingQuestion({ question, index });
  };

  const handleSaveQuestion = async (question: Question) => {
    if (!editingQuestion || !currentQuiz?.id || !token) {
      alert("Simpan kuis dulu sebelum menambahkan soal");
      return;
    }

    try {
      const payload = buildQuestionPayload(question);
      const isExistingQuestion = questions.some((q) => q.id === question.id);

      let res: Response;

      if (isExistingQuestion) {
        res = await fetch(`http://localhost:5000/api/questions/${question.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`http://localhost:5000/api/quizzes/${currentQuiz.id}/questions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        throw new Error("Gagal menyimpan soal");
      }

      const savedQuestion = await res.json();

      const mappedQuestion: Question = {
        id: String(savedQuestion.id),
        type: savedQuestion.type,
        points: savedQuestion.points,
        data: {
          question: savedQuestion.questionText || payload.questionText,
          explanation: savedQuestion.explanation || payload.explanation || "",
          guideline: savedQuestion.payload?.guideline || payload.payload?.guideline || "",
          options: (payload.options || []).map((opt: any) => ({
            text: opt.optionText,
            isCorrect: opt.isCorrect,
          })),
          ...savedQuestion.payload,
        },
      };

      setQuestions((prev) => {
        const index = editingQuestion.index;
        const updated = [...prev];

        if (updated[index]) {
          updated[index] = mappedQuestion;
        } else {
          updated.push(mappedQuestion);
        }

        return updated;
      });

      setEditingQuestion(null);
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan saat menyimpan soal");
    }
  };

  const deleteQuestion = async (id: string) => {
    if (!confirm("Hapus soal ini?")) return;
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:5000/api/questions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Gagal menghapus soal");
      }

      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan saat menghapus soal");
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Judul kuis harus diisi");
      return;
    }

    if (!kelas.trim()) {
      alert("Kelas harus dipilih");
      return;
    }

    const questionTypes = [
      ...new Set(
        questions.map((q) => {
          switch (q.type) {
            case "multiple-choice":
              return "Multiple Choice";
            case "essay":
              return "Essay";
            case "drag-drop":
              return "Drag & Drop";
            case "matching":
              return "Matching";
            case "logic-flow":
              return "Logic Flow";
            case "debugging":
              return "Debugging Puzzle";
            case "simulation":
              return "Simulation";
            default:
              return "";
          }
        })
      ),
    ].filter(Boolean);

    try {
      setSavingQuiz(true);

      console.log("STATUS SAAT DISIMPAN:", status);

      const savedQuiz = await onSave({
        id: currentQuiz?.id,
        title,
        kelas,
        description,
        duration,
        status,
        questions,
        totalQuestions: questions.length,
        questionTypes,
      });

      setCurrentQuiz(savedQuiz);
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan kuis");
    } finally {
      setSavingQuiz(false);
    }
  };

  if (selectingTypeIndex !== null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-white py-14 px-8 lg:px-16">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-start gap-4">
              <button onClick={() => setSelectingTypeIndex(null)} className="p-3 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition">
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>

              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Tambah Soal Baru #{selectingTypeIndex + 1}</h1>
                <p className="text-gray-500 mt-1">Pilih tipe soal terlebih dahulu</p>
              </div>
            </div>

            <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-sm hover:bg-blue-700 transition">Simpan Soal</button>
          </div>

          {/* Main Container */}
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-16">
            <h2 className="text-lg font-semibold text-gray-800 mb-8">Pilih Tipe Soal</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              {questionTypes.map((type) => {
                const isActive = type.id === "multiple-choice" || type.id === "essay";

                return (
                  <div
                    key={type.id}
                    onClick={() => {
                      if (!isActive) return; // 🚫 blok kalau tidak aktif

                      setEditingQuestion({
                        question: {
                          id: Date.now().toString(),
                          type: type.id as any,
                          data: {},
                          points: 10,
                        },
                        index: selectingTypeIndex,
                      });
                      setSelectingTypeIndex(null);
                    }}
                    className={`relative rounded-2xl p-8 border transition-all duration-300
          ${isActive ? "bg-white border-gray-200 cursor-pointer hover:border-blue-500 hover:shadow-lg" : "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"}`}
                  >
                    {/* Badge Coming Soon */}
                    {!isActive && <span className="absolute top-4 right-4 text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full">Coming Soon</span>}

                    <div className="text-3xl mb-4">{type.icon}</div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{type.label}</h3>

                    <p className="text-gray-500 text-sm">{isActive ? "Pilih tipe soal ini" : "Segera hadir"}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show question editor if editing
  if (editingQuestion !== null) {
    return <QuestionEditor question={editingQuestion.question} questionNumber={editingQuestion.index + 1} onSave={handleSaveQuestion} onCancel={() => setEditingQuestion(null)} />;
  }

  const getQuestionTypeLabel = (type: string) => {
    return questionTypes.find((t) => t.id === type)?.label || type;
  };

  const getQuestionTypeIcon = (type: string) => {
    return questionTypes.find((t) => t.id === type)?.icon || "📝";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-white py-14 px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={onCancel} className="w-14 h-14 flex items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 hover:bg-white transition-all duration-200">
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <div>
              <h1 className="text-gray-800 mb-1">{quiz ? "Edit Kuis" : "Buat Kuis Baru"}</h1>
              <p className="text-gray-600">Buat soal interaktif dengan berbagai tipe pertanyaan</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setStatus(status === "draft" ? "published" : "draft")} className={`px-4 py-2 rounded-lg transition-colors ${status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
              {status === "published" ? "Dipublikasi" : "Draft"}
            </button>

            <button onClick={handleSave} disabled={savingQuiz} className="flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-60">
              <Save className="w-5 h-5" />
              {savingQuiz ? "Menyimpan..." : "Simpan Kuis"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quiz Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-gray-800 mb-4">Informasi Kuis</h2>

            <div className="space-y-4">
              {/* Judul */}
              <div>
                <label className="block text-gray-700 mb-2">Judul Kuis *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masukkan judul kuis..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* KELAS */}
              <div>
                <label className="block text-gray-700 mb-2">Kelas *</label>
                <select value={kelas} onChange={(e) => setKelas(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
                  <option value="">Pilih kelas</option>
                  {kelasOptions.map((item) => (
                    <option key={item.id} value={item.nama}>
                      {item.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Deskripsi</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deskripsi singkat tentang kuis ini..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Durasi (menit)</label>
                <input type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value) || 0)} min="1" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-800">Daftar Soal ({questions.length})</h2>
              <button onClick={handleAddQuestion} className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                <Plus className="w-5 h-5" />
                Tambah Soal
              </button>
            </div>

            {/* Question List */}
            {questions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <p className="mb-2">Belum ada soal</p>
                <p className="text-sm mb-4">Klik "Tambah Soal" untuk memulai</p>
                <button onClick={handleAddQuestion} className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                  Buat Soal Pertama
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {questions.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors bg-gray-50">
                    <div className="flex items-start gap-3">
                      <GripVertical className="w-5 h-5 text-gray-400 cursor-move mt-1" />
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center flex-shrink-0">{index + 1}</div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{getQuestionTypeIcon(question.type)}</span>
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm">{getQuestionTypeLabel(question.type)}</span>
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-sm">{question.points} poin</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleEditQuestion(question, index)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Soal">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => deleteQuestion(question.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus Soal">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <p className="text-gray-700 line-clamp-2">{question.data.question || "(Tidak ada pertanyaan)"}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Statistics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-gray-800 mb-4">Ringkasan</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Soal</span>
                <span className="text-gray-800">{questions.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Poin</span>
                <span className="text-gray-800">{questions.reduce((sum, q) => sum + q.points, 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Kelas</span>
                <span className="text-gray-800">{kelas || "-"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Durasi</span>
                <span className="text-gray-800">{duration} menit</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status</span>
                <span className={status === "published" ? "text-green-600" : "text-gray-600"}>{status === "published" ? "Dipublikasi" : "Draft"}</span>
              </div>
            </div>
          </div>

          {/* Question Type Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-gray-800 mb-4">Distribusi Tipe Soal</h3>
            <div className="space-y-2">
              {questionTypes.map((type) => {
                const count = questions.filter((q) => q.type === type.id).length;
                if (count === 0) return null;
                return (
                  <div key={type.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{type.icon}</span>
                      <span className="text-gray-600 text-sm">{type.label}</span>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-sm">{count}</span>
                  </div>
                );
              })}
              {questions.length === 0 && <p className="text-gray-400 text-sm text-center py-4">Belum ada soal</p>}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <h3 className="text-gray-800 mb-3">💡 Tips</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Gunakan berbagai tipe soal untuk variasi</li>
              <li>• Berikan feedback yang jelas pada setiap soal</li>
              <li>• Atur durasi sesuai jumlah dan kesulitan soal</li>
              <li>• Preview kuis sebelum dipublikasi</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default QuizCreator;
