import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { FileBarChart, Download, Search, Filter, TrendingUp, Award, Users, ChevronRight } from "lucide-react";

interface TeacherGradesProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onViewStudentGradeDetail?: (studentId: number) => void;
}

interface StudentGradeSummary {
  id: number;
  name: string;
  nis: string;
  class: string;
  quizAvg: number;
  projectAvg: number;
  overall: number;
  quizzes: number;
  projects: number;
  avatar: string;
  trend: "stable" | "up" | "down";
}

interface TeachingClassItem {
  kelas: string;
}

interface ClassStat {
  class: string;
  students: number;
  avgScore: number;
  highest: number;
  lowest: number;
}

export default function TeacherGrades({ onNavigate, onLogout, onViewStudentGradeDetail }: TeacherGradesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [students, setStudents] = useState<StudentGradeSummary[]>([]);
  const [classOptions, setClassOptions] = useState<TeachingClassItem[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoadingClasses(true);
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/guru/teaching-classes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Gagal mengambil daftar kelas");
        }

        const data = await res.json();
        setClassOptions(data);
      } catch (err) {
        console.error("FETCH CLASSES ERROR:", err);
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoadingStudents(true);
        setError("");

        const token = localStorage.getItem("token");
        const query = selectedClass !== "all" ? `?kelas=${encodeURIComponent(selectedClass)}` : "";

        const res = await fetch(`http://localhost:5000/api/guru/students/grade-summary${query}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Gagal mengambil data nilai siswa");
        }

        const data = await res.json();
        setStudents(data);
      } catch (err) {
        console.error("FETCH STUDENTS ERROR:", err);
        setError("Data nilai siswa gagal dimuat");
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudents();
  }, [selectedClass]);

  const filteredStudents = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    if (!keyword) return students;

    return students.filter((student) => {
      return student.name.toLowerCase().includes(keyword) || student.nis.toLowerCase().includes(keyword) || student.class.toLowerCase().includes(keyword);
    });
  }, [students, searchQuery]);

  const summaryStats = useMemo(() => {
    const totalStudents = filteredStudents.length;

    const avgClass = totalStudents > 0 ? Number((filteredStudents.reduce((sum, student) => sum + Number(student.overall || 0), 0) / totalStudents).toFixed(1)) : 0;

    const passCount = filteredStudents.filter((student) => Number(student.overall) >= 75).length;
    const passRate = totalStudents > 0 ? Math.round((passCount / totalStudents) * 100) : 0;

    const completionRate =
      totalStudents > 0
        ? Math.round(
            (filteredStudents.reduce((sum, student) => {
              const done = Number(student.quizzes || 0) + Number(student.projects || 0);
              return sum + (done > 0 ? 1 : 0);
            }, 0) /
              totalStudents) *
              100
          )
        : 0;

    return {
      totalStudents,
      avgClass,
      passRate,
      completionRate,
    };
  }, [filteredStudents]);

  const classStats = useMemo<ClassStat[]>(() => {
    const grouped = new Map<string, StudentGradeSummary[]>();

    filteredStudents.forEach((student) => {
      if (!grouped.has(student.class)) {
        grouped.set(student.class, []);
      }
      grouped.get(student.class)!.push(student);
    });

    return Array.from(grouped.entries()).map(([className, items]) => {
      const scores = items.map((item) => Number(item.overall || 0));

      return {
        class: className,
        students: items.length,
        avgScore: scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0,
        highest: scores.length > 0 ? Math.max(...scores) : 0,
        lowest: scores.length > 0 ? Math.min(...scores) : 0,
      };
    });
  }, [filteredStudents]);

  const distribution = useMemo(() => {
    const total = filteredStudents.length || 1;

    const a = filteredStudents.filter((s) => Number(s.overall) >= 90).length;
    const b = filteredStudents.filter((s) => Number(s.overall) >= 80 && Number(s.overall) < 90).length;
    const c = filteredStudents.filter((s) => Number(s.overall) >= 70 && Number(s.overall) < 80).length;
    const d = filteredStudents.filter((s) => Number(s.overall) < 70).length;

    return {
      a,
      b,
      c,
      d,
      aPct: Math.round((a / total) * 100),
      bPct: Math.round((b / total) * 100),
      cPct: Math.round((c / total) * 100),
      dPct: Math.round((d / total) * 100),
    };
  }, [filteredStudents]);

  const topPerformers = useMemo(() => {
    return [...filteredStudents].sort((a, b) => Number(b.overall) - Number(a.overall)).slice(0, 5);
  }, [filteredStudents]);

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
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="flex-1">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-blue-900 mb-2 text-2xl font-semibold">Penilaian & Rapor</h1>
              <p className="text-gray-600">Lihat dan kelola nilai siswa</p>
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

          {error && (
            <Card className="mb-6 border-red-200">
              <CardContent className="pt-6 text-red-600">{error}</CardContent>
            </Card>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Users className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl text-blue-900 font-semibold">{summaryStats.totalStudents}</p>
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
                    <p className="text-2xl text-green-700 font-semibold">{summaryStats.avgClass}</p>
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
                    <p className="text-2xl text-purple-700 font-semibold">{summaryStats.passRate}%</p>
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
                    <p className="text-2xl text-orange-700 font-semibold">{summaryStats.completionRate}%</p>
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
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <CardTitle>Daftar Nilai Siswa</CardTitle>
                      <CardDescription>Nilai keseluruhan dari kuis dan proyek</CardDescription>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input placeholder="Cari siswa..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                      </div>

                      <Select value={selectedClass} onValueChange={setSelectedClass}>
                        <SelectTrigger className="w-44">
                          <SelectValue placeholder="Semua Kelas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Kelas</SelectItem>
                          {classOptions.map((item) => (
                            <SelectItem key={item.kelas} value={item.kelas}>
                              {item.kelas}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {loadingStudents || loadingClasses ? (
                    <div className="text-sm text-gray-500">Loading data nilai siswa...</div>
                  ) : filteredStudents.length === 0 ? (
                    <div className="text-sm text-gray-500">Belum ada data siswa untuk ditampilkan.</div>
                  ) : (
                    <div className="space-y-4">
                      {filteredStudents.map((student) => (
                        <Card key={student.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                              <Avatar className="w-12 h-12">
                                <AvatarFallback className="bg-blue-500 text-white">{student.avatar}</AvatarFallback>
                              </Avatar>

                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                  <h4 className="text-blue-900 font-semibold">{student.name}</h4>
                                  <Badge variant="outline">{student.class}</Badge>
                                  <span className="text-sm text-gray-600">NIS: {student.nis}</span>
                                </div>

                                <div className="grid md:grid-cols-4 gap-4">
                                  <div className="text-center p-2 bg-gray-50 rounded">
                                    <p className="text-xs text-gray-600 mb-1">Nilai Akhir</p>
                                    <p className={`text-xl font-semibold ${getGradeColor(student.overall)}`}>{student.overall}</p>
                                    <p className="text-xs text-gray-600">Grade {getGradeLetter(student.overall)}</p>
                                  </div>

                                  <div className="text-center p-2 bg-blue-50 rounded">
                                    <p className="text-xs text-gray-600 mb-1">Rata-rata Quiz</p>
                                    <p className="text-xl text-blue-900 font-semibold">{student.quizAvg}</p>
                                    <p className="text-xs text-gray-600">{student.quizzes} kuis</p>
                                  </div>

                                  <div className="text-center p-2 bg-purple-50 rounded">
                                    <p className="text-xs text-gray-600 mb-1">Rata-rata Proyek</p>
                                    <p className="text-xl text-purple-900 font-semibold">{student.projectAvg}</p>
                                    <p className="text-xs text-gray-600">{student.projects} proyek</p>
                                  </div>

                                  <div className="flex items-center justify-center pt-2 md:pt-0">
                                    <Button
                                      className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border-blue-100 rounded-xl px-6 h-12 font-bold transition-all duration-300 group shadow-sm hover:shadow-md"
                                      onClick={() => {
                                        if (onViewStudentGradeDetail) {
                                          onViewStudentGradeDetail(student.id);
                                        } else {
                                          console.log("Detail student:", student);
                                        }
                                      }}
                                    >
                                      Detail
                                      <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
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
                  {classStats.length === 0 ? (
                    <div className="text-sm text-gray-500">Belum ada statistik kelas.</div>
                  ) : (
                    <div className="space-y-4">
                      {classStats.map((classData, index) => (
                        <Card key={index}>
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h4 className="text-blue-900 mb-1 font-semibold">{classData.class}</h4>
                                <p className="text-sm text-gray-600">{classData.students} siswa</p>
                              </div>
                              <div className="text-right">
                                <p className="text-3xl text-blue-900 font-semibold">{classData.avgScore}</p>
                                <p className="text-sm text-gray-600">Rata-rata</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                              <div className="bg-green-50 p-3 rounded-lg text-center">
                                <p className="text-sm text-gray-600 mb-1">Tertinggi</p>
                                <p className="text-2xl text-green-700 font-semibold">{classData.highest}</p>
                              </div>
                              <div className="bg-red-50 p-3 rounded-lg text-center">
                                <p className="text-sm text-gray-600 mb-1">Terendah</p>
                                <p className="text-2xl text-red-700 font-semibold">{classData.lowest}</p>
                              </div>
                              <div className="bg-blue-50 p-3 rounded-lg text-center">
                                <p className="text-sm text-gray-600 mb-1">Range</p>
                                <p className="text-2xl text-blue-700 font-semibold">{classData.highest - classData.lowest}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
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
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-green-500 rounded flex items-center justify-center text-white">A</div>
                          <div>
                            <p className="text-blue-900">90 - 100</p>
                            <p className="text-sm text-gray-600">Sangat Baik</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl text-blue-900 font-semibold">{distribution.a}</p>
                          <p className="text-sm text-gray-600">siswa ({distribution.aPct}%)</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-500 rounded flex items-center justify-center text-white">B</div>
                          <div>
                            <p className="text-blue-900">80 - 89</p>
                            <p className="text-sm text-gray-600">Baik</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl text-blue-900 font-semibold">{distribution.b}</p>
                          <p className="text-sm text-gray-600">siswa ({distribution.bPct}%)</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-yellow-500 rounded flex items-center justify-center text-white">C</div>
                          <div>
                            <p className="text-blue-900">70 - 79</p>
                            <p className="text-sm text-gray-600">Cukup</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl text-blue-900 font-semibold">{distribution.c}</p>
                          <p className="text-sm text-gray-600">siswa ({distribution.cPct}%)</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-red-500 rounded flex items-center justify-center text-white">D-E</div>
                          <div>
                            <p className="text-blue-900">{"<"} 70</p>
                            <p className="text-sm text-gray-600">Perlu Perbaikan</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl text-blue-900 font-semibold">{distribution.d}</p>
                          <p className="text-sm text-gray-600">siswa ({distribution.dPct}%)</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Performers</CardTitle>
                    <CardDescription>5 siswa dengan nilai tertinggi</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {topPerformers.length === 0 ? (
                      <div className="text-sm text-gray-500">Belum ada data siswa.</div>
                    ) : (
                      topPerformers.map((student, index) => (
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
                            <p className="text-2xl text-green-600 font-semibold">{student.overall}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
