import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import { Progress } from "../ui/progress";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { ArrowLeft, CheckCircle2, Clock, Lock, FileText, MessageSquare, AlertCircle, XCircle, Circle, Edit2, Send, Download } from "lucide-react";

interface ProjectProgressDetailProps {
  onBack: () => void;
  groupData: any;
  projectTitle: string;
}

export default function ProjectProgressDetail({ onBack, groupData, projectTitle }: ProjectProgressDetailProps) {
  const [activeTab, setActiveTab] = useState("");
  const [editingFeedback, setEditingFeedback] = useState<{
    submissionId: number;
    sintaksId: number;
    stageId: number;
  } | null>(null);
  const [feedbackValue, setFeedbackValue] = useState("");
  const [detailData, setDetailData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);

        const res = await fetch(`http://localhost:5000/api/guru/projects/${groupData.projectId || groupData.id}/monitoring`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("MONITORING DETAIL:", data);

        if (!res.ok) {
          console.error("Gagal ambil monitoring detail:", data);
          setDetailData(null);
          return;
        }

        const groupsArray = Array.isArray(data.groups) ? data.groups : data.groups ? [data.groups] : [];
        const selectedGroup = groupsArray.length > 0 ? groupsArray[0] : null;

        setDetailData(selectedGroup);

        if (selectedGroup?.syntaxes?.length > 0) {
          setActiveTab(`sintaks-${selectedGroup.syntaxes[0].syntaxNo}`);
        }
      } catch (error) {
        console.error("Fetch monitoring detail error:", error);
        setDetailData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [groupData.id, groupData.projectId, token]);

  const syntaxes = detailData?.syntaxes || [];
  const members = detailData?.members || [];

  const totalStages = useMemo(() => {
    return syntaxes.reduce((sum: number, sintaks: any) => sum + (sintaks.stages?.length || 0), 0);
  }, [syntaxes]);

  const completedStages = useMemo(() => {
    return syntaxes.reduce((sum: number, sintaks: any) => {
      const done = sintaks.stages?.filter((stage: any) => stage.status === "selesai").length || 0;
      return sum + done;
    }, 0);
  }, [syntaxes]);

  const completedSintaks = useMemo(() => {
    return syntaxes.filter((s: any) => s.status === "selesai").length;
  }, [syntaxes]);

  const overallProgress = totalStages === 0 ? 0 : Math.round((completedStages / totalStages) * 100);

  const canBeGraded = syntaxes.length > 0 && syntaxes.every((s: any) => (s.stages || []).every((stage: any) => stage.status === "selesai"));

  const isSintaksUnlocked = (index: number) => {
    if (index === 0) return true;
    const previous = syntaxes[index - 1];
    return previous?.status === "selesai";
  };

  const getStageStatusBadge = (status: string) => {
    switch (status) {
      case "selesai":
        return {
          label: "Selesai",
          color: "bg-green-500",
        };
      case "belum_selesai":
        return {
          label: "Sedang Dikerjakan",
          color: "bg-blue-500",
        };
      case "belum_mengerjakan":
      default:
        return {
          label: "Belum Mulai",
          color: "bg-gray-400",
        };
    }
  };

  const getSintaksStatus = (sintaks: any) => {
    if (sintaks.status === "selesai") {
      return {
        label: "Selesai",
        color: "bg-green-500",
        icon: CheckCircle2,
      };
    }

    if (sintaks.status === "terkunci") {
      return {
        label: "Terkunci",
        color: "bg-gray-400",
        icon: Lock,
      };
    }

    if (sintaks.status === "belum_selesai") {
      return {
        label: "Sedang Dikerjakan",
        color: "bg-blue-500",
        icon: Clock,
      };
    }

    return {
      label: "Belum Mulai",
      color: "bg-gray-400",
      icon: AlertCircle,
    };
  };

  const handleSaveFeedback = async (submissionId: number, sintaksId: number, stageId: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/guru/submissions/${submissionId}/feedback`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          feedbackText: feedbackValue,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Gagal simpan feedback:", data);
        alert(data.message || "Gagal menyimpan feedback");
        return;
      }

      setDetailData((prev: any) => {
        if (!prev) return prev;

        return {
          ...prev,
          syntaxes: prev.syntaxes.map((sintaks: any) => {
            if (sintaks.id !== sintaksId) return sintaks;

            return {
              ...sintaks,
              stages: sintaks.stages.map((stage: any) => {
                if (stage.id !== stageId) return stage;
                return {
                  ...stage,
                  feedbackText: feedbackValue,
                };
              }),
            };
          }),
        };
      });

      setEditingFeedback(null);
      setFeedbackValue("");
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menyimpan feedback");
    }
  };

  const handleUpdateStatus = async (submissionId: number, status: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/guru/submissions/${submissionId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Gagal update status:", data);
        alert(data.message || "Gagal update status");
        return;
      }

      setDetailData((prev: any) => {
        if (!prev) return prev;

        const updatedSyntaxes = prev.syntaxes.map((sintaks: any) => {
          const updatedStages = sintaks.stages.map((stage: any) => {
            if (stage.submissionId !== submissionId) return stage;
            return {
              ...stage,
              status,
            };
          });

          const completedCount = updatedStages.filter((s: any) => s.status === "selesai").length;

          let sintaksStatus = "belum_selesai";
          if (completedCount === updatedStages.length && updatedStages.length > 0) {
            sintaksStatus = "selesai";
          }

          return {
            ...sintaks,
            stages: updatedStages,
            status: sintaksStatus,
            progress: {
              completed: completedCount,
              total: updatedStages.length,
            },
          };
        });

        return {
          ...prev,
          syntaxes: updatedSyntaxes,
        };
      });
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat update status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p>Loading progress project...</p>
        </div>
      </div>
    );
  }

  if (!detailData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button variant="ghost" onClick={onBack} className="mb-6 text-blue-600">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Project
          </Button>

          <Card>
            <CardContent className="py-10 text-center text-gray-500">Data progress tidak ditemukan.</CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={onBack} className="mb-6 text-blue-600">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Daftar Project
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="mb-2">{projectTitle}</CardTitle>
                <p className="text-base text-gray-600">Progress Pengerjaan: {detailData.groupName || groupData.groupName || "Kelompok"}</p>
              </div>

              {canBeGraded ? (
                <Badge className="bg-green-500">
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Siap Dinilai
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Belum Selesai
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {groupData.type === "group" && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-3">Anggota Kelompok:</p>
                <div className="flex flex-wrap gap-3">
                  {members.map((member: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-blue-500 text-white text-xs">
                          {member.initials ||
                            member.name
                              ?.split(" ")
                              .map((x: string) => x[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm text-blue-900">{member.name}</p>
                        <p className="text-xs text-gray-600">{member.role || "-"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Progress Keseluruhan</p>
                <p className="text-sm text-blue-900">
                  {completedSintaks}/{syntaxes.length} Sintaks Selesai ({completedStages}/{totalStages} Tahap)
                </p>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>

            {!canBeGraded && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-900">Kelompok ini belum bisa dinilai karena belum menyelesaikan semua sintaks.</p>
                  <p className="text-xs text-yellow-700 mt-1">Siswa harus menyelesaikan semua tahap untuk mendapatkan nilai.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full bg-gray-100 rounded-2xl p-2 flex gap-2 mb-6 h-auto overflow-x-auto whitespace-nowrap">
                {syntaxes.map((sintaks: any, index: number) => {
                  const status = getSintaksStatus(sintaks);
                  const StatusIcon = status.icon;

                  const isActive = activeTab === `sintaks-${sintaks.syntaxNo}`;
                  const isCompleted = sintaks.status === "selesai";
                  const isLocked = sintaks.status === "terkunci";

                  return (
                    <TabsTrigger
                      key={sintaks.id}
                      value={`sintaks-${sintaks.syntaxNo}`}
                      disabled={!isSintaksUnlocked(index)}
                      className="shrink-0 min-w-[180px] max-w-[220px] rounded-lg px-4 py-3 transition-all h-auto
                      data-[state=active]:bg-blue-500
                      data-[state=active]:text-white
                      text-gray-700 hover:bg-white"
                    >
                      <div className={`text-center ${isActive ? "text-white" : ""}`}>
                        <div className="flex items-center justify-center gap-2 mb-1">
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : isLocked ? <Lock className="w-4 h-4 opacity-60" /> : <StatusIcon className="w-4 h-4" />}
                          <span className="text-sm font-medium">Sintaks {sintaks.syntaxNo}</span>
                        </div>
                        <p className="text-xs opacity-90 leading-tight break-words whitespace-normal">{sintaks.title}</p>
                      </div>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {syntaxes.map((sintaks: any, index: number) => {
                const status = getSintaksStatus(sintaks);
                const StatusIcon = status.icon;
                const completedStagesCount = sintaks.stages?.filter((s: any) => s.status === "selesai").length || 0;
                const sintaksProgress = !sintaks.stages?.length ? 0 : (completedStagesCount / sintaks.stages.length) * 100;

                return (
                  <TabsContent key={sintaks.id} value={`sintaks-${sintaks.syntaxNo}`} className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-blue-900 mb-2">
                            Sintaks {sintaks.syntaxNo}: {sintaks.title}
                          </h3>
                          <p className="text-gray-600 text-sm">{sintaks.description}</p>
                        </div>
                        <Badge className={status.color}>
                          <StatusIcon className="w-4 h-4 mr-1" />
                          {status.label}
                        </Badge>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-gray-600">Progress Sintaks {sintaks.syntaxNo}</p>
                          <p className="text-sm text-blue-900">
                            {completedStagesCount}/{sintaks.stages?.length || 0} Tahap Selesai
                          </p>
                        </div>
                        <Progress value={sintaksProgress} className="h-2" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-blue-900">Tahap-tahap Pengerjaan</h4>

                      <div className="grid gap-4">
                        {(sintaks.stages || []).map((stage: any) => {
                          const getStageIcon = () => {
                            switch (stage.status) {
                              case "selesai":
                                return { Icon: CheckCircle2, color: "text-green-600" };
                              case "belum_selesai":
                                return { Icon: Clock, color: "text-blue-600" };
                              case "belum_mengerjakan":
                              default:
                                return { Icon: Circle, color: "text-gray-400" };
                            }
                          };

                          const { Icon: StageIcon, color: iconColor } = getStageIcon();

                          const getBorderColor = () => {
                            switch (stage.status) {
                              case "selesai":
                                return "border-green-200 bg-green-50";
                              case "belum_selesai":
                                return "border-blue-200 bg-blue-50";
                              default:
                                return "border-gray-200 bg-white";
                            }
                          };

                          const stageBadge = getStageStatusBadge(stage.status);

                          return (
                            <Card key={stage.id} className={`border-2 ${getBorderColor()}`}>
                              <CardContent className="pt-4">
                                <div className="flex items-start gap-3 mb-3">
                                  <div className={`mt-1 ${iconColor}`}>
                                    <StageIcon className="w-6 h-6" />
                                  </div>

                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                      <h5 className="text-blue-900">
                                        Tahap {stage.stageNo}: {stage.title}
                                      </h5>
                                      <Badge className={`${stageBadge.color} text-xs`}>{stageBadge.label}</Badge>
                                    </div>
                                    <p className="text-sm text-gray-600">{stage.subtitle}</p>
                                  </div>
                                </div>

                                <div className="ml-9 space-y-3">
                                  <div className="space-y-2">
                                    <p className="text-xs text-gray-600">Instruksi:</p>
                                    <div className="p-3 bg-white rounded-lg border text-sm text-gray-700">{stage.instruction || "-"}</div>
                                  </div>

                                  {stage.answer && (
                                    <div className="space-y-2">
                                      <p className="text-xs text-gray-600">Jawaban Siswa:</p>
                                      <div className="p-3 bg-white rounded-lg border text-sm text-gray-700 whitespace-pre-wrap">{stage.answer}</div>
                                    </div>
                                  )}

                                  {stage.files?.length > 0 && (
                                    <div className="space-y-2">
                                      <p className="text-xs text-gray-600">File Upload:</p>
                                      <div className="space-y-2">
                                        {stage.files.map((file: any) => (
                                          <a
                                            key={file.id}
                                            href={`http://localhost:5000/uploads/${file.fileUrl}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center justify-between p-3 bg-white rounded-lg border hover:bg-gray-50"
                                          >
                                            <div className="flex items-center gap-2">
                                              <FileText className="w-4 h-4 text-blue-600" />
                                              <span className="text-sm text-gray-700">{file.fileName}</span>
                                            </div>
                                            <Download className="w-4 h-4 text-gray-500" />
                                          </a>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {stage.submissionId && (
                                    <div className="space-y-2">
                                      <p className="text-xs text-gray-600">Ubah Status:</p>
                                      <div className="flex gap-2 flex-wrap">
                                        <Button size="sm" variant={stage.status === "belum_mengerjakan" ? "default" : "outline"} onClick={() => handleUpdateStatus(stage.submissionId, "belum_mengerjakan")}>
                                          Belum Mulai
                                        </Button>
                                        <Button size="sm" variant={stage.status === "belum_selesai" ? "default" : "outline"} onClick={() => handleUpdateStatus(stage.submissionId, "belum_selesai")}>
                                          Proses
                                        </Button>
                                        <Button size="sm" variant={stage.status === "selesai" ? "default" : "outline"} onClick={() => handleUpdateStatus(stage.submissionId, "selesai")}>
                                          Selesai
                                        </Button>
                                      </div>
                                    </div>
                                  )}

                                  {stage.submissionId && (
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <p className="text-xs text-gray-600">Feedback Guru:</p>
                                        {editingFeedback?.submissionId === stage.submissionId ? (
                                          <Button size="sm" onClick={() => handleSaveFeedback(stage.submissionId, sintaks.id, stage.id)} className="h-7 px-3 bg-blue-500 hover:bg-blue-600">
                                            <Send className="w-3 h-3 mr-1" />
                                            Kirim
                                          </Button>
                                        ) : (
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                              setEditingFeedback({
                                                submissionId: stage.submissionId,
                                                sintaksId: sintaks.id,
                                                stageId: stage.id,
                                              });
                                              setFeedbackValue(stage.feedbackText || "");
                                            }}
                                            className="h-7 px-3"
                                          >
                                            <Edit2 className="w-3 h-3 mr-1" />
                                            Edit
                                          </Button>
                                        )}
                                      </div>

                                      {editingFeedback?.submissionId === stage.submissionId ? (
                                        <Textarea value={feedbackValue} onChange={(e) => setFeedbackValue(e.target.value)} className="min-h-[100px] text-sm" placeholder="Tulis feedback untuk siswa..." />
                                      ) : (
                                        <div className="p-3 rounded-lg border text-sm bg-white text-gray-700">
                                          <div className="flex gap-2">
                                            <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                            <p>{stage.feedbackText || "Belum ada feedback."}</p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
