import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Progress } from "../ui/progress";
import { Users, BookOpen, ClipboardCheck, TrendingUp, Award, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface TeacherDashboardProps {
  onNavigate: (page: string) => void;
  user: any;
}

export default function TeacherDashboard({ onNavigate, user }: TeacherDashboardProps) {
  const [stats, setStats] = useState<any>(null);
  const [classProgress, setClassProgress] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/dashboard/guru", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setStats(data);
    };

    fetchDashboard();
  }, []);

  useEffect(() => {
    const fetchProgress = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/dashboard/guru/progress", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      const formatted = data.map((item: any) => ({
        class: item.kelas,
        students: item.total_siswa,
        avgScore: item.rata_rata || 0,
        completion: item.completion || 0,
      }));

      setClassProgress(formatted);
    };

    fetchProgress();
  }, []);

  const recentActivities = [
    { id: 1, type: "submission", student: "Ahmad Syarif", action: "mengumpulkan latihan Conditional Rendering", time: "10 menit yang lalu", avatar: "AS" },
    { id: 2, type: "quiz", student: "Budi Santoso", action: "menyelesaikan Quiz React Map & Filter", time: "25 menit yang lalu", avatar: "BS" },
    { id: 3, type: "material", student: "Citra Dewi", action: "mengakses materi React Hooks", time: "1 jam yang lalu", avatar: "CD" },
    { id: 4, type: "submission", student: "Dewi Kusuma", action: "mengumpulkan tugas List Rendering", time: "2 jam yang lalu", avatar: "DK" },
  ];

  const upcomingDeadlines = [
    { id: 1, title: "Proyek Sistem Kasir", class: "XI RPL 1", deadline: "15 Nov 2025", submissions: 18, total: 28, daysLeft: 2 },
    { id: 2, title: "Quiz Database MySQL", class: "X RPL 1", deadline: "18 Nov 2025", submissions: 12, total: 32, daysLeft: 5 },
    { id: 3, title: "Proyek API REST", class: "XII RPL 1", deadline: "20 Nov 2025", submissions: 20, total: 25, daysLeft: 7 },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard Guru</h1>
        <p className="text-sm text-gray-500 mt-1">Selamat datang, {user?.nama || "Guru"}! Kelola pembelajaran siswa Anda di sini.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Siswa</p>
                <h3 className="text-blue-900">{stats?.totalStudents ?? "-"}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Proyek Aktif</p>
                <h3 className="text-green-700">{stats?.activeProjects}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Perlu Dinilai</p>
                <h3 className="text-yellow-700">{stats?.pendingGrades}</h3>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tingkat Selesai</p>
                <h3 className="text-purple-700">{stats?.completionRate}%</h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Progress per Kelas</CardTitle>
              <CardDescription>Ringkasan performa setiap kelas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {classProgress.length === 0 ? (
                <p className="text-sm text-gray-500">Belum ada data kelas</p>
              ) : (
                classProgress.map((classData, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-blue-900">{classData.class}</h4>
                        <p className="text-sm text-gray-600">{classData.students} siswa</p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-600">Rata-rata Nilai</p>
                        <p className="text-2xl text-blue-900">{classData.avgScore}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tingkat Penyelesaian</span>
                        <span className="text-blue-600">{classData.completion}%</span>
                      </div>

                      <Progress value={classData.completion} className="h-2" />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Deadline Terdekat</CardTitle>
              <CardDescription>Tugas dan proyek yang akan berakhir</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingDeadlines.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-blue-900">{item.title}</h4>
                      <Badge variant="outline">{item.class}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Deadline: {item.deadline}</span>
                      <span>•</span>
                      <span>
                        {item.submissions}/{item.total} terkumpul
                      </span>
                    </div>
                    <div className="mt-2">
                      <Progress value={(item.submissions / item.total) * 100} className="h-2" />
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <div className={`text-2xl ${item.daysLeft <= 3 ? "text-red-600" : "text-blue-900"}`}>{item.daysLeft}</div>
                    <p className="text-xs text-gray-600">hari lagi</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start bg-blue-500 hover:bg-blue-600" onClick={() => onNavigate("teacher-materials")}>
                <BookOpen className="w-4 h-4 mr-2" />
                Upload Materi Baru
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate("teacher-quiz")}>
                <ClipboardCheck className="w-4 h-4 mr-2" />
                Buat Kuis Baru
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate("teacher-projects")}>
                <Award className="w-4 h-4 mr-2" />
                Tambah Proyek PBL
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate("teacher-grades")}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Lihat Penilaian
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aktivitas Terbaru</CardTitle>
              <CardDescription>Update dari siswa Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <Avatar className="flex-shrink-0">
                    <AvatarFallback className="bg-blue-500 text-white text-xs">{activity.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700">
                      <span className="text-blue-900">{activity.student}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                Perhatian
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0" />
                <p className="text-gray-700">12 tugas menunggu penilaian</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0" />
                <p className="text-gray-700">Deadline Sistem Kasir dalam 2 hari</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0" />
                <p className="text-gray-700">5 siswa belum mengakses materi minggu ini</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
