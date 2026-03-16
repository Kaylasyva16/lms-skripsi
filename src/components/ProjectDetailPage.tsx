import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Textarea } from "./ui/textarea";
import { ChevronLeft, CheckCircle2, XCircle, Clock, AlertCircle, Edit2, Lock, Save, X, Upload, FileText, Trash2 } from "lucide-react";

interface ProjectDetailPageProps {
  projectId: number;
  onClose: () => void;
}

type TeamMember = {
  id: number;
  name: string;
  role: string;
  initials: string;
};

type StageFile = {
  id: number;
  fileName: string;
  fileUrl: string;
  fileSize?: number;
};

type Stage = {
  id: number;
  stageNo: number;
  title: string;
  subtitle: string;
  instruction?: string;
  description?: string;
  answer?: string;
  status: "belum_mengerjakan" | "belum_selesai" | "selesai";
  feedbackText?: string | null;
  allowFileUpload?: boolean;
  files?: StageFile[];
};

type Syntax = {
  id: number;
  syntaxNo: number;
  title: string;
  subtitle?: string;
  description?: string;
  unlocked: boolean;
  status: "terkunci" | "belum_selesai" | "selesai";
  progress: {
    completed: number;
    total: number;
  };
  stages: Stage[];
};

type ProjectDetailResponse = {
  project: {
    id: number;
    title: string;
    description?: string;
    status: string;
    groupName?: string;
  };
  teamMembers: TeamMember[];
  overallProgress: {
    completed: number;
    total: number;
    percentage: number;
  };
  syntaxes: Syntax[];
};

const API_BASE = "http://localhost:5000";

