import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { BookOpen, ArrowRight, Code2, ClipboardCheck, FolderKanban, Github, Twitter, Linkedin, Sparkles, Zap, Star, Rocket } from "lucide-react";
import { motion } from "framer-motion";

import { MessageCircle } from "lucide-react";

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="w-full overflow-x-hidden">
      {/* HERO */}
      <section className="relative w-full bg-gradient-to-br from-blue-500 to-blue-700 py-14 sm:py-16 lg:py-28">
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.2 } },
              }}
              className="text-white"
            >
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 0.6, repeat: Infinity }} className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6 border border-white/30">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-sm sm:text-base">Platform LMS Terbaik untuk SMK RPL</span>
              </motion.div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Belajar Coding Tidak <br />
                <span className="whitespace-nowrap">
                  Harus <span className="text-yellow-300">Ribet</span> 🚀
                </span>
              </h1>

              <p className="text-base sm:text-lg text-blue-100 mb-8 max-w-lg">Belajar, latihan, dan bikin project dengan cara yang simpel dan terarah.</p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => onNavigate("login")} className="w-full sm:w-auto justify-center gap-2 px-6 sm:px-8 h-12 sm:h-14 text-sm sm:text-base bg-white text-blue-600 hover:bg-yellow-300">
                  Mulai Belajar <ArrowRight className="w-5 h-5" />
                </Button>

                <Button variant="outline" onClick={() => onNavigate("about")} className="w-full sm:w-auto justify-center px-6 sm:px-8 h-12 sm:h-14 text-sm sm:text-base text-white border-white/30 bg-white/10 hover:bg-white/20">
                  Tentang PBL
                </Button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
              <ImageWithFallback src="https://images.unsplash.com/photo-1758270705518-b61b40527e76" alt="Students" className="w-full h-[250px] sm:h-[350px] lg:h-[450px] object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Features Section - Colorful Cards */}
      <section className="w-full bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* HEADER */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full mb-4">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Fitur Lengkap!</span>
            </div>

            <h2 className="text-gray-900 mb-4">Semua yang Kamu Butuhkan</h2>

            <p className="text-gray-600 max-w-2xl mx-auto text-lg">Platform all-in-one untuk belajar programming dari nol sampai pro</p>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Materi */}
            <Card className="group border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="pt-8">
                <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-gray-900 mb-2">Materi Lengkap</h3>
                <p className="text-sm text-gray-600">36 modul pembelajaran terstruktur</p>
              </CardContent>
            </Card>

            {/* Kuis */}
            <Card className="group border-2 border-purple-200 hover:border-purple-400 hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-white">
              <CardContent className="pt-8">
                <div className="w-14 h-14 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <ClipboardCheck className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-gray-900 mb-2">Kuis Interaktif</h3>
                <p className="text-sm text-gray-600">Test kemampuan dengan feedback</p>
              </CardContent>
            </Card>

            {/* Project */}
            <Card className="group border-2 border-green-200 hover:border-green-400 hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-br from-green-50 to-white">
              <CardContent className="pt-8">
                <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center mb-4">
                  <FolderKanban className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-gray-900 mb-2">Project Real</h3>
                <p className="text-sm text-gray-600">Build portfolio nyata</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. CTA Section - Gradient Background */}
      <section className="relative w-full bg-gradient-to-br from-blue-500 to-blue-700 py-20 overflow-hidden">
        {/* Dot Pattern - Biar sama persis kyk Hero */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/30">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="font-medium text-white text-sm sm:text-base">Mulai Masa Depanmu di SMK!</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Bikin Portofolio <span className="text-yellow-300">Kamu!</span>
          </h2>

          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">Belajar coding lewat project riil standar industri. Gratis buat kamu, siswa SMK RPL!</p>

          <div className="flex items-center justify-center">
            <Button onClick={() => onNavigate("register")} className="group flex items-center gap-2 bg-white text-blue-600 hover:bg-yellow-300 hover:text-blue-700 px-8 h-14 text-lg font-semibold rounded-xl shadow-md transition-all">
              Mulai Belajar
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>
      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="text-center sm:text-left">
            <div className="flex items-center gap-3 mb-4 justify-center sm:justify-start">
              <Code2 className="text-white" />
              <span className="text-white font-bold">LMS PBL</span>
            </div>
            <p className="text-sm">Platform coding untuk siswa SMK RPL</p>
          </div>

          <div>
            <h3 className="text-white mb-3">Fitur</h3>
            <ul className="space-y-2 text-sm">
              <li>Materi</li>
              <li>Kuis</li>
              <li>Project</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white mb-3">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>Dashboard</li>
              <li>Forum</li>
              <li>Profile</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white mb-3">Social</h3>
            <div className="flex gap-3 justify-center sm:justify-start">
              <Github />
              <Twitter />
              <Linkedin />
            </div>
          </div>
        </div>

        <div className="text-center mt-8 text-sm">© 2024 LMS PBL</div>
      </footer>
    </div>
  );
}
