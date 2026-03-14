import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { BookOpen, CheckCircle, ArrowRight, Code2, ClipboardCheck, FolderKanban, Award, Target, Users, Lightbulb, TrendingUp, Github, Twitter, Linkedin } from "lucide-react";

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="w-full">
      {/* 1. Hero Section - Platform LMS */}
      <section className="w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h1 className="text-gray-900 mb-6 leading-tight">
                Platform LMS Berbasis
                <br />
                <span className="text-blue-600">Problem-Based Learning</span>
                <br />
                untuk SMK RPL
              </h1>

              <p className="text-gray-600 mb-8 max-w-lg text-lg">
                Tingkatkan kompetensi pemrograman dengan sistem pembelajaran berbasis proyek yang interaktif, terstruktur, dan dilengkapi dengan gamifikasi untuk pengalaman belajar yang lebih menyenangkan.
              </p>

              <div className="flex items-center gap-4 flex-wrap">
                <Button size="lg" onClick={() => setCurrentPage("login")} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Mulai Belajar Sekarang
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => onNavigate("about")} className="border-gray-300">
                  Tentang PBL
                </Button>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-3xl transform rotate-3"></div>
                <div className="relative bg-white p-2 rounded-3xl shadow-2xl">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1758270705518-b61b40527e76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMGxlYXJuaW5nJTIwbGFwdG9wJTIwY2xhc3Nyb29tfGVufDF8fHx8MTc2MjE3MzM0Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Students learning"
                    className="w-full h-[400px] object-cover rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Features Section - Penjelasan Fitur */}
      <section className="w-full bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 mb-4">Fitur Utama Platform</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Platform LMS yang dilengkapi dengan berbagai fitur pembelajaran untuk mendukung perjalanan belajar programming Anda</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Materi */}
            <Card className="border-2 border-gray-100 hover:border-yellow-200 hover:shadow-lg transition-all">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-gray-900 mb-3">Materi</h3>
                <p className="text-sm text-gray-600 mb-4">Materi pembelajaran terstruktur dari dasar hingga mahir, disusun sesuai kurikulum SMK RPL</p>
                <ul className="space-y-2 text-left">
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span>Konten lengkap & terstruktur</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span>Video tutorial interaktif</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span>Modul downloadable</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Kuis */}
            <Card className="border-2 border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ClipboardCheck className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-gray-900 mb-3">Kuis</h3>
                <p className="text-sm text-gray-600 mb-4">Uji pemahaman dengan kuis interaktif di setiap materi untuk mengukur progress belajar Anda</p>
                <ul className="space-y-2 text-left">
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>Soal pilihan ganda</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>Instant feedback</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>Score tracking</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Project */}
            <Card className="border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FolderKanban className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-gray-900 mb-3">Project</h3>
                <p className="text-sm text-gray-600 mb-4">Belajar dengan mengerjakan proyek nyata dari level Beginner, Intermediate, hingga Expert</p>
                <ul className="space-y-2 text-left">
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>15+ proyek terstruktur</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Panduan step-by-step</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Portfolio builder</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Nilai */}
            <Card className="border-2 border-gray-100 hover:border-green-200 hover:shadow-lg transition-all">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-gray-900 mb-3">Nilai</h3>
                <p className="text-sm text-gray-600 mb-4">Pantau progress pembelajaran dengan sistem penilaian otomatis dan detail report</p>
                <ul className="space-y-2 text-left">
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Penilaian otomatis</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Progress dashboard</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Sertifikat digital</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. Why Choose Platform - Kenapa Belajar dengan Platform Ini */}
      <section className="w-full bg-gradient-to-br from-blue-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-600 rounded-3xl transform -rotate-3"></div>
              <div className="relative bg-white p-2 rounded-3xl shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1759884248009-92c5e6957708e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwY29kaW5nJTIwbGFwdG9wfGVufDF8fHx8MTc2MjEyOTQ4Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Student coding"
                  className="w-full h-[450px] object-cover rounded-2xl"
                />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
                <Target className="w-4 h-4" />
                <span className="text-sm">Keunggulan Platform</span>
              </div>

              <h2 className="text-gray-900 mb-6">
                Mengapa Belajar dengan
                <br />
                <span className="text-blue-600">Platform Ini?</span>
              </h2>

              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-2">Pembelajaran Terstruktur</h3>
                    <p className="text-gray-600">Materi disusun secara sistematis dari dasar hingga advanced, memudahkan siswa memahami konsep programming secara bertahap dan terorganisir</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-2">Gamifikasi yang Memotivasi</h3>
                    <p className="text-gray-600">Sistem poin, badge, dan leaderboard membuat belajar lebih seru dan kompetitif. Siswa termotivasi untuk terus berkembang dan mencapai level tertinggi</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-2">Belajar Kapan Saja, Dimana Saja</h3>
                    <p className="text-gray-600">Akses materi 24/7 dengan platform berbasis web yang responsif. Fleksibilitas belajar sesuai dengan kecepatan dan jadwal masing-masing siswa</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-2">Dukungan Komunitas & Mentor</h3>
                    <p className="text-gray-600">Forum diskusi aktif dan bimbingan dari guru membantu siswa mengatasi kesulitan dan berkembang bersama dalam komunitas yang supportif</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Why PBL - Kenapa Problem Based Learning */}
      <section className="w-full bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-6">
                <Lightbulb className="w-4 h-4" />
                <span className="text-sm">Metode Pembelajaran</span>
              </div>

              <h2 className="text-gray-900 mb-6">
                Mengapa <span className="text-blue-600">Problem-Based Learning</span>?
              </h2>

              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-2">Pembelajaran Kontekstual & Aplikatif</h3>
                    <p className="text-gray-600">Belajar melalui proyek nyata membuat siswa memahami bagaimana teori programming diterapkan dalam aplikasi dunia nyata, bukan hanya hafalan konsep</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-2">Meningkatkan Problem Solving Skills</h3>
                    <p className="text-gray-600">Setiap proyek menghadirkan tantangan yang melatih kemampuan berpikir kritis, analisis masalah, dan mencari solusi kreatif secara mandiri</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-2">Membangun Portfolio Profesional</h3>
                    <p className="text-gray-600">Setiap proyek yang diselesaikan menjadi bagian dari portfolio yang dapat ditampilkan kepada calon employer atau untuk melanjutkan pendidikan</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-2">Keterampilan Kolaborasi & Komunikasi</h3>
                    <p className="text-gray-600">PBL mendorong kerja sama tim, diskusi, dan presentasi yang merupakan soft skills penting di industri IT profesional</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-2">Siap Menghadapi Dunia Kerja</h3>
                    <p className="text-gray-600">Pengalaman mengerjakan proyek dari awal hingga selesai mempersiapkan siswa dengan skills praktis yang dibutuhkan industri IT</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative order-first lg:order-last">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white p-2 rounded-3xl shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1758691736804-4e88c52ad58b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwcHJvamVjdCUyMGNvbGxhYm9yYXRpb258ZW58MXx8fHwxNzYyMTczMzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Team collaboration"
                  className="w-full h-[500px] object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA Section - Ajakan Belajar */}
      <section className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-white mb-6">
            Siap Memulai Perjalanan
            <br />
            Belajar Programming Anda?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">Bergabunglah dengan ribuan siswa SMK RPL yang sudah mengembangkan skill programming mereka melalui pembelajaran berbasis proyek. Mulai belajar sekarang, 100% gratis!</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button size="lg" onClick={() => onNavigate("login")} className="gap-2 bg-white text-blue-600 hover:bg-blue-50 px-8">
              Daftar Sekarang
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => onNavigate("about")} className="gap-2 border-white text-white hover:bg-white/10">
              Pelajari Lebih Lanjut
            </Button>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 text-white">
              <Users className="w-6 h-6" />
              <div className="text-left">
                <p className="text-sm text-blue-100">Siswa Aktif</p>
                <p>2,500+</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 text-white">
              <FolderKanban className="w-6 h-6" />
              <div className="text-left">
                <p className="text-sm text-blue-100">Project Tersedia</p>
                <p>15+</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 text-white">
              <TrendingUp className="w-6 h-6" />
              <div className="text-left">
                <p className="text-sm text-blue-100">Tingkat Kepuasan</p>
                <p>95%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white">LMS PBL</p>
                  <p className="text-xs text-gray-400">SMK RPL Learning</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-4">Platform pembelajaran berbasis proyek untuk siswa SMK jurusan Rekayasa Perangkat Lunak</p>
              <div className="flex items-center gap-3">
                <button className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <Github className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <Twitter className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Fitur */}
            <div>
              <h3 className="text-white mb-4">Fitur</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button onClick={() => onNavigate("project")} className="hover:text-white transition-colors">
                    Materi Pembelajaran
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate("project")} className="hover:text-white transition-colors">
                    Kuis Interaktif
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate("project")} className="hover:text-white transition-colors">
                    Problem-Based Learning
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate("leaderboard")} className="hover:text-white transition-colors">
                    Sistem Penilaian
                  </button>
                </li>
              </ul>
            </div>

            {/* Platform */}
            <div>
              <h3 className="text-white mb-4">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button onClick={() => onNavigate("dashboard")} className="hover:text-white transition-colors">
                    Dashboard
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate("leaderboard")} className="hover:text-white transition-colors">
                    Leaderboard
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate("forum")} className="hover:text-white transition-colors">
                    Forum Diskusi
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate("profile")} className="hover:text-white transition-colors">
                    Profil Siswa
                  </button>
                </li>
              </ul>
            </div>

            {/* Informasi */}
            <div>
              <h3 className="text-white mb-4">Informasi</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button onClick={() => onNavigate("about")} className="hover:text-white transition-colors">
                    Tentang PBL
                  </button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">Panduan Penggunaan</button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">FAQ</button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">Kontak</button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-400">&copy; 2024 LMS PBL. All rights reserved. Platform pembelajaran untuk SMK RPL.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
