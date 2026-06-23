"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";

interface TeacherLearningObjectivesProps {
  onNavigate: (page: string) => void;
}

export default function TeacherLearningObjectives({ onNavigate }: TeacherLearningObjectivesProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [cpCode, setCpCode] = useState("CP 3.2");
  const [cpTitle, setCpTitle] = useState("Capaian Pembelajaran");
  const [cpDescription, setCpDescription] = useState("");

  const [tpTitle, setTpTitle] = useState("Tujuan Pembelajaran");
  const [tpDescription, setTpDescription] = useState("");

  const [indicators, setIndicators] = useState<string[]>([""]);

  const courseId = 1;

  useEffect(() => {
    const fetchLearningObjectives = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:5000/api/courses/${courseId}/learning-objectives`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Gagal mengambil capaian pembelajaran");
        }

        setCpCode(data.cp_code || "CP 3.2");
        setCpTitle(data.cp_title || "Capaian Pembelajaran");
        setCpDescription(data.cp_description || "");

        setTpTitle(data.tp_title || "Tujuan Pembelajaran");
        setTpDescription(data.tp_description || "");

        if (Array.isArray(data.indicators) && data.indicators.length > 0) {
          setIndicators(data.indicators.map((item: any) => item.indicator_text || ""));
        } else {
          setIndicators([""]);
        }
      } catch (err) {
        console.error("FETCH LEARNING OBJECTIVES ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningObjectives();
  }, []);

  const handleIndicatorChange = (index: number, value: string) => {
    const updated = [...indicators];
    updated[index] = value;
    setIndicators(updated);
  };

  const addIndicator = () => {
    setIndicators([...indicators, ""]);
  };

  const removeIndicator = (index: number) => {
    const updated = indicators.filter((_, i) => i !== index);
    setIndicators(updated.length > 0 ? updated : [""]);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const filteredIndicators = indicators.map((item) => item.trim()).filter((item) => item.length > 0);

      if (!cpDescription.trim()) {
        alert("Deskripsi capaian pembelajaran wajib diisi");
        return;
      }

      if (!tpDescription.trim()) {
        alert("Deskripsi tujuan pembelajaran wajib diisi");
        return;
      }

      if (filteredIndicators.length === 0) {
        alert("Minimal satu indikator wajib diisi");
        return;
      }

      const res = await fetch(`http://localhost:5000/api/guru/courses/${courseId}/learning-objectives`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cp_code: cpCode,
          cp_title: cpTitle,
          cp_description: cpDescription,
          tp_title: tpTitle,
          tp_description: tpDescription,
          indicators: filteredIndicators,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal menyimpan capaian pembelajaran");
      }

      alert("Capaian pembelajaran berhasil disimpan");
      onNavigate("teacher-dashboard");
    } catch (err) {
      console.error("SAVE LEARNING OBJECTIVES ERROR:", err);
      alert("Gagal menyimpan capaian pembelajaran");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500">Memuat data capaian pembelajaran...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4">
        <button type="button" onClick={() => onNavigate("teacher-dashboard")} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Kembali ke Dashboard</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Capaian & Tujuan Pembelajaran</h1>
            <p className="text-gray-500 mt-1">Percabangan dan Perulangan Pemrograman Terstruktur</p>
          </div>

          <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white px-6">
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Capaian Pembelajaran</CardTitle>
              <CardDescription>Kompetensi yang ingin dicapai siswa</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">KODE CP</label>
                <Input value={cpCode} onChange={(e) => setCpCode(e.target.value)} className="max-w-xs" placeholder="Contoh: CP 3.2" />
                <p className="text-sm text-gray-400 mt-2">Ditampilkan sebagai badge di dashboard siswa</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">JUDUL</label>
                <Input value={cpTitle} onChange={(e) => setCpTitle(e.target.value)} placeholder="Capaian Pembelajaran" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">DESKRIPSI</label>
                <textarea
                  value={cpDescription}
                  onChange={(e) => setCpDescription(e.target.value)}
                  rows={5}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Masukkan deskripsi capaian pembelajaran"
                />
                <p className="text-sm text-gray-400 text-right mt-2">{cpDescription.length} karakter</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tujuan Pembelajaran</CardTitle>
              <CardDescription>Hasil yang diharapkan dari siswa</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">JUDUL</label>
                <Input value={tpTitle} onChange={(e) => setTpTitle(e.target.value)} placeholder="Tujuan Pembelajaran" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">DESKRIPSI</label>
                <textarea
                  value={tpDescription}
                  onChange={(e) => setTpDescription(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Masukkan deskripsi tujuan pembelajaran"
                />
                <p className="text-sm text-gray-400 text-right mt-2">{tpDescription.length} karakter</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle>Indikator Tujuan Pembelajaran</CardTitle>
                  <CardDescription>Rincian indikator yang akan ditampilkan kepada siswa</CardDescription>
                </div>

                <Button type="button" variant="outline" onClick={addIndicator} className="text-green-700 border-green-200 hover:bg-green-50">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Indikator
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {indicators.map((indicator, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-semibold shrink-0 mt-2">{index + 1}</div>

                  <textarea
                    value={indicator}
                    onChange={(e) => handleIndicatorChange(index, e.target.value)}
                    rows={2}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder={`Masukkan indikator ${index + 1}`}
                  />

                  <Button type="button" variant="outline" size="sm" onClick={() => removeIndicator(index)} className="mt-2 text-red-600 border-red-200 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
