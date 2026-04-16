import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Target, Users, Lightbulb, Rocket, CheckCircle, BookOpen, TrendingUp, Award, Zap, Brain, Code2, ArrowRight, Sparkles } from "lucide-react";

export function AboutPBL() {
  return (
    <div className="w-full">
      {/* Hero Section - Sama seperti landing page dengan gradient */}
      <section className="relative w-full bg-gradient-to-br from-blue-500 to-blue-700 py-20 lg:py-28 overflow-hidden">
        {/* Subtle Pattern Background */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/30">
                <BookOpen className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-medium">Metode Pembelajaran Modern</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Belajar Lewat <br />
                <span className="text-yellow-300">Masalah Nyata</span>
              </h1>

              <p className="text-blue-100 text-lg sm:text-xl mb-8 leading-relaxed max-w-xl">Bukan cuma teori. Kamu langsung praktik, cari solusi, dan bikin project seperti di dunia kerja.</p>

              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                    <Brain className="w-6 h-6 text-yellow-300" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-200">Metode</p>
                    <p className="text-white font-semibold">Aktif & Kontekstual</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                    <Code2 className="w-6 h-6 text-yellow-300" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-200">Fokus</p>
                    <p className="text-white font-semibold">Praktik Langsung</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-3xl rotate-12 opacity-80 blur-sm"></div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-pink-400 rounded-3xl -rotate-12 opacity-80 blur-sm"></div>

              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1759646827278-27c5733e0cee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBlZHVjYXRpb24lMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2MjA5NTMyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Modern education"
                  className="w-full h-[450px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Skills Section - Colorful Cards seperti landing page */}
      <section className="w-full bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Skills Development</span>
            </div>
            <h2 className="text-gray-900 mb-4">Keterampilan yang Dikembangkan</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">PBL membantu siswa mengembangkan berbagai kompetensi penting untuk dunia kerja</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="group border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="pt-8">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-gray-900 mb-2">Critical Thinking</h3>
                <p className="text-sm text-gray-600">Berpikir kritis dan analitis dalam memecahkan masalah</p>
              </CardContent>
            </Card>

            <Card className="group border-2 border-purple-200 hover:border-purple-400 hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-white">
              <CardContent className="pt-8">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Lightbulb className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-gray-900 mb-2">Problem Solving</h3>
                <p className="text-sm text-gray-600">Kemampuan menemukan solusi kreatif untuk tantangan kompleks</p>
              </CardContent>
            </Card>

            <Card className="group border-2 border-green-200 hover:border-green-400 hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-br from-green-50 to-white">
              <CardContent className="pt-8">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-gray-900 mb-2">Collaboration</h3>
                <p className="text-sm text-gray-600">Bekerja sama efektif dalam tim dan berbagi tanggung jawab</p>
              </CardContent>
            </Card>

            <Card className="group border-2 border-orange-200 hover:border-orange-400 hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-br from-orange-50 to-white">
              <CardContent className="pt-8">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-gray-900 mb-2">Communication</h3>
                <p className="text-sm text-gray-600">Menyampaikan ide dan hasil kerja secara jelas dan persuasif</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-6">
                <Award className="w-4 h-4" />
                <span className="text-sm">Manfaat PBL</span>
              </div>

              <h2 className="text-gray-900 mb-6">
                Mengapa PBL Cocok
                <br />
                untuk <span className="text-blue-600">Siswa RPL</span>?
              </h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-2">Pembelajaran Lebih Bermakna</h3>
                    <p className="text-sm text-gray-600">Belajar konsep programming melalui aplikasi nyata, bukan sekadar menghafal teori. Siswa langsung memahami bagaimana kode bekerja dalam konteks dunia nyata.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Award className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-2">Persiapan Dunia Kerja</h3>
                    <p className="text-sm text-gray-600">Mengembangkan soft skills seperti problem solving, teamwork, dan komunikasi yang sangat dibutuhkan industri IT. Portfolio solusi masalah menjadi nilai tambah saat melamar kerja.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Rocket className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-2">Motivasi & Engagement Tinggi</h3>
                    <p className="text-sm text-gray-600">Masalah yang menarik dan relevan meningkatkan motivasi belajar. Dengan sistem gamifikasi, siswa lebih engaged dan bersemangat menyelesaikan setiap tantangan.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-600 rounded-3xl transform -rotate-3"></div>
              <div className="relative bg-white p-2 rounded-3xl shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwd29ya3NwYWNlJTIwbGVhcm5pbmd8ZW58MXx8fHwxNzYyMTczNzM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Workspace learning"
                  className="w-full h-[450px] object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Section */}
      <section className="w-full bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-white mb-4">Implementasi PBL di Platform Kami</h2>
            <p className="text-blue-100 max-w-2xl mx-auto">Bagaimana kami menerapkan metode PBL secara efektif dalam pembelajaran digital</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4">
                <Code2 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-white mb-2">Masalah Terstruktur</h3>
              <p className="text-sm text-blue-100">Setiap masalah memiliki tahapan jelas: identifikasi, perencanaan, penyusunan jadwal, pelaksanaan, dan evaluasi</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-white mb-2">Level System</h3>
              <p className="text-sm text-blue-100">Masalah dikategorikan dalam 3 level (Beginner, Intermediate, Expert) sesuai kompleksitas</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-white mb-2">Forum Kolaborasi</h3>
              <p className="text-sm text-blue-100">Diskusi aktif dengan teman dan guru untuk berbagi solusi dan mengatasi kendala</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-white mb-2">Gamifikasi</h3>
              <p className="text-sm text-blue-100">Sistem poin, badge, dan leaderboard untuk meningkatkan motivasi dan engagement</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-white mb-2">Progress Tracking</h3>
              <p className="text-sm text-blue-100">Pantau progres pembelajaran secara real-time melalui dashboard interaktif</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-white mb-2">Evaluasi Komprehensif</h3>
              <p className="text-sm text-blue-100">Penilaian holistik dari hasil akhir, proses kerja, dan kolaborasi tim</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
