import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

import TeacherProjectDetail from "./TeacherProjectDetail";
import ProjectProgressDetail from "./ProjectProgressDetail"; // ✅ WAJIB (tadi belum ada)

import { Briefcase, Plus, Users, Calendar, CheckCircle2, Award, User, Eye, Search, Filter, TrendingUp, Zap } from "lucide-react";

interface TeacherProjectsProps {
  onNavigate: (page: string) => void;
}

export default function TeacherProjects({ onNavigate }: TeacherProjectsProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [projectType, setProjectType] = useState<"individual" | "group">("group");
  const [showProgressDetail, setShowProgressDetail] = useState(false);
  const [selectedGroupForProgress, setSelectedGroupForProgress] = useState<any>(null);
  const [selectedProjectDetail, setSelectedProjectDetail] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "completed">("all");

  const [projects, setProjects] = useState<any[]>([]);
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");

  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [membersPerGroup, setMembersPerGroup] = useState(3);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/kelas", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        const formatted = data.map((item: any) => ({
          id: String(item.id),
          name: item.nama,
        }));

        setClasses(formatted);
      } catch (error) {
        console.error(error);
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/projects", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("PROJECTS RESPONSE:", data);

        if (!res.ok) {
          console.error("Gagal ambil projects:", data.error || data.message || data);
          setProjects([]);
          return;
        }

        setProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Fetch projects error:", error);
        setProjects([]);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const checkMe = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("ME:", data);
    };

    checkMe();
  }, []);

  const handleViewProgress = (group: any, project: any) => {
    setSelectedGroupForProgress({
      ...group,
      type: project.type,
      projectTitle: project.title,
    });
    setShowProgressDetail(true);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !selectedClassId || !deadline) {
      alert("Judul, kelas, dan deadline wajib diisi");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const payload = {
        title,
        classId: Number(selectedClassId),
        type: projectType,
        deadline,
        description,
        membersPerGroup: projectType === "group" ? Number(membersPerGroup) : null,
      };

      const res = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal membuat proyek");

      const newProject = await res.json();
      setProjects((prev) => [newProject, ...prev]);

      setTitle("");
      setSelectedClassId("");
      setDeadline("");
      setDescription("");
      setMembersPerGroup(3);
      setProjectType("group");
      setShowCreateForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredProjects = Array.isArray(projects)
    ? projects.filter((project) => {
        const matchesSearch = project.title?.toLowerCase().includes(searchQuery.toLowerCase()) || project.class?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter = filterStatus === "all" || project.status === filterStatus;

        return matchesSearch && matchesFilter;
      })
    : [];

  const calculateProjectProgress = (project: any) => {
    return 0;
  };

  if (showProgressDetail && selectedGroupForProgress) {
    return <ProjectProgressDetail onBack={() => setShowProgressDetail(false)} groupData={selectedGroupForProgress} projectTitle={selectedGroupForProgress.projectTitle} />;
  }

  if (selectedProjectDetail) {
    return <TeacherProjectDetail project={selectedProjectDetail} onBack={() => setSelectedProjectDetail(null)} onNavigate={onNavigate} onViewProgress={handleViewProgress} />;
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Problem Based Learning</h1>
              <p className="text-sm text-gray-500 mt-1">Kelola dan monitor proyek pembelajaran siswa secara real-time</p>
            </div>

            <button onClick={() => setShowCreateForm(true)} className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow-sm hover:bg-blue-700 transition">
              <Plus className="w-4 h-4" />
              Tambah Proyek
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4 w-full mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input placeholder="Cari proyek berdasarkan nama atau kelas..." className="pl-10 w-full bg-white border-gray-200 focus:border-blue-500" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>

          {/* Filter */}
          <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
            <SelectTrigger className="w-56 bg-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="completed">Selesai</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <Briefcase className="w-6 h-6" />
                <p className="text-sm opacity-90">Total Proyek</p>
              </div>
              <p className="text-4xl mb-1">{projects.length}</p>
              <p className="text-xs opacity-75">Proyek Aktif</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-6 h-6" />
                <p className="text-sm opacity-90">Proyek Aktif</p>
              </div>
              <p className="text-4xl mb-1">{projects.filter((p) => p.status === "active").length}</p>
              <p className="text-xs opacity-75">Sedang Berjalan</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-6 h-6" />
                <p className="text-sm opacity-90">Total Siswa</p>
              </div>
              <p className="text-4xl mb-1">{projects.reduce((sum, p) => sum + (p.groups?.length || 0) * 3 + (p.students?.length || 0), 0)}</p>
              <p className="text-xs opacity-75">Terlibat dalam Proyek</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-6 h-6" />
                <p className="text-sm opacity-90">Rata-rata Nilai</p>
              </div>
              <p className="text-4xl mb-1">84.5</p>
              <p className="text-xs opacity-75">Dari Semua Proyek</p>
            </CardContent>
          </Card>
        </div>

        {/* Create Project Form */}
        {showCreateForm && (
          <Card className="mb-8 border-2 border-blue-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-white pb-4 pt-6">
              <CardTitle className="text-blue-900">Tambah Proyek Baru</CardTitle>
              <CardDescription>Buat proyek pembelajaran berbasis praktik untuk siswa</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 pb-10 px-8">
              <form className="space-y-6" onSubmit={handleCreateProject}>
                <div className="space-y-3">
                  <Label className="text-gray-800 font-medium">Tipe Proyek</Label>

                  <RadioGroup value={projectType} onValueChange={(value) => setProjectType(value as any)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <label
                        htmlFor="individual"
                        className={`flex items-center space-x-3 p-6 border-2 rounded-xl cursor-pointer transition-all ${projectType === "individual" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`}
                      >
                        <RadioGroupItem value="individual" id="individual" />
                        <div className="flex items-center gap-3">
                          <User className="w-6 h-6 text-orange-500" />
                          <span className="text-lg font-medium">Tugas Individu</span>
                        </div>
                      </label>

                      <label
                        htmlFor="group"
                        className={`flex items-center space-x-3 p-6 border-2 rounded-xl cursor-pointer transition-all ${projectType === "group" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`}
                      >
                        <RadioGroupItem value="group" id="group" />
                        <div className="flex items-center gap-3">
                          <Users className="w-6 h-6 text-purple-500" />
                          <span className="text-lg font-medium">Tugas Kelompok</span>
                        </div>
                      </label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Judul Proyek</Label>
                  <Input placeholder="Masukkan judul proyek" value={title} onChange={(e) => setTitle(e.target.value)} className="h-14" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Kelas</Label>
                    <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                      <SelectTrigger className="h-14 bg-white">
                        <SelectValue placeholder="Pilih kelas" />
                      </SelectTrigger>
                      <SelectContent className="z-[9999] bg-white border border-gray-200 shadow-xl rounded-xl p-1">
                        {classes.map((kelas) => (
                          <SelectItem key={kelas.id} value={kelas.id} className="cursor-pointer rounded-md px-3 py-3 text-base text-gray-900 outline-none transition-colors data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-700">
                            {kelas.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Deadline</Label>
                    <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="h-14" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Deskripsi Proyek</Label>
                  <Textarea placeholder="Jelaskan tentang proyek ini secara detail..." value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-[140px]" />
                </div>

                {projectType === "group" && (
                  <div className="space-y-2">
                    <Label>Jumlah Anggota per Kelompok</Label>
                    <Input type="number" min={2} value={membersPerGroup} onChange={(e) => setMembersPerGroup(Number(e.target.value))} className="h-14" />
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm h-12 px-6">
                    <Plus className="w-4 h-4 mr-2" />
                    Buat Proyek
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)} className="h-12 px-6">
                    Batal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const progress = calculateProjectProgress(project);
            const participantCount = project.type === "group" ? project.membersPerGroup || 0 : 1;

            return (
              <Card key={project.id} className="border-0 shadow-lg hover:shadow-2xl transition-all cursor-pointer group overflow-hidden" onClick={() => setSelectedProjectDetail(project)}>
                <div className={`h-2 ${project.status === "active" ? "bg-gradient-to-r from-green-400 to-green-600" : "bg-gradient-to-r from-gray-400 to-gray-600"}`} />

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <CardTitle className="text-blue-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">{project.title}</CardTitle>

                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={project.type === "group" ? "bg-purple-500 hover:bg-purple-600" : "bg-orange-500 hover:bg-orange-600"}>
                          {project.type === "group" ? (
                            <>
                              <Users className="w-3 h-3 mr-1" />
                              Kelompok
                            </>
                          ) : (
                            <>
                              <User className="w-3 h-3 mr-1" />
                              Individu
                            </>
                          )}
                        </Badge>

                        <Badge variant="outline" className="text-blue-600 border-blue-300">
                          {project.class}
                        </Badge>
                      </div>
                    </div>

                    <Badge className={project.status === "active" ? "bg-green-500" : "bg-gray-500"}>{project.status === "active" ? "Aktif" : "Selesai"}</Badge>
                  </div>

                  <div className="flex items-center gap-4 bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg">
                    <div className="relative">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="6" fill="none" />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke={progress === 100 ? "#10b981" : "#3b82f6"}
                          strokeWidth="6"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 28}`}
                          strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
                          className="transition-all duration-500"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm text-blue-900">{progress}%</span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">Progress Rata-rata</p>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-gray-500">
                          {participantCount} {project.type === "group" ? "Kelompok" : "Siswa"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Calendar className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Deadline</p>
                          <p className="text-blue-900 text-xs">{project.deadline}</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-blue-500 hover:bg-blue-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProjectDetail(project);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Detail
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-300 text-blue-600 hover:bg-blue-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate("teacher-evaluation");
                        }}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Nilai
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-12 h-12 text-blue-300" />
            </div>
            <h3 className="text-blue-900 mb-2">Tidak Ada Proyek</h3>
            <p className="text-gray-600 mb-6">Belum ada proyek yang sesuai dengan pencarian Anda</p>
            <Button onClick={() => setShowCreateForm(true)} className="bg-blue-500 hover:bg-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Proyek Pertama
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