function formatBytes(bytes?: number) {
  if (!bytes) return "-";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function getStageStatusLabel(status: Stage["status"]) {
  if (status === "selesai") return "SELESAI";
  if (status === "belum_selesai") return "SUDAH DIISI";
  return "BELUM MENGERJAKAN";
}

function getStageStatusIcon(status: Stage["status"], hasFeedback?: boolean) {
  if (status === "selesai") {
    return <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />;
  }

  if (status === "belum_selesai") {
    return <CheckCircle2 className="w-6 h-6 text-blue-500 flex-shrink-0" />;
  }

  return <Clock className="w-6 h-6 text-gray-400 flex-shrink-0" />;
}

export function ProjectDetailPage({ projectId, onClose }: ProjectDetailPageProps) {
  const [activeSintaks, setActiveSintaks] = useState(1);
  const [editingStageId, setEditingStageId] = useState<number | null>(null);
  const [editedAnswer, setEditedAnswer] = useState("");
  const [projectDetail, setProjectDetail] = useState<ProjectDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingStageId, setUploadingStageId] = useState<number | null>(null);
  console.log("PROJECT DETAIL projectId:", projectId);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/api/student/projects/${projectId}/detail`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Gagal mengambil detail project");
      }

      const data = await res.json();
      setProjectDetail(data);

      if (data?.syntaxes?.length > 0) {
        const firstAvailable = data.syntaxes.find((s: Syntax) => s.unlocked) ?? data.syntaxes[0];
        setActiveSintaks((prev) => prev || firstAvailable.syntaxNo);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    fetchDetail();
  }, [projectId]);

  const syntaxes = projectDetail?.syntaxes || [];

  const currentSintaks: Syntax | undefined = useMemo(() => {
    return syntaxes.find((s) => s.syntaxNo === activeSintaks) || syntaxes[0];
  }, [syntaxes, activeSintaks]);

  const stages = currentSintaks?.stages || [];

  const overallProgress = projectDetail?.overallProgress || {
    completed: 0,
    total: 0,
    percentage: 0,
  };

  const handleEdit = (stage: Stage) => {
    setEditingStageId(stage.id);
    setEditedAnswer(stage.answer || "");
  };

  const handleSave = async () => {
    if (editingStageId === null) return;

    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/api/student/stages/${editingStageId}/submission`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectId,
          answer: editedAnswer,
          status: editedAnswer.trim() ? "belum_selesai" : "belum_mengerjakan",
        }),
      });

      if (!res.ok) {
        throw new Error("Gagal menyimpan jawaban");
      }

      setEditingStageId(null);
      setEditedAnswer("");
      await fetchDetail();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingStageId(null);
    setEditedAnswer("");
  };

  const handleFileUpload = async (stageId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingStageId(stageId);
      const token = localStorage.getItem("token");

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("projectId", String(projectId));

        const res = await fetch(`${API_BASE}/api/student/stages/${stageId}/files`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!res.ok) {
          throw new Error("Gagal upload file");
        }
      }

      await fetchDetail();
      event.target.value = "";
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingStageId(null);
    }
  };

  const handleRemoveFile = async (fileId: number) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/api/student/stage-files/${fileId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Gagal menghapus file");
      }

      await fetchDetail();
    } catch (err) {
      console.error(err);
    }
  };

  if (!projectId) {
    return <div className="p-6 text-sm text-red-500">Project ID tidak ditemukan.</div>;
  }

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Memuat detail project...</div>;
  }

  if (!projectDetail) {
    return <div className="p-6 text-sm text-red-500">Detail project tidak ditemukan.</div>;
  }

  return (
    <div className="space-y-6 pb-8">
      <button onClick={onClose} className="flex items-center gap-2 text-[#155dfc] hover:text-[#0d4acf] transition-colors">
        <ChevronLeft className="w-4 h-4" />
        <span className="font-medium text-sm tracking-[-0.15px]">Kembali ke Daftar Project</span>
      </button>

      <Card className="border border-[rgba(0,0,0,0.1)]">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h3 className="text-base text-neutral-950 mb-1 tracking-[-0.31px]">{projectDetail.project.title}</h3>
              <p className="text-base text-[#717182] tracking-[-0.31px]">Progress Pengerjaan: {projectDetail.project.groupName || "-"}</p>
            </div>

            <Badge variant="outline" className="bg-[#eceef2] text-[#030213] border-0 text-xs font-medium h-[22px] px-3">
              <AlertCircle className="w-3 h-3 mr-1.5" />
              {overallProgress.completed === overallProgress.total && overallProgress.total > 0 ? "Selesai" : "Belum Selesai"}
            </Badge>
          </div>

          <div className="mb-6">
            <p className="text-sm text-[#4a5565] mb-3 tracking-[-0.15px]">Anggota Kelompok:</p>
            <div className="flex flex-wrap gap-3">
              {projectDetail.teamMembers.map((member) => (
                <div key={member.id} className="bg-blue-50 rounded-[10px] px-3 py-2.5 flex items-center gap-3 min-w-[150px]">
                  <div className="bg-[#2b7fff] w-8 h-8 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">{member.initials}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#1c398e] leading-5 tracking-[-0.15px] truncate">{member.name}</p>
                    <p className="text-xs text-[#4a5565] leading-4 truncate">{member.role || "Anggota"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-[#4a5565] tracking-[-0.15px]">Progress Keseluruhan</p>
              <p className="text-sm text-[#1c398e] tracking-[-0.15px]">
                {overallProgress.completed}/{overallProgress.total} Tahap Selesai
              </p>
            </div>
            <Progress value={overallProgress.percentage} className="h-3" />
          </div>

          {overallProgress.completed < overallProgress.total && (
            <div className="bg-yellow-50 border border-[#fff085] rounded-[10px] p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-[#D08700] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-[#733e0a] leading-5 tracking-[-0.15px] mb-1">Kelompok ini belum bisa dinilai karena belum menyelesaikan semua sintaks.</p>
                <p className="text-xs text-[#a65f00] leading-4">Siswa harus menyelesaikan semua tahap untuk mendapatkan nilai.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-white rounded-[14px] border border-[rgba(0,0,0,0.1)] p-1">
        <div className="flex gap-1 overflow-x-auto">
          {syntaxes.map((step) => (
            <button
              key={step.id}
              onClick={() => step.unlocked && setActiveSintaks(step.syntaxNo)}
              disabled={!step.unlocked}
              className={`flex-1 min-w-[160px] rounded-[14px] px-2 py-3 flex flex-col items-center justify-center gap-1.5 transition-all ${
                currentSintaks?.syntaxNo === step.syntaxNo ? "bg-[#2b7fff] text-white" : step.unlocked ? "text-neutral-950 hover:bg-gray-50 cursor-pointer" : "text-gray-400 bg-gray-100 cursor-not-allowed opacity-60"
              }`}
            >
              <div className="flex items-center gap-1.5">
                {step.unlocked ? <Clock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                <span className="text-xs font-medium leading-4">Sintaks {step.syntaxNo}</span>
              </div>
              <span className="text-xs leading-[15px] text-center opacity-80">{step.subtitle || step.title}</span>
            </button>
          ))}
        </div>
      </div>

      {currentSintaks && (
        <Card className="border border-[rgba(0,0,0,0.1)]">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base text-[#1c398e] mb-1 tracking-[-0.31px]">{currentSintaks.title}</h3>
                <p className="text-sm text-[#4a5565] tracking-[-0.15px]">{currentSintaks.description}</p>
              </div>

              {currentSintaks.status === "selesai" && (
                <Badge className="bg-green-500 hover:bg-green-600 text-white">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Selesai
                </Badge>
              )}

              {currentSintaks.status === "terkunci" && (
                <Badge className="bg-gray-500 hover:bg-gray-600 text-white">
                  <Lock className="w-3 h-3 mr-1" />
                  Terkunci
                </Badge>
              )}
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-[#4a5565] tracking-[-0.15px]">Progress Sintaks {currentSintaks.syntaxNo}</p>
                <p className="text-sm text-[#1c398e] tracking-[-0.15px]">
                  {currentSintaks.progress.completed}/{currentSintaks.progress.total} Tahap Selesai
                </p>
              </div>
              <Progress value={currentSintaks.progress.total === 0 ? 0 : (currentSintaks.progress.completed / currentSintaks.progress.total) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h3 className="font-medium text-[#1c398e]">Tahap-tahap Pengerjaan</h3>

        {stages.map((stage) => {
          const hasFeedback = Boolean(stage.feedbackText);
          const stageAnswer = stage.answer || stage.description || "";

          return (
            <Card key={stage.id} className={`border ${hasFeedback ? "bg-green-50 border-green-200" : "bg-white border-gray-300"}`}>
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStageStatusIcon(stage.status, hasFeedback)}
                    <div>
                      <h4 className="font-medium text-neutral-950 mb-0.5">{stage.title}</h4>
                      <p className="text-sm text-[#4a5565]">{stage.subtitle}</p>
                    </div>
                  </div>

                  {hasFeedback && (
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 text-xs">
                      Sudah Diberi Feedback
                    </Badge>
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-700 mb-2">Hasil Pengerjaan:</p>

                  {editingStageId === stage.id ? (
                    <div className="space-y-3">
                      <Textarea value={editedAnswer} onChange={(e) => setEditedAnswer(e.target.value)} className="w-full min-h-[120px] bg-white border-gray-300" placeholder="Tulis jawaban Anda di sini..." />
                      <div className="flex gap-2">
                        <Button onClick={handleSave} size="sm" disabled={saving} className="gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                          <Save className="w-4 h-4" />
                          {saving ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                        <Button onClick={handleCancel} variant="outline" size="sm" className="gap-2">
                          <X className="w-4 h-4" />
                          Batal
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className={`p-3 rounded border ${hasFeedback ? "bg-white border-green-200" : "bg-gray-50 border-gray-200"}`}>
                      <p className="text-sm text-gray-600 leading-relaxed">{stageAnswer || "Belum ada jawaban. Klik Edit Jawaban untuk mulai mengisi."}</p>
                    </div>
                  )}
                </div>

                {hasFeedback && (
                  <div className="bg-white rounded-lg border border-green-200 p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <p className="text-xs font-medium text-green-700">Feedback Guru:</p>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed pl-6">{stage.feedbackText}</p>
                  </div>
                )}

                {stage.allowFileUpload && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500">Opsional — upload jika tahap ini membutuhkan lampiran pendukung</p>

                    <div className="flex items-center gap-2 mb-3">
                      <label htmlFor={`file-upload-${stage.id}`} className="cursor-pointer">
                        <div className="flex items-center gap-2 px-4 py-2 border border-[#2b7fff] rounded-lg text-[#2b7fff] hover:bg-blue-50 transition-colors text-sm">
                          <Upload className="w-4 h-4" />
                          <span>{uploadingStageId === stage.id ? "Mengupload..." : "Upload File"}</span>
                        </div>
                        <input id={`file-upload-${stage.id}`} type="file" multiple className="hidden" onChange={(e) => handleFileUpload(stage.id, e)} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip" />
                      </label>
                      <span className="text-xs text-gray-500">PDF, DOC, Gambar, ZIP</span>
                    </div>

                    

                    {stage.files && stage.files.length > 0 && (
                      <div className="space-y-2 mt-3">
                        {stage.files.map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <FileText className="w-4 h-4 text-[#2b7fff] flex-shrink-0" />
                              <a href={`${API_BASE}/uploads/${file.fileUrl}`} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-700 truncate hover:underline">
                                {file.fileName}
                              </a>
                              <span className="text-xs text-gray-500 flex-shrink-0">({formatBytes(file.fileSize)})</span>
                            </div>

                            <Button onClick={() => handleRemoveFile(file.id)} variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {editingStageId !== stage.id && (
                  <Button onClick={() => handleEdit(stage)} variant="ghost" size="sm" className={`gap-2 ${hasFeedback ? "text-green-600 hover:text-green-700 hover:bg-green-100" : "text-gray-600 hover:text-gray-900"}`}>
                    <Edit2 className="w-4 h-4" />
                    Edit Jawaban
                  </Button>
                )}

                <div className="mt-3 text-xs text-gray-500">Status: {getStageStatusLabel(stage.status)}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
