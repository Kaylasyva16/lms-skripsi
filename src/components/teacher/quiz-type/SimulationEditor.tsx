import React from "react";
import { Plus, Trash2, Play } from "lucide-react";

interface SimulationStep {
  id: string;
  action: string;
  expectedResult: string;
}

interface SimulationData {
  question: string;
  instruction: string;
  scenario: string;
  steps: SimulationStep[];
  successCriteria: string[];
  explanation: string;
}

interface SimulationEditorProps {
  data: Partial<SimulationData>;
  onChange: (data: SimulationData) => void;
}

export const SimulationEditor: React.FC<SimulationEditorProps> = ({ data, onChange }) => {
  const question = data.question || "";
  const instruction = data.instruction || "Lakukan simulasi sesuai dengan skenario yang diberikan";
  const scenario = data.scenario || "";
  const steps = data.steps || [{ id: "1", action: "", expectedResult: "" }];
  const successCriteria = data.successCriteria || [""];
  const explanation = data.explanation || "";

  const updateQuestion = (question: string) => {
    onChange({ question, instruction, scenario, steps, successCriteria, explanation });
  };

  const updateInstruction = (instruction: string) => {
    onChange({ question, instruction, scenario, steps, successCriteria, explanation });
  };

  const updateScenario = (scenario: string) => {
    onChange({ question, instruction, scenario, steps, successCriteria, explanation });
  };

  const addStep = () => {
    onChange({
      question,
      instruction,
      scenario,
      steps: [...steps, { id: Date.now().toString(), action: "", expectedResult: "" }],
      successCriteria,
      explanation,
    });
  };

  const updateStep = (id: string, field: "action" | "expectedResult", value: string) => {
    onChange({
      question,
      instruction,
      scenario,
      steps: steps.map((step) => (step.id === id ? { ...step, [field]: value } : step)),
      successCriteria,
      explanation,
    });
  };

  const removeStep = (id: string) => {
    if (steps.length > 1) {
      onChange({
        question,
        instruction,
        scenario,
        steps: steps.filter((step) => step.id !== id),
        successCriteria,
        explanation,
      });
    }
  };

  const addCriteria = () => {
    onChange({
      question,
      instruction,
      scenario,
      steps,
      successCriteria: [...successCriteria, ""],
      explanation,
    });
  };

  const updateCriteria = (index: number, value: string) => {
    onChange({
      question,
      instruction,
      scenario,
      steps,
      successCriteria: successCriteria.map((c, i) => (i === index ? value : c)),
      explanation,
    });
  };

  const removeCriteria = (index: number) => {
    if (successCriteria.length > 1) {
      onChange({
        question,
        instruction,
        scenario,
        steps,
        successCriteria: successCriteria.filter((_, i) => i !== index),
        explanation,
      });
    }
  };

  const updateExplanation = (explanation: string) => {
    onChange({ question, instruction, scenario, steps, successCriteria, explanation });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-2">Pertanyaan *</label>
        <textarea
          value={question}
          onChange={(e) => updateQuestion(e.target.value)}
          placeholder="Contoh: Simulasikan proses deployment aplikasi web ke production server"
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Instruksi</label>
        <input
          type="text"
          value={instruction}
          onChange={(e) => updateInstruction(e.target.value)}
          placeholder="Instruksi untuk siswa..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Skenario *</label>
        <textarea
          value={scenario}
          onChange={(e) => updateScenario(e.target.value)}
          placeholder="Deskripsikan skenario simulasi secara detail...
Contoh:
Anda adalah seorang DevOps engineer yang bertugas untuk melakukan deployment aplikasi web. 
Server production sudah tersedia dengan spesifikasi tertentu. Database sudah dikonfigurasi. 
Tugas Anda adalah melakukan deployment dengan langkah-langkah yang benar."
          rows={5}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-gray-700">Langkah-langkah yang Harus Dilakukan</label>
          <button onClick={addStep} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm">
            <Plus className="w-4 h-4" />
            Tambah Langkah
          </button>
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={step.id} className="p-4 border border-gray-300 rounded-lg bg-gray-50">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full flex-shrink-0 mt-1">{index + 1}</div>

                <div className="flex-1 space-y-2">
                  <div>
                    <label className="block text-gray-700 text-sm mb-1">Aksi yang Dilakukan *</label>
                    <input
                      type="text"
                      value={step.action}
                      onChange={(e) => updateStep(step.id, "action", e.target.value)}
                      placeholder="Contoh: Upload file aplikasi ke server"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm mb-1">Hasil yang Diharapkan *</label>
                    <textarea
                      value={step.expectedResult}
                      onChange={(e) => updateStep(step.id, "expectedResult", e.target.value)}
                      placeholder="Contoh: File berhasil terupload, aplikasi dapat diakses melalui browser"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none bg-white"
                    />
                  </div>
                </div>

                {steps.length > 1 && (
                  <button onClick={() => removeStep(step.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-gray-700">Kriteria Keberhasilan</label>
          <button onClick={addCriteria} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm">
            <Plus className="w-4 h-4" />
            Tambah Kriteria
          </button>
        </div>

        <div className="space-y-2">
          {successCriteria.map((criteria, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-gray-500 w-6">✓</span>
              <input
                type="text"
                value={criteria}
                onChange={(e) => updateCriteria(index, e.target.value)}
                placeholder="Contoh: Aplikasi dapat diakses tanpa error"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {successCriteria.length > 1 && (
                <button onClick={() => removeCriteria(index)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-600">
            💡 <span className="text-gray-700">Info:</span> Siswa akan dinilai berdasarkan kelengkapan langkah yang dilakukan dan pencapaian kriteria keberhasilan.
          </p>
        </div>
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Penjelasan Lengkap (opsional)</label>
        <textarea
          value={explanation}
          onChange={(e) => updateExplanation(e.target.value)}
          placeholder="Penjelasan lengkap tentang simulasi, best practices, dan hal-hal yang perlu diperhatikan..."
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />
      </div>

      {/* Preview Info */}
      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-start gap-3">
          <Play className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-gray-800 mb-1">Preview untuk Siswa</h4>
            <p className="text-sm text-gray-600">Siswa akan melihat skenario dan diminta untuk melakukan simulasi sesuai langkah-langkah. Mereka akan mencentang setiap langkah yang sudah dilakukan dan menjelaskan hasilnya.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
