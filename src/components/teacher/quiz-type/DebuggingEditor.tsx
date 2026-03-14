import React from "react";
import { Plus, Trash2, AlertCircle } from "lucide-react";

interface BugLocation {
  id: string;
  line: number;
  description: string;
  fix: string;
}

interface DebuggingData {
  question: string;
  instruction: string;
  code: string;
  bugs: BugLocation[];
  explanation: string;
}

interface DebuggingEditorProps {
  data: Partial<DebuggingData>;
  onChange: (data: DebuggingData) => void;
}

export const DebuggingEditor: React.FC<DebuggingEditorProps> = ({ data, onChange }) => {
  const question = data.question || "";
  const instruction = data.instruction || "Temukan dan perbaiki bug dalam kode berikut";
  const code = data.code || "";
  const bugs = data.bugs || [{ id: "1", line: 1, description: "", fix: "" }];
  const explanation = data.explanation || "";

  const updateQuestion = (question: string) => {
    onChange({ question, instruction, code, bugs, explanation });
  };

  const updateInstruction = (instruction: string) => {
    onChange({ question, instruction, code, bugs, explanation });
  };

  const updateCode = (code: string) => {
    onChange({ question, instruction, code, bugs, explanation });
  };

  const addBug = () => {
    onChange({
      question,
      instruction,
      code,
      bugs: [...bugs, { id: Date.now().toString(), line: 1, description: "", fix: "" }],
      explanation,
    });
  };

  const updateBug = (id: string, field: keyof BugLocation, value: string | number) => {
    onChange({
      question,
      instruction,
      code,
      bugs: bugs.map((bug) => (bug.id === id ? { ...bug, [field]: value } : bug)),
      explanation,
    });
  };

  const removeBug = (id: string) => {
    if (bugs.length > 1) {
      onChange({
        question,
        instruction,
        code,
        bugs: bugs.filter((bug) => bug.id !== id),
        explanation,
      });
    }
  };

  const updateExplanation = (explanation: string) => {
    onChange({ question, instruction, code, bugs, explanation });
  };

  const codeLines = code.split("\n");

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-2">Pertanyaan *</label>
        <textarea
          value={question}
          onChange={(e) => updateQuestion(e.target.value)}
          placeholder="Contoh: Program berikut memiliki beberapa bug. Identifikasi dan perbaiki bug tersebut."
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
        <label className="block text-gray-700 mb-2">Kode dengan Bug *</label>
        <div className="relative">
          <textarea
            value={code}
            onChange={(e) => updateCode(e.target.value)}
            placeholder="Masukkan kode yang berisi bug...
Contoh:
def calculate_average(numbers):
    total = 0
    for num in number:  # Bug: typo 'number' should be 'numbers'
        total += num
    return total / len(numbers)"
            rows={12}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none font-mono text-sm"
            style={{ tabSize: 4 }}
          />
          <div className="absolute top-2 right-2 text-xs text-gray-500 bg-white px-2 py-1 rounded">{codeLines.length} baris</div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-gray-700">Lokasi Bug dan Perbaikan</label>
          <button onClick={addBug} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm">
            <Plus className="w-4 h-4" />
            Tambah Bug
          </button>
        </div>

        <div className="space-y-3">
          {bugs.map((bug, index) => (
            <div key={bug.id} className="p-4 border border-red-200 rounded-lg bg-red-50">
              <div className="flex items-start gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-gray-700">Bug #{index + 1} pada baris:</span>
                    <input
                      type="number"
                      value={bug.line}
                      onChange={(e) => updateBug(bug.id, "line", parseInt(e.target.value) || 1)}
                      min="1"
                      max={codeLines.length}
                      className="w-20 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {bugs.length > 1 && (
                      <button onClick={() => removeBug(bug.id)} className="ml-auto p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Show the code line */}
                  {bug.line > 0 && bug.line <= codeLines.length && (
                    <div className="mb-3 p-2 bg-white border border-red-300 rounded font-mono text-sm">
                      <span className="text-gray-400 mr-2">{bug.line}:</span>
                      <span className="text-gray-800">{codeLines[bug.line - 1]}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div>
                      <label className="block text-gray-700 text-sm mb-1">Deskripsi Bug *</label>
                      <input
                        type="text"
                        value={bug.description}
                        onChange={(e) => updateBug(bug.id, "description", e.target.value)}
                        placeholder="Jelaskan bug yang ada..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm mb-1">Cara Memperbaiki *</label>
                      <textarea
                        value={bug.fix}
                        onChange={(e) => updateBug(bug.id, "fix", e.target.value)}
                        placeholder="Jelaskan cara memperbaiki bug ini..."
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-600">
            💡 <span className="text-gray-700">Tips:</span> Siswa akan diminta untuk mengidentifikasi baris yang berisi bug dan menjelaskan cara memperbaikinya.
          </p>
        </div>
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Penjelasan Lengkap (opsional)</label>
        <textarea
          value={explanation}
          onChange={(e) => updateExplanation(e.target.value)}
          placeholder="Penjelasan lengkap tentang semua bug dan cara memperbaikinya..."
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />
      </div>
    </div>
  );
};
