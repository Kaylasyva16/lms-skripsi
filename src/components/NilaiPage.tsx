"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Award, TrendingUp, CheckCircle2, ChevronRight, BookOpen, FolderKanban, FileText, PieChart as PieChartIcon, Activity } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, PieChart, Pie } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";

const gradeHistory = [
  { month: "Jan", grade: 82 },
  { month: "Feb", grade: 85 },
  { month: "Mar", grade: 88 },
  { month: "Apr", grade: 92 },
  { month: "Mei", grade: 90 },
  { month: "Jun", grade: 94 },
];

const weightageData = [
  { name: "Kuis", value: 30, color: "#3b82f6" },
  { name: "Proyek PBL", value: 40, color: "#8b5cf6" },
  { name: "Ujian Akhir", value: 30, color: "#10b981" },
];

const courseGrades = [
  {
    id: 1,
    course: "Dasar Pemrograman Web",
    teacher: "Pak Kusuma",
    grade: "A",
    score: 95,
    status: "Selesai",
    date: "15 Okt 2025",
  },
  {
    id: 2,
    course: "Basis Data",
    teacher: "Bu Siti",
    grade: "A-",
    score: 90,
    status: "Selesai",
    date: "20 Okt 2025",
  },
  {
    id: 3,
    course: "Pemrograman Berorientasi Objek",
    teacher: "Pak Budi",
    grade: "B+",
    score: 88,
    status: "Selesai",
    date: "25 Okt 2025",
  },
  {
    id: 4,
    course: "UI/UX Design Dasar",
    teacher: "Bu Maya",
    grade: "A",
    score: 92,
    status: "Selesai",
    date: "28 Okt 2025",
  },
];

const quizGrades = [
  { id: 1, title: "Kuis 1: Variabel & Tipe Data", score: 95, date: "10 Sep 2025", category: "Pemrograman Terstruktur" },
  { id: 2, title: "Kuis 2: Struktur Percabangan", score: 88, date: "18 Sep 2025", category: "Pemrograman Terstruktur" },
  { id: 3, title: "Kuis 3: Perulangan (Loops)", score: 92, date: "25 Sep 2025", category: "Pemrograman Terstruktur" },
  { id: 4, title: "Kuis 4: Dasar Database", score: 85, date: "05 Okt 2025", category: "Basis Data" },
  { id: 5, title: "Kuis 5: Relasi Tabel", score: 90, date: "12 Okt 2025", category: "Basis Data" },
];

const pblGrades = [
  {
    id: 1,
    project: "Sistem Inventory Sekolah",
    fase: "Fase 5: Evaluasi",
    score: 94,
    feedback: "Implementasi logic sangat baik, dokumentasi lengkap.",
  },
  {
    id: 2,
    project: "E-Commerce Sederhana",
    fase: "Fase 4: Pelaksanaan",
    score: 88,
    feedback: "Fokus pada keamanan routing dan validasi form.",
  },
];

export function NilaiPage() {
  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-700">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 opacity-80" />
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Rata-rata Nilai</span>
            </div>
            <p className="text-3xl font-black">89.5</p>
            <p className="text-xs opacity-80 mt-1">Target Semester: 95.0</p>
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
                <p className="text-xl font-bold text-gray-900">90.0</p>
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
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Ranking</p>
                <p className="text-xl font-bold text-gray-900">Top 5%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detail Progres Nilai (Weightage breakdown) */}
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
                  <Pie data={weightageData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {weightageData.map((entry, index) => (
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
              {weightageData.map((item) => (
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

        {/* Grade Progress Chart */}
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
                <BarChart data={gradeHistory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} domain={[0, 100]} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                  <Bar dataKey="grade" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quiz Grades Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            Rekap Nilai Kuis & Tugas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Judul Kuis</th>
                  <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Skor</th>
                  <th className="py-4 px-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {quizGrades.map((quiz) => (
                  <tr key={quiz.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 px-4">
                      <p className="font-bold text-gray-900 text-sm">{quiz.title}</p>
                    </td>
                    <td className="py-4 px-4 text-xs">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-medium">{quiz.category}</span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">{quiz.date}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`font-black ${quiz.score >= 90 ? "text-emerald-600" : "text-blue-600"}`}>{quiz.score}</span>
                    </td>
                    <td className="py-4 px-4 text-right text-gray-400">
                      <ChevronRight className="w-4 h-4" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Course Grades Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            Detail Nilai Akhir Mata Pelajaran
          </CardTitle>
          <button className="text-sm text-blue-600 font-medium hover:underline">Unduh Laporan</button>
        </CardHeader>
        <CardContent>
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
                {courseGrades.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{item.course}</p>
                        <p className="text-xs text-gray-500">{item.date}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{item.teacher}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-bold text-gray-900">{item.score}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-xs ${
                          item.grade.startsWith("A") ? "bg-emerald-50 text-emerald-700" : item.grade.startsWith("B") ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {item.grade}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <CheckCircle2 className="w-3 h-3" />
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-all opacity-0 group-hover:opacity-100">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* PBL Project Grades */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-indigo-500" />
              Penilaian Proyek PBL
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pblGrades.map((pbl) => (
              <div key={pbl.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/30 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{pbl.project}</h4>
                    <p className="text-xs text-blue-600 font-medium">{pbl.fase}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-gray-900">{pbl.score}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Poin Akhir</p>
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-gray-50">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Feedback Guru:</p>
                  <p className="text-xs text-gray-600 italic">"{pbl.feedback}"</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
