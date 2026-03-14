import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Code2, Mail, Lock, User, GraduationCap, BookOpen, ChevronRight, ChevronLeft, ArrowRight, Sparkles, IdCard, School } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState, useEffect } from "react";

interface RegisterPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

const getLocalStorage = (key: string) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error parsing localStorage:", error);
    return [];
  }
};

export function RegisterPage({ onBack, onSuccess }: RegisterPageProps) {
  const [kelasList, setKelasList] = useState<any[]>([]);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    nis: "",
    className: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchKelas = async () => {
      const res = await fetch("http://localhost:5000/public/kelas");
      const data = await res.json();
      setKelasList(data);
    };

    fetchKelas();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (!formData.fullName || !formData.nis || !formData.className) {
      toast.error("Harap isi semua data diri");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Password tidak cocok!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama: formData.fullName,
          email: formData.email.toLowerCase(),
          password: formData.password,
          role: "siswa", // WAJIB sesuai backend
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Register gagal");
        return;
      }

      toast.success("Pendaftaran berhasil!");
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    }
  };

  return (
    <div className="h-screen w-screen grid grid-cols-2 overflow-hidden">
      {/* ================= LEFT SIDE ================= */}
      <div
        className="relative h-full w-full text-white flex flex-col"
        style={{
          backgroundImage: `
      linear-gradient(
        to bottom right,
        rgba(29,78,216,0.92),
        rgba(37,99,235,0.90),
        rgba(30,64,175,0.95)
      ),
      url('https://images.unsplash.com/photo-1561089489-f13d5e730d72?auto=format&fit=crop&w=1600&q=80')
    `,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="h-full flex items-center">
          <div className="w-full max-w-4xl mx-auto px-20">
            {/* Logo */}
            <div className="flex items-center gap-4 mb-20">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                <Code2 className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">LMS PBL</h2>
                <p className="text-blue-100">Problem-Based Learning</p>
              </div>
            </div>

            {/* Hero */}
            <div className="max-w-2xl">
              <h1 className="text-6xl font-extrabold leading-tight mb-8">
                Mulai Petualangan
                <br />
                <span className="text-blue-200">Belajarmu</span> Hari Ini.
              </h1>

              <p className="text-blue-100 text-lg mb-10 leading-relaxed">Bergabunglah dengan ribuan siswa SMK RPL lainnya dalam sistem pembelajaran berbasis masalah yang seru dan interaktif.</p>

              <div className="space-y-5">
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                  <Sparkles className="w-6 h-6 text-blue-200" />
                  <span>Sistem Gamifikasi (Level & Badge)</span>
                </div>

                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                  <BookOpen className="w-6 h-6 text-blue-200" />
                  <span>36 Modul Pemrograman Terstruktur</span>
                </div>

                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                  <GraduationCap className="w-6 h-6 text-blue-200" />
                  <span>Proyek PBL Dunia Nyata</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="w-full max-w-lg px-8">
          {/* Back & Step Indicator */}
          <div className="mb-8 flex items-center justify-between">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-blue-600">
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Kembali ke Login</span>
            </button>

            <div className="flex gap-2">
              <div className={`h-1.5 w-10 rounded-full ${step === 1 ? "bg-blue-600" : "bg-blue-200"}`} />
              <div className={`h-1.5 w-10 rounded-full ${step === 2 ? "bg-blue-600" : "bg-blue-200"}`} />
            </div>
          </div>

          {/* Card */}
          <Card className="shadow-2xl border border-slate-200 rounded-3xl bg-white">
            <CardHeader>
              <CardTitle className="text-4xl font-black tracking-tight">Daftar Sekarang</CardTitle>
              <CardDescription>{step === 1 ? "Lengkapi data diri untuk memulai profil belajarmu." : "Keamanan akun adalah prioritas kami."}</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} noValidate>
                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                      <Input className="h-12 text-base" name="fullName" placeholder="Nama Lengkap" value={formData.fullName} onChange={handleChange} required />

                      <div className="grid grid-cols-2 gap-4">
                        <Input name="nis" placeholder="NIS" className="h-12" value={formData.nis} onChange={handleChange} required />

                        <select name="className" className="h-12 border rounded-md px-3 text-sm w-full" value={formData.className} onChange={handleChange} required>
                          <option value="">Pilih Kelas</option>
                          {kelasList.map((kelas, index) => (
                            <option key={index} value={kelas.nama}>
                              {kelas.nama}
                            </option>
                          ))}
                        </select>
                      </div>

                      <Button type="button" onClick={handleNext} className=" w-full h-12 text-base font-semibold rounded-xl !bg-blue-600 text-white hover:!bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg">
                        Selanjutnya <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                      <Input name="email" type="email" placeholder="Email Sekolah" value={formData.email} onChange={handleChange} required />

                      <Input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />

                      <Input name="confirmPassword" type="password" placeholder="Konfirmasi Password" value={formData.confirmPassword} onChange={handleChange} required />

                      <div className="flex gap-3">
                        <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 h-12 text-base font-semibold rounded-xl">
                          Sebelumnya
                        </Button>

                        <Button type="submit" className="flex-1 h-12 text-base font-semibold rounded-xl !bg-blue-600 text-white hover:!bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg">
                          Daftar <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
