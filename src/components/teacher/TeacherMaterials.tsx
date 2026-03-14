import { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { BookOpen, Plus, Upload, FileText, Video, Link as LinkIcon, Edit, Trash2, Users, Calendar, Save, FolderOpen, Star, PlayCircle, CheckCircle2, Clock, List, ChevronRight, ArrowLeft } from "lucide-react";

interface TeacherMaterialsProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

interface SubMaterial {
  id: number;
  title: string;
  type: "Video" | "PDF" | "Link" | "Materi";
  duration: string;
  description: string;
  completed?: boolean;
  order: number;
  url?: string;
  file_url?: string;
}

interface Module {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  totalLessons: number;
  completedLessons: number;
  rating: number;
  totalRatings: number;
  topics: string[];
  subMaterials: SubMaterial[];
  color: string;
  icon: string;
  class: string;
  uploadDate: string;
}

interface AdminClass {
  id: number;
  nama: string;
}

const mapModuleFromApi = (m: any): Module => {
  let parsedTopics: string[] = [];

  if (Array.isArray(m.topics)) {
    parsedTopics = m.topics;
  } else if (typeof m.topics === "string") {
    try {
      const parsed = JSON.parse(m.topics);
      parsedTopics = Array.isArray(parsed)
        ? parsed
        : m.topics
            .split(",")
            .map((t: string) => t.trim())
            .filter(Boolean);
    } catch {
      parsedTopics = m.topics
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean);
    }
  }

  return {
    id: m.id,
    title: m.title || "",
    subtitle: m.subtitle || "",
    description: m.description || "",
    duration: m.duration || "",
    totalLessons: Number(m.total_materials ?? m.totalMateri ?? m.totalLessons ?? 0),
    completedLessons: Number(m.completed_lessons ?? m.completedLessons ?? 0),
    rating: Number(m.rating ?? 0),
    totalRatings: Number(m.totalRatings ?? m.total_ratings ?? 0),
    topics: parsedTopics,
    subMaterials: [],
    color: m.color || "blue",
    icon: m.icon || "book",
    class: m.kelas || m.class || "",
    uploadDate: m.created_at ? new Date(m.created_at).toLocaleDateString("id-ID") : new Date().toLocaleDateString("id-ID"),
  };
};

const mapSubMaterialFromApi = (m: any): SubMaterial => ({
  id: m.id,
  title: m.title,
  type: m.type,
  duration: m.duration,
  description: m.description,
  order: Number(m.order_number ?? 0),
  file_url: m.file_url,
  url: m.url || "",
});

