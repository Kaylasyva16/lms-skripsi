import React, { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";

interface EssayAnswer {
  questionId: number;
  questionOrder?: number;
  question: string;
  answer: string;
  score?: number | null;
  feedback?: string | null;
}

interface StudentSubmission {
  id: string;
  studentName: string;
  studentClass: string;
  submittedAt: string;
  answers: EssayAnswer[];
  totalScore?: number | null;
}

interface StudentEssayDetailProps {
  submission: StudentSubmission;
  quizTitle: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onBackToEssayGrading: () => void;
}

export const StudentEssayDetail: React.FC<StudentEssayDetailProps> = ({ submission, quizTitle, onNavigate, onLogout, onBackToEssayGrading }) => {
  const [answers, setAnswers] = useState<EssayAnswer[]>([]);
  const [studentName, setStudentName] = useState(submission.studentName);
  const [studentClass, setStudentClass] = useState(submission.studentClass);
  const [submittedAt, setSubmittedAt] = useState(submission.submittedAt);
  const [pageTitle, setPageTitle] = useState(quizTitle);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSubmissionDetail = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`http://localhost:5000/api/essay-submissions/${submission.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Gagal mengambil detail submission");
        }

        setAnswers(data.answers || []);
        setStudentName(data.studentName || submission.studentName);
        setStudentClass(data.studentClass || submission.studentClass);
        setSubmittedAt(data.submittedAt || submission.submittedAt);
        setPageTitle(data.quizTitle || quizTitle);
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    if (submission?.id) {
      fetchSubmissionDetail();
    }
  }, [submission.id, token, submission.studentName, submission.studentClass, submission.submittedAt, quizTitle]);

  const handleScoreChange = (index: number, score: string) => {
    const trimmed = score.trim();

    const newAnswers = [...answers];
    newAnswers[index] = {
      ...newAnswers[index],
      score: trimmed === "" ? null : Math.max(0, Math.min(100, Number(trimmed))),
    };
    setAnswers(newAnswers);
  };

  const handleFeedbackChange = (index: number, feedback: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = { ...newAnswers[index], feedback };
    setAnswers(newAnswers);
  };

  const calculateTotalScore = () => {
    const validScores = answers.filter((a) => a.score !== undefined && a.score !== null).map((a) => Number(a.score));

    if (validScores.length === 0) return 0;

    return validScores.reduce((sum, score) => sum + score, 0);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const payload = {
        answers: answers.map((answer) => ({
          questionId: answer.questionId,
          score: answer.score ?? null,
          feedback: answer.feedback ?? "",
        })),
      };

      const res = await fetch(`http://localhost:5000/api/essay-submissions/${submission.id}/grade`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal menyimpan penilaian");
      }

      alert("Penilaian berhasil disimpan!");
      onBackToEssayGrading();
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan saat menyimpan");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8">Memuat detail jawaban siswa...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <button onClick={onBackToEssayGrading} className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
          <ArrowLeft className="w-5 h-5" />
          Kembali ke Daftar Siswa
        </button>

        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-gray-800 mb-2">Penilaian Jawaban Essay</h1>
            <p className="text-gray-600">{pageTitle}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{studentName}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full" />
                Kelas: {studentClass}
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                Dikumpulkan: {new Date(submittedAt).toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Rata-rata Nilai</div>
            <div className="text-4xl font-bold text-blue-600">{calculateTotalScore()}</div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {answers.map((answer, index) => (
          <div key={answer.questionId || index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-semibold">Soal #{answer.questionOrder || index + 1}</span>

              <div className="flex-1" />

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Nilai:</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={answer.score ?? ""}
                  onChange={(e) => handleScoreChange(index, e.target.value)}
                  placeholder="0-100"
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <div className="mb-4">
              <p className="font-semibold text-gray-900 mb-2">Pertanyaan:</p>
              <p className="text-gray-700 leading-relaxed">{answer.question}</p>
            </div>

            <div className="mb-4">
              <p className="font-semibold text-gray-900 mb-2">Jawaban Siswa:</p>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{answer.answer || "-"}</p>
              </div>
            </div>

            <div>
              <label className="font-semibold text-gray-900 mb-2 block">Feedback untuk Siswa:</label>
              <textarea
                value={answer.feedback ?? ""}
                onChange={(e) => handleFeedbackChange(index, e.target.value)}
                placeholder="Berikan feedback untuk membantu siswa memahami jawaban..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 mt-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Ringkasan Penilaian</h3>
            <p className="text-blue-100">
              {answers.filter((a) => a.score !== undefined && a.score !== null).length} dari {answers.length} soal sudah dinilai
            </p>
          </div>

          <div className="text-right">
            <div className="text-sm text-blue-100 mb-1">Rata-rata Nilai</div>
            <div className="text-4xl font-bold">{calculateTotalScore()}</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        <button onClick={onBackToEssayGrading} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          Batal
        </button>

        <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          <Save className="w-5 h-5" />
          {isSaving ? "Menyimpan..." : "Simpan Penilaian"}
        </button>
      </div>
    </div>
  );
};

export default StudentEssayDetail;
