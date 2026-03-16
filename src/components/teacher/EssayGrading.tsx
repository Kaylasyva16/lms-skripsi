import React, { useEffect, useState } from "react";
import { ArrowLeft, Search, ChevronRight } from "lucide-react";

interface EssayAnswer {
  questionId?: number;
  questionOrder?: number;
  question: string;
  answer: string;
  score?: number;
  feedback?: string;
}

interface StudentSubmission {
  id: string;
  studentName: string;
  studentClass: string;
  submittedAt: string;
  answers: {
    questionId?: number;
    questionOrder?: number;
    question: string;
    answer: string;
    score?: number | null;
    feedback?: string | null;
  }[];
  totalScore?: number | null;
}

interface EssayGradingProps {
  quizId: string;
  quizTitle: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onViewStudentDetail?: (submission: StudentSubmission) => void;
  refreshKey?: number;
}

export const EssayGrading: React.FC<EssayGradingProps> = ({ quizId, quizTitle, onNavigate, onLogout, onViewStudentDetail, refreshKey }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEssaySubmissions = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`http://localhost:5000/api/quizzes/${quizId}/essay-submissions`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Gagal mengambil data jawaban essay");
        }

        const data = await res.json();

        const normalizedData = (data || []).map((item: any) => ({
          id: String(item.id),
          studentName: item.studentName || "",
          studentClass: item.studentClass || "",
          submittedAt: item.submittedAt || "",
          answers: Array.isArray(item.answers) ? item.answers : [],
          totalScore: item.totalScore ?? null,
        }));

        setSubmissions(normalizedData);
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      fetchEssaySubmissions();
    }
  }, [quizId, token, refreshKey]);

  const filteredSubmissions = submissions.filter((sub) => sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || sub.studentClass.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading) {
    return <div className="p-8">Memuat data jawaban essay...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <button onClick={() => onNavigate("teacher-quiz")} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Kembali ke Kelola Kuis
        </button>
        <h1 className="text-gray-800 mb-2">Periksa Jawaban Essay</h1>
        <p className="text-gray-600">{quizTitle}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama siswa atau kelas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Total Siswa</div>
          <div className="text-2xl font-bold text-gray-900">{submissions.length}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Sudah Dinilai</div>
          <div className="text-2xl font-bold text-green-600">{submissions.filter((s) => s.totalScore !== null && s.totalScore !== undefined).length}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Belum Dinilai</div>
          <div className="text-2xl font-bold text-orange-600">{submissions.filter((s) => s.totalScore === null || s.totalScore === undefined).length}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">No</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Nama Siswa</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Kelas</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Waktu Pengumpulan</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Nilai</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.map((submission, index) => (
              <tr key={submission.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-gray-900">{index + 1}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{submission.studentName}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">{submission.studentClass}</span>
                </td>
                <td className="px-6 py-4 text-gray-600">{submission.submittedAt ? new Date(submission.submittedAt).toLocaleString("id-ID") : "-"}</td>
                <td className="px-6 py-4">
                  {submission.totalScore !== null && submission.totalScore !== undefined ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">{submission.totalScore}</span>
                  ) : (
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">Belum Dinilai</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => onViewStudentDetail?.(submission)} className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    Lihat Detail
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredSubmissions.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-gray-800 mb-2">Belum ada jawaban essay</h3>
            <p className="text-gray-600">Data akan muncul setelah siswa mengumpulkan kuis</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EssayGrading;
