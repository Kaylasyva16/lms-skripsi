import { LayoutDashboard, Users, BookOpen, School, UserCircle, LogOut, Calendar, CheckCircle, Search, Pencil, Trash2, UserCheck, UserX, GraduationCap } from "lucide-react";
import TambahGuru from "./modal/TambahGuru";
import TambahMapel from "./modal/TambahMapel";
import TambahKelas from "./modal/TambahKelas";
import TambahSiswa from "./modal/TambahSiswa";
import { useState, useEffect } from "react";

/* ================= SIDEBAR ================= */
const Sidebar = ({ active, setActive, onLogout }: any) => {
  const menus = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "guru", label: "Kelola Guru", icon: Users },
    { id: "mapel", label: "Kelola Mata Pelajaran", icon: BookOpen },
    { id: "kelas", label: "Kelola Kelas", icon: School },
    { id: "siswa", label: "Kelola Siswa", icon: UserCircle },
  ];

  return (
    <aside className="w-64 bg-white border-r min-h-screen flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-lg font-bold">RPL Learn</h1>
        <p className="text-sm text-gray-500">Admin Dashboard</p>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
          <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">AD</div>
          <div>
            <p className="font-semibold text-sm">Administrator</p>
            <p className="text-xs text-gray-500">Admin Sekolah</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {menus.map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              onClick={() => setActive(m.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition
                ${active === m.id ? "bg-blue-600 text-white shadow" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <Icon size={18} />
              {m.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <button onClick={onLogout} className="flex items-center gap-3 text-red-600 text-sm hover:bg-red-50 px-4 py-3 rounded-xl w-full">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

/* ================= HEADER ================= */
const Header = ({ title }: any) => (
  <header className="bg-white border-b">
    <div className="max-w-[1200px] mx-auto px-6 py-4">
      <h2 className="text-2xl font-bold">{title}</h2>
    </div>
  </header>
);

/* ================= STAT CARD ================= */
const StatCard = ({ title, value, suffix, icon, color = { bg: "bg-gray-100" } }: any) => (
  <div
    className="bg-white border rounded-2xl p-6 flex items-center justify-between
                  hover:shadow-md transition duration-300"
  >
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold mt-1">
        {value} <span className="text-sm text-gray-500">{suffix}</span>
      </p>
    </div>
    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color.bg}`}>{icon}</div>
  </div>
);

/* ================= DASHBOARD ================= */
const DashboardOverview = ({ guruList, mapelList, kelasList, siswaList }: any) => {
  const totalGuru = guruList.length;
  const totalMapel = mapelList.length;
  const totalKelas = kelasList.length;
  const totalSiswa = siswaList.length;

  return (
    <div className="flex flex-col gap-12">
      {/* ===== HERO ===== */}
      <div className="mb-16">
        <div className="bg-blue-600 rounded-2xl p-8 text-white shadow-sm">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 border-4 border-white rounded-full flex items-center justify-center font-bold">AD</div>
            <div>
              <h3 className="text-2xl font-semibold">Selamat Datang, Admin!</h3>
              <p className="text-blue-100 text-sm mt-1">Dashboard Manajemen Sekolah</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== STAT UTAMA ===== */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Guru" value={totalGuru} suffix="Guru" icon={<Users className="text-blue-600" />} color={{ bg: "bg-blue-100" }} />

          <StatCard title="Mata Pelajaran" value={totalMapel} suffix="Mapel" icon={<CheckCircle className="text-green-600" />} color={{ bg: "bg-green-100" }} />

          <StatCard title="Total Kelas" value={totalKelas} suffix="Kelas" icon={<School className="text-orange-600" />} color={{ bg: "bg-orange-100" }} />
        </div>
      </div>

      {/* ===== RINGKASAN DATA SISWA ===== */}
      <div>
        <h4 className="text-lg font-bold mb-4">Ringkasan Data Siswa</h4>

        <div className="bg-white border rounded-2xl p-">
          <div className="border rounded-2xl p-8 flex flex-col gap-8">
            {/* Top */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-semibold">Total Siswa Terdaftar</p>
                <p className="text-gray-500 mt-1">Semua Kelas</p>
              </div>
              <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-medium">{totalSiswa} Siswa</span>
            </div>

            {/* Bottom */}
            <div className="flex items-center justify-between border-t pt-6">
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar size={18} />
                <span className="font-medium">Tahun Ajaran 2025 / 2026</span>
              </div>

              <div className="flex items-center gap-2 text-blue-600 font-semibold">
                <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                Aktif
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= KELOLA GURU ================= */
const KelolaGuru = ({ guruList, setGuruList, mapelList }: any) => {
  const [search, setSearch] = useState("");
  const [openTambahGuru, setOpenTambahGuru] = useState(false);
  const [editGuru, setEditGuru] = useState<any | null>(null);
  const [popup, setPopup] = useState<{
    type: "success" | "update" | "delete";
    message: string;
  } | null>(null);

  const handleEditGuru = (guru: any, index: number) => {
    setEditGuru({ ...guru, index });
    setOpenTambahGuru(true);
  };

  const handleSubmitGuru = async (data: any) => {
    const token = localStorage.getItem("token");

    try {
      if (editGuru !== null) {
        // UPDATE
        await fetch(`http://localhost:5000/guru/${editGuru.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        setPopup({
          type: "update",
          message: "Data guru berhasil diperbarui",
        });
      } else {
        // CREATE
        await fetch("http://localhost:5000/guru", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        setPopup({
          type: "success",
          message: "Data guru berhasil ditambahkan",
        });
      }

      console.log("DATA YANG DIKIRIM:", data);
      // 🔥 FETCH ULANG DATA (INI KUNCINYA)
      const refresh = await fetch("http://localhost:5000/guru", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedList = await refresh.json();
      setGuruList(updatedList);

      setEditGuru(null);
      setOpenTambahGuru(false);
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data guru");
    }
  };

  const handleHapusGuru = async (id: number) => {
    if (!confirm("Yakin ingin menghapus guru ini?")) return;

    try {
      const token = localStorage.getItem("token");

      await fetch(`http://localhost:5000/guru/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setGuruList((prev) => prev.filter((guru) => guru.id !== id));

      setPopup({
        type: "delete",
        message: "Data guru berhasil dihapus",
      });
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus guru");
    }
  };

  const filteredGuru = guruList.filter(
    (guru) => (guru.nama?.toLowerCase() || "").includes(search.toLowerCase()) || (guru.email?.toLowerCase() || "").includes(search.toLowerCase()) || (guru.mapel?.toLowerCase() || "").includes(search.toLowerCase())
  );

  return (
    <>
      {popup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay Blur */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setPopup(null)} />

          {/* Popup Box */}
          <div
            className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl 
                px-10 py-12 text-center animate-popup"
          >
            {/* Icon */}
            <div
              className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6
        ${popup.type === "success" ? "bg-green-100" : popup.type === "update" ? "bg-blue-100" : "bg-red-100"}`}
            >
              {popup.type === "success" && <span className="text-green-600 text-4xl">✓</span>}
              {popup.type === "update" && <span className="text-blue-600 text-4xl">✎</span>}
              {popup.type === "delete" && <span className="text-red-600 text-4xl">🗑</span>}
            </div>

            {/* Text */}
            <h3 className="text-2xl font-bold mb-2">Berhasil!</h3>
            <p className="text-gray-500 mb-8">{popup.message}</p>

            {/* Button */}
            <button onClick={() => setPopup(null)} className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition">
              OK
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-8">
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari guru..."
              className="w-full h-14 rounded-full border px-6 pr-16 text-sm
  text-gray-700 placeholder-gray-400
  focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <Search size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* ===== TABLE CARD ===== */}
        <div className=" mt-10 bg-white rounded-2xl border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-8 py-4 text-left w-12">No</th>
                <th className="px-8 py-4 text-left">Nama Guru</th>
                <th className="px-8 py-4 text-left">Email</th>
                <th className="px-8 py-4 text-left">Mata Pelajaran</th>
                <th className="px-8 py-4 text-center w-32">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredGuru.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-400">
                    {search ? "Data tidak ditemukan" : "Belum ada data guru"}
                  </td>
                </tr>
              ) : (
                filteredGuru.map((guru, i) => (
                  <tr key={guru.id} className="hover:bg-gray-50">
                    <td className="px-8 py-4">{i + 1}</td>
                    <td className="px-8 py-4 font-semibold">{guru.nama}</td>
                    <td className="px-8 py-4 text-gray-600">{guru.email}</td>
                    <td className="px-8 py-4">
                      <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">{guru.mapel}</span>
                    </td>

                    {/* AKSI */}
                    <td className="px-8 py-4 pr-12 text-center">
                      <div className="flex items-center justify-center gap-4">
                        {/* EDIT */}
                        <button onClick={() => handleEditGuru(guru, i)} className="text-blue-600 hover:text-blue-700 transition" title="Edit">
                          <Pencil size={22} strokeWidth={2.2} />
                        </button>

                        {/* HAPUS */}
                        <button onClick={() => handleHapusGuru(guru.id)} className="text-red-600 hover:text-red-700 transition" title="Hapus">
                          <Trash2 size={22} strokeWidth={2.2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== MODAL ===== */}
      <TambahGuru
        open={openTambahGuru}
        onClose={() => {
          setOpenTambahGuru(false);
          setEditGuru(null);
        }}
        onSubmit={handleSubmitGuru}
        initialData={editGuru}
        mapelList={mapelList}
      />
    </>
  );
};

/* ================= KELOLA MAPEL ================= */
const KelolaMataPelajaran = ({ mapelList, setMapelList }: any) => {
  const [openTambahMapel, setOpenTambahMapel] = useState(false);
  const [search, setSearch] = useState("");
  const [editMapel, setEditMapel] = useState<any | null>(null);
  const [popup, setPopup] = useState<{
    type: "success" | "update" | "delete";
    message: string;
  } | null>(null);

  const handleEditMapel = (mapel: any) => {
    setEditMapel(mapel);
    setOpenTambahMapel(true);
  };

  const handleHapusMapel = async (id: number) => {
    if (!confirm("Yakin ingin menghapus mapel ini?")) return;

    try {
      const token = localStorage.getItem("token");

      await fetch(`http://localhost:5000/mapel/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMapelList((prev) => prev.filter((m) => m.id !== id));

      setPopup({
        type: "delete",
        message: "Mata pelajaran berhasil dihapus",
      });
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus mapel");
    }
  };

  const capitalizeFirst = (text: string) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const handleSubmitMapel = async (data: any) => {
    const token = localStorage.getItem("token");

    try {
      if (editMapel !== null) {
        // UPDATE
        const res = await fetch(`http://localhost:5000/mapel/${editMapel.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        const updated = await res.json();

        setMapelList((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));

        setPopup({
          type: "update",
          message: "Mata pelajaran berhasil diperbarui",
        });
      } else {
        // CREATE
        const res = await fetch("http://localhost:5000/mapel", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        const newMapel = await res.json();

        setMapelList((prev) => [...prev, newMapel]);

        setPopup({
          type: "success",
          message: "Mata pelajaran berhasil ditambahkan",
        });
      }

      setEditMapel(null);
      setOpenTambahMapel(false);
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan mapel");
    }
  };

  const filteredMapel = mapelList.filter((mapel) => mapel.nama.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      {popup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay Blur */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setPopup(null)} />

          {/* Popup Box */}
          <div
            className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl 
            px-8 py-8 text-center animate-popup"
          >
            {/* Icon */}
            <div
              className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6
        ${popup.type === "success" ? "bg-green-100" : popup.type === "update" ? "bg-blue-100" : "bg-red-100"}`}
            >
              {popup.type === "success" && <span className="text-green-600 text-4xl">✓</span>}
              {popup.type === "update" && <span className="text-blue-600 text-4xl">✎</span>}
              {popup.type === "delete" && <span className="text-red-600 text-4xl">🗑</span>}
            </div>

            {/* Text */}
            <h3 className="text-2xl font-bold mb-2">Berhasil!</h3>
            <p className="text-gray-500 mb-8">{popup.message}</p>

            {/* Button */}
            <button onClick={() => setPopup(null)} className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition">
              OK
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-8">
        {/* ===== HEADER CARD ===== */}
        <div className="bg-white rounded-2xl border shadow-sm px-8 py-8 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold">Kelola Mapel</h3>
              <p className="text-gray-500 mt-1">Tambah, edit, dan hapus data mapel</p>
            </div>

            <button onClick={() => setOpenTambahMapel(true)} className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition flex items-center gap-2">
              <span className="text-xl">+</span>
              Tambah Mapel
            </button>
          </div>

          {/* SEARCH */}
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari mata pelajaran..."
              className="w-full h-14 rounded-full border px-6 pr-16 text-sm
              text-gray-700 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* ===== TABLE CARD ===== */}
        <div className=" mt-10 bg-white rounded-2xl border shadow-sm overflow-hidden">
          <table className="w-full table-fixed">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4 text-left w-[70px]">No</th>
                <th className="px-6 py-4 text-left">Nama Mata Pelajaran</th>
                <th className="px-6 py-4 text-center w-[120px]">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredMapel.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-6 text-gray-400">
                    Belum ada data mata pelajaran
                  </td>
                </tr>
              ) : (
                filteredMapel.map((mapel, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td className="px-8 py-4">{i + 1}</td>

                    <td className="px-8 py-4 font-semibold">{mapel.nama}</td>

                    {/* AKSI */}
                    <td className="px-8 py-4 pr-12 text-center">
                      <div className="flex items-center justify-center gap-4">
                        {/* EDIT */}
                        <button onClick={() => handleEditMapel(mapel)} className="text-blue-600 hover:text-blue-700 transition" title="Edit">
                          <Pencil size={22} strokeWidth={2.2} />
                        </button>

                        {/* HAPUS */}
                        <button onClick={() => handleHapusMapel(mapel.id)} className="text-red-600 hover:text-red-700 transition" title="Hapus">
                          <Trash2 size={22} strokeWidth={2.2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== MODAL ===== */}
      <TambahMapel
        open={openTambahMapel}
        onClose={() => {
          setOpenTambahMapel(false);
          setEditMapel(null);
        }}
        onSubmit={handleSubmitMapel}
        initialData={editMapel}
      />
    </>
  );
};

/* ================= KELOLA KELAS ================= */
const KelolaKelas = ({ kelasList, setKelasList, guruList }: any) => {
  const [openTambahKelas, setOpenTambahKelas] = useState(false);
  const [search, setSearch] = useState("");
  const [editKelas, setEditKelas] = useState<any | null>(null);
  const [popup, setPopup] = useState<{
    type: "success" | "update" | "delete";
    message: string;
  } | null>(null);

  const handleEditKelas = (kelas: any) => {
    setEditKelas(kelas);
    setOpenTambahKelas(true);
  };

  const handleHapusKelas = async (id: number) => {
    if (!confirm("Yakin ingin menghapus kelas ini?")) return;

    try {
      const token = localStorage.getItem("token");

      await fetch(`http://localhost:5000/kelas/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setKelasList((prev) => prev.filter((k) => k.id !== id));

      setPopup({
        type: "delete",
        message: "Kelas berhasil dihapus",
      });
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus kelas");
    }
  };

  const capitalizeFirst = (text: string) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const handleSubmitKelas = async (data: any) => {
    const token = localStorage.getItem("token");

    try {
      if (editKelas !== null) {
        // UPDATE
        const res = await fetch(`http://localhost:5000/kelas/${editKelas.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        const updated = await res.json();

        setKelasList((prev) => prev.map((k) => (k.id === updated.id ? updated : k)));

        setPopup({
          type: "update",
          message: "Kelas berhasil diperbarui",
        });
      } else {
        // CREATE
        const res = await fetch("http://localhost:5000/kelas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        const newKelas = await res.json();

        setKelasList((prev) => [...prev, newKelas]);

        setPopup({
          type: "success",
          message: "Kelas berhasil ditambahkan",
        });
      }

      setEditKelas(null);
      setOpenTambahKelas(false);
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan kelas");
    }
  };

  const filteredKelas = kelasList.filter((kelas) => {
    const nama = kelas.nama?.toLowerCase() || "";
    const wali = kelas.waliKelas ? String(kelas.waliKelas).toLowerCase() : "";

    return nama.includes(search.toLowerCase()) || wali.includes(search.toLowerCase());
  });

  return (
    <>
      {popup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay Blur */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setPopup(null)} />

          {/* Popup Box */}
          <div
            className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl 
            px-8 py-8 text-center animate-popup"
          >
            {/* Icon */}
            <div
              className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6
        ${popup.type === "success" ? "bg-green-100" : popup.type === "update" ? "bg-blue-100" : "bg-red-100"}`}
            >
              {popup.type === "success" && <span className="text-green-600 text-4xl">✓</span>}
              {popup.type === "update" && <span className="text-blue-600 text-4xl">✎</span>}
              {popup.type === "delete" && <span className="text-red-600 text-4xl">🗑</span>}
            </div>

            {/* Text */}
            <h3 className="text-2xl font-bold mb-2">Berhasil!</h3>
            <p className="text-gray-500 mb-8">{popup.message}</p>

            {/* Button */}
            <button onClick={() => setPopup(null)} className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition">
              OK
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-8">
        {/* ===== HEADER CARD ===== */}
        <div className="bg-white rounded-2xl border shadow-sm px-8 py-8 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold">Kelola Kelas</h3>
              <p className="text-gray-500 mt-1">Tambah, edit, dan hapus data kelas</p>
            </div>

            <button onClick={() => setOpenTambahKelas(true)} className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition flex items-center gap-2">
              <span className="text-xl">+</span>
              Tambah Kelas
            </button>
          </div>

          {/* SEARCH */}
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kelas atau wali kelas..."
              className="w-full h-14 rounded-full border px-6 pr-16 text-sm
              text-gray-700 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* ===== TABLE CARD ===== */}
        <div className=" mt-10 bg-white rounded-2xl border shadow-sm overflow-hidden">
          <table className="w-full table-fixed">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4 text-left w-[70px]">No</th>
                <th className="px-6 py-4 text-left">Nama Kelas</th>
                <th className="px-6 py-4 text-left">Wali Kelas</th>
                <th className="px-6 py-4 text-center w-[120px]">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredKelas.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-6 text-gray-400">
                    Belum ada data kelas
                  </td>
                </tr>
              ) : (
                filteredKelas.map((kelas, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td className="px-8 py-4">{i + 1}</td>

                    <td className="px-8 py-4 font-semibold">{kelas.nama}</td>

                    <td className="px-8 py-4">{kelas.waliKelas || "-"}</td>

                    <td className="px-8 py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        {/* EDIT */}
                        <button onClick={() => handleEditKelas(kelas)} className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition">
                          <Pencil size={20} strokeWidth={2} />
                        </button>

                        {/* DELETE */}
                        <button onClick={() => handleHapusKelas(kelas.id)} className="p-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition">
                          <Trash2 size={20} strokeWidth={2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== MODAL ===== */}
      <TambahKelas
        open={openTambahKelas}
        onClose={() => {
          setOpenTambahKelas(false);
          setEditKelas(null);
        }}
        onSubmit={handleSubmitKelas}
        initialData={editKelas}
        guruList={guruList}
      />
    </>
  );
};

/* ================= KELOLA SISWA ================= */

const KelolaSiswa = ({ siswaList, setSiswaList, kelasList }: any) => {
  const [search, setSearch] = useState("");
  const [openTambahSiswa, setOpenTambahSiswa] = useState(false);
  const [editSiswa, setEditSiswa] = useState<any | null>(null);

  const fetchSiswa = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/siswa", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setSiswaList(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSiswa = (siswa: any) => {
    setEditSiswa(siswa);
    setOpenTambahSiswa(true);
  };

  const handleHapusSiswa = async (id: number) => {
    if (!confirm("Yakin ingin menghapus data siswa ini?")) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/siswa/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || result.error || "Gagal menghapus siswa");
        return;
      }

      await fetchSiswa();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus siswa");
    }
  };

  const capitalizeWords = (text: string) => {
    if (!text) return "";
    return text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleSubmitSiswa = async (data: any) => {
    const token = localStorage.getItem("token");

    const formattedData = {
      ...data,
      nama: capitalizeWords(data.nama),
    };

    try {
      let res;

      if (editSiswa !== null) {
        res = await fetch(`http://localhost:5000/siswa/${editSiswa.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formattedData),
        });
      } else {
        res = await fetch("http://localhost:5000/siswa", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formattedData),
        });
      }

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || result.error || "Gagal menyimpan siswa");
        return;
      }

      await fetchSiswa();

      setEditSiswa(null);
      setOpenTambahSiswa(false);
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan siswa");
    }
  };

  const filteredSiswa = siswaList.filter(
    (s: any) =>
      (s.nama || "").toLowerCase().includes(search.toLowerCase()) ||
      String(s.nis || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (s.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.kelas || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="bg-white rounded-2xl border shadow-sm px-8 py-8 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold">Kelola Siswa</h3>
              <p className="text-gray-500 mt-1">Tambah, edit, dan hapus data siswa</p>
            </div>

            <button
              onClick={() => {
                setEditSiswa(null);
                setOpenTambahSiswa(true);
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
            >
              + Tambah Siswa
            </button>
          </div>

          <div className="relative">
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari siswa..." className="w-full h-14 rounded-full border px-6 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <Search size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="mt-10 bg-white rounded-2xl border shadow-sm overflow-hidden">
          <table className="w-full table-fixed">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-8 py-4 text-left w-[80px]">No</th>
                <th className="px-8 py-4 text-left w-[160px]">NIS</th>
                <th className="px-8 py-4 text-left">Nama</th>
                <th className="px-8 py-4 text-left">Email</th>
                <th className="px-8 py-4 text-left w-[180px]">Kelas</th>
                <th className="px-8 py-4 text-center w-[120px]">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredSiswa.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-400">
                    {search ? "Data tidak ditemukan" : "Belum ada data siswa"}
                  </td>
                </tr>
              ) : (
                filteredSiswa.map((siswa: any, i: number) => (
                  <tr key={siswa.id || i} className="hover:bg-gray-50 transition">
                    <td className="px-8 py-4">{i + 1}</td>
                    <td className="px-8 py-4 font-semibold">{siswa.nis || "-"}</td>
                    <td className="px-8 py-4">{siswa.nama || "-"}</td>
                    <td className="px-8 py-4 text-gray-600">{siswa.email || "-"}</td>
                    <td className="px-8 py-4">{siswa.kelas ? <span className="inline-flex items-center bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-semibold">{siswa.kelas}</span> : "-"}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-4">
                        <button onClick={() => handleEditSiswa(siswa)} className="text-blue-600 hover:text-blue-700 transition">
                          <Pencil size={20} />
                        </button>

                        <button onClick={() => handleHapusSiswa(siswa.id)} className="text-red-600 hover:text-red-700 transition">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TambahSiswa
        open={openTambahSiswa}
        onClose={() => {
          setOpenTambahSiswa(false);
          setEditSiswa(null);
        }}
        onSubmit={handleSubmitSiswa}
        initialData={editSiswa}
        kelasList={kelasList}
        siswaList={siswaList}
      />
    </>
  );
};

/* ================= MAIN ================= */
const getLocalStorage = (key: string) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export default function AdminDashboard() {
  const [active, setActive] = useState("dashboard");
  const [mapelList, setMapelList] = useState<any[]>([]);
  const [guruList, setGuruList] = useState<any[]>([]);
  const [kelasList, setKelasList] = useState<any[]>([]);
  const [siswaList, setSiswaList] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/kelas", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("DATA KELAS:", data);
        setKelasList(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchKelas();
  }, []);

  useEffect(() => {
    const fetchMapel = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/mapel", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setMapelList(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMapel();
  }, []);

  useEffect(() => {
    const fetchGuru = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/guru", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setGuruList(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchGuru();
  }, []);

  useEffect(() => {
    const fetchSiswa = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/siswa", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("DATA SISWA:", data);
        setSiswaList(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSiswa();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar active={active} setActive={setActive} onLogout={handleLogout} />

      <main className="flex-1 flex flex-col">
        <Header title={active === "dashboard" ? "Dashboard" : active === "guru" ? "Kelola Guru" : active === "mapel" ? "Kelola Mata Pelajaran" : active === "kelas" ? "Kelola Kelas" : active === "siswa" ? "Kelola Siswa" : ""} />

        <div className="flex-1 w-full">
          <div className="max-w-[1200px] mx-auto px-6 py-8">
            {active === "dashboard" && <DashboardOverview guruList={guruList} mapelList={mapelList} kelasList={kelasList} siswaList={siswaList} />}

            {active === "guru" && <KelolaGuru guruList={guruList} setGuruList={setGuruList} mapelList={mapelList} />}
            {active === "mapel" && <KelolaMataPelajaran mapelList={mapelList} setMapelList={setMapelList} />}
            {active === "kelas" && <KelolaKelas kelasList={kelasList} setKelasList={setKelasList} guruList={guruList} />}
            {active === "siswa" && <KelolaSiswa siswaList={siswaList} setSiswaList={setSiswaList} kelasList={kelasList} />}
          </div>
        </div>
        <footer className="text-center text-xs text-gray-400 py-6">© 2026 RPL Learn · Admin Dashboard</footer>
      </main>
    </div>
  );
}
