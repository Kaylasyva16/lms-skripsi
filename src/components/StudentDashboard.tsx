"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Award, TrendingUp, CheckCircle2, ChevronRight, BookOpen, FolderKanban, FileText, PieChart as PieChartIcon, Activity, Clock, Calendar, AlertCircle, Bug } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, PieChart, Pie } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { useEffect, useState } from "react";

const recentTasks = [
  {
    id: 1,
    title: "Database Normalization Exercise",
    subject: "Database Design",
    dueDate: "5 Nov 2025",
    status: "pending",
    priority: "high",
  },
  {
    id: 2,
    title: "Build Responsive Landing Page",
    subject: "Web Development",
    dueDate: "8 Nov 2025",
    status: "in-progress",
    priority: "medium",
  },
  {
    id: 3,
    title: "UI/UX Case Study Presentation",
    subject: "UI/UX Design",
    dueDate: "10 Nov 2025",
    status: "completed",
    priority: "low",
  },
];

const learningDistribution = [
  { name: "Materi", value: 45, color: "#3b82f6" },
  { name: "Kuis", value: 30, color: "#8b5cf6" },
  { name: "Project", value: 25, color: "#10b981" },
];

const activityData = [
  { day: "Sen", hours: 2 },
  { day: "Sel", hours: 3.5 },
  { day: "Rab", hours: 2.5 },
  { day: "Kam", hours: 4 },
  { day: "Jum", hours: 3 },
  { day: "Sab", hours: 5 },
  { day: "Min", hours: 2 },
];

const recentLearning = [
  {
    id: 1,
    title: "Database Design",
    module: "Normalization Techniques",
    progress: 33,
    lastAccessed: "2 jam yang lalu",
    icon: "🗄️",
  },
  {
    id: 2,
    title: "Web Development",
    module: "JavaScript Fundamentals",
    progress: 70,
    lastAccessed: "1 hari yang lalu",
    icon: "💻",
  },
  {
    id: 3,
    title: "UI/UX Design",
    module: "Usability Testing",
    progress: 100,
    lastAccessed: "2 hari yang lalu",
    icon: "🎨",
  },
];

interface StudentDashboardProps {
  onNavigate: (page: string) => void;
  user: any;
}

export default function StudentDashboard({ onNavigate, user }: StudentDashboardProps) {
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  console.log("USER DATA:", user);

  return (
    <div className="space-y-6 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
      {/* Header */}
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Materi</p>
                <p className="text-blue-900">6 Materi</p>
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
                <p className="text-blue-900">1 Materi</p>
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
                <p className="text-blue-900">2 Materi</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tugas Terbaru */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Tugas Terbaru</CardTitle>
                <button className="text-sm text-blue-600 hover:text-blue-700">Lihat Semua</button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <div key={task.id} className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="text-gray-900 mb-1">{task.title}</h4>
                        <p className="text-sm text-gray-600">{task.subject}</p>
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
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Grafik Pembelajaran */}
          <Card>
            <CardHeader>
              <CardTitle>Distribusi Pembelajaran</CardTitle>
              <p className="text-sm text-gray-600">Pembagian waktu belajar berdasarkan aktivitas</p>
            </CardHeader>
            <CardContent>
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

              {/* Legend */}
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
            </CardContent>
          </Card>

          {/* Aktivitas Mingguan */}
          <Card>
            <CardHeader>
              <CardTitle>Aktivitas Belajar Minggu Ini</CardTitle>
              <p className="text-sm text-gray-600">Jam belajar per hari</p>
            </CardHeader>
            <CardContent>
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
                  <BarChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="hours" fill="hsl(142, 76%, 36%)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Pembelajaran Terbaru */}
          <Card>
            <CardHeader>
              <CardTitle>Pembelajaran Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentLearning.map((learning) => (
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
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Debugging Challenge Card */}
          <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 hover:shadow-xl transition-all cursor-pointer" onClick={() => onNavigate("debugging")}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bug className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white mb-1">Debugging Challenge</h4>
                  <p className="text-sm text-white/90">Array & Condition Bugs</p>
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-white/90">Bugs to Fix</span>
                  <span className="text-white">2 Bugs</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/90">Difficulty</span>
                  <span className="text-white">Medium</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/90">Klik untuk mulai</span>
                <div className="flex items-center gap-1 text-white">
                  <span className="text-sm">+100</span>
                  <span className="text-xs">poin</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
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
                  <span>22.5 jam</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-90">Tugas Selesai</span>
                  <span>4 tugas</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-90">Poin Didapat</span>
                  <span>+360 poin</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
