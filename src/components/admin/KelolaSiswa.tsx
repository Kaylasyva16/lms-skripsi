import { Search, Pencil, Trash2 } from "lucide-react";

/* ================= KELOLA SISWA ================= */
const KelolaSiswa = () => (
  <div className="space-y-12">
    {/* ===== HEADER CARD ===== */}
    <div className="bg-white rounded-2xl border shadow-sm px-10 py-8">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold">Kelola Siswa</h3>
          <p className="text-gray-500 mt-1">Tambah, edit, dan hapus data siswa</p>
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-full font-semibold shadow">+ Tambah Siswa</button>
      </div>

      {/* SEARCH */}
      <div className="relative mt-8">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input placeholder="Cari nama siswa, NIS, atau kelas..." className="w-full pl-12 pr-5 py-4 rounded-full border focus:ring-2 focus:ring-blue-500" />
      </div>
    </div>

    {/* ===== TABLE CARD ===== */}
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-10 py-5 text-left w-20">No</th>
            <th className="px-10 py-5 text-left">Nama Siswa</th>
            <th className="px-10 py-5 text-left">NIS</th>
            <th className="px-10 py-5 text-left">Kelas</th>
            <th className="px-10 py-5 text-center w-32">Aksi</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {[
            ["Andi Pratama", "202301", "XII RPL 1"],
            ["Rina Oktaviani", "202302", "XII RPL 1"],
            ["Dimas Saputra", "202303", "XII RPL 2"],
            ["Nabila Azzahra", "202304", "XII TKJ 1"],
          ].map((s, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-10 py-6">{i + 1}</td>

              <td className="px-10 py-6 font-semibold">{s[0]}</td>

              <td className="px-10 py-6 text-gray-700">{s[1]}</td>

              <td className="px-10 py-6">
                <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold">{s[2]}</span>
              </td>

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
export default function KelolaSiswa() {
    return (
     
  }
  