export default function TeacherMaterials({ onNavigate, onLogout }: TeacherMaterialsProps) {
  const [view, setView] = useState<"modules" | "module-detail">("modules");
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [showAddModuleForm, setShowAddModuleForm] = useState(false);
  const [showAddSubMaterialForm, setShowAddSubMaterialForm] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingSubMaterial, setEditingSubMaterial] = useState<SubMaterial | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(false);
  const [adminClasses, setAdminClasses] = useState<AdminClass[]>([]);

  const [newModule, setNewModule] = useState({
    title: "",
    subtitle: "",
    description: "",
    duration: "2-3 jam",
    classId: "",
    topics: "",
    color: "blue",
  });

  const [newSubMaterial, setNewSubMaterial] = useState({
    title: "",
    type: "Video" as "Video" | "PDF" | "Link" | "Materi",
    duration: "",
    description: "",
    url: "",
  });

  const fetchModules = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/courses/1/modules");
      const data = await res.json();
      const mapped = data.map(mapModuleFromApi);
      setModules(mapped);

      if (selectedModule) {
        const updatedSelected = mapped.find((m: Module) => m.id === selectedModule.id) || null;
        if (updatedSelected) {
          setSelectedModule((prev) =>
            prev
              ? {
                  ...updatedSelected,
                  subMaterials: prev.subMaterials,
                }
              : updatedSelected
          );
        }
      }
    } catch (err) {
      console.error("Gagal fetch modules:", err);
    }
  };

  const fetchMaterials = async (moduleId: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/modules/${moduleId}/materials`);
      const data = await res.json();
      const mappedSubMaterials = data.map(mapSubMaterialFromApi);

      setModules((prev) =>
        prev.map((mod) =>
          mod.id === moduleId
            ? {
                ...mod,
                totalLessons: mappedSubMaterials.length,
                subMaterials: mappedSubMaterials,
              }
            : mod
        )
      );

      setSelectedModule((prev) =>
        prev && prev.id === moduleId
          ? {
              ...prev,
              totalLessons: mappedSubMaterials.length,
              subMaterials: mappedSubMaterials,
            }
          : prev
      );
    } catch (err) {
      console.error("Gagal fetch materials:", err);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/public/kelas")
      .then((res) => res.json())
      .then((data) => setAdminClasses(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedModule?.id) {
      fetchMaterials(selectedModule.id);
    }
  }, [selectedModule?.id]);

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      await fetch("http://localhost:5000/api/modules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          course_id: 1,
          title: newModule.title,
          subtitle: newModule.subtitle,
          description: newModule.description,
          type: "Materi",
          file_url: "",
          order_number: modules.length + 1,
          duration: newModule.duration,
          kelas: newModule.classId,
          color: newModule.color,
          topics: newModule.topics
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });

      await fetchModules();

      setShowAddModuleForm(false);
      setNewModule({
        title: "",
        subtitle: "",
        description: "",
        duration: "2-3 jam",
        classId: "",
        topics: "",
        color: "blue",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModule) return;

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("module_id", selectedModule.id.toString());
      formData.append("title", newSubMaterial.title);
      formData.append("description", newSubMaterial.description);
      formData.append("type", newSubMaterial.type);
      formData.append("duration", newSubMaterial.duration);
      formData.append("order_number", (selectedModule.subMaterials.length + 1).toString());
      formData.append("url", newSubMaterial.url);

      if (file) {
        formData.append("file", file);
      }

      await fetch("http://localhost:5000/api/materials", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      await fetchMaterials(selectedModule.id);
      await fetchModules();

      setNewSubMaterial({
        title: "",
        type: "Video",
        duration: "",
        description: "",
        url: "",
      });
      setShowAddSubMaterialForm(false);
      setFile(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteModule = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus modul ini beserta semua materinya?")) return;

    try {
      const token = localStorage.getItem("token");

      await fetch(`http://localhost:5000/api/modules/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setModules((prev) => prev.filter((m) => m.id !== id));

      if (selectedModule?.id === id) {
        setSelectedModule(null);
        setView("modules");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSubMaterial = (subId: number) => {
    if (!selectedModule) return;

    if (confirm("Apakah Anda yakin ingin menghapus sub-materi ini?")) {
      const updatedModule = {
        ...selectedModule,
        subMaterials: selectedModule.subMaterials.filter((s) => s.id !== subId),
        totalLessons: selectedModule.totalLessons - 1,
      };

      setModules((prev) => prev.map((m) => (m.id === selectedModule.id ? updatedModule : m)));
      setSelectedModule(updatedModule);
    }
  };

  const handleSaveEditModule = async () => {
    if (!editingModule) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/modules/${editingModule.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editingModule.title,
          subtitle: editingModule.subtitle,
          description: editingModule.description,
          duration: editingModule.duration,
          kelas: editingModule.class,
          color: editingModule.color,
          topics: editingModule.topics,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.log("UPDATE MODULE ERROR RESPONSE:", text);
        throw new Error(`HTTP ${res.status}`);
      }

      await fetchModules();

      if (selectedModule?.id === editingModule.id) {
        const refreshed = await fetch(`http://localhost:5000/api/modules/${editingModule.id}/materials`);
        const materials = await refreshed.json();

        setSelectedModule({
          ...editingModule,
          subMaterials: materials.map(mapSubMaterialFromApi),
        });
      }

      setEditingModule(null);
      alert("Modul berhasil diperbarui");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan perubahan modul");
    }
  };

  const handleSaveEditSubMaterial = async () => {
    if (!editingSubMaterial || !selectedModule) return;

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("title", editingSubMaterial.title);
      formData.append("description", editingSubMaterial.description);
      formData.append("type", editingSubMaterial.type);
      formData.append("duration", editingSubMaterial.duration);
      formData.append("url", editingSubMaterial.url || "");

      if (file) {
        formData.append("file", file);
      }

      const res = await fetch(`http://localhost:5000/api/materials/${editingSubMaterial.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        console.log("UPDATE ERROR RESPONSE:", text);
        throw new Error(`HTTP ${res.status}`);
      }

      const updatedFromServer = await res.json();

      const mappedUpdated: SubMaterial = {
        id: updatedFromServer.id,
        title: updatedFromServer.title,
        type: updatedFromServer.type,
        duration: updatedFromServer.duration,
        description: updatedFromServer.description,
        order: Number(updatedFromServer.order_number ?? 0),
        file_url: updatedFromServer.file_url,
        url: updatedFromServer.url || "",
      };

      const updatedSubMaterials = selectedModule.subMaterials.map((s) => (s.id === editingSubMaterial.id ? mappedUpdated : s));

      const updatedModule = {
        ...selectedModule,
        totalLessons: updatedSubMaterials.length,
        subMaterials: updatedSubMaterials,
      };

      setModules((prev) => prev.map((m) => (m.id === selectedModule.id ? updatedModule : m)));
      setSelectedModule(updatedModule);
      setEditingSubMaterial(null);
      setFile(null);

      alert("Materi berhasil diperbarui");
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui materi");
    }
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; icon: string; badge: string; hover: string }> = {
      blue: { bg: "bg-blue-500", icon: "text-blue-500", badge: "bg-blue-100 text-blue-700", hover: "hover:border-blue-300" },
      purple: { bg: "bg-purple-500", icon: "text-purple-500", badge: "bg-purple-100 text-purple-700", hover: "hover:border-purple-300" },
      green: { bg: "bg-green-500", icon: "text-green-500", badge: "bg-green-100 text-green-700", hover: "hover:border-green-300" },
      orange: { bg: "bg-orange-500", icon: "text-orange-500", badge: "bg-orange-100 text-orange-700", hover: "hover:border-orange-300" },
      pink: { bg: "bg-pink-500", icon: "text-pink-500", badge: "bg-pink-100 text-pink-700", hover: "hover:border-pink-300" },
    };
    return colors[color] || colors.blue;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return <FileText className="w-4 h-4" />;
      case "Video":
        return <Video className="w-4 h-4" />;
      case "Link":
        return <LinkIcon className="w-4 h-4" />;
      case "Materi":
        return <BookOpen className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "Video":
        return "bg-blue-100 text-blue-700";
      case "PDF":
        return "bg-red-100 text-red-700";
      case "Materi":
        return "bg-purple-100 text-purple-700";
      case "Link":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Modules List View
  if (view === "modules") {
    return (
      <div className="flex min-h-screen bg-[#F8FAFC]">
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h1 className="text-2xl font-semibold text-[#1E3A8A]">Materi Pembelajaran</h1>
                  <p className="text-gray-500 mt-1">Daftar modul pembelajaran untuk siswa</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200" onClick={() => setShowAddModuleForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Modul Baru
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="bg-[#EFF6FF] p-4 rounded-xl">
                    <FolderOpen className="w-6 h-6 text-[#3B82F6]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#1E3A8A]">{modules.length}</p>
                    <p className="text-sm text-gray-500">Total Modul</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="bg-[#EFF6FF] p-4 rounded-xl">
                    <BookOpen className="w-6 h-6 text-[#3B82F6]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#1E3A8A]">{modules.reduce((sum, m) => sum + Number(m.totalLessons || 0), 0)}</p>
                    <p className="text-sm text-gray-500">Total Materi</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="bg-[#EFF6FF] p-4 rounded-xl">
                    <Users className="w-6 h-6 text-[#3B82F6]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#1E3A8A]">124</p>
                    <p className="text-sm text-gray-500">Siswa Aktif</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="bg-[#EFF6FF] p-4 rounded-xl">
                    <Star className="w-6 h-6 text-[#3B82F6]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#1E3A8A]">4.7</p>
                    <p className="text-sm text-gray-500">Avg. Rating</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Daftar Modul</h2>

              {modules.length === 0 ? (
                <div className="text-center py-20">
                  <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700">Belum ada modul</h3>
                  <p className="text-gray-500">Klik "Tambah Modul Baru" untuk membuat modul pembelajaran</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {modules.map((module) => {
                    const colorClasses = getColorClasses(module.color);

                    return (
                      <Card key={module.id} className={`border border-gray-200 ${colorClasses.hover} transition-all rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md`}>
                        <CardContent className="p-0">
                          <div className="flex">
                            <div className={`w-24 ${colorClasses.bg} flex items-center justify-center shrink-0`}>
                              <div className="bg-white/20 p-4 rounded-xl">
                                <PlayCircle className="w-10 h-10 text-white" />
                              </div>
                            </div>

                            <div className="flex-1 p-6">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold text-[#1E40AF] mb-1">{module.title}</h3>
                                  <p className="text-sm text-gray-600 mb-2">{module.subtitle}</p>
                                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{module.description}</p>
                                </div>
                              </div>

                              <div className="mb-4">
                                <p className="text-xs text-gray-500 mb-2">Yang akan dipelajari:</p>
                                <div className="grid grid-cols-2 gap-2">
                                  {module.topics.slice(0, 4).map((topic, idx) => (
                                    <div key={idx} className="flex items-start gap-2">
                                      <CheckCircle2 className={`w-3 h-3 mt-0.5 ${colorClasses.icon} shrink-0`} />
                                      <span className="text-xs text-gray-600">{topic}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                  <Clock className="w-4 h-4" />
                                  <span>{module.duration}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                  <BookOpen className="w-4 h-4" />
                                  <span>{Number(module.totalLessons ?? 0)} materi</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                  <Users className="w-4 h-4" />
                                  <span>{module.class}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                  <Calendar className="w-4 h-4" />
                                  <span>{module.uploadDate}</span>
                                </div>
                                {module.rating > 0 && (
                                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span>
                                      {module.rating}/5 ({module.totalRatings})
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center justify-between">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  onClick={() => {
                                    setSelectedModule(module);
                                    setView("module-detail");
                                  }}
                                >
                                  <List className="w-4 h-4 mr-2" />
                                  Kelola Materi ({Number(module.totalLessons ?? 0)})
                                  <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>

                                <div className="flex items-center gap-2">
                                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors" onClick={() => setEditingModule({ ...module })}>
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors" onClick={() => handleDeleteModule(module.id)}>
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <Dialog open={showAddModuleForm} onOpenChange={setShowAddModuleForm}>
          <DialogContent className="max-w-3xl rounded-3xl p-8 overflow-visible">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold text-gray-900">Tambah Modul Baru</DialogTitle>
              <DialogDescription className="text-gray-500">Buat modul pembelajaran baru untuk siswa</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddModule} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold">Judul Modul</Label>
                  <Input placeholder="e.g. Pengenalan Percabangan" value={newModule.title} onChange={(e) => setNewModule({ ...newModule, title: e.target.value })} required className="bg-[#F8FAFC] border-none h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold">Sub-judul</Label>
                  <Input placeholder="e.g. Struktur Kontrol Keputusan" value={newModule.subtitle} onChange={(e) => setNewModule({ ...newModule, subtitle: e.target.value })} required className="bg-[#F8FAFC] border-none h-12 rounded-xl" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-semibold">Deskripsi</Label>
                <Textarea
                  placeholder="Jelaskan tujuan dan materi yang akan dipelajari..."
                  value={newModule.description}
                  onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                  required
                  rows={3}
                  className="bg-[#F8FAFC] border-none rounded-xl resize-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold">Durasi Estimasi</Label>
                  <Input placeholder="e.g. 2-3 jam" value={newModule.duration} onChange={(e) => setNewModule({ ...newModule, duration: e.target.value })} className="bg-[#F8FAFC] border-none h-12 rounded-xl" />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold">Kelas</Label>

                  <Select value={newModule.classId} onValueChange={(value) => setNewModule({ ...newModule, classId: value })}>
                    <SelectTrigger className="bg-[#F8FAFC] border-none h-12 rounded-xl">
                      <SelectValue placeholder="Pilih kelas" />
                    </SelectTrigger>

                    <SelectContent position="popper" sideOffset={5} className="z-[999] max-h-60 overflow-y-auto bg-white shadow-lg border">
                      {adminClasses.map((kelas) => (
                        <SelectItem key={kelas.id} value={kelas.nama} className="cursor-pointer px-3 py-2 hover:bg-blue-50 focus:bg-blue-100 rounded-md transition-colors">
                          {kelas.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 items-start">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold">Topik-topik (pisahkan dengan koma)</Label>
                  <Textarea
                    placeholder="Konsep percabangan, Operator relasional, IF statement, dll"
                    value={newModule.topics}
                    onChange={(e) => setNewModule({ ...newModule, topics: e.target.value })}
                    rows={3}
                    className="bg-[#F8FAFC] border-none rounded-xl resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold">Warna Tema</Label>
                  <Select value={newModule.color} onValueChange={(val) => setNewModule({ ...newModule, color: val })}>
                    <SelectTrigger className="bg-[#F8FAFC] border-none h-12 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Biru</SelectItem>
                      <SelectItem value="purple">Ungu</SelectItem>
                      <SelectItem value="green">Hijau</SelectItem>
                      <SelectItem value="orange">Orange</SelectItem>
                      <SelectItem value="pink">Pink</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={loading} className="bg-[#3B82F6] hover:bg-blue-600 px-8 text-white">
                  {loading ? "Menyimpan..." : "Simpan Modul"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={!!editingModule} onOpenChange={() => setEditingModule(null)}>
          <DialogContent className="max-w-3xl rounded-3xl p-8 overflow-visible">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold text-gray-900">Edit Modul</DialogTitle>
              <DialogDescription className="text-gray-500">Ubah detail modul pembelajaran</DialogDescription>
            </DialogHeader>
            {editingModule && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-semibold">Judul Modul</Label>
                    <Input value={editingModule.title} onChange={(e) => setEditingModule({ ...editingModule, title: e.target.value })} className="bg-[#F8FAFC] border border-gray-200 h-12 rounded-xl px-3" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-semibold">Sub-judul</Label>
                    <Input value={editingModule.subtitle} onChange={(e) => setEditingModule({ ...editingModule, subtitle: e.target.value })} className="bg-[#F8FAFC] border border-gray-200 h-12 rounded-xl px-3" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold">Deskripsi</Label>
                  <Textarea
                    value={editingModule.description}
                    onChange={(e) =>
                      setEditingModule({
                        ...editingModule,
                        description: e.target.value,
                      })
                    }
                    className="bg-[#F8FAFC] border border-gray-200 rounded-xl resize-none h-24 px-3 py-2"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-semibold">Durasi</Label>
                    <Input
                      value={editingModule.duration}
                      onChange={(e) =>
                        setEditingModule({
                          ...editingModule,
                          duration: e.target.value,
                        })
                      }
                      className="bg-[#F8FAFC] border border-gray-200 h-12 rounded-xl px-3"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-semibold">Kelas</Label>

                    <Select
                      value={editingModule.class}
                      onValueChange={(value) =>
                        setEditingModule({
                          ...editingModule,
                          class: value,
                        })
                      }
                    >
                      <SelectTrigger className="bg-[#F8FAFC] border border-gray-200 h-12 rounded-xl">
                        <SelectValue placeholder="Pilih kelas" />
                      </SelectTrigger>

                      <SelectContent position="popper" sideOffset={5} className="z-[999] max-h-60 overflow-y-auto bg-white shadow-lg border rounded-xl">
                        {adminClasses.map((kelas) => (
                          <SelectItem key={kelas.id} value={kelas.nama} className="cursor-pointer px-3 py-2 hover:bg-blue-50 focus:bg-blue-100 rounded-md transition-colors">
                            {kelas.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-semibold">Topik-topik (pisahkan dengan koma)</Label>

                      <Textarea
                        value={editingModule.topics.join(", ")}
                        onChange={(e) =>
                          setEditingModule({
                            ...editingModule,
                            topics: e.target.value.split(",").map((t) => t.trim()),
                          })
                        }
                        rows={3}
                        className="bg-[#F8FAFC] border border-gray-200 h-12 rounded-xl px-3"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 font-semibold">Warna Tema</Label>

                      <Select
                        value={editingModule.color}
                        onValueChange={(val) =>
                          setEditingModule({
                            ...editingModule,
                            color: val,
                          })
                        }
                      >
                        <SelectTrigger className="bg-[#F8FAFC] border border-gray-200 h-12 rounded-xl px-3">
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent position="popper" sideOffset={5} className="z-[999] max-h-60 overflow-y-auto bg-white shadow-lg border rounded-xl">
                          <SelectItem value="blue" className="cursor-pointer px-3 py-2 hover:bg-blue-50 focus:bg-blue-100 rounded-md transition-colors">
                            Biru
                          </SelectItem>

                          <SelectItem value="purple" className="cursor-pointer px-3 py-2 hover:bg-blue-50 focus:bg-blue-100 rounded-md transition-colors">
                            Ungu
                          </SelectItem>

                          <SelectItem value="green" className="cursor-pointer px-3 py-2 hover:bg-blue-50 focus:bg-blue-100 rounded-md transition-colors">
                            Hijau
                          </SelectItem>

                          <SelectItem value="orange" className="cursor-pointer px-3 py-2 hover:bg-blue-50 focus:bg-blue-100 rounded-md transition-colors">
                            Orange
                          </SelectItem>

                          <SelectItem value="pink" className="cursor-pointer px-3 py-2 hover:bg-blue-50 focus:bg-blue-100 rounded-md transition-colors">
                            Pink
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button variant="ghost" onClick={() => setEditingModule(null)}>
                    Batal
                  </Button>
                  <Button className="bg-[#3B82F6] hover:bg-blue-600 px-8" onClick={handleSaveEditModule}>
                    <Save className="w-4 h-4 mr-2" />
                    Simpan Perubahan
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (view === "module-detail" && selectedModule) {
    const colorClasses = getColorClasses(selectedModule.color);

    return (
      <div className="flex min-h-screen bg-[#F8FAFC]">
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => {
                setView("modules");
                setSelectedModule(null);
              }}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Daftar Modul
            </button>

            <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white mb-6">
              <CardContent className="p-0">
                <div className="flex">
                  <div className={`w-32 ${colorClasses.bg} flex items-center justify-center shrink-0`}>
                    <div className="bg-white/20 p-5 rounded-xl">
                      <PlayCircle className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h1 className="text-2xl font-semibold text-[#1E3A8A] mb-1">{selectedModule.title}</h1>
                        <p className="text-gray-600 mb-2">{selectedModule.subtitle}</p>
                        <p className="text-sm text-gray-500 leading-relaxed">{selectedModule.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mt-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <span>{selectedModule.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <BookOpen className="w-5 h-5 text-gray-400" />
                        <span>{selectedModule.subMaterials.length} materi</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-5 h-5 text-gray-400" />
                        <span>{selectedModule.class}</span>
                      </div>
                      {selectedModule.rating > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          <span>
                            {selectedModule.rating}/5 ({selectedModule.totalRatings} rating)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Daftar Materi</h2>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                  onClick={() => {
                    setNewSubMaterial({
                      title: "",
                      type: "Video",
                      duration: "",
                      description: "",
                      url: "",
                    });
                    setFile(null);
                    setShowAddSubMaterialForm(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Materi
                </Button>
              </div>

              {selectedModule.subMaterials.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Belum ada materi dalam modul ini</p>
                  <Button onClick={() => setShowAddSubMaterialForm(true)} variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Materi Pertama
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedModule.subMaterials
                    .sort((a, b) => a.order - b.order)
                    .map((sub, index) => (
                      <div key={sub.id} className="flex items-center gap-4 p-4 bg-[#F8FAFC] rounded-xl hover:bg-gray-50 transition-colors group">
                        <div className={`w-10 h-10 rounded-full ${colorClasses.bg} flex items-center justify-center text-white font-semibold shrink-0`}>{index + 1}</div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-medium text-gray-900">{sub.title}</h3>
                            <Badge className={`${getTypeBadgeColor(sub.type)} text-xs border-none`}>
                              <span className="flex items-center gap-1">
                                {getTypeIcon(sub.type)}
                                {sub.type}
                              </span>
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 mb-1">{sub.description}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>{sub.duration}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors" onClick={() => setEditingSubMaterial({ ...sub })}>
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-500 transition-colors" onClick={() => handleDeleteSubMaterial(sub.id)}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </Card>
          </div>
        </div>

        <Dialog open={showAddSubMaterialForm} onOpenChange={setShowAddSubMaterialForm}>
          <DialogContent className="max-w-5xl rounded-3xl p-8 max-h-[90vh] overflow-y-auto">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl font-bold text-gray-900">Tambah Materi Baru</DialogTitle>
              <DialogDescription className="text-gray-500">Tambahkan materi ke modul "{selectedModule.title}"</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSubMaterial} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold text-sm">Judul Materi</Label>
                  <Input
                    placeholder="e.g. Pengenalan IF Statement"
                    value={newSubMaterial.title}
                    onChange={(e) => setNewSubMaterial({ ...newSubMaterial, title: e.target.value })}
                    required
                    className="bg-[#F8FAFC] border-none h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold text-sm">Tipe Materi</Label>
                  <Select value={newSubMaterial.type} onValueChange={(val: any) => setNewSubMaterial({ ...newSubMaterial, type: val })}>
                    <SelectTrigger className="bg-[#F8FAFC] border-none h-11 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg rounded-xl z-50">
                      <SelectItem value="Video" className="cursor-pointer hover:bg-blue-50 focus:bg-blue-100">
                        Video
                      </SelectItem>
                      <SelectItem value="PDF" className="cursor-pointer hover:bg-blue-50 focus:bg-blue-100">
                        PDF Document
                      </SelectItem>
                      <SelectItem value="Materi" className="cursor-pointer hover:bg-blue-50 focus:bg-blue-100">
                        Materi Teks
                      </SelectItem>
                      <SelectItem value="Link" className="cursor-pointer hover:bg-blue-50 focus:bg-blue-100">
                        Link/URL
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold text-sm">Deskripsi</Label>
                  <Textarea
                    placeholder="Jelaskan isi materi..."
                    value={newSubMaterial.description}
                    onChange={(e) => setNewSubMaterial({ ...newSubMaterial, description: e.target.value })}
                    required
                    rows={3}
                    className="bg-[#F8FAFC] border-none rounded-xl resize-none"
                  />
                </div>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-semibold text-sm">Durasi/Waktu</Label>
                    <Input placeholder="e.g. 15 menit" value={newSubMaterial.duration} onChange={(e) => setNewSubMaterial({ ...newSubMaterial, duration: e.target.value })} required className="bg-[#F8FAFC] border-none h-11 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-semibold text-sm">URL (opsional)</Label>
                    <Input placeholder="e.g. https://example.com/video.mp4" value={newSubMaterial.url} onChange={(e) => setNewSubMaterial({ ...newSubMaterial, url: e.target.value })} className="bg-[#F8FAFC] border-none h-11 rounded-xl" />
                  </div>
                </div>
              </div>

              <div className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                <input
                  type="file"
                  className="hidden"
                  id="fileUpload"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFile(e.target.files[0]);
                    }
                  }}
                />

                <label htmlFor="fileUpload" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-gray-400" />

                    {file ? (
                      <p className="text-sm text-green-600 font-medium">{file.name}</p>
                    ) : (
                      <>
                        <p className="text-gray-600">Klik untuk upload file</p>
                        <p className="text-sm text-gray-400">PDF, Video, atau file lainnya</p>
                      </>
                    )}
                  </div>
                </label>
              </div>

              <DialogFooter className="flex items-center justify-end gap-4 pt-4 border-t bg-white">
                <Button type="button" variant="ghost" onClick={() => setShowAddSubMaterialForm(false)} className="px-6">
                  Batal
                </Button>

                <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-8 h-11 font-semibold shadow-md rounded-xl">
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Materi
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={!!editingSubMaterial} onOpenChange={() => setEditingSubMaterial(null)}>
          <DialogContent className="max-w-5xl rounded-3xl p-8 max-h-[90vh] overflow-y-auto">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl font-bold text-gray-900">Edit Materi</DialogTitle>
              <DialogDescription className="text-gray-500">Ubah detail materi pembelajaran</DialogDescription>
            </DialogHeader>
            {editingSubMaterial && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-semibold text-sm">Judul Materi</Label>
                    <Input value={editingSubMaterial.title} onChange={(e) => setEditingSubMaterial({ ...editingSubMaterial, title: e.target.value })} className="bg-[#F8FAFC] border-none h-11 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-semibold text-sm">Tipe Materi</Label>
                    <Select value={editingSubMaterial.type} onValueChange={(val: any) => setEditingSubMaterial({ ...editingSubMaterial, type: val })}>
                      <SelectTrigger className="bg-[#F8FAFC] border-none h-11 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Video">Video</SelectItem>
                        <SelectItem value="PDF">PDF Document</SelectItem>
                        <SelectItem value="Materi">Materi Teks</SelectItem>
                        <SelectItem value="Link">Link/URL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-semibold text-sm">Deskripsi</Label>
                    <Textarea value={editingSubMaterial.description} onChange={(e) => setEditingSubMaterial({ ...editingSubMaterial, description: e.target.value })} rows={3} className="bg-[#F8FAFC] border-none rounded-xl resize-none" />
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-semibold text-sm">Durasi/Waktu</Label>
                      <Input value={editingSubMaterial.duration} onChange={(e) => setEditingSubMaterial({ ...editingSubMaterial, duration: e.target.value })} className="bg-[#F8FAFC] border-none h-11 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-semibold text-sm">URL (opsional)</Label>
                      <Input
                        placeholder="e.g. https://example.com/video.mp4"
                        value={editingSubMaterial.url || ""}
                        onChange={(e) => setEditingSubMaterial({ ...editingSubMaterial, url: e.target.value })}
                        className="bg-[#F8FAFC] border-none h-11 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold text-sm">Ganti File Materi (Opsional)</Label>

                  {editingSubMaterial?.file_url && (
                    <div className="text-sm text-gray-600">
                      File saat ini:
                      <a href={`http://localhost:5000/uploads/${editingSubMaterial.file_url}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline ml-1">
                        {editingSubMaterial.file_url}
                      </a>
                    </div>
                  )}

                  <input
                    type="file"
                    id="editFileUpload"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFile(e.target.files[0]);
                      }
                    }}
                  />

                  <label htmlFor="editFileUpload" className="border-2 border-dashed border-gray-200 rounded-2xl p-5 flex flex-col items-center justify-center bg-[#F8FAFC] hover:bg-gray-50 transition-colors cursor-pointer">
                    <Upload className="w-7 h-7 text-gray-300 mb-1.5" />

                    {file ? (
                      <p className="text-green-600 text-sm font-medium">{file.name}</p>
                    ) : (
                      <>
                        <p className="text-gray-500 font-medium text-sm">Klik untuk mengganti file</p>
                        <p className="text-gray-400 text-xs mt-0.5">PDF, Video, atau file lainnya</p>
                      </>
                    )}
                  </label>
                </div>

                <DialogFooter className="flex items-center justify-end gap-4 pt-4 border-t bg-white">
                  <Button variant="ghost" onClick={() => setEditingSubMaterial(null)} className="px-6">
                    Batal
                  </Button>

                  <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 h-11 font-semibold shadow-md rounded-xl" onClick={handleSaveEditSubMaterial}>
                    <Save className="w-4 h-4 mr-2" />
                    Simpan Perubahan
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return null;
}
