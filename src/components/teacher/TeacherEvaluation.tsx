import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import { Slider } from "../ui/slider";
import { Code2, Download, FileText, CheckCircle2, Clock, XCircle, Eye, Star, MessageSquare, ArrowLeft } from "lucide-react";

interface TeacherEvaluationProps {
  onNavigate: (page: string) => void;
}

export default function TeacherEvaluation({ onNavigate }: TeacherEvaluationProps) {
  const [creativity, setCreativity] = useState([75]);
  const [understanding, setUnderstanding] = useState([80]);
  const [teamwork, setTeamwork] = useState([70]);
  const [documentation, setDocumentation] = useState([85]);
  const [feedback, setFeedback] = useState("");

  const submissions = [
    {
      id: 1,
      projectTitle: "Sistem Kasir Minimarket",
      studentName: "Ahmad Syarif",
      class: "XI RPL 1",
      submittedAt: "3 Nov 2025, 14:30",
      status: "pending",
      avatar: "AS",
    },
    {
      id: 2,
      projectTitle: "Website Portfolio Personal",
      studentName: "Budi Santoso",
      class: "XI RPL 1",
      submittedAt: "2 Nov 2025, 16:45",
      status: "pending",
      avatar: "BS",
    },
    {
      id: 3,
      projectTitle: "API REST Toko Online",
      studentName: "Citra Dewi",
      class: "X RPL 1",
      submittedAt: "1 Nov 2025, 10:20",
      status: "graded",
      score: 88,
      avatar: "CD",
    },
    {
      id: 4,
      projectTitle: "Aplikasi Perpustakaan",
      studentName: "Dewi Kusuma",
      class: "XII RPL 1",
      submittedAt: "1 Nov 2025, 09:15",
      status: "graded",
      score: 95,
      avatar: "DK",
    },
    {
      id: 5,
      projectTitle: "Sistem Absensi Online",
      studentName: "Eko Prasetyo",
      class: "X RPL 2",
      submittedAt: "31 Okt 2025, 22:10",
      status: "graded",
      score: 78,
      avatar: "EP",
    },
  ];

  const totalScore = Math.round(creativity[0] * 0.3 + understanding[0] * 0.4 + teamwork[0] * 0.2 + documentation[0] * 0.1);

  const getGrade = (score: number) => {
    if (score >= 90) return { grade: "A", color: "text-green-600" };
    if (score >= 80) return { grade: "B", color: "text-blue-600" };
    if (score >= 70) return { grade: "C", color: "text-yellow-600" };
    if (score >= 60) return { grade: "D", color: "text-orange-600" };
    return { grade: "E", color: "text-red-600" };
  };

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => onNavigate("teacher-dashboard")} className="mb-6 text-blue-600">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Dashboard
        </Button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-blue-900 mb-2">Evaluasi Proyek Siswa</h1>
          <p className="text-gray-600">Nilai dan berikan feedback untuk proyek yang telah dikumpulkan</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Menunggu Penilaian</p>
                  <h3 className="text-yellow-700">12</h3>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Sudah Dinilai</p>
                  <h3 className="text-green-700">45</h3>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Rata-rata Nilai</p>
                  <h3 className="text-blue-700">84.5</h3>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Star className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Terlambat</p>
                  <h3 className="text-red-700">3</h3>
                </div>
                <div className="bg-red-100 p-3 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left - Submission List */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Daftar Pengumpulan</CardTitle>
                <CardDescription>Proyek yang telah dikumpulkan siswa</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="pending" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="pending">
                      Pending
                      <Badge variant="secondary" className="ml-2 text-xs">
                        2
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="graded">Dinilai</TabsTrigger>
                  </TabsList>

                  <TabsContent value="pending" className="space-y-3">
                    {submissions
                      .filter((s) => s.status === "pending")
                      .map((submission) => (
                        <Card key={submission.id} className="cursor-pointer hover:shadow-md transition-shadow border-2 border-yellow-200 bg-yellow-50">
                          <CardContent className="pt-4">
                            <div className="flex items-start gap-3">
                              <Avatar>
                                <AvatarFallback className="bg-blue-500 text-white">{submission.avatar}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-blue-900 mb-1 truncate">{submission.studentName}</h4>
                                <p className="text-sm text-gray-600 mb-2">{submission.class}</p>
                                <p className="text-sm text-gray-700 mb-2">{submission.projectTitle}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  <span>{submission.submittedAt}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </TabsContent>

                  <TabsContent value="graded" className="space-y-3">
                    {submissions
                      .filter((s) => s.status === "graded")
                      .map((submission) => (
                        <Card key={submission.id} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="pt-4">
                            <div className="flex items-start gap-3">
                              <Avatar>
                                <AvatarFallback className="bg-green-500 text-white">{submission.avatar}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="text-blue-900 truncate">{submission.studentName}</h4>
                                  <Badge className="bg-green-500">{submission.score}</Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{submission.class}</p>
                                <p className="text-sm text-gray-700 mb-2">{submission.projectTitle}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                                  <span>Sudah dinilai</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right - Evaluation Form */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detail Pengumpulan</CardTitle>
                <CardDescription>Sistem Kasir Minimarket - Ahmad Syarif (XI RPL 1)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Project Info */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Waktu Pengumpulan</p>
                      <p className="text-blue-900">3 Nov 2025, 14:30</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Status</p>
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                        Menunggu Penilaian
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">File yang Dikumpulkan</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          sistem-kasir.zip
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Dokumentasi</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          Lihat Catatan
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grading Rubric */}
                <div>
                  <h3 className="text-blue-900 mb-4">Rubrik Penilaian</h3>

                  <div className="space-y-6">
                    {/* Creativity */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-blue-900">Kreativitas & Inovasi</h4>
                          <p className="text-sm text-gray-600">Bobot: 30%</p>
                        </div>
                        <span className="text-2xl text-blue-600">{creativity[0]}</span>
                      </div>
                      <Slider value={creativity} onValueChange={setCreativity} max={100} step={5} className="mb-2" />
                      <p className="text-xs text-gray-500">Originalitas ide, penggunaan fitur tambahan, dan solusi kreatif</p>
                    </div>

                    {/* Understanding */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-blue-900">Pemahaman Konsep</h4>
                          <p className="text-sm text-gray-600">Bobot: 40%</p>
                        </div>
                        <span className="text-2xl text-blue-600">{understanding[0]}</span>
                      </div>
                      <Slider value={understanding} onValueChange={setUnderstanding} max={100} step={5} className="mb-2" />
                      <p className="text-xs text-gray-500">Penerapan konsep OOP, struktur kode, dan best practices</p>
                    </div>

                    {/* Teamwork */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-blue-900">Kerja Sama Tim</h4>
                          <p className="text-sm text-gray-600">Bobot: 20%</p>
                        </div>
                        <span className="text-2xl text-blue-600">{teamwork[0]}</span>
                      </div>
                      <Slider value={teamwork} onValueChange={setTeamwork} max={100} step={5} className="mb-2" />
                      <p className="text-xs text-gray-500">Kolaborasi, pembagian tugas, dan komunikasi antar anggota</p>
                    </div>

                    {/* Documentation */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-blue-900">Dokumentasi</h4>
                          <p className="text-sm text-gray-600">Bobot: 10%</p>
                        </div>
                        <span className="text-2xl text-blue-600">{documentation[0]}</span>
                      </div>
                      <Slider value={documentation} onValueChange={setDocumentation} max={100} step={5} className="mb-2" />
                      <p className="text-xs text-gray-500">Kelengkapan dokumentasi, komentar kode, dan user manual</p>
                    </div>
                  </div>
                </div>

                {/* Total Score */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90 mb-1">Nilai Total</p>
                      <h2 className="text-white">{totalScore}</h2>
                    </div>
                    <div className="text-right">
                      <p className="text-sm opacity-90 mb-1">Grade</p>
                      <h2 className="text-white">{getGrade(totalScore).grade}</h2>
                    </div>
                  </div>
                </div>

                {/* Feedback */}
                <div>
                  <h4 className="text-blue-900 mb-3">Feedback untuk Siswa</h4>
                  <Textarea placeholder="Berikan komentar, saran, atau apresiasi untuk siswa..." rows={6} value={feedback} onChange={(e) => setFeedback(e.target.value)} />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button className="flex-1 bg-blue-500 hover:bg-blue-600">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Simpan Penilaian
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Kirim untuk Revisi
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl text-blue-900 mb-1">24</p>
                  <p className="text-sm text-gray-600">Proyek Aktif</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl text-blue-900 mb-1">4.5</p>
                  <p className="text-sm text-gray-600">Rating Guru</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl text-blue-900 mb-1">92%</p>
                  <p className="text-sm text-gray-600">Tingkat Selesai</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
  );
}
