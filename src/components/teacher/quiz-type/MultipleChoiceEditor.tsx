import React from "react";
import { Plus, Trash2, Check } from "lucide-react";

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface MultipleChoiceData {
  question: string;
  options: Option[];
  explanation: string;
}

interface MultipleChoiceEditorProps {
  data: Partial<MultipleChoiceData>;
  onChange: (data: MultipleChoiceData) => void;
}

export const MultipleChoiceEditor: React.FC<MultipleChoiceEditorProps> = ({ data, onChange }) => {
  const question = data.question || "";
  const options = data.options || [
    { id: "1", text: "", isCorrect: false },
    { id: "2", text: "", isCorrect: false },
  ];
  const explanation = data.explanation || "";

  const updateQuestion = (question: string) => {
    onChange({ question, options, explanation });
  };

  const updateOption = (id: string, text: string) => {
    onChange({
      question,
      options: options.map((opt) => (opt.id === id ? { ...opt, text } : opt)),
      explanation,
    });
  };

  const toggleCorrect = (id: string) => {
    onChange({
      question,
      options: options.map((opt) => (opt.id === id ? { ...opt, isCorrect: !opt.isCorrect } : opt)),
      explanation,
    });
  };

  const addOption = () => {
    onChange({
      question,
      options: [...options, { id: Date.now().toString(), text: "", isCorrect: false }],
      explanation,
    });
  };

  const removeOption = (id: string) => {
    if (options.length > 2) {
      onChange({
        question,
        options: options.filter((opt) => opt.id !== id),
        explanation,
      });
    }
  };

  const updateExplanation = (explanation: string) => {
    onChange({ question, options, explanation });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-2">Pertanyaan *</label>
        <textarea
          value={question}
          onChange={(e) => updateQuestion(e.target.value)}
          placeholder="Tulis pertanyaan di sini..."
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-gray-700">Pilihan Jawaban</label>
          <button onClick={addOption} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm">
            <Plus className="w-4 h-4" />
            Tambah Opsi
          </button>
        </div>

        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={option.id} className="flex items-center gap-2">
              <span className="text-gray-500 w-6">{String.fromCharCode(65 + index)}.</span>
              <input
                type="text"
                value={option.text}
                onChange={(e) => updateOption(option.id, e.target.value)}
                placeholder={`Opsi ${String.fromCharCode(65 + index)}`}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={() => toggleCorrect(option.id)}
                className={`p-2 rounded-lg transition-colors ${option.isCorrect ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}
                title={option.isCorrect ? "Jawaban benar" : "Tandai sebagai jawaban benar"}
              >
                <Check className="w-5 h-5" />
              </button>
              {options.length > 2 && (
                <button onClick={() => removeOption(option.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2">Klik ikon ✓ untuk menandai jawaban yang benar</p>
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Penjelasan (opsional)</label>
        <textarea
          value={explanation}
          onChange={(e) => updateExplanation(e.target.value)}
          placeholder="Penjelasan untuk jawaban yang benar..."
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />
      </div>
    </div>
  );
};
