import { useEffect, useState } from "react";
import { X, Save } from "lucide-react";
import { Pencil, Trash2 } from "lucide-react";

export default function TambahGuru({ open, onClose, onSubmit, initialData, mapelList }: any) {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [mapelId, setMapelId] = useState<number | "">("");
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (open) {
      if (initialData) {
        // MODE EDIT
        setNama(initialData.nama || "");
        setEmail(initialData.email || "");
        setMapelId(initialData.mapel_id || "");
      } else {
        // MODE TAMBAH → RESET FORM
        setNama("");
        setEmail("");
        setMapelId("");
      }
    }
  }, [initialData, open]);

  if (!open) return null;

  const validate = () => {
    let newErrors: any = {};

    if (!nama.trim()) {
      newErrors.nama = "Nama guru wajib diisi";
    }

    if (!email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!mapelId) {
      newErrors.mapel = "Mata pelajaran wajib dipilih";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* MODAL */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 animate-scale-in">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">{initialData ? "Edit Guru" : "Tambah Guru Baru"}</h2>
          <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition">
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <div className="space-y-6">
          <input
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Nama Guru"
            className="w-full h-14 rounded-2xl border px-6 text-base 
leading-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full h-14 rounded-2xl border px-6 text-base 
leading-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={mapelId}
            onChange={(e) => setMapelId(Number(e.target.value))}
            className="w-full h-14 rounded-2xl border pl-6 pr-10 text-base 
  appearance-none bg-white
  focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Pilih Mata Pelajaran</option>

            {mapelList.length === 0 ? (
              <option disabled>Belum ada mapel</option>
            ) : (
              mapelList.map((m: any, i: number) => (
                <option key={i} value={m.id}>
                  {m.nama}
                </option>
              ))
            )}
          </select>

          <button
            onClick={() => {
              if (!validate()) return;

              onSubmit({
                nama,
                email,
                mapel_id: mapelId,
              });
            }}
            disabled={!nama || !email || !mapelId}
            className={`w-full h-14 rounded-xl font-semibold flex items-center justify-center gap-2 transition
    ${!nama || !email || !mapelId ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
          >
            <Save size={18} />
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
