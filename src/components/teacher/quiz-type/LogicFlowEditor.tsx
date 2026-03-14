import React from "react";
import { Plus, Trash2, ArrowDown } from "lucide-react";

interface FlowBlock {
  id: string;
  code: string;
  type: "start" | "process" | "condition" | "end";
}

interface LogicFlowData {
  question: string;
  instruction: string;
  blocks: FlowBlock[];
  correctOrder: string[]; // array of block IDs in correct order
  explanation: string;
}

interface LogicFlowEditorProps {
  data: Partial<LogicFlowData>;
  onChange: (data: LogicFlowData) => void;
}

export const LogicFlowEditor: React.FC<LogicFlowEditorProps> = ({ data, onChange }) => {
  const question = data.question || "";
  const instruction = data.instruction || "Susun blok kode berikut dalam urutan yang benar";
  const blocks = data.blocks || [
    { id: "1", code: "", type: "start" },
    { id: "2", code: "", type: "process" },
    { id: "3", code: "", type: "end" },
  ];
  const correctOrder = data.correctOrder || blocks.map((b) => b.id);
  const explanation = data.explanation || "";

  const blockTypes = [
    { value: "start", label: "Start", color: "bg-green-100 border-green-300" },
    { value: "process", label: "Process", color: "bg-blue-100 border-blue-300" },
    { value: "condition", label: "Condition", color: "bg-yellow-100 border-yellow-300" },
    { value: "end", label: "End", color: "bg-red-100 border-red-300" },
  ];

  const updateQuestion = (question: string) => {
    onChange({ question, instruction, blocks, correctOrder, explanation });
  };

  const updateInstruction = (instruction: string) => {
    onChange({ question, instruction, blocks, correctOrder, explanation });
  };

  const addBlock = () => {
    const newBlock = { id: Date.now().toString(), code: "", type: "process" as const };
    onChange({
      question,
      instruction,
      blocks: [...blocks, newBlock],
      correctOrder: [...correctOrder, newBlock.id],
      explanation,
    });
  };

  const updateBlock = (id: string, field: "code" | "type", value: string) => {
    onChange({
      question,
      instruction,
      blocks: blocks.map((block) => (block.id === id ? { ...block, [field]: value } : block)),
      correctOrder,
      explanation,
    });
  };

  const removeBlock = (id: string) => {
    if (blocks.length > 2) {
      onChange({
        question,
        instruction,
        blocks: blocks.filter((block) => block.id !== id),
        correctOrder: correctOrder.filter((blockId) => blockId !== id),
        explanation,
      });
    }
  };

  const moveBlockInOrder = (index: number, direction: "up" | "down") => {
    const newOrder = [...correctOrder];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex >= 0 && targetIndex < newOrder.length) {
      [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
      onChange({ question, instruction, blocks, correctOrder: newOrder, explanation });
    }
  };

  const updateExplanation = (explanation: string) => {
    onChange({ question, instruction, blocks, correctOrder, explanation });
  };

  const getBlockColor = (type: string) => {
    return blockTypes.find((t) => t.value === type)?.color || "bg-gray-100 border-gray-300";
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-2">Pertanyaan *</label>
        <textarea
          value={question}
          onChange={(e) => updateQuestion(e.target.value)}
          placeholder="Contoh: Susun alur program untuk menghitung nilai rata-rata"
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
          <label className="block text-gray-700">Blok Kode</label>
          <button onClick={addBlock} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm">
            <Plus className="w-4 h-4" />
            Tambah Blok
          </button>
        </div>

        <div className="space-y-3">
          {blocks.map((block, index) => (
            <div key={block.id} className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <select value={block.type} onChange={(e) => updateBlock(block.id, "type", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
                      {blockTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {blocks.length > 2 && (
                      <button onClick={() => removeBlock(block.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className={`p-3 border-2 rounded-lg ${getBlockColor(block.type)}`}>
                    <textarea
                      value={block.code}
                      onChange={(e) => updateBlock(block.id, "code", e.target.value)}
                      placeholder={`Kode untuk blok ${blockTypes.find((t) => t.value === block.type)?.label}...`}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded bg-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Correct Order */}
      <div>
        <label className="block text-gray-700 mb-3">Urutan yang Benar</label>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
          <p className="text-sm text-gray-600 mb-3">Atur urutan blok yang benar (akan diacak saat ditampilkan ke siswa):</p>
          <div className="space-y-2">
            {correctOrder.map((blockId, index) => {
              const block = blocks.find((b) => b.id === blockId);
              if (!block) return null;

              return (
                <div key={blockId} className="flex items-center gap-2">
                  <div className="flex flex-col gap-1">
                    <button onClick={() => moveBlockInOrder(index, "up")} disabled={index === 0} className="p-1 text-gray-600 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed">
                      <ArrowDown className="w-4 h-4 rotate-180" />
                    </button>
                    <button onClick={() => moveBlockInOrder(index, "down")} disabled={index === correctOrder.length - 1} className="p-1 text-gray-600 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed">
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-gray-500 w-6">{index + 1}.</span>
                    <div className={`flex-1 p-2 border-2 rounded-lg ${getBlockColor(block.type)}`}>
                      <div className="text-sm text-gray-700">
                        <span className="px-2 py-1 bg-white rounded text-xs mr-2">{blockTypes.find((t) => t.value === block.type)?.label}</span>
                        {block.code || "(kosong)"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Penjelasan (opsional)</label>
        <textarea
          value={explanation}
          onChange={(e) => updateExplanation(e.target.value)}
          placeholder="Penjelasan alur logika yang benar..."
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />
      </div>
    </div>
  );
};
