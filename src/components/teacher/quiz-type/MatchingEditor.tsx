import React from 'react';
import { Plus, Trash2, ArrowRight } from 'lucide-react';

interface MatchPair {
  id: string;
  left: string;
  right: string;
}

interface MatchingData {
  question: string;
  instruction: string;
  pairs: MatchPair[];
  explanation: string;
}

interface MatchingEditorProps {
  data: Partial<MatchingData>;
  onChange: (data: MatchingData) => void;
}

export const MatchingEditor: React.FC<MatchingEditorProps> = ({ data, onChange }) => {
  const question = data.question || '';
  const instruction = data.instruction || 'Cocokkan item di sebelah kiri dengan pasangan yang tepat di sebelah kanan';
  const pairs = data.pairs || [
    { id: '1', left: '', right: '' },
    { id: '2', left: '', right: '' }
  ];
  const explanation = data.explanation || '';

  const updateQuestion = (question: string) => {
    onChange({ question, instruction, pairs, explanation });
  };

  const updateInstruction = (instruction: string) => {
    onChange({ question, instruction, pairs, explanation });
  };

  const addPair = () => {
    onChange({
      question,
      instruction,
      pairs: [...pairs, { id: Date.now().toString(), left: '', right: '' }],
      explanation
    });
  };

  const updatePair = (id: string, side: 'left' | 'right', value: string) => {
    onChange({
      question,
      instruction,
      pairs: pairs.map(pair => 
        pair.id === id ? { ...pair, [side]: value } : pair
      ),
      explanation
    });
  };

  const removePair = (id: string) => {
    if (pairs.length > 2) {
      onChange({
        question,
        instruction,
        pairs: pairs.filter(pair => pair.id !== id),
        explanation
      });
    }
  };

  const updateExplanation = (explanation: string) => {
    onChange({ question, instruction, pairs, explanation });
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
        <div className="flex items-center justify-between mb-3">
          <label className="block text-gray-700">Pasangan yang Harus Dicocokkan</label>
          <button
            onClick={addPair}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
          >
            <Plus className="w-4 h-4" />
            Tambah Pasangan
          </button>
        </div>

        <div className="space-y-3">
          {pairs.map((pair, index) => (
            <div key={pair.id} className="flex items-center gap-2">
              <span className="text-gray-500 w-6">{index + 1}.</span>
              
              {/* Left Item */}
              <div className="flex-1">
                <input
                  type="text"
                  value={pair.left}
                  onChange={(e) => updatePair(pair.id, 'left', e.target.value)}
                  placeholder="Item kiri"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />

              {/* Right Item */}
              <div className="flex-1">
                <input
                  type="text"
                  value={pair.right}
                  onChange={(e) => updatePair(pair.id, 'right', e.target.value)}
                  placeholder="Item kanan"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {pairs.length > 2 && (
                <button
                  onClick={() => removePair(pair.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-600">
            💡 <span className="text-gray-700">Preview untuk siswa:</span> Item di sebelah kanan akan diacak, 
            dan siswa harus mencocokkan dengan item di sebelah kiri.
          </p>
        </div>
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
