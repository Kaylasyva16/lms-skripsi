import React, { useState, useEffect } from "react";
import { ArrowLeft, BookOpen, FileText, Award } from "lucide-react";

interface QuizScore {
  id: string;
  quizTitle: string;
  score: number;
  maxScore: number;
  date: string;
  status: "completed" | "pending";
}

interface ProjectScore {
  id: string;
  projectTitle: string;
  score: number;
  maxScore: number;
  date: string;
  phases: {
    name: string;
    score: number;
    maxScore: number;
  }[];
}

interface StudentGradeData {
  id: string;
  studentName: string;
  studentClass: string;
  studentNumber: string;
  quizScores: QuizScore[];
  projectScores: ProjectScore[];
}

interface StudentGradeDetailProps {
  studentId: number | null;
  onBack: () => void;
}

export const StudentGradeDetail: React.FC<StudentGradeDetailProps> = ({ studentId, onBack }) => {
  const [studentData, setStudentData] = useState<StudentGradeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudentDetail = async () => {
      if (!studentId) return;

      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:5000/api/guru/students/${studentId}/grades-detail`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Gagal mengambil detail nilai siswa");
        }

        const data = await res.json();
        setStudentData(data);
      } catch (err) {
        console.error(err);
        setError("Data nilai siswa gagal dimuat");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetail();
  }, [studentId]);

  if (loading) {
    return <div className="p-8">Loading data siswa...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">{error}</div>;
  }

  if (!studentData) {
    return <div className="p-8">Data siswa tidak ditemukan</div>;
  }

  const calculateQuizAverage = () => {
    const completed = studentData.quizScores.filter((q) => q.status === "completed");
    if (completed.length === 0) return 0;
    const total = completed.reduce((sum, q) => sum + (q.score / q.maxScore) * 100, 0);
    return Math.round(total / completed.length);
  };

  const calculateProjectAverage = () => {
    if (studentData.projectScores.length === 0) return 0;
    const total = studentData.projectScores.reduce((sum, p) => sum + (p.score / p.maxScore) * 100, 0);
    return Math.round(total / studentData.projectScores.length);
  };

  const finalGrade = Math.round(calculateQuizAverage() * 0.4 + calculateProjectAverage() * 0.6);

  const getGradeLabel = (score: number) => {
    if (score >= 90) return { label: "A", color: "text-green-600", bg: "bg-green-100" };
    if (score >= 80) return { label: "B", color: "text-blue-600", bg: "bg-blue-100" };
    if (score >= 70) return { label: "C", color: "text-yellow-600", bg: "bg-yellow-100" };
    if (score >= 60) return { label: "D", color: "text-orange-600", bg: "bg-orange-100" };
    return { label: "E", color: "text-red-600", bg: "bg-red-100" };
  };

  const gradeInfo = getGradeLabel(finalGrade);

  return (
    <div className="flex-1 bg-gray-50 min-h-screen p-6 lg:p-8">
      <div className="space-y-6">
        <div>
          <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-2">
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Daftar Nilai
          </button>

          <h1 className="text-2xl font-semibold text-gray-900">Detail Nilai Siswa</h1>
          <p className="text-sm text-gray-500">Rincian nilai dari semua komponen penilaian</p>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">{studentData.studentName}</h2>
            <p className="text-sm text-blue-100 mt-1">
              NIS: {studentData.studentNumber} • {studentData.studentClass}
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur rounded-xl px-5 py-4 text-center">
            <p className="text-xs text-blue-100">Nilai Akhir</p>
            <p className="text-3xl font-bold">{finalGrade}</p>
            <span className={`px-3 py-1 text-sm rounded-lg font-semibold ${gradeInfo.bg} ${gradeInfo.color}`}>{gradeInfo.label}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Rata-rata Kuis</p>
                <p className="text-xl font-bold">{calculateQuizAverage()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Rata-rata Project</p>
                <p className="text-xl font-bold">{calculateProjectAverage()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Bobot Penilaian</p>
                <p className="text-sm font-semibold">Kuis 40% • Project 60%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-6">
          <div className="flex items-center gap-2 mb-4 font-semibold text-gray-800">
            <FileText className="w-5 h-5 text-purple-600" />
            Nilai Kuis
          </div>

          {studentData.quizScores.length === 0 ? (
            <p className="text-sm text-gray-400">Belum ada data kuis</p>
          ) : (
            <div className="space-y-3">
              {studentData.quizScores.map((quiz) => (
                <div key={quiz.id} className="flex items-center justify-between rounded-xl border p-4">
                  <div>
                    <p className="font-medium text-gray-900">{quiz.quizTitle}</p>
                    <p className="text-sm text-gray-500">{quiz.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-purple-600">
                      {quiz.score}/{quiz.maxScore}
                    </p>
                    <p className="text-xs text-gray-500">{quiz.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border p-6">
          <div className="flex items-center gap-2 mb-4 font-semibold text-gray-800">
            <BookOpen className="w-5 h-5 text-green-600" />
            Nilai Project (PBL)
          </div>

          {studentData.projectScores.length === 0 ? (
            <p className="text-sm text-gray-400">Belum ada data project</p>
          ) : (
            <div className="space-y-4">
              {studentData.projectScores.map((project) => (
                <div key={project.id} className="rounded-xl border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">{project.projectTitle}</p>
                      <p className="text-sm text-gray-500">{project.date}</p>
                    </div>
                    <p className="font-semibold text-green-600">
                      {project.score}/{project.maxScore}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {project.phases.map((phase, index) => {
                      const phaseMaxScore = Number(phase.maxScore || 4);
                      const percentage = Math.round((Number(phase.score || 0) / phaseMaxScore) * 100);
                      return (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{phase.name}</span>
                            <span>
                              {phase.score}/{phaseMaxScore}
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-gray-200">
                            <div className="h-2 rounded-full bg-green-500" style={{ width: `${percentage}%` }} />
                          </div>
                        </div>
                      );
                    })}
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

export default StudentGradeDetail;
