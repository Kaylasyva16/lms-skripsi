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
  const [deadlines, setDeadlines] = useState<any[]>([]);
  const [loadingDeadlines, setLoadingDeadlines] = useState(true);

  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/dashboard/guru", {
        headers: { Authorization: `Bearer ${token}` },
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
        headers: { Authorization: `Bearer ${token}` },
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

  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        setLoadingDeadlines(true);

        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/guru/deadline-terdekat", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        setDeadlines(data);
      } catch (err) {
        console.error(err);
        setDeadlines([]);
      } finally {
        setLoadingDeadlines(false);
      }
    };

    fetchDeadlines();
  }, []);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/guru/recent-activities", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setRecentActivities(data);
      } catch {
        setRecentActivities([]);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard Guru</h1>
        <p className="text-sm text-gray-500 mt-1">Selamat datang, {user?.nama || "Guru"}! Kelola pembelajaran siswa Anda di sini.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6 flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Siswa</p>
              <h3 className="text-blue-900 text-xl font-semibold">{stats?.totalStudents ?? 0}</h3>
            </div>
            <Users className="text-blue-500" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6 flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Proyek Aktif</p>
              <h3 className="text-green-700 text-xl font-semibold">{stats?.activeProjects ?? 0}</h3>
            </div>
            <BookOpen className="text-green-500" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="pt-6 flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Perlu Dinilai</p>
              <h3 className="text-yellow-700 text-xl font-semibold">{stats?.pendingGrades ?? 0}</h3>
            </div>
            <Clock className="text-yellow-500" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-6 flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Tingkat Selesai</p>
              <h3 className="text-purple-700 text-xl font-semibold">{stats?.completionRate ?? 0}%</h3>
            </div>
            <TrendingUp className="text-purple-500" />
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="md:col-span-2 space-y-6">
          {/* Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Progress per Kelas</CardTitle>
              <CardDescription>Ringkasan performa setiap kelas</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {classProgress.length === 0 ? (
                <p className="text-sm text-gray-500">Belum ada data kelas</p>
              ) : (
                classProgress.map((c, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="text-blue-900">{c.class}</h4>
                        <p className="text-sm text-gray-600">{c.students} siswa</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Rata-rata</p>
                        <p className="text-xl">{c.avgScore}</p>
                      </div>
                    </div>

                    <div className="mt-2">
                      <Progress value={c.completion} className="h-2" />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Deadline */}
          <Card>
            <CardHeader>
              <CardTitle>Deadline Terdekat</CardTitle>
              <CardDescription>Tugas dan proyek yang akan berakhir</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {loadingDeadlines ? (
                <p className="text-sm text-gray-500">Memuat deadline...</p>
              ) : deadlines.length === 0 ? (
                <p className="text-sm text-gray-500">Tidak ada deadline</p>
              ) : (
                deadlines.map((item) => (
                  <div key={item.id} className="flex justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex gap-2 mb-2">
                        <h4 className="text-blue-900">{item.title}</h4>
                        <Badge variant="outline">{item.kelas}</Badge>
                      </div>

                      <p className="text-sm text-gray-600">
                        Deadline: {new Date(item.deadline).toLocaleDateString("id-ID")}
                        {" • "}
                        {item.progress} terkumpul
                      </p>

                      <div className="mt-2">
                        <Progress value={item.percent} className="h-2" />
                      </div>
                    </div>

                    <div className="ml-4 text-right">
                      <div className={`text-xl ${item.sisaHari <= 3 ? "text-red-600" : "text-blue-900"}`}>{item.sisaHari}</div>
                      <p className="text-xs">hari lagi</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Aksi Cepat</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
              <Button className="w-full justify-start bg-blue-500 hover:bg-blue-600 text-white" onClick={() => onNavigate("teacher-materials")}>
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
              {recentActivities.length === 0 ? (
                <p className="text-sm text-gray-500">Belum ada aktivitas</p>
              ) : (
                recentActivities.map((a) => (
                  <div key={a.id} className="flex gap-3">
                    <Avatar>
                      <AvatarFallback>{a.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p>
                        <span className="text-blue-900">{a.student}</span> {a.action}
                      </p>
                      <small className="text-gray-500">{a.time}</small>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
