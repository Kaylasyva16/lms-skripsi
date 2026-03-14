import { Search, Pencil, Trash2 } from "lucide-react";

export default function KelolaMapel() {
  const data = ["Matematika", "Bahasa Indonesia", "Bahasa Inggris", "Fisika", "Kimia"];

  return (
    <div className="space-y-10">
      {/* HEADER CARD */}
      <div className="bg-white rounded-2xl border shadow-sm px-10 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Kelola Mata Pelajaran</h2>
            <p className="text-gray-500">Tambah, edit, dan hapus data mata pelajaran</p>
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold shadow">+ Tambah Mata Pelajaran</button>
        </div>

        {/* SEARCH */}
        <div className="relative">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input placeholder="Cari mata pelajaran..." className="w-full pl-12 pr-5 py-4 rounded-full border border-gray-200 focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
            <tr>
              <th className="px-10 py-5 text-left w-20">No</th>
              <th className="px-10 py-5 text-left">Nama Mata Pelajaran</th>
              <th className="px-10 py-5 text-center w-32">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {data.map((m, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-10 py-6">{i + 1}</td>
                <td className="px-10 py-6 font-semibold">{m}</td>
                <td className="px-10 py-6">
                  <div className="flex justify-center gap-4">
                    <button className="p-2 rounded-lg text-blue-600 hover:bg-blue-50">
                      <Pencil size={18} />
                    </button>
                    <button className="p-2 rounded-lg text-red-500 hover:bg-red-50">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
