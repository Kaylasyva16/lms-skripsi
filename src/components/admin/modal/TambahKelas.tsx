import { useEffect, useState } from "react";
import { X, Save } from "lucide-react";

export default function TambahKelas({ open, onClose, onSubmit, initialData, guruList }: any) {
  const [namaKelas, setNamaKelas] = useState("");
  const [waliKelas, setWaliKelas] = useState("");

  useEffect(() => {
    if (initialData) {
      setNamaKelas(initialData.nama || "");
      setWaliKelas(initialData.waliKelas || "");
    } else {
      setNamaKelas("");
      setWaliKelas("");
    }
  }, [initialData, open]);

  if (!open) return null;

  const isValid = namaKelas.trim() !== "" && waliKelas.trim() !== "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl px-8 py-8 animate-scale-in">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-gray-900">{initialData ? "Edit Kelas" : "Tambah Kelas Baru"}</h2>

          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
            <X size={22} />
          </button>
        </div>

        {/* FORM */}
        <div className="space-y-6">
          {/* Nama Kelas */}
          <input
            value={namaKelas}
            onChange={(e) => setNamaKelas(e.target.value)}
            placeholder="Nama Kelas"
            className="w-full h-14 rounded-xl border px-5 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Nama Wali Kelas (dari guruList) */}
          <select
            value={waliKelas}
            onChange={(e) => setWaliKelas(e.target.value)}
            className="w-full h-14 rounded-xl border px-5 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Nama Wali Kelas</option>
            {guruList.map((guru: any, index: number) => (
              <option key={guru.id} value={guru.id}>
                {guru.nama}
              </option>
            ))}
          </select>

          {/* BUTTON */}
          <div className="pt-2">
            <button
              disabled={!isValid}
              onClick={() =>
                onSubmit({
                  nama: namaKelas,
                  waliKelas: Number(waliKelas),
                })
              }
              className={`w-full h-14 rounded-xl font-semibold flex items-center justify-center gap-2 transition
                ${!isValid ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
            >
              <Save size={18} />
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
