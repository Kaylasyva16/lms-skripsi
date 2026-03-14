import { Search, Pencil, Trash2 } from "lucide-react";

/* ================= KELOLA KELAS ================= */
const KelolaKelas = () => (
  <div className="space-y-12">
    {/* Header Card */}
    <div className="bg-white rounded-2xl border shadow-sm px-10 py-8">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold">Kelola Kelas</h3>
          <p className="text-gray-500 mt-1">Tambah, edit, dan hapus data kelas</p>
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-full font-semibold shadow">+ Tambah Kelas</button>
      </div>

      <div className="relative mt-8">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input placeholder="Cari kelas atau wali kelas..." className="w-full pl-12 pr-5 py-4 rounded-full border focus:ring-2 focus:ring-blue-500" />
      </div>
    </div>

    {/* Table */}
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-10 py-5 text-left w-20">No</th>
            <th className="px-10 py-5 text-left">Nama Kelas</th>
            <th className="px-10 py-5 text-left">Wali Kelas</th>
            <th className="px-10 py-5 text-center w-32">Aksi</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {[
            ["XII RPL 1", "Budi Santoso"],
            ["XII RPL 2", "Siti Nurhaliza"],
            ["XII TKJ 1", "Ahmad Fauzi"],
            ["XII TKJ 2", "Dewi Lestari"],
          ].map((k, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-10 py-6">{i + 1}</td>
              <td className="px-10 py-6">
                <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full font-semibold">{k[0]}</span>
              </td>
              <td className="px-10 py-6 font-semibold">{k[1]}</td>
              <td className="px-10 py-6">
                <div className="flex justify-center gap-4">
                  <Pencil className="text-blue-600 cursor-pointer" />
                  <Trash2 className="text-red-500 cursor-pointer" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default function KelolaKelas() {
  return (
   
}
