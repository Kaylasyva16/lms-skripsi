"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Award, TrendingUp, CheckCircle2, ChevronRight, BookOpen, FolderKanban, FileText, PieChart as PieChartIcon, Activity, Clock3 } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, PieChart, Pie } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";

type GradeHistoryItem = {
  month: string;
  grade: number;
};

type WeightageItem = {
  name: string;
  value: number;
  color: string;
};

type QuizGrade = {
  id: number | string;
  title: string;
  score: number | null;
  date: string;
  category: string;
  teacher?: string;
  status?: string;
};

type CourseGrade = {
  id: number | string;
  course: string;
  teacher: string;
  grade: string;
  score: number | null;
  status: string;
  date: string;
};

type PblGrade = {
  id: number | string;
  project: string;
  fase: string;
  score: number;
  feedback: string;
  teacher?: string;
  date?: string;
  status?: string;
};

type StudentInfo = {
  id: number;
  nama: string;
  kelas: string;
  nis: string;
};

type SummaryData = {
  averageScore: number;
  averageQuiz: number;
  averageProject: number;
  ranking: string;
  targetSemester: number;
};

type GradesOverviewResponse = {
  student: StudentInfo;
  summary: SummaryData;
  gradeHistory: GradeHistoryItem[];
  weightageData: WeightageItem[];
  quizGrades: QuizGrade[];
  courseGrades: CourseGrade[];
  pblGrades: PblGrade[];
};

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function formatDate(dateString?: string) {
  if (!dateString) return "-";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getScoreColor(score: number | null) {
  if (score === null || score === undefined) return "text-gray-400";
  if (score >= 90) return "text-emerald-600";
  if (score >= 75) return "text-blue-600";
  return "text-amber-600";
}

function getGradeBadgeClass(grade: string) {
  if (grade.startsWith("A")) return "bg-emerald-50 text-emerald-700";
  if (grade.startsWith("B")) return "bg-blue-50 text-blue-700";
  if (grade.startsWith("C")) return "bg-amber-50 text-amber-700";
  return "bg-red-50 text-red-700";
}

function getStatusBadge(status?: string) {
  const normalized = (status || "").toLowerCase();

  if (normalized === "graded" || normalized === "selesai") {
    return {
      label: "Selesai",
      className: "bg-emerald-50 text-emerald-700 border border-emerald-100",
      icon: <CheckCircle2 className="w-3 h-3" />,
    };
  }

  if (normalized === "submitted") {
    return {
      label: "Menunggu Dinilai",
      className: "bg-amber-50 text-amber-700 border border-amber-100",
      icon: <Clock3 className="w-3 h-3" />,
    };
  }

  return {
    label: status || "Diproses",
    className: "bg-gray-50 text-gray-700 border border-gray-100",
    icon: <Clock3 className="w-3 h-3" />,
  };
}

export function NilaiPage() {
  const [data, setData] = useState<GradesOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoading(true);
        setError("");

        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

        const res = await fetch(`${API_BASE_URL}/api/student/grades/overview`, {
          method: "GET",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const contentType = res.headers.get("content-type") || "";
        let result: any = null;

        if (contentType.includes("application/json")) {
          result = await res.json();
        } else {
          throw new Error(`Response bukan JSON. Status ${res.status}`);
        }

        if (!res.ok) {
          throw new Error(result.message || "Gagal mengambil data nilai");
        }

        setData(result);
      } catch (err: any) {
        console.error("FETCH NILAI ERROR:", err);
        setError(err.message || "Terjadi kesalahan saat mengambil data nilai");
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  const safeData = useMemo<GradesOverviewResponse>(
    () =>
      data || {
        student: {
          id: 0,
          nama: "-",
          kelas: "-",
          nis: "-",
        },
        summary: {
          averageScore: 0,
          averageQuiz: 0,
          averageProject: 0,
          ranking: "-",
          targetSemester: 95,
        },
        gradeHistory: [],
        weightageData: [
          { name: "Kuis", value: 30, color: "#3b82f6" },
          { name: "Proyek PBL", value: 40, color: "#8b5cf6" },
          { name: "Ujian Akhir", value: 30, color: "#10b981" },
        ],
        quizGrades: [],
        courseGrades: [],
        pblGrades: [],
      },
    [data]
  );

  const normalizedQuizGrades = useMemo(() => {
    return (safeData.quizGrades || []).map((quiz) => ({
      ...quiz,
      score: quiz.score ?? null,
      status: quiz.status || "submitted",
    }));
  }, [safeData.quizGrades]);

  const normalizedCourseGrades = useMemo(() => {
    return (safeData.courseGrades || []).map((item) => ({
      ...item,
      score: item.score ?? null,
      status: item.status || "Diproses",
    }));
  }, [safeData.courseGrades]);

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <Card>
          <CardContent className="py-10 text-center text-gray-500">Memuat data nilai...</CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 p-4">
        <Card>
          <CardContent className="py-10 text-center text-red-500">{error}</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-gray-900">Nilai</h2>
        <p className="text-sm text-gray-500">
          Rekap dan progres nilai akademik {safeData.student.nama} • NIS {safeData.student.nis} • Kelas {safeData.student.kelas}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 opacity-80" />
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Nilai Akhir</span>
            </div>
            <p className="text-3xl font-black">{safeData.summary.averageScore}</p>
            <p className="text-xs opacity-80 mt-1">
              Kuis {safeData.summary.averageQuiz} • Proyek {safeData.summary.averageProject}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Rata-rata Kuis</p>
                <p className="text-xl font-bold text-gray-900">{safeData.summary.averageQuiz}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Rata-rata Proyek</p>
                <p className="text-xl font-bold text-gray-900">{safeData.summary.averageProject}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-purple-500" />
              Komposisi Nilai Akhir
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full relative mb-4">
              <ChartContainer config={{}} className="h-full w-full">
                <PieChart>
                  <Pie data={safeData.weightageData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {safeData.weightageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-gray-900">100%</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Bobot</span>
              </div>
            </div>

            <div className="space-y-3">
              {safeData.weightageData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-600 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" />
              Detail Progres Nilai Semester
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full relative">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={safeData.gradeHistory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar dataKey="grade" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            Rekap Nilai Kuis & Tugas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {normalizedQuizGrades.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">Belum ada data nilai kuis.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Judul Kuis</th>
                    <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Kategori</th>
                    <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tanggal</th>
                    <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Skor</th>
                    <th className="py-4 px-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {normalizedQuizGrades.map((quiz) => {
                    const statusBadge = getStatusBadge(quiz.status);

                    return (
                      <tr key={quiz.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="py-4 px-4">
                          <p className="font-bold text-gray-900 text-sm">{quiz.title}</p>
                        </td>
                        <td className="py-4 px-4 text-xs">
                          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-medium">{quiz.category}</span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-500">{formatDate(quiz.date)}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium ${statusBadge.className}`}>
                            {statusBadge.icon}
                            {statusBadge.label}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`font-black ${getScoreColor(quiz.score)}`}>{quiz.score ?? "-"}</span>
                        </td>
                        <td className="py-4 px-4 text-right text-gray-400">
                          <ChevronRight className="w-4 h-4" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            Detail Nilai Akhir Mata Pelajaran
          </CardTitle>
          <button className="text-sm text-blue-600 font-medium hover:underline">Unduh Laporan</button>
        </CardHeader>
        <CardContent>
          {normalizedCourseGrades.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">Belum ada data nilai akhir.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Mata Pelajaran</th>
                    <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Pengajar</th>
                    <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Skor</th>
                    <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Grade</th>
                    <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="py-4 px-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {normalizedCourseGrades.map((item) => {
                    const statusBadge = getStatusBadge(item.status);

                    return (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{item.course}</p>
                            <p className="text-xs text-gray-500">{formatDate(item.date)}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">{item.teacher}</td>
                        <td className="py-4 px-4 text-center">
                          <span className="font-bold text-gray-900">{item.score ?? "-"}</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-flex items-center justify-center min-w-[32px] h-8 px-2 rounded-lg font-bold text-xs ${getGradeBadgeClass(item.grade)}`}>{item.grade}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium ${statusBadge.className}`}>
                            {statusBadge.icon}
                            {statusBadge.label}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-all opacity-0 group-hover:opacity-100">
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-indigo-500" />
              Penilaian Proyek PBL
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {safeData.pblGrades.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500">Belum ada nilai proyek PBL.</div>
            ) : (
              safeData.pblGrades.map((pbl) => (
                <div key={pbl.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/30 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{pbl.project}</h4>
                      <p className="text-xs text-blue-600 font-medium">{pbl.fase}</p>
                      {pbl.teacher && <p className="text-xs text-gray-500 mt-1">Pengajar: {pbl.teacher}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-gray-900">{pbl.score}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Poin Akhir</p>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-gray-50">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Feedback Guru:</p>
                    <p className="text-xs text-gray-600 italic">"{pbl.feedback || "Belum ada feedback"}"</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
