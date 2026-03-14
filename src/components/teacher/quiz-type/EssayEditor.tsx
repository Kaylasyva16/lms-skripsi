import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Badge } from "../../ui/badge";
import { FileText, Star, Trash2 } from "lucide-react";

/* =======================
   Data Contract (IMPORTANT)
   ======================= */
export interface EssayQuestionData {
  question: string;
  description?: string;
  level: "mudah" | "sedang" | "sulit";
  minWords?: number;
  maxWords?: number;
  rubric: string[]; // ⬅️ WAJIB
  guideline: string;
}

interface EssayEditorProps {
  data?: EssayQuestionData;
  onChange?: (data: EssayQuestionData) => void;
}

export function EssayEditor({ data, onChange }: EssayEditorProps) {
  const [localData, setLocalData] = useState<EssayQuestionData>({
    question: "",
    description: "",
    level: "mudah",
    minWords: 50,
    maxWords: 500,
    rubric: [],
    guideline: "",
    ...(data ?? {}),
  });

  useEffect(() => {
    onChange?.(localData);
  }, [localData, onChange]);

  const [newRubricItem, setNewRubricItem] = useState("");

  const update = (updates: Partial<EssayQuestionData>) => {
    setLocalData((prev) => ({ ...prev, ...updates }));
  };

  const addRubricItem = () => {
    if (!newRubricItem.trim()) return;
    update({
      rubric: [...localData.rubric, newRubricItem.trim()],
    });
    setNewRubricItem("");
  };

  const removeRubricItem = (index: number) => {
    update({
      rubric: localData.rubric.filter((_, i) => i !== index),
    });
  };

  const levelBadge = () => {
    switch (localData.level) {
      case "mudah":
        return <Badge className="bg-green-500">⭐ Mudah</Badge>;
      case "sedang":
        return <Badge className="bg-orange-500">⭐⭐ Sedang</Badge>;
      case "sulit":
        return <Badge className="bg-red-500">⭐⭐⭐ Sulit</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* =======================
          MAIN EDITOR
          ======================= */}
      <Card className="border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-white">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            <CardTitle>✍️ Editor Soal Essay</CardTitle>
          </div>
          <CardDescription>Buat soal essay dengan rubrik penilaian yang jelas</CardDescription>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Question */}
          <div className="space-y-2">
            <Label>Pertanyaan Essay *</Label>
            <Textarea value={localData.question} onChange={(e) => update({ question: e.target.value })} rows={4} placeholder="Tuliskan pertanyaan essay di sini..." />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Petunjuk Tambahan (Opsional)</Label>
            <Textarea value={localData.description} onChange={(e) => update({ description: e.target.value })} rows={3} placeholder="Contoh: Sertakan contoh kode..." />
          </div>

          {/* Guideline (REQUIRED) */}
          <div className="space-y-2">
            <Label>Guideline Penilaian *</Label>
            <Textarea value={localData.guideline} onChange={(e) => update({ guideline: e.target.value })} rows={3} placeholder="Pedoman umum penilaian jawaban essay..." />
          </div>

          {/* Level */}
          <div className="space-y-2">
            <Label>Tingkat Kesulitan</Label>
            <Select value={localData.level} onValueChange={(v: "mudah" | "sedang" | "sulit") => update({ level: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mudah">⭐ Mudah</SelectItem>
                <SelectItem value="sedang">⭐⭐ Sedang</SelectItem>
                <SelectItem value="sulit">⭐⭐⭐ Sulit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Word Limit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Minimal Kata</Label>
              <Input type="number" value={localData.minWords} onChange={(e) => update({ minWords: Number(e.target.value) || 0 })} />
            </div>
            <div>
              <Label>Maksimal Kata</Label>
              <Input type="number" value={localData.maxWords} onChange={(e) => update({ maxWords: Number(e.target.value) || 0 })} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* =======================
          RUBRIC
          ======================= */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle>📋 Rubrik Penilaian</CardTitle>
          <CardDescription>Kriteria detail untuk evaluasi jawaban siswa</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input value={newRubricItem} onChange={(e) => setNewRubricItem(e.target.value)} placeholder="Tambahkan kriteria penilaian..." />
            <Button onClick={addRubricItem}>Tambah</Button>
          </div>

          {localData.rubric.map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
              <span className="text-sm font-medium">{i + 1}</span>
              <p className="flex-1 text-sm">{item}</p>
              <Button size="sm" variant="ghost" onClick={() => removeRubricItem(i)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* =======================
          PREVIEW
          ======================= */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-green-600" />
            Preview Soal
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <Badge variant="outline">✍️ Essay</Badge>
            {levelBadge()}
          </div>

          <h4 className="font-medium">{localData.question || "Pertanyaan akan muncul di sini"}</h4>

          {localData.description && <p className="text-sm italic text-gray-600">💡 {localData.description}</p>}

          <Textarea disabled rows={5} placeholder="Jawaban siswa..." />

          <p className="text-xs text-gray-500">
            Batasan kata: {localData.minWords} – {localData.maxWords}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
