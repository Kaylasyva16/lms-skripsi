import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Code2, BookOpen, GraduationCap, ChevronRight, ChevronLeft, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface RegisterPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

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

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (!formData.fullName || !formData.nis || !formData.className) {
      toast.error("Harap isi semua data diri");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Password tidak cocok!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: formData.fullName,
          email: formData.email.toLowerCase(),
          password: formData.password,
          role: "siswa",
          nis: formData.nis,
          kelas: formData.className,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Register gagal");
        return;
      }

      toast.success("Registrasi berhasil!");
      setTimeout(() => onSuccess(), 1500);
    } catch {
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT (HIDDEN DI MOBILE) */}
      <div
        className="hidden lg:flex relative text-white"
        style={{
          backgroundImage: `
            linear-gradient(to bottom right, rgba(29,78,216,0.92), rgba(37,99,235,0.9)),
            url('https://images.unsplash.com/photo-1561089489-f13d5e730d72')
          `,
          backgroundSize: "cover",
        }}
      >
        <div className="flex items-center w-full px-16">
          <div>
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                <Code2 className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">LMS PBL</h2>
                <p className="text-blue-100 text-sm">Problem-Based Learning</p>
              </div>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold mb-6">Mulai Belajarmu Hari Ini</h1>

            <div className="space-y-4">
              <div className="flex gap-3">
                <Sparkles /> <span>Gamifikasi</span>
              </div>
              <div className="flex gap-3">
                <BookOpen /> <span>36 Modul</span>
              </div>
              <div className="flex gap-3">
                <GraduationCap /> <span>Project Nyata</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-center px-4 sm:px-6 py-10 bg-gray-50">
        <div className="w-full max-w-md sm:max-w-lg">
          {/* BACK */}
          <button onClick={onBack} className="mb-6 text-sm text-gray-500 flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" /> Kembali
          </button>

          <Card className="shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl font-bold">Daftar</CardTitle>
              <CardDescription>{step === 1 ? "Isi data diri" : "Buat akun"}</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div key="1" className="space-y-4">
                      <Input name="fullName" placeholder="Nama" onChange={handleChange} />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input name="nis" placeholder="NIS" onChange={handleChange} />

                        <select name="className" className="h-12 border rounded-md px-3" onChange={handleChange}>
                          <option value="">Kelas</option>
                          {kelasList.map((k, i) => (
                            <option key={i}>{k.nama}</option>
                          ))}
                        </select>
                      </div>

                      <Button type="button" onClick={handleNext} className="w-full h-12">
                        Lanjut <ChevronRight className="ml-2 w-4 h-4" />
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div key="2" className="space-y-4">
                      <Input name="email" placeholder="Email" onChange={handleChange} />
                      <Input name="password" type="password" placeholder="Password" onChange={handleChange} />
                      <Input name="confirmPassword" type="password" placeholder="Konfirmasi" onChange={handleChange} />

                      <div className="flex gap-3">
                        <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                          Kembali
                        </Button>
                        <Button type="submit" className="flex-1">
                          Daftar <ArrowRight className="ml-2 w-4 h-4" />
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
