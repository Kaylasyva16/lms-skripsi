import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import { Slider } from "../ui/slider";
import { Download, FileText, CheckCircle2, Clock, XCircle, Star, MessageSquare, ArrowLeft } from "lucide-react";

interface TeacherEvaluationProps {
  onNavigate: (page: string) => void;
  projectId: number | string;
}

interface SummaryData {
  pending: number;
  graded: number;
  late: number;
  averageScore: number;
}
interface SubmissionItem {
  id: number;
  projectId: number;
  submittedAt: string;
  deadline?: string;
  status: "pending" | "graded" | "late";
  finalScore?: number | null;
  fileName?: string | null;
  fileUrl?: string | null;
  fileSize?: number | null;
  fileSizeLabel?: string | null;
  title: string;
  subtitle: string;
  projectTitle: string;
}

interface RubricItem {
  id: number;
  name: string;
  weight: number;
  score?: number | null;
  note?: string | null;
}

interface SubmissionDetail {
  id: number;
  projectId: number;
  projectTitle: string;
  submittedAt: string;
  deadline?: string;
  status: "pending" | "graded" | "late";
  fileName?: string | null;
  fileUrl?: string | null;
  fileSize?: number | null;
  fileSizeLabel?: string | null;
  teacherNote?: string | null;
  finalScore?: number | null;
  student?: {
    id: number;
    nama: string;
    kelas: string;
    nis: string;
  } | null;
  group?: {
    id: number;
    groupName: string;
    className: string;
    members: Array<{
      id: number;
      nama: string;
      kelas: string;
      nis: string;
    }>;
  } | null;
  rubrics: RubricItem[];
}

