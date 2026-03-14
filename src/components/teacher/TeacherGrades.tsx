import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { FileBarChart, Download, Search, Filter, TrendingUp, TrendingDown, Award, Users } from "lucide-react";

interface TeacherGradesProps {
  onNavigate: (page: any) => void; // biar aman sama TeacherPage
}

export default function TeacherGrades({ onNavigate }: TeacherGradesProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const students = [
    {
      id: 1,
      name: "Ahmad Syarif",
      nis: "2021001",
      class: "XI RPL 1",
      avatar: "AS",
      quizAvg: 85,
      projectAvg: 88,
      overall: 87,
      projects: 12,
      quizzes: 8,
      attendance: 95,
      trend: "up",
    },
    {
      id: 2,
      name: "Budi Santoso",
      nis: "2021002",
      class: "XI RPL 1",
      avatar: "BS",
      quizAvg: 78,
      projectAvg: 82,
      overall: 80,
      projects: 10,
      quizzes: 8,
      attendance: 92,
      trend: "up",
    },
    {
      id: 3,
      name: "Citra Dewi",
      nis: "2020015",
      class: "X RPL 1",
      avatar: "CD",
      quizAvg: 92,
      projectAvg: 90,
      overall: 91,
      projects: 9,
      quizzes: 6,
      attendance: 98,
      trend: "up",
    },
    {
      id: 4,
      name: "Dewi Kusuma",
      nis: "2019045",
      class: "XII RPL 1",
      avatar: "DK",
      quizAvg: 95,
      projectAvg: 93,
      overall: 94,
      projects: 18,
      quizzes: 12,
      attendance: 97,
      trend: "stable",
    },
    {
      id: 5,
      name: "Eko Prasetyo",
      nis: "2020032",
      class: "X RPL 2",
      avatar: "EP",
      quizAvg: 72,
      projectAvg: 75,
      overall: 74,
      projects: 8,
      quizzes: 6,
      attendance: 88,
      trend: "down",
    },
  ];

  const classStats = [
    { class: "X RPL 1", students: 32, avgScore: 82, highest: 95, lowest: 68 },
    { class: "X RPL 2", students: 30, avgScore: 78, highest: 92, lowest: 65 },
    { class: "XI RPL 1", students: 28, avgScore: 85, highest: 96, lowest: 72 },
    { class: "XI RPL 2", students: 31, avgScore: 80, highest: 90, lowest: 70 },
    { class: "XII RPL 1", students: 25, avgScore: 90, highest: 98, lowest: 80 },
    { class: "XII RPL 2", students: 27, avgScore: 88, highest: 95, lowest: 78 },
  ];

  const getGradeColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getGradeLetter = (score: number) => {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "E";
  };

  return (
    <div className="p-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Penilaian & Rapor</h1>
          <p className="text-sm text-gray-500 mt-1">Lihat dan kelola nilai siswa</p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600">
            <Download className="w-4 h-4 mr-2" />
            Export Nilai
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl text-blue-900">156</p>
                <p className="text-sm text-gray-600">Total Siswa</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <Award className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl text-green-700">84.2</p>
                <p className="text-sm text-gray-600">Rata-rata Kelas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl text-purple-700">89%</p>
                <p className="text-sm text-gray-600">Lulus KKM</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-3 rounded-lg">
                <FileBarChart className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl text-orange-700">92%</p>
                <p className="text-sm text-gray-600">Tingkat Selesai</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="students" className="space-y-6">
        <TabsList>
          <TabsTrigger value="students">Nilai Siswa</TabsTrigger>
          <TabsTrigger value="class">Statistik Kelas</TabsTrigger>
          <TabsTrigger value="analysis">Analisis</TabsTrigger>
        </TabsList>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Daftar Nilai Siswa</CardTitle>
                  <CardDescription>Nilai keseluruhan dari kuis dan proyek</CardDescription>
                </div>

                <div className="flex gap-3">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input placeholder="Cari siswa..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  </div>

                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Semua Kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kelas</SelectItem>
                      <SelectItem value="x-rpl-1">X RPL 1</SelectItem>
                      <SelectItem value="x-rpl-2">X RPL 2</SelectItem>
                      <SelectItem value="xi-rpl-1">XI RPL 1</SelectItem>
                      <SelectItem value="xi-rpl-2">XI RPL 2</SelectItem>
                      <SelectItem value="xii-rpl-1">XII RPL 1</SelectItem>
                      <SelectItem value="xii-rpl-2">XII RPL 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {students.map((student) => (
                  <Card key={student.id} className="rounded-3xl border shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-6">
                        {/* HEADER ROW */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <Avatar className="w-16 h-16 shrink-0">
                              <AvatarFallback className="bg-blue-600 text-white text-lg">{student.avatar}</AvatarFallback>
                            </Avatar>

                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="text-blue-900 font-semibold text-lg">{student.name}</h3>

                              <Badge variant="outline">{student.class}</Badge>

                              <span className="text-sm text-gray-500">NIS: {student.nis}</span>
                            </div>
                          </div>

                          <Button variant="outline" className="h-12 px-6 rounded-xl">
                            Detail
                          </Button>
                        </div>

                        {/* STATS ROW */}
                        <div className="flex flex-wrap gap-4">
                          <div className="min-w-[170px] flex-1 bg-gray-100 rounded-2xl p-4 text-center">
                            <p className="text-xs text-gray-600 mb-1">Nilai Akhir</p>
                            <p className={`text-2xl font-semibold ${getGradeColor(student.overall)}`}>{student.overall}</p>
                            <p className="text-xs text-gray-500">Grade {getGradeLetter(student.overall)}</p>
                          </div>

                          <div className="min-w-[170px] flex-1 bg-blue-50 rounded-2xl p-4 text-center">
                            <p className="text-xs text-gray-600 mb-1">Rata-rata Quiz</p>
                            <p className="text-2xl font-semibold text-blue-700">{student.quizAvg}</p>
                            <p className="text-xs text-gray-500">{student.quizzes} kuis</p>
                          </div>

                          <div className="min-w-[170px] flex-1 bg-purple-50 rounded-2xl p-4 text-center">
                            <p className="text-xs text-gray-600 mb-1">Rata-rata Proyek</p>
                            <p className="text-2xl font-semibold text-purple-700">{student.projectAvg}</p>
                            <p className="text-xs text-gray-500">{student.projects} proyek</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Class Stats Tab */}
        <TabsContent value="class" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistik per Kelas</CardTitle>
              <CardDescription>Ringkasan performa setiap kelas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classStats.map((classData, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-blue-900 mb-1">{classData.class}</h4>
                          <p className="text-sm text-gray-600">{classData.students} siswa</p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl text-blue-900">{classData.avgScore}</p>
                          <p className="text-sm text-gray-600">Rata-rata</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-green-50 p-3 rounded-lg text-center">
                          <p className="text-sm text-gray-600 mb-1">Tertinggi</p>
                          <p className="text-2xl text-green-700">{classData.highest}</p>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg text-center">
                          <p className="text-sm text-gray-600 mb-1">Terendah</p>
                          <p className="text-2xl text-red-700">{classData.lowest}</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg text-center">
                          <p className="text-sm text-gray-600 mb-1">Range</p>
                          <p className="text-2xl text-blue-700">{classData.highest - classData.lowest}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribusi Nilai</CardTitle>
                <CardDescription>Sebaran nilai siswa</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { grade: "A", range: "90 - 100", label: "Sangat Baik", count: 42, pct: "27%", color: "bg-green-500" },
                    { grade: "B", range: "80 - 89", label: "Baik", count: 68, pct: "44%", color: "bg-blue-500" },
                    { grade: "C", range: "70 - 79", label: "Cukup", count: 32, pct: "21%", color: "bg-yellow-500" },
                    { grade: "D-E", range: "< 70", label: "Perlu Perbaikan", count: 14, pct: "8%", color: "bg-red-500" },
                  ].map((row) => (
                    <div key={row.grade} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 ${row.color} rounded flex items-center justify-center text-white`}>{row.grade}</div>
                        <div>
                          <p className="text-blue-900">{row.range}</p>
                          <p className="text-sm text-gray-600">{row.label}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl text-blue-900">{row.count}</p>
                        <p className="text-sm text-gray-600">siswa ({row.pct})</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>5 siswa dengan nilai tertinggi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {students
                  .slice()
                  .sort((a, b) => b.overall - a.overall)
                  .slice(0, 5)
                  .map((student, index) => (
                    <div key={student.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl">{index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}</div>
                      <Avatar>
                        <AvatarFallback className="bg-blue-500 text-white">{student.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-blue-900">{student.name}</p>
                        <p className="text-sm text-gray-600">{student.class}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl text-green-600">{student.overall}</p>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
