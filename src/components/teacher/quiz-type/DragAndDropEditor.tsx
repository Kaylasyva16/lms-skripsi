import React from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface DragItem {
  id: string;
  text: string;
}

interface DropZone {
  id: string;
  label: string;
  correctItemIds: string[];
}

interface DragAndDropData {
  question: string;
  instruction: string;
  items: DragItem[];
  dropZones: DropZone[];
  explanation: string;
}

interface DragAndDropEditorProps {
  data: Partial<DragAndDropData>;
  onChange: (data: DragAndDropData) => void;
}

export const DragAndDropEditor: React.FC<DragAndDropEditorProps> = ({ data, onChange }) => {
  const question = data.question || '';
  const instruction = data.instruction || 'Seret item ke zona yang sesuai';
  const items = data.items || [{ id: '1', text: '' }];
  const dropZones = data.dropZones || [{ id: '1', label: 'Zona 1', correctItemIds: [] }];
  const explanation = data.explanation || '';

  const updateQuestion = (question: string) => {
    onChange({ question, instruction, items, dropZones, explanation });
  };

  const updateInstruction = (instruction: string) => {
    onChange({ question, instruction, items, dropZones, explanation });
  };

  const addItem = () => {
    onChange({
      question,
      instruction,
      items: [...items, { id: Date.now().toString(), text: '' }],
      dropZones,
      explanation
    });
  };

  const updateItem = (id: string, text: string) => {
    onChange({
      question,
      instruction,
      items: items.map(item => item.id === id ? { ...item, text } : item),
      dropZones,
      explanation
    });
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      onChange({
        question,
        instruction,
        items: items.filter(item => item.id !== id),
        dropZones: dropZones.map(zone => ({
          ...zone,
          correctItemIds: zone.correctItemIds.filter(itemId => itemId !== id)
        })),
        explanation
      });
    }
  };

  const addDropZone = () => {
    onChange({
      question,
      instruction,
      items,
      dropZones: [
        ...dropZones,
        { id: Date.now().toString(), label: `Zona ${dropZones.length + 1}`, correctItemIds: [] }
      ],
      explanation
    });
  };

  const updateDropZone = (id: string, label: string) => {
    onChange({
      question,
      instruction,
      items,
      dropZones: dropZones.map(zone => zone.id === id ? { ...zone, label } : zone),
      explanation
    });
  };

  const removeDropZone = (id: string) => {
    if (dropZones.length > 1) {
      onChange({
        question,
        instruction,
        items,
        dropZones: dropZones.filter(zone => zone.id !== id),
        explanation
      });
    }
  };

  const toggleItemInZone = (zoneId: string, itemId: string) => {
    onChange({
      question,
      instruction,
      items,
      dropZones: dropZones.map(zone => {
        if (zone.id === zoneId) {
          const correctItemIds = zone.correctItemIds.includes(itemId)
            ? zone.correctItemIds.filter(id => id !== itemId)
            : [...zone.correctItemIds, itemId];
          return { ...zone, correctItemIds };
        }
        return zone;
      }),
      explanation
    });
  };

  const updateExplanation = (explanation: string) => {
    onChange({ question, instruction, items, dropZones, explanation });
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

      {/* Drag Items */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-gray-700">Item yang Dapat Diseret</label>
          <button
            onClick={addItem}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
          >
            <Plus className="w-4 h-4" />
            Tambah Item
          </button>
        </div>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={item.id} className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-gray-400" />
              <span className="text-gray-500 w-6">{index + 1}.</span>
              <input
                type="text"
                value={item.text}
                onChange={(e) => updateItem(item.id, e.target.value)}
                placeholder={`Item ${index + 1}`}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {items.length > 1 && (
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Drop Zones */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-gray-700">Zona Drop</label>
          <button
            onClick={addDropZone}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
          >
            <Plus className="w-4 h-4" />
            Tambah Zona
          </button>
        </div>
        <div className="space-y-3">
          {dropZones.map((zone, index) => (
            <div key={zone.id} className="p-3 border border-gray-300 rounded-lg bg-gray-50">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={zone.label}
                  onChange={(e) => updateDropZone(zone.id, e.target.value)}
                  placeholder={`Nama zona ${index + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                />
                {dropZones.length > 1 && (
                  <button
                    onClick={() => removeDropZone(zone.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="text-sm text-gray-600 mb-2">Jawaban benar untuk zona ini:</div>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleItemInZone(zone.id, item.id)}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      zone.correctItemIds.includes(item.id)
                        ? 'bg-green-500 text-white'
                        : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {item.text || `Item ${items.indexOf(item) + 1}`}
                  </button>
                ))}
              </div>
            </div>
          ))}
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
