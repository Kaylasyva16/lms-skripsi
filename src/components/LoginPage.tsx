import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Code2, Mail, Lock, Info, Sparkles } from "lucide-react";

interface LoginPageProps {
  onLogin: (role: "siswa" | "guru" | "admin") => void;
  onRegister: () => void;
}

export function LoginPage({ onLogin, onRegister }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      localStorage.clear();

      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("LOGIN RESPONSE:", data);

      if (!response.ok) {
        alert(data.message || "Login gagal");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      const meResponse = await fetch("http://localhost:5000/me", {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });

      const meData = await meResponse.json();
      console.log("ME RESPONSE:", meData);

      if (!meResponse.ok) {
        alert(meData.message || "Gagal mengambil data user");
        return;
      }

      localStorage.setItem("user", JSON.stringify(meData));

      onLogin(data.role);
    } catch (error) {
      console.error(error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* ===== BACKGROUND EFFECTS ===== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Soft glow blobs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-pink-400/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/25 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-cyan-300/15 rounded-full blur-3xl animate-pulse delay-500" />

        {/* Floating dots (spread across screen) */}
        <span className="absolute top-[10%] left-[8%] w-2.5 h-2.5 bg-white rounded-full animate-float shadow-[0_0_12px_rgba(255,255,255,0.6)] z-10" />
        <span className="absolute top-[18%] left-[35%] w-2 h-2 bg-white rounded-full animate-float delay-200 shadow-[0_0_10px_rgba(255,255,255,0.5)] z-10" />
        <span className="absolute top-[12%] right-[12%] w-3 h-3 bg-white rounded-full animate-float delay-500 shadow-[0_0_14px_rgba(255,255,255,0.6)] z-10" />

        <span className="absolute top-[40%] left-[6%] w-2 h-2 bg-white rounded-full animate-float delay-300 shadow-[0_0_10px_rgba(255,255,255,0.5)] z-10" />
        <span className="absolute top-[45%] left-[48%] w-3 h-3 bg-white rounded-full animate-float delay-700 shadow-[0_0_14px_rgba(255,255,255,0.6)] z-10" />
        <span className="absolute top-[38%] right-[8%] w-2.5 h-2.5 bg-white rounded-full animate-float delay-1000 shadow-[0_0_12px_rgba(255,255,255,0.6)] z-10" />

        <span className="absolute bottom-[18%] left-[12%] w-3 h-3 bg-white rounded-full animate-float delay-150 shadow-[0_0_14px_rgba(255,255,255,0.6)] z-10" />
        <span className="absolute bottom-[22%] left-[42%] w-2 h-2 bg-white rounded-full animate-float delay-500 shadow-[0_0_10px_rgba(255,255,255,0.5)] z-10" />
        <span className="absolute bottom-[16%] right-[14%] w-2.5 h-2.5 bg-white rounded-full animate-float delay-800 shadow-[0_0_12px_rgba(255,255,255,0.6)] z-10" />

        <span className="absolute bottom-[8%] right-[35%] w-2 h-2 bg-white rounded-full animate-float delay-300 shadow-[0_0_10px_rgba(255,255,255,0.5)] z-10" />
      </div>

      {/* ===== CONTENT ===== */}
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-3 shadow-2xl">
            <Code2 className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-white text-2xl font-bold">LMS PBL</h1>
          <p className="text-blue-50 text-sm">Learning Management System - SMK RPL</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl bg-white border border-white/60 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

          <CardHeader className="pb-4 pt-5">
            <CardTitle className="text-2xl text-center font-bold text-gray-900">Selamat Datang</CardTitle>
            <CardDescription className="text-center text-gray-600">Masukkan kredensial Anda untuk melanjutkan</CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <Label className="flex items-center gap-2 text-gray-700 font-medium">
                  <Mail className="w-4 h-4 text-blue-600" /> Email
                </Label>
                <Input type="email" placeholder="nama@smk.sch.id" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label className="flex items-center gap-2 text-gray-700 font-medium">
                  <Lock className="w-4 h-4 text-purple-600" /> Password
                </Label>
                <Input type="password" placeholder="Masukkan password Anda" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              {/* Demo Mode */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                <p className="text-sm font-bold text-blue-900 mb-1 flex items-center gap-2">
                  <Info className="w-4 h-4" /> Demo Mode
                </p>
                <ul className="text-sm space-y-1">
                  <li className="text-blue-600">• siswa@smk.sch.id</li>
                  <li className="text-green-600">• guru@smk.sch.id</li>
                  <li className="text-purple-600">• admin@smk.sch.id</li>
                </ul>
                <div className="mt-2 pt-2 border-t border-blue-200 text-sm text-blue-800">
                  Pass: <span className="font-bold bg-blue-100 px-2 py-0.5 rounded">password</span>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 rounded-md border-gray-300 text-blue-600 focus:ring-blue-200" />
                  <span className="text-sm text-gray-700 font-medium">Ingat saya</span>
                </label>

                <button type="button" className="text-sm text-blue-600 font-semibold hover:underline" onClick={() => alert("Fitur lupa password belum tersedia")}>
                  Lupa password?
                </button>
              </div>

              {/* Login Button */}
              <Button type="submit" className="w-full h-11 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-lg">
                Masuk <Sparkles className="w-4 h-4 ml-2" />
              </Button>

              {/* Divider */}
              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-gray-500 font-semibold">ATAU</span>
                </div>
              </div>

              {/* Register */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Belum punya akun?{" "}
                  <button type="button" className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1" onClick={onRegister}>
                    Daftar Sekarang →
                  </button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-blue-100 text-xs mt-4">© 2024 LMS PBL SMK RPL</p>
      </div>

      {/* ===== ANIMATIONS ===== */}
      <style>{`
  @keyframes float {
    0%, 100% { transform: translate(0, 0); }
    25% { transform: translate(12px, -18px); }
    50% { transform: translate(-10px, -12px); }
    75% { transform: translate(8px, -16px); }
  }

  .animate-float {
    animation: float 8s ease-in-out infinite;
  }

  .delay-150 { animation-delay: 0.15s; }
  .delay-200 { animation-delay: 0.2s; }
  .delay-300 { animation-delay: 0.3s; }
  .delay-500 { animation-delay: 0.5s; }
  .delay-700 { animation-delay: 0.7s; }
  .delay-1000 { animation-delay: 1s; }
`}</style>
    </div>
  );
}
