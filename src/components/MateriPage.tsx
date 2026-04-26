import { Card } from "./ui/card";
import { Clock, Star, Trophy, Brain, Lightbulb, Layout, Database, Code, Palette } from "lucide-react";
import { useState } from "react";
import { MaterialDetailPage } from "./MaterialDetailPage";

const materials = [
  {
    id: 1,
    title: "Percabangan IF Statement",
    subtitle: "Pengambilan Keputusan dalam Kode",
    description: "Pelajari konsep dasar percabangan dengan IF statement, operator relasional, dan logika untuk membuat program yang dapat mengambil keputusan.",
    duration: "2-3 jam",
    level: "Beginner",
    totalModules: 5,
    completedModules: 0,
    gradient: "from-blue-400 via-blue-500 to-purple-600",
    icon: Brain,
    topics: ["Konsep percabangan", "Statement IF sederhana", "Operator relasional", "Flowchart percabangan"],
  },
  {
    id: 2,
    title: "IF-ELSE & Nested IF",
    subtitle: "Percabangan Kompleks",
    description: "Kuasai percabangan IF-ELSE dan nested IF untuk menangani berbagai kondisi. Pelajari cara membuat keputusan bertingkat dalam program.",
    duration: "3-4 jam",
    level: "Beginner",
    totalModules: 6,
    completedModules: 0,
    gradient: "from-pink-400 via-pink-500 to-purple-600",
    icon: Lightbulb,
    topics: ["IF-ELSE statement", "ELSE-IF ladder", "Nested IF (IF bersarang)", "Best practices"],
  },
  {
    id: 3,
    title: "Switch-Case Statement",
    subtitle: "Multi-Pilihan Efisien",
    description: "Pelajari switch-case untuk menangani banyak pilihan dengan lebih efisien. Pahami kapan menggunakan switch vs IF-ELSE.",
    duration: "2-3 jam",
    level: "Intermediate",
    totalModules: 4,
    completedModules: 0,
    gradient: "from-green-400 via-green-500 to-teal-600",
    icon: Layout,
    topics: ["Syntax switch-case", "Break & default statement", "Switch vs IF comparison", "Studi kasus menu program"],
  },
  {
    id: 4,
    title: "Perulangan FOR Loop",
    subtitle: "Iterasi dengan Counter",
    description: "Pelajari perulangan FOR untuk mengulang proses dengan jumlah iterasi yang sudah ditentukan. Cocok untuk pemrosesan data dan array.",
    duration: "3-4 jam",
    level: "Intermediate",
    totalModules: 7,
    completedModules: 0,
    gradient: "from-orange-400 via-orange-500 to-red-600",
    icon: Database,
    topics: ["Struktur loop FOR", "Increment & decrement", "Loop dengan step custom", "Aplikasi pada array"],
  },
  {
    id: 5,
    title: "WHILE & DO-WHILE Loop",
    subtitle: "Iterasi Berbasis Kondisi",
    description: "Kuasai perulangan WHILE dan DO-WHILE untuk kasus di mana jumlah iterasi tidak diketahui. Pelajari perbedaan dan penggunaannya.",
    duration: "3-4 jam",
    level: "Intermediate",
    totalModules: 6,
    completedModules: 0,
    gradient: "from-indigo-400 via-indigo-500 to-purple-600",
    icon: Code,
    topics: ["WHILE loop structure", "DO-WHILE loop structure", "Perbedaan keduanya", "Validasi input dengan loop"],
  },
  {
    id: 6,
    title: "Nested Loop & Kombinasi",
    subtitle: "Perulangan Bersarang",
    description: "Pelajari nested loop dan kombinasi percabangan dengan perulangan. Selesaikan problem kompleks seperti pola, matriks, dan validasi.",
    duration: "4-5 jam",
    level: "Expert",
    totalModules: 8,
    completedModules: 0,
    gradient: "from-purple-400 via-purple-500 to-pink-600",
    icon: Palette,
    topics: ["Konsep nested loop", "Pola segitiga & piramida", "Kombinasi IF dalam loop", "Break, continue, & return"],
  },
];

export function MateriPage() {
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  // If material is selected, show detail page (not popup)
  if (selectedMaterial) {
    return <MaterialDetailPage onClose={() => setSelectedMaterial(null)} />;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-gray-900 mb-3">Percabangan dan Perulangan</h2>
        <p className="text-gray-600 mb-6">Kuasai struktur kontrol percabangan (IF, ELSE, SWITCH) dan perulangan (FOR, WHILE, DO-WHILE) dalam pemrograman terstruktur. Pelajari cara membuat keputusan dan iterasi yang efisien dalam kode.</p>
        <div className="flex items-center justify-center gap-8 text-sm text-gray-600 flex-wrap">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Total 20-26 jam pembelajaran</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            <span>6 topik fundamental</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            <span>Interactive & gamified</span>
          </div>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {materials.map((material) => {
          const IconComponent = material.icon;
          return (
            <div key={material.id} className={`bg-gradient-to-br ${material.gradient} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-[1.02]`} onClick={() => setSelectedMaterial(material)}>
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <div className="text-sm opacity-90">{material.duration}</div>
                  <div className="text-xs opacity-75">{material.level}</div>
                </div>
              </div>

              {/* Title */}
              <div className="mb-3">
                <h3 className="text-white mb-1">{material.title}</h3>
                <p className="text-sm opacity-90">{material.subtitle}</p>
              </div>

              {/* Module Count */}
              <div className="text-sm mb-4 opacity-90">
                {material.completedModules}/{material.totalModules} modules
              </div>

              {/* Description Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
                <p className="text-sm mb-3 opacity-95">{material.description}</p>

                <div className="space-y-1.5">
                  <p className="text-xs opacity-75 mb-2">Yang akan dipelajari:</p>
                  {material.topics.map((topic, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/60 mt-1.5 flex-shrink-0" />
                      <span className="opacity-90">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress */}
              {material.completedModules > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-90">Progress</span>
                    <span>{Math.round((material.completedModules / material.totalModules) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white/90 rounded-full transition-all" style={{ width: `${(material.completedModules / material.totalModules) * 100}%` }} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="p-6">
          <h3 className="text-gray-900 mb-2">💡 Tips Belajar Efektif</h3>
          <p className="text-gray-600 text-sm mb-4">Untuk hasil maksimal, kerjakan materi secara berurutan dari Beginner ke Expert. Selesaikan semua modul dalam satu materi sebelum melanjutkan ke materi berikutnya.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Level Saat Ini</p>
              <p className="text-sm text-gray-900">Intermediate</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Materi Selesai</p>
              <p className="text-sm text-gray-900">1 dari 6 materi</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Total Poin</p>
              <p className="text-sm text-gray-900">1,250 poin</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
