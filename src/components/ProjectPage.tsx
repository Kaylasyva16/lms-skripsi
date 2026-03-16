import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar, Award, Clock, UserPlus, Users2, FileText, Trash2, Pencil } from "lucide-react";
import { ProjectDetailPage } from "./ProjectDetailPage";

const parseResponse = async (res: Response) => {
  const contentType = res.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return await res.json();
  }

  return { message: await res.text() };
};

type Member = {
  id?: number;
  studentId?: number;
  no: number;
  name: string;
  absen: string;
  status: string;
  role?: string;
};

type StudentProject = {
  id: number;
  title: string;
  classId: number;
  class: string;
  type: "group" | "individual";
  deadline: string;
  description: string;
  membersPerGroup: number | null;
  status: "active" | "completed";
  createdAt: string;
};

type Classmate = {
  id: number;
  nama: string;
  nis: string;
};

export function ProjectPage() {
  const [projects, setProjects] = useState<StudentProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<StudentProject | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [classmates, setClassmates] = useState<Classmate[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMember, setNewMember] = useState({ studentId: "", status: "Anggota", role: "" });
  const [showDetail, setShowDetail] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/student/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await parseResponse(res);

      if (!res.ok) {
        setErrorMessage(data.message || "Gagal mengambil data project");
        setTimeout(() => setErrorMessage(""), 3000);
        setProjects([]);
        setSelectedProject(null);
        return;
      }

      const projectList = Array.isArray(data) ? data : [];
      setProjects(projectList);
      setSelectedProject(projectList[0] || null);
    } catch (error) {
      console.error(error);
      setErrorMessage("Terjadi kesalahan saat mengambil project");
      setTimeout(() => setErrorMessage(""), 3000);
      setProjects([]);
      setSelectedProject(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async (projectId: number) => {
    try {
      setLoadingMembers(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/student/projects/${projectId}/group`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await parseResponse(res);
      console.log("FETCH MEMBERS RESPONSE:", data);
      console.log("FETCH MEMBERS ARRAY:", data.members);
      console.log("FETCH FIRST MEMBER:", data.members?.[0]);

      if (!res.ok) {
        setErrorMessage(data.message || "Gagal mengambil anggota kelompok");
        setTimeout(() => setErrorMessage(""), 3000);
        setMembers([]);
        return;
      }

      setMembers(Array.isArray(data.members) ? data.members : []);
    } catch (error) {
      console.error(error);
      setErrorMessage("Terjadi kesalahan saat mengambil anggota kelompok");
      setTimeout(() => setErrorMessage(""), 3000);
      setMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  const fetchClassmates = async (projectId: number) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/student/projects/${projectId}/classmates`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await parseResponse(res);

      if (!res.ok) {
        setErrorMessage(data.message || "Gagal mengambil daftar siswa");
        setTimeout(() => setErrorMessage(""), 3000);
        setClassmates([]);
        return;
      }

      setClassmates(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setErrorMessage("Terjadi kesalahan saat mengambil daftar siswa");
      setTimeout(() => setErrorMessage(""), 3000);
      setClassmates([]);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject?.type === "group") {
      fetchMembers(selectedProject.id);
      fetchClassmates(selectedProject.id);
    } else {
      setMembers([]);
      setClassmates([]);
    }
  }, [selectedProject]);
  const handleSaveMember = async () => {
    if (!selectedProject) return;

    if (!newMember.studentId) {
      setErrorMessage("Pilih siswa terlebih dahulu");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    if (!newMember.role) {
      setErrorMessage("Pilih peran terlebih dahulu");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const isEdit = !!editingMember?.id;

      const url = isEdit ? `http://localhost:5000/api/student/group-members/${editingMember.id}` : `http://localhost:5000/api/student/projects/${selectedProject.id}/group/members`;

      const method = isEdit ? "PUT" : "POST";

      const payload = {
        studentId: Number(newMember.studentId),
        status: newMember.status,
        role: newMember.role,
      };

      console.log("SAVE MEMBER URL:", url);
      console.log("SAVE MEMBER METHOD:", method);
      console.log("SAVE MEMBER PAYLOAD:", payload);

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await parseResponse(res);
      console.log("SAVE MEMBER STATUS:", res.status);
      console.log("SAVE MEMBER RESPONSE:", data);

      if (!res.ok) {
        const safeMessage = typeof data.message === "string" && !data.message.includes("<!DOCTYPE") ? data.message : isEdit ? "Gagal mengubah anggota" : "Gagal menambahkan anggota";

        setErrorMessage(safeMessage);
        setTimeout(() => setErrorMessage(""), 3000);
        return;
      }

      setSuccessMessage(isEdit ? "Anggota berhasil diupdate!" : "Anggota berhasil ditambahkan!");
      setTimeout(() => setSuccessMessage(""), 3000);

      setNewMember({
        studentId: "",
        status: "Anggota",
        role: "",
      });
      setEditingMember(null);
      setIsDialogOpen(false);
      fetchMembers(selectedProject.id);
    } catch (error) {
      console.error(error);
      setErrorMessage("Terjadi kesalahan saat menyimpan anggota");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleEditMember = (member: Member) => {
    setEditingMember(member);
    setNewMember({
      studentId: String(member.studentId ?? ""),
      status: member.status || "Anggota",
      role: member.role || "",
    });
    setIsDialogOpen(true);
  };

  const handleDeleteMember = async (memberId?: number) => {
    console.log("DELETE memberId:", memberId);
    console.log("selectedProject:", selectedProject);

    if (!memberId || !selectedProject) {
      console.log("memberId atau selectedProject kosong", { memberId, selectedProject });
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/student/group-members/${memberId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await parseResponse(res);
      console.log("DELETE status:", res.status);
      console.log("DELETE response:", data);

      if (!res.ok) {
        alert(data.message || "Gagal menghapus anggota");
        return;
      }

      alert("Anggota berhasil dihapus");
      fetchMembers(selectedProject.id);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menghapus anggota");
    }
  };

  const availableClassmates = classmates.filter((student) => !members.some((member) => member.studentId === student.id));

  const getStatusLabel = (status?: string) => {
    if (status === "active") return "Sedang Dikerjakan";
    if (status === "completed") return "Selesai";
    return "-";
  };

  const getStatusBadgeClass = (status?: string) => {
    if (status === "active") return "bg-orange-500 hover:bg-orange-600";
    if (status === "completed") return "bg-green-500 hover:bg-green-600";
    return "bg-gray-400 hover:bg-gray-500";
  };
  if (showDetail && selectedProject) {
    return <ProjectDetailPage projectId={selectedProject.id} onClose={() => setShowDetail(false)} />;
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-gray-900 mb-2">Problem Based Learning</h2>
          <p className="text-gray-600">Memuat data project...</p>
        </div>
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-gray-900 mb-2">Problem Based Learning</h2>
          <p className="text-gray-600">Detail problem dan manajemen kelompok</p>
        </div>

        <Card>
          <CardContent className="py-10 text-center">
            <div className="flex flex-col items-center gap-3">
              <FileText className="w-10 h-10 text-gray-300" />
              <h3 className="text-gray-900">Belum ada project</h3>
              <p className="text-sm text-gray-500">Project dari guru belum tersedia untuk kelas kamu.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {successMessage && <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50">✓ {successMessage}</div>}

      {errorMessage && <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg z-50">✕ {errorMessage}</div>}

      <div>
        <h2 className="text-gray-900 mb-2">Problem Based Learning</h2>
        <p className="text-gray-600">Detail problem dan manajemen kelompok</p>
      </div>

      {projects.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Daftar Project
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {projects.map((project) => (
                <Button key={project.id} variant={selectedProject.id === project.id ? "default" : "outline"} className={selectedProject.id === project.id ? "bg-blue-500 hover:bg-blue-600" : ""} onClick={() => setSelectedProject(project)}>
                  {project.title}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            Deskripsi Proyek
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <h3 className="text-gray-900 mb-2">{selectedProject.title || "-"}</h3>
            <p className="text-gray-600 leading-relaxed">{selectedProject.description || "Deskripsi proyek belum tersedia."}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-500" />
            Detail Proyek
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Nama Proyek</p>
                <p className="text-gray-900">{selectedProject.title || "-"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Tenggat Waktu</p>
                <p className="text-gray-900">{selectedProject.deadline || "-"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-purple-50 border border-purple-200">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Nilai</p>
                <p className="text-gray-900">-</p>
                <p className="text-xs text-gray-500">Belum dinilai</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-orange-50 border border-orange-200">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <Badge className={getStatusBadgeClass(selectedProject.status)}>{getStatusLabel(selectedProject.status)}</Badge>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t mt-6">
            <Button className="bg-blue-500 hover:bg-blue-600 gap-2" onClick={() => setShowDetail(true)}>
              <FileText className="w-4 h-4" />
              Lihat Detail Proyek Lengkap
            </Button>
          </div>
        </CardContent>
      </Card>

      {selectedProject.type === "group" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users2 className="w-5 h-5 text-green-500" />
                Anggota Kelompok
              </CardTitle>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-green-500 hover:bg-green-600 gap-2"
                    onClick={() => {
                      setEditingMember(null);
                      setNewMember({
                        studentId: "",
                        status: "Anggota",
                        role: "",
                      });
                    }}
                  >
                    <UserPlus className="w-4 h-4" />
                    Tambah Anggota
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{editingMember ? "Edit Anggota Kelompok" : "Tambah Anggota Kelompok"}</DialogTitle>
                    <DialogDescription>{editingMember ? "Ubah data anggota kelompok" : "Pilih siswa untuk dimasukkan ke kelompok"}</DialogDescription>
                  </DialogHeader>

                  <div className="flex flex-col gap-5 py-4">
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-medium">Pilih Siswa</Label>
                      <Select value={newMember.studentId} onValueChange={(value) => setNewMember({ ...newMember, studentId: value })}>
                        <SelectTrigger className="w-full h-10">
                          <SelectValue placeholder="Pilih siswa" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border shadow-md z-50">
                          {availableClassmates.length > 0 ? (
                            availableClassmates.map((student) => (
                              <SelectItem key={student.id} value={String(student.id)} className="hover:bg-blue-100 focus:bg-blue-100 cursor-pointer">
                                {student.nama} - {student.nis}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="empty" disabled>
                              Tidak ada siswa tersedia
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-medium">Status</Label>
                      <Select value={newMember.status} onValueChange={(value) => setNewMember({ ...newMember, status: value })}>
                        <SelectTrigger className="w-full h-10">
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                        <SelectContent className="z-50 bg-white border shadow-md">
                          <SelectItem value="Ketua" className="cursor-pointer hover:bg-blue-100 focus:bg-blue-100">
                            Ketua
                          </SelectItem>
                          <SelectItem value="Anggota" className="cursor-pointer hover:bg-blue-100 focus:bg-blue-100">
                            Anggota
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-medium">Peran</Label>
                      <Select value={newMember.role} onValueChange={(value) => setNewMember({ ...newMember, role: value })}>
                        <SelectTrigger className="w-full h-10">
                          <SelectValue placeholder="Pilih peran" />
                        </SelectTrigger>
                        <SelectContent className="z-50 bg-white border shadow-md">
                          <SelectItem value="Leader" className="cursor-pointer hover:bg-blue-100 focus:bg-blue-100">
                            Leader
                          </SelectItem>
                          <SelectItem value="Programmer" className="cursor-pointer hover:bg-blue-100 focus:bg-blue-100">
                            Programmer
                          </SelectItem>
                          <SelectItem value="Designer" className="cursor-pointer hover:bg-blue-100 focus:bg-blue-100">
                            Designer
                          </SelectItem>
                          <SelectItem value="Database" className="cursor-pointer hover:bg-blue-100 focus:bg-blue-100">
                            Database
                          </SelectItem>
                          <SelectItem value="Dokumentasi" className="cursor-pointer hover:bg-blue-100 focus:bg-blue-100">
                            Dokumentasi
                          </SelectItem>
                          <SelectItem value="Presenter" className="cursor-pointer hover:bg-blue-100 focus:bg-blue-100">
                            Presenter
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Batal
                    </Button>
                    <Button className="bg-green-500 hover:bg-green-600" onClick={handleSaveMember}>
                      {editingMember ? "Edit Anggota Kelompok" : "Tambah Anggota Kelompok"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>

          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-16">No</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead className="w-32">NIS / Absen</TableHead>
                    <TableHead className="w-32">Status</TableHead>
                    <TableHead className="w-40">Peran</TableHead>
                    <TableHead className="w-20">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingMembers ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500 py-6">
                        Memuat anggota...
                      </TableCell>
                    </TableRow>
                  ) : members.length > 0 ? (
                    members.map((member) => (
                      <TableRow key={member.id || member.no}>
                        <TableCell>{member.no}</TableCell>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.absen}</TableCell>
                        <TableCell>
                          <Badge className={member.status === "Ketua" ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-500 hover:bg-gray-600"}>{member.status}</Badge>
                        </TableCell>
                        <TableCell>{member.role || "-"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => handleEditMember(member)}>
                              <Pencil className="w-4 h-4" />
                            </Button>

                            <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleDeleteMember(member.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500 py-6">
                        Belum ada anggota kelompok
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700">
                Total anggota kelompok: <span className="font-medium">{members.length} orang</span>
                {selectedProject.membersPerGroup && (
                  <>
                    {" "}
                    | Maksimal <span className="font-medium">{selectedProject.membersPerGroup} orang</span>
                  </>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