export default function TeacherEvaluation({ onNavigate, projectId }: TeacherEvaluationProps) {
  const [summary, setSummary] = useState<SummaryData>({
    pending: 0,
    graded: 0,
    late: 0,
    averageScore: 0,
  });

  const [tab, setTab] = useState<"pending" | "graded">("pending");
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<number | null>(null);
  const [detail, setDetail] = useState<SubmissionDetail | null>(null);

  const [scores, setScores] = useState<Record<number, number>>({});
  const [feedback, setFeedback] = useState("");
  const [rubricNotes, setRubricNotes] = useState<Record<number, string>>({});

  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://localhost:5000",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const getInitials = (text: string) => {
    return text
      .split(" ")
      .map((x) => x[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const formatDate = (value?: string) => {
    if (!value) return "-";
    return new Date(value).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusLabel = (status?: string) => {
    if (status === "graded") return "Sudah Dinilai";
    if (status === "late") return "Terlambat";
    return "Menunggu Penilaian";
  };

  const getStatusBadgeClass = (status?: string) => {
    if (status === "graded") return "text-green-600 border-green-600";
    if (status === "late") return "text-red-600 border-red-600";
    return "text-yellow-600 border-yellow-600";
  };

  const fetchSummary = async () => {
    try {
      setLoadingSummary(true);
      const res = await api.get(`/api/guru/projects/${projectId}/review-summary`);
      console.log("SUMMARY RESPONSE:", res.data);

      setSummary({
        pending: Number(res.data.pending || 0),
        graded: Number(res.data.graded || 0),
        late: Number(res.data.late || 0),
        averageScore: Number(res.data.averageScore || 0),
      });
    } catch (err: any) {
      console.error("Gagal ambil summary:", err);
      console.error("Response data:", err.response?.data);
      console.error("Status:", err.response?.status);
    } finally {
      setLoadingSummary(false);
    }
  };

  const fetchSubmissions = async (statusValue: "pending" | "graded") => {
    try {
      setLoadingSubmissions(true);
      const res = await api.get(`/api/guru/projects/${projectId}/review-submissions?status=${statusValue}`);
      console.log("SUBMISSIONS RESPONSE:", res.data);

      const data = Array.isArray(res.data) ? res.data : [];
      setSubmissions(data);

      if (data.length === 0) {
        setSelectedSubmissionId(null);
        setDetail(null);
        setScores({});
        setRubricNotes({});
        setFeedback("");
        return;
      }

      setSelectedSubmissionId((prev) => {
        if (prev && data.some((item) => item.id === prev)) return prev;
        return data[0].id;
      });
    } catch (err: any) {
      console.error("Gagal ambil submissions:", err);
      console.error("Response data:", err.response?.data);
      console.error("Status:", err.response?.status);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const fetchDetail = async (submissionId: number) => {
    try {
      setLoadingDetail(true);
      const res = await api.get(`/api/guru/project-submissions/${submissionId}`);
      console.log("DETAIL RESPONSE:", res.data);

      const data: SubmissionDetail = res.data;
      setDetail(data);
      setFeedback(data.teacherNote || "");

      const nextScores: Record<number, number> = {};
      const nextNotes: Record<number, string> = {};

      (data.rubrics || []).forEach((rubric) => {
        nextScores[rubric.id] = Number(rubric.score ?? 0);
        nextNotes[rubric.id] = rubric.note || "";
      });

      setScores(nextScores);
      setRubricNotes(nextNotes);
    } catch (err: any) {
      console.error("Gagal ambil detail:", err);
      console.error("Response data:", err.response?.data);
      console.error("Status:", err.response?.status);
    } finally {
      setLoadingDetail(false);
    }
  };

  const saveGrade = async () => {
    if (!detail) return;

    try {
      setSaving(true);

      console.log("KIRIM RUBRICS:", detail.rubrics);

      await api.put(`/api/guru/project-submissions/${detail.id}/grade`, {
        teacherNote: feedback,
        rubrics: detail.rubrics.map((rubric) => ({
          rubricId: rubric.id,
          score: Number(scores[rubric.id] ?? 0),
          note: rubricNotes[rubric.id] || "",
        })),
      });

      await fetchSummary();
      await fetchSubmissions(tab);
      await fetchDetail(detail.id);

      alert("Penilaian berhasil disimpan");
    } catch (err: any) {
      console.error("Gagal simpan penilaian:", err);
      console.error("Response data:", err.response?.data);
      console.error("Status:", err.response?.status);
      alert("Gagal menyimpan penilaian");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [projectId]);

  useEffect(() => {
    fetchSubmissions(tab);
  }, [projectId, tab]);

  useEffect(() => {
    if (selectedSubmissionId) {
      fetchDetail(selectedSubmissionId);
    }
  }, [selectedSubmissionId]);

  const totalScore = useMemo(() => {
    if (!detail) return 0;

    const hasRubricScores = detail.rubrics?.some((rubric) => rubric.score !== null && rubric.score !== undefined);

    if (!hasRubricScores) {
      return Number(detail.finalScore ?? 0);
    }

    const total = detail.rubrics.reduce((acc, rubric) => {
      const score = Number(scores[rubric.id] ?? rubric.score ?? 0);
      const weight = Number(rubric.weight ?? 0);
      return acc + (score * weight) / 100;
    }, 0);

    return Math.round(total);
  }, [detail, scores]);

  const getGrade = (score: number) => {
    if (score >= 90) return { grade: "A", color: "text-green-600" };
    if (score >= 80) return { grade: "B", color: "text-blue-600" };
    if (score >= 70) return { grade: "C", color: "text-yellow-600" };
    if (score >= 60) return { grade: "D", color: "text-orange-600" };
    return { grade: "E", color: "text-red-600" };
  };

  const rubricSource = detail?.rubrics ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button variant="ghost" onClick={() => onNavigate("teacher-dashboard")} className="mb-6 text-blue-600">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kembali ke Dashboard
      </Button>

      <div className="mb-8">
        <h1 className="text-blue-900 mb-2">Evaluasi Proyek Siswa</h1>
        <p className="text-gray-600">Nilai dan berikan feedback untuk proyek yang telah dikumpulkan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Menunggu Penilaian</p>
                <h3 className="text-yellow-700">{loadingSummary ? "..." : summary.pending}</h3>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Sudah Dinilai</p>
                <h3 className="text-green-700">{loadingSummary ? "..." : summary.graded}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Rata-rata Nilai</p>
                <h3 className="text-blue-700">{loadingSummary ? "..." : summary.averageScore}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Star className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Terlambat</p>
                <h3 className="text-red-700">{loadingSummary ? "..." : summary.late}</h3>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <XCircle className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Pengumpulan</CardTitle>
              <CardDescription>Proyek yang telah dikumpulkan siswa</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={tab} onValueChange={(value) => setTab(value as "pending" | "graded")} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="pending">
                    Pending
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {summary.pending}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="graded">
                    Dinilai
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {summary.graded}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-3">
                {loadingSubmissions ? (
                  <p className="text-sm text-gray-500">Memuat data...</p>
                ) : submissions.length === 0 ? (
                  <p className="text-sm text-gray-500">Belum ada pengumpulan.</p>
                ) : (
                  submissions.map((submission) => {
                    const isActive = selectedSubmissionId === submission.id;
                    const isPending = submission.status === "pending" || submission.status === "late";

                    return (
                      <Card
                        key={submission.id}
                        onClick={() => setSelectedSubmissionId(submission.id)}
                        className={`cursor-pointer hover:shadow-md transition-shadow ${isPending ? "border-2 border-yellow-200 bg-yellow-50" : ""} ${isActive ? "ring-2 ring-blue-400" : ""}`}
                      >
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarFallback className={`text-white ${isPending ? "bg-blue-500" : "bg-green-500"}`}>{getInitials(submission.title)}</AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="text-blue-900 truncate">{submission.title}</h4>
                                {submission.status === "graded" && <Badge className="bg-green-500">{submission.finalScore ?? 0}</Badge>}
                              </div>

                              <p className="text-sm text-gray-600 mb-2">{submission.subtitle}</p>
                              <p className="text-sm text-gray-700 mb-2">{submission.projectTitle}</p>

                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                {submission.status === "graded" ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Clock className="w-3 h-3" />}
                                <span>{formatDate(submission.submittedAt)}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detail Pengumpulan</CardTitle>
              <CardDescription>
                {loadingDetail
                  ? "Memuat detail..."
                  : detail
                  ? `${detail.projectTitle} - ${detail.student ? `${detail.student.nama} (${detail.student.kelas})` : detail.group ? `${detail.group.groupName} (${detail.group.className})` : "-"}`
                  : "Pilih submission dari daftar"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {!detail && <div className="bg-gray-50 border rounded-lg p-4 text-sm text-gray-500">Belum ada submission yang bisa dinilai.</div>}

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Waktu Pengumpulan</p>
                    <p className="text-blue-900">{detail ? formatDate(detail.submittedAt) : "-"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tenggat</p>
                    <p className="text-blue-900">{detail?.deadline ? formatDate(detail.deadline) : "-"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <Badge variant="outline" className={detail ? getStatusBadgeClass(detail.status) : "text-gray-500 border-gray-400"}>
                      {detail ? getStatusLabel(detail.status) : "Belum Ada Submission"}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">File yang Dikumpulkan</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {detail?.fileUrl ? (
                        <>
                          <a href={`http://localhost:5000/uploads/${detail.fileUrl}`} target="_blank" rel="noreferrer" className="w-full">
                            <Button size="sm" variant="outline" className="w-full justify-start overflow-hidden">
                              <Download className="w-4 h-4 mr-2 shrink-0" />
                              <span className="truncate block">{detail.fileName}</span>
                            </Button>
                          </a>
                          <span className="text-xs text-gray-500">{detail.fileSizeLabel || "-"}</span>
                        </>
                      ) : (
                        <Button size="sm" variant="outline" disabled>
                          <Download className="w-4 h-4 mr-2" />
                          Belum ada file
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 mb-1">Catatan Guru</p>
                    <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">{detail?.teacherNote ? detail.teacherNote : "Belum ada catatan."}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-blue-900 mb-4">Rubrik Penilaian</h3>

                <div className="space-y-6">
                  {rubricSource.length === 0 ? (
                    <p className="text-sm text-gray-500">Rubrik belum tersedia untuk project ini.</p>
                  ) : (
                    rubricSource.map((rubric) => (
                      <div key={rubric.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="text-blue-900">{rubric.name}</h4>
                            <p className="text-sm text-gray-600">Bobot: {rubric.weight}%</p>
                          </div>
                          <span className="text-2xl text-blue-600">{scores[rubric.id] ?? rubric.score ?? 0}</span>
                        </div>

                        <Slider
                          value={[scores[rubric.id] ?? rubric.score ?? 0]}
                          onValueChange={(value) =>
                            setScores((prev) => ({
                              ...prev,
                              [rubric.id]: value[0],
                            }))
                          }
                          max={100}
                          step={5}
                          disabled={!detail}
                          className="mb-4"
                        />

                        <Textarea
                          placeholder="Catatan untuk rubrik ini..."
                          rows={3}
                          value={rubricNotes[rubric.id] ?? ""}
                          onChange={(e) =>
                            setRubricNotes((prev) => ({
                              ...prev,
                              [rubric.id]: e.target.value,
                            }))
                          }
                          disabled={!detail}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Nilai Total</p>
                    <h2 className="text-white">{detail ? totalScore : 0}</h2>
                  </div>

                  <div className="text-right">
                    <p className="text-sm opacity-90 mb-1">Grade</p>
                    <h2 className="text-white">{detail ? getGrade(totalScore).grade : "-"}</h2>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-blue-900 mb-3">Feedback untuk Siswa</h4>
                <Textarea placeholder="Berikan komentar, saran, atau apresiasi untuk siswa..." rows={6} value={feedback} onChange={(e) => setFeedback(e.target.value)} disabled={!detail} />
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-blue-500 hover:bg-blue-600" onClick={saveGrade} disabled={!detail || saving}>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {saving ? "Menyimpan..." : "Simpan Penilaian"}
                </Button>

                <Button variant="outline" className="flex-1" disabled>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Kirim untuk Revisi
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl text-blue-900 mb-1">{submissions.length}</p>
                <p className="text-sm text-gray-600">Submission Ditampilkan</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl text-blue-900 mb-1">{summary.averageScore}</p>
                <p className="text-sm text-gray-600">Rata-rata Nilai</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl text-blue-900 mb-1">{summary.pending + summary.graded === 0 ? 0 : Math.round((summary.graded / (summary.pending + summary.graded)) * 100)}%</p>
                <p className="text-sm text-gray-600">Tingkat Selesai</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
