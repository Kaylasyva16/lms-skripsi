import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Progress } from "../ui/progress";
import { Input } from "../ui/input";
import { Users, User, Calendar, CheckCircle2, Eye, Edit, XCircle, Target, FileText, ChevronRight, Search } from "lucide-react";

interface TeacherProjectDetailProps {
  project: any;
  onBack: () => void;
  onNavigate: (page: string) => void;
  onViewProgress: (entity: any, project: any) => void;
}

export default function TeacherProjectDetail({ project, onBack, onNavigate, onViewProgress }: TeacherProjectDetailProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [projectDetail, setProjectDetail] = useState<any>(project);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonitoring = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:5000/api/guru/projects/${project.id}/monitoring`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("MONITORING DATA:", data);

        if (!res.ok) {
          console.error("Monitoring gagal:", data);
          return;
        }

        const safeGroups = Array.isArray(data.groups) ? data.groups : [];

        setProjectDetail((prev: any) => ({
          ...prev,
          ...project,
          ...data.project,
        }));

        setGroups(safeGroups);
      } catch (err) {
        console.error("FETCH MONITORING ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    if (project?.id) {
      fetchMonitoring();
    }
  }, [project?.id]);

  const calculateProjectProgress = () => {
    if (!groups.length) return 0;

    const total = groups.reduce((sum: number, group: any) => {
      return sum + (group.overallProgress?.percentage || 0);
    }, 0);

    return Math.round(total / groups.length);
  };

  const totalParticipants = groups.reduce((sum: number, group: any) => {
    return sum + (group.members?.length || 0);
  }, 0);

  const filteredGroups = groups.filter((group: any) => {
    const q = searchTerm.toLowerCase();
    const matchesGroupName = (group.groupName || "").toLowerCase().includes(q);
    const matchesMemberName = (group.members || []).some((m: any) => (m.name || "").toLowerCase().includes(q));
    return matchesGroupName || matchesMemberName;
  });

  const displayData = filteredGroups;
  const totalCount = groups.length;
  const filteredCount = displayData.length;

  if (loading) {
    return <div className="p-8">Loading project detail...</div>;
  }

  return (
    <div className="p-0">
      <div className="mb-6">
        <Button variant="outline" onClick={onBack} className="mb-4 hover:bg-blue-50">
          <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
          Kembali ke Daftar Proyek
        </Button>

        <div className="bg-white rounded-xl shadow-lg border-2 border-blue-100 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-blue-900 mb-3">{projectDetail.title}</h1>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={projectDetail.type === "group" ? "bg-purple-500" : "bg-orange-500"}>
                  {projectDetail.type === "group" ? (
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

                <Badge variant="outline" className="text-blue-600">
                  {projectDetail.class}
                </Badge>

                <Badge className={projectDetail.status === "active" ? "bg-green-500" : "bg-gray-500"}>{projectDetail.status === "active" ? "Aktif" : "Selesai"}</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-sm">
              <CardContent className="pt-5 pb-5">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-blue-100 p-3 rounded-lg mb-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-xs text-gray-600 mb-1.5">Deadline</p>
                  <p className="text-blue-900">{projectDetail.deadline || "-"}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white shadow-sm">
              <CardContent className="pt-5 pb-5">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-purple-100 p-3 rounded-lg mb-3">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-xs text-gray-600 mb-1.5">Peserta</p>
                  <p className="text-blue-900">{totalParticipants}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white shadow-sm">
              <CardContent className="pt-5 pb-5">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-green-100 p-3 rounded-lg mb-3">
                    <Target className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-600 mb-1.5">Progress</p>
                  <p className="text-blue-900">{calculateProjectProgress()}%</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-blue-200 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Deskripsi Proyek
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{projectDetail.description}</p>
            </CardContent>
          </Card>

          {projectDetail.status === "active" && (
            <div className="space-y-3">
              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 h-11"
                onClick={() => {
                  onBack();
                  onNavigate("teacher-evaluation");
                }}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Buka Penilaian
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-10" onClick={() => setIsEditOpen(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50 h-10">
                  <XCircle className="w-4 h-4 mr-2" />
                  Akhiri
                </Button>
              </div>
            </div>
          )}
        </div>

        {isEditOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6" onClick={() => setIsEditOpen(false)}>
            <div className="bg-white w-full max-w-5xl rounded-[32px] shadow-2xl p-8 lg:p-10 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-semibold text-blue-900 mb-8">Edit Project</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <label className="text-base font-semibold text-gray-700">Judul Proyek</label>
                  <Input defaultValue={projectDetail.title} className="mt-3 h-14 rounded-2xl" />
                </div>

                <div>
                  <label className="text-base font-semibold text-gray-700">Kelas</label>
                  <Input defaultValue={projectDetail.class} className="mt-3 h-14 rounded-2xl" />
                </div>
              </div>

              <div className="mb-8">
                <label className="text-base font-semibold text-gray-700">Deskripsi Proyek</label>
                <textarea defaultValue={projectDetail.description} rows={4} className="mt-3 w-full rounded-2xl border border-gray-200 p-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                <div>
                  <label className="text-base font-semibold text-gray-700 block mb-4">Deadline</label>
                  <Input type="date" defaultValue={projectDetail.deadline} className="h-16 rounded-2xl bg-gray-100 border-0 px-6 text-lg" />
                </div>

                <div>
                  <label className="text-base font-semibold text-gray-700 block mb-4">Status</label>
                  <select defaultValue={projectDetail.status} className="w-full h-16 rounded-2xl bg-gray-100 border-0 px-6 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-12">
                <Button variant="outline" onClick={() => setIsEditOpen(false)} className="h-14 px-8 rounded-2xl">
                  Batal
                </Button>

                <Button className="h-14 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setIsEditOpen(false)}>
                  Simpan
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="col-span-3">
          <Card className="shadow-sm">
            <CardHeader className="pb-4 border-b bg-gradient-to-r from-gray-50 to-white">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Daftar Kelompok
              </CardTitle>
              <CardDescription>Monitoring progress dan status pengerjaan setiap kelompok</CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input placeholder="Cari nama kelompok atau anggota..." className="pl-10 bg-white border-gray-200 focus:border-blue-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>

                {searchTerm && (
                  <p className="text-sm text-gray-600 mt-2">
                    Menampilkan {filteredCount} dari {totalCount} kelompok
                  </p>
                )}
              </div>

              <div className="space-y-4 max-h-[calc(100vh-500px)] overflow-y-auto pr-2">
                {displayData.length > 0 ? (
                  displayData.map((group: any) => {
                    const progressPercent = group.overallProgress?.percentage || 0;
                    const completedSteps = group.overallProgress?.completed || 0;
                    const totalSteps = group.overallProgress?.total || 0;

                    return (
                      <Card key={group.id} className="border-2 hover:border-blue-300 transition-all shadow-sm hover:shadow-md">
                        <CardContent className="pt-6 pb-6">
                          <div className="flex items-start justify-between mb-5">
                            <div className="flex-1">
                              <h4 className="text-blue-900 mb-4 text-lg">{group.groupName}</h4>

                              <div className="flex -space-x-2 mb-4">
                                {(group.members || []).map((member: any, idx: number) => (
                                  <Avatar key={idx} className="border-2 border-white w-10 h-10">
                                    <AvatarFallback className="bg-blue-500 text-white">
                                      {member.initials ||
                                        member.name
                                          ?.split(" ")
                                          .map((x: string) => x[0])
                                          .join("")
                                          .slice(0, 2)
                                          .toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                ))}
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                              <Badge className={progressPercent === 100 ? "bg-green-500" : "bg-blue-500"}>{progressPercent === 100 ? "Selesai" : "Berjalan"}</Badge>
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2.5">
                              <span className="text-gray-600">Progress PBL</span>
                              <span className="text-blue-600">
                                {completedSteps}/{totalSteps} Tahap
                              </span>
                            </div>
                            <Progress value={progressPercent} className="h-2.5" />
                          </div>

                          <Button className="w-full bg-blue-500 hover:bg-blue-600 h-11" onClick={() => onViewProgress(group, projectDetail)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Lihat Detail Progress
                            <ChevronRight className="w-4 h-4 ml-auto" />
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <div className="text-center text-gray-500">Belum ada kelompok pada project ini.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
