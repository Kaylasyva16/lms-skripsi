import { useEffect, useState } from "react";
import { X, Save } from "lucide-react";

export default function TambahSiswa({ open, onClose, onSubmit, initialData, kelasList, siswaList }: any) {
  const [nis, setNis] = useState("");
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [kelas, setKelas] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      if (initialData) {
        setNis(initialData.nis || "");
        setNama(initialData.nama || "");
        setEmail(initialData.email || "");
        setPassword(initialData.password || "");
        setKelas(initialData.kelas || "");
      } else {
        setNis("");
        setNama("");
        setEmail("");
        setPassword("");
        setKelas("");
      }
      setError("");
    }
  }, [initialData, open]);

  if (!open) return null;

  /* ================= FORMATTERS ================= */

  const formatNama = (text: string) => {
    return text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleNamaChange = (e: any) => {
    setNama(formatNama(e.target.value));
  };

  const handleKelasChange = (e: any) => {
    setKelas(e.target.value.toUpperCase());
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    if (!nis || !nama || !email || !kelas) {
      setError("NIS, nama, email, dan kelas wajib diisi");
      return false;
    }

    if (!initialData && !password) {
      setError("Password wajib diisi");
      return false;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setError("Format email tidak valid");
      return false;
    }

    const nisExists = siswaList?.some((s: any) => s.nis === nis && (!initialData || s.id !== initialData.id));

    if (nisExists) {
      setError("NIS sudah digunakan");
      return false;
    }

    const emailExists = siswaList?.some((s: any) => (s.email || "").toLowerCase() === email.toLowerCase() && (!initialData || s.id !== initialData.id));

    if (emailExists) {
      setError("Email sudah digunakan");
      return false;
    }

    setError("");
    return true;
  };

  const isValid = nis.trim() !== "" && nama.trim() !== "" && email.trim() !== "" && kelas.trim() !== "" && (initialData ? true : password.trim() !== "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl px-8 py-8 animate-scale-in">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-gray-900">{initialData ? "Edit Siswa" : "Tambah Siswa"}</h2>

          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
            <X size={22} />
          </button>
        </div>

        {/* FORM */}
        <div className="space-y-6">
          <input value={nis} onChange={(e) => setNis(e.target.value)} placeholder="NIS" className="w-full h-14 rounded-xl border px-5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

          <input value={nama} onChange={handleNamaChange} placeholder="Nama Siswa" className="w-full h-14 rounded-xl border px-5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Siswa" className="w-full h-14 rounded-xl border px-5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full h-14 rounded-xl border px-5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

          <select value={kelas} onChange={handleKelasChange} className="w-full h-14 rounded-xl border px-5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Pilih Kelas</option>
            {kelasList?.map((k: any, i: number) => (
              <option key={i} value={k.nama}>
                {k.nama}
              </option>
            ))}
          </select>

          {/* ERROR MESSAGE */}
          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* BUTTON */}
          <div className="pt-2">
            <button
              disabled={!isValid}
              onClick={() => {
                if (!validate()) return;

                onSubmit({
                  nis,
                  nama,
                  email,
                  password,
                  kelas,
                });
              }}
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
