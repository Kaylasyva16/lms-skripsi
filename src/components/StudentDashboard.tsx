"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { TrendingUp, CheckCircle2, BookOpen, Clock, Calendar, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, PieChart, Pie } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";

interface LatestActivityItem {
  id: number;
  type: "tugas" | "quiz" | "project";
  title: string;
  subject: string;
  dueDate: string;
  status: "pending" | "in-progress" | "completed";
  priority: "high" | "medium" | "low";
}

interface RecentLearningItem {
  id: number;
  title: string;
  module: string;
  progress: number;
  lastAccessed: string;
  icon: string;
}

interface LearningDistributionItem {
  name: string;
  value: number;
  color: string;
}

interface PerformanceData {
  studyHours: number;
  completedTasks: number;
}

interface WeeklyActivityItem {
  day: string;
  hours: number;
}

interface StudentDashboardProps {
  onNavigate: (page: string) => void;
  user: any;
}

export default function StudentDashboard({ onNavigate, user }: StudentDashboardProps) {
  const [latestActivities, setLatestActivities] = useState<LatestActivityItem[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  const [recentLearningData, setRecentLearningData] = useState<RecentLearningItem[]>([]);
  const [loadingRecentLearning, setLoadingRecentLearning] = useState(true);

  const [performance, setPerformance] = useState<PerformanceData>({
    studyHours: 0,
    completedTasks: 0,
  });
  const [loadingPerformance, setLoadingPerformance] = useState(true);

  const [learningDistribution, setLearningDistribution] = useState<LearningDistributionItem[]>([]);
  const [loadingDistribution, setLoadingDistribution] = useState(true);

  const [weeklyActivity, setWeeklyActivity] = useState<WeeklyActivityItem[]>([]);
  const [loadingWeeklyActivity, setLoadingWeeklyActivity] = useState(true);

  const [totalMateri, setTotalMateri] = useState(0);

  const [progressData, setProgressData] = useState({
    total: 0,
    complete: 0,
  });

  const inProgress = Math.max(progressData.total - progressData.complete, 0);

  const fetchMateriSummary = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/courses/1/modules", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal mengambil summary materi");
      }

      const modules = Array.isArray(data) ? data : [];

      const total = modules.reduce((sum, item) => sum + Number(item.total_materials ?? 0), 0);

      const complete = modules.reduce((sum, item) => sum + Number(item.completed_materials ?? 0), 0);

      setTotalMateri(total);
      setProgressData({
        total,
        complete,
      });
    } catch (err) {
      console.error("FETCH MATERI SUMMARY ERROR:", err);
      setTotalMateri(0);
      setProgressData({
        total: 0,
        complete: 0,
      });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (!user?.id) return;

    const fetchLatestActivities = async () => {
      try {
        setLoadingActivities(true);

        const res = await fetch("http://localhost:5000/api/student/latest-activities", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Gagal mengambil aktivitas terbaru");
        }

        setLatestActivities(data);
      } catch (err) {
        console.error("FETCH LATEST ACTIVITIES ERROR:", err);
        setLatestActivities([]);
      } finally {
        setLoadingActivities(false);
      }
    };

    const fetchRecentLearning = async () => {
      try {
        setLoadingRecentLearning(true);

        const res = await fetch("http://localhost:5000/api/student/recent-learning", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Gagal mengambil pembelajaran terbaru");
        }

        setRecentLearningData(data);
      } catch (err) {
        console.error("FETCH RECENT LEARNING ERROR:", err);
        setRecentLearningData([]);
      } finally {
        setLoadingRecentLearning(false);
      }
    };

    const fetchPerformance = async () => {
      try {
        setLoadingPerformance(true);

        const res = await fetch("http://localhost:5000/api/student/performance", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Gagal mengambil performa");
        }

        setPerformance(data);
      } catch (err) {
        console.error("FETCH PERFORMANCE ERROR:", err);
        setPerformance({
          studyHours: 0,
          completedTasks: 0,
        });
      } finally {
        setLoadingPerformance(false);
      }
    };

    const fetchLearningDistribution = async () => {
      try {
        setLoadingDistribution(true);

        const res = await fetch("http://localhost:5000/api/student/learning-distribution", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("LEARNING DISTRIBUTION RESPONSE:", data);

        if (!res.ok) {
          throw new Error(data.message || "Gagal mengambil distribusi pembelajaran");
        }

        setLearningDistribution(data);
      } catch (err) {
        console.error("FETCH LEARNING DISTRIBUTION ERROR:", err);
        setLearningDistribution([]);
      } finally {
        setLoadingDistribution(false);
      }
    };

    const fetchWeeklyActivity = async () => {
      try {
        setLoadingWeeklyActivity(true);

        const res = await fetch("http://localhost:5000/api/student/weekly-activity", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Gagal mengambil aktivitas mingguan");
        }

        setWeeklyActivity(data);
      } catch (err) {
        console.error("FETCH WEEKLY ACTIVITY ERROR:", err);
        setWeeklyActivity([]);
      } finally {
        setLoadingWeeklyActivity(false);
      }
    };

    fetchMateriSummary();
    fetchWeeklyActivity();
    fetchLatestActivities();
    fetchRecentLearning();
    fetchPerformance();
    fetchLearningDistribution();
  }, [user?.id]);

  return (
    <div className="space-y-6 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
      <div className="flex items-center gap-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
        <Avatar className="w-16 h-16 border-4 border-white">
          <AvatarImage src="" />
          <AvatarFallback className="bg-blue-700 text-white">
            {user?.nama
              ? user.nama
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : ""}
          </AvatarFallback>
        </Avatar>

        <div>
          <h2 className="text-white mb-1">Selamat Datang, {user?.nama || "Siswa"}!</h2>
          <p className="text-blue-100">
            Kelas {user?.kelas || "-"} • NIS: {user?.nis || "-"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Materi</p>
                <p className="text-blue-900">{totalMateri} Materi</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Selesai</p>
                <p className="text-blue-900">{progressData.complete} Materi</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Dalam Progress</p>
                <p className="text-blue-900">{inProgress} Materi</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Tugas Terbaru</CardTitle>
                <button className="text-sm text-blue-600 hover:text-blue-700">Lihat Semua</button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loadingActivities ? (
                  <p className="text-sm text-gray-500">Memuat aktivitas terbaru...</p>
                ) : latestActivities.length === 0 ? (
                  <p className="text-sm text-gray-500">Belum ada aktivitas terbaru.</p>
                ) : (
                  latestActivities.map((task) => (
                    <div key={`${task.type}-${task.id}`} className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="text-gray-900 mb-1">{task.title}</h4>
                          <p className="text-sm text-gray-600">
                            {task.subject} • {task.type === "tugas" ? "Tugas" : task.type === "quiz" ? "Kuis" : "Project"}
                          </p>
                        </div>

                        <div className={`px-2 py-1 rounded text-xs ${task.priority === "high" ? "bg-red-100 text-red-700" : task.priority === "medium" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>
                          {task.priority === "high" ? "Penting" : task.priority === "medium" ? "Sedang" : "Rendah"}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Deadline: {task.dueDate}</span>
                        </div>

                        <div className={`flex items-center gap-1 ${task.status === "completed" ? "text-green-600" : task.status === "in-progress" ? "text-blue-600" : "text-orange-600"}`}>
                          {task.status === "completed" ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Selesai</span>
                            </>
                          ) : task.status === "in-progress" ? (
                            <>
                              <Clock className="w-4 h-4" />
                              <span>Dalam Pengerjaan</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4" />
                              <span>Belum Dikerjakan</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribusi Pembelajaran</CardTitle>
              <p className="text-sm text-gray-600">Pembagian waktu belajar berdasarkan aktivitas</p>
            </CardHeader>
            <CardContent>
              {loadingDistribution ? (
                <p className="text-sm text-gray-500">Memuat distribusi pembelajaran...</p>
              ) : learningDistribution.length === 0 ? (
                <p className="text-sm text-gray-500">Belum ada data distribusi.</p>
              ) : (
                <>
                  <div className="flex items-center justify-center h-[300px] w-full relative">
                    <ChartContainer
                      config={{
                        materi: {
                          label: "Materi",
                          color: "#3b82f6",
                        },
                        kuis: {
                          label: "Kuis",
                          color: "#8b5cf6",
                        },
                        project: {
                          label: "Project",
                          color: "#10b981",
                        },
                      }}
                      className="h-full w-full"
                    >
                      <PieChart>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Pie data={learningDistribution} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                          {learningDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ChartContainer>
                  </div>

                  <div className="flex items-center justify-center gap-6 mt-4">
                    {learningDistribution.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-gray-600">
                          {item.name} ({item.value}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aktivitas Belajar Minggu Ini</CardTitle>
              <p className="text-sm text-gray-600">Jam belajar per hari</p>
            </CardHeader>
            <CardContent>
              {loadingWeeklyActivity ? (
                <p className="text-sm text-gray-500">Memuat aktivitas mingguan...</p>
              ) : weeklyActivity.length === 0 ? (
                <p className="text-sm text-gray-500">Belum ada aktivitas mingguan.</p>
              ) : (
                <div className="h-[200px] w-full relative">
                  <ChartContainer
                    config={{
                      hours: {
                        label: "Jam",
                        color: "hsl(142, 76%, 36%)",
                      },
                    }}
                    className="h-full w-full"
                  >
                    <BarChart data={weeklyActivity}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="hours" fill="hsl(142, 76%, 36%)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pembelajaran Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loadingRecentLearning ? (
                  <p className="text-sm text-gray-500">Memuat pembelajaran terbaru...</p>
                ) : recentLearningData.length === 0 ? (
                  <p className="text-sm text-gray-500">Belum ada pembelajaran terbaru.</p>
                ) : (
                  recentLearningData.map((learning) => (
                    <div key={learning.id} className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 hover:border-blue-300 transition-all cursor-pointer" onClick={() => onNavigate("materi")}>
                      <div className="flex items-start gap-3 mb-2">
                        <span className="text-2xl">{learning.icon}</span>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm text-gray-900 mb-1">{learning.title}</h4>
                          <p className="text-xs text-gray-600 truncate">{learning.module}</p>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>{learning.progress}%</span>
                          <span>{learning.lastAccessed}</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all" style={{ width: `${learning.progress}%` }} />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-8 h-8" />
                <div>
                  <p className="text-sm opacity-90">Performa Minggu Ini</p>
                  <p className="text-white">Sangat Baik! 🎉</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="opacity-90">Waktu Belajar</span>
                  <span>{loadingPerformance ? "-" : performance.studyHours} jam</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-90">Tugas Selesai</span>
                  <span>{loadingPerformance ? "-" : performance.completedTasks} tugas</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
