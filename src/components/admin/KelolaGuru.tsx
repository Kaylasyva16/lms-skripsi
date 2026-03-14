import { useState } from "react";
import { Search } from "lucide-react";
import TambahGuru from "./components/admin/modal/TambahGuru";

/* ================= KELOLA GURU ================= */
const KelolaGuru = () => {
  const [openTambahGuru, setOpenTambahGuru] = useState(false);
  const [guruList, setGuruList] = useState<any[]>([]);

  const handleTambahGuru = (data: any) => {
    console.log("DATA MASUK:", data); // 🔍 DEBUG

    setGuruList((prev) => [...prev, data]);
    setOpenTambahGuru(false);

    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  return (
    <>
      {/* ✅ TOAST SUKSES */}
      {success && <div className="fixed top-6 right-6 z-50 bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg animate-slide-in">✅ Data guru berhasil ditambahkan</div>}

      <div className="space-y-12">
        {/* ===== HEADER CARD ===== */}
        <div className="bg-white rounded-2xl border shadow-sm px-8 py-8 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold">Kelola Guru</h3>
              <p className="text-gray-500 mt-1">Tambah, edit, dan hapus data guru</p>
            </div>

            <button onClick={() => setOpenTambahGuru(true)} className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition flex items-center gap-2">
              <span className="text-xl">+</span>
              Tambah Guru
            </button>
          </div>

          {/* SEARCH */}
          <div className="relative">
            <input
              type="text"
              placeholder="Cari guru..."
              className="w-full h-14 rounded-full border px-6 pr-16 text-sm
              text-gray-700 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* ===== TABLE CARD ===== */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-8 py-4 text-left w-12">No</th>
                <th className="px-8 py-4 text-left">Nama Guru</th>
                <th className="px-8 py-4 text-left">Email</th>
                <th className="px-8 py-4 text-left">Mata Pelajaran</th>
                <th className="px-8 py-4 text-center w-24">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {guruList.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-400">
                    Belum ada data guru
                  </td>
                </tr>
              )}

              {guruList.map((guru, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-8 py-4">{i + 1}</td>
                  <td className="px-8 py-4 font-semibold">{guru.nama}</td>
                  <td className="px-8 py-4 text-gray-600">{guru.email}</td>
                  <td className="px-8 py-4">
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">{guru.mapel}</span>
                  </td>
                  <td className="px-8 py-4 text-center">—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== MODAL ===== */}
      <TambahGuru open={openTambahGuru} onClose={() => setOpenTambahGuru(false)} onSubmit={handleTambahGuru} />
    </>
  );
};

export default KelolaGuru;
