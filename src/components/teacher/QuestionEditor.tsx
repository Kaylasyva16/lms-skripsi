import React, { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { MultipleChoiceEditor } from "./quiz-type/MultipleChoiceEditor";
import { DragAndDropEditor } from "./quiz-type/DragAndDropEditor";
import { MatchingEditor } from "./quiz-type/MatchingEditor";
import { LogicFlowEditor } from "./quiz-type/LogicFlowEditor";
import { DebuggingEditor } from "./quiz-type/DebuggingEditor";
import { SimulationEditor } from "./quiz-type/SimulationEditor";
import { EssayEditor } from "./quiz-type/EssayEditor";

interface Question {
  id: string;
  type: "multiple-choice" | "drag-drop" | "matching" | "logic-flow" | "debugging" | "simulation" | "essay";
  data: any;
  points: number;
}

interface QuestionEditorProps {
  question: Question | null;
  questionNumber: number;
  onSave: (question: Question) => void;
  onCancel: () => void;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({ question, questionNumber, onSave, onCancel }) => {
  const [selectedType, setSelectedType] = useState<Question["type"] | "">(question?.type || "");
  const [questionData, setQuestionData] = useState<any>(question?.data || {});
  const [points, setPoints] = useState<number>(question?.points || 10);

  const questionTypes = [
    { id: "multiple-choice", label: "Pilihan Ganda", icon: "📝", description: "Soal dengan beberapa pilihan jawaban" },
    { id: "drag-drop", label: "Drag & Drop", icon: "🔄", description: "Seret item ke zona yang sesuai" },
    { id: "matching", label: "Matching", icon: "🔗", description: "Cocokkan pasangan yang sesuai" },
    { id: "logic-flow", label: "Logic Flow Puzzle", icon: "🧩", description: "Susun blok kode dengan urutan yang benar" },
    { id: "debugging", label: "Debugging Puzzle", icon: "🐛", description: "Temukan dan perbaiki bug dalam kode" },
    { id: "simulation", label: "Simulation Task", icon: "⚡", description: "Lakukan simulasi sesuai skenario" },
    { id: "essay", label: "Essay", icon: "✍️", description: "Jawaban berbentuk uraian" },
  ];

  const handleSave = () => {
    if (!selectedType) {
      alert("Pilih tipe soal terlebih dahulu");
      return;
    }

    let isValid = false;

    switch (selectedType) {
      case "multiple-choice":
        isValid = questionData.question && questionData.options?.length >= 2 && questionData.options.some((o: any) => o.isCorrect);
        break;

      case "drag-drop":
        isValid = questionData.question && questionData.items?.length > 0 && questionData.dropZones?.length > 0;
        break;

      case "matching":
        isValid = questionData.question && questionData.pairs?.length >= 2;
        break;

      case "logic-flow":
        isValid = questionData.question && questionData.blocks?.length >= 2;
        break;

      case "debugging":
        isValid = questionData.question && questionData.code && questionData.bugs?.length > 0;
        break;

      case "simulation":
        isValid = questionData.question && questionData.scenario && questionData.steps?.length > 0;
        break;

      case "essay":
        isValid = questionData.question && questionData.guideline;
        break;
    }

    if (!isValid) {
      alert("Lengkapi semua field yang diperlukan");
      return;
    }

    onSave({
      id: question?.id || Date.now().toString(),
      type: selectedType,
      data: questionData,
      points,
    });
  };

  const renderEditor = () => {
    const commonProps = {
      data: questionData,
      onChange: setQuestionData,
    };

    switch (selectedType) {
      case "multiple-choice":
        return <MultipleChoiceEditor {...commonProps} />;
      case "drag-drop":
        return <DragAndDropEditor {...commonProps} />;
      case "matching":
        return <MatchingEditor {...commonProps} />;
      case "logic-flow":
        return <LogicFlowEditor {...commonProps} />;
      case "debugging":
        return <DebuggingEditor {...commonProps} />;
      case "simulation":
        return <SimulationEditor {...commonProps} />;
      case "essay":
        return <EssayEditor {...commonProps} />;
      default:
        return null;
    }
  };

  const currentType = questionTypes.find((t) => t.id === selectedType);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-white py-14 px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-start gap-4">
            <button
              onClick={onCancel}
              className="w-14 h-14 flex items-center justify-center
             rounded-2xl
             bg-white
             border border-gray-200
             shadow-sm
             hover:shadow-md
             hover:-translate-y-[1px]
             transition-all duration-200"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>

            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{question ? `Edit Soal #${questionNumber}` : `Tambah Soal Baru #${questionNumber}`}</h1>
              <p className="text-gray-500 mt-1">{currentType?.label || "Pilih tipe soal"}</p>
            </div>
          </div>

          <button onClick={handleSave} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-sm hover:bg-blue-700 transition">
            <Save className="w-5 h-5" />
            Simpan Soal
          </button>
        </div>

        {/* Type Selection */}
        {!selectedType && (
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {questionTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    setSelectedType(type.id as Question["type"]);
                    setQuestionData({});
                    setPoints(10);
                  }}
                  className="p-4 border rounded-xl hover:bg-blue-50 text-left"
                >
                  <div className="text-3xl">{type.icon}</div>
                  <h3>{type.label}</h3>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Editor */}
        {selectedType && (
          <div className="grid grid-cols-4 gap-8 mt-8">
            <div className="col-span-3 bg-white p-6 rounded-xl border">{renderEditor()}</div>
            <div className="col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-xl border">
                <h3>Poin Soal</h3>
                <input
                  type="number"
                  min={1}
                  value={points}
                  onChange={(e) => setPoints(+e.target.value || 1)}
                  className="w-full text-center text-3xl font-semibold border border-gray-200 rounded-xl py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border">
                <h3>💡 Tips</h3>

                {selectedType === "essay" && (
                  <ul className="text-sm space-y-2">
                    <li>• Gunakan pertanyaan terbuka</li>
                    <li>• Sertakan rubrik penilaian</li>
                    <li>• Tentukan ekspektasi jawaban</li>
                    <li>• Cocok untuk analisis & opini</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
