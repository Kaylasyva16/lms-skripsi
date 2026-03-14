import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Target, 
  Users, 
  Lightbulb, 
  Rocket, 
  CheckCircle, 
  BookOpen, 
  TrendingUp, 
  Award,
  Zap,
  Brain,
  Code2,
  ArrowRight
} from 'lucide-react';

export function AboutPBL() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm">Metode Pembelajaran Modern</span>
              </div>
              
              <h1 className="text-gray-900 mb-6 leading-tight">
                Apa itu<br />
                <span className="text-blue-600">Problem-Based Learning</span>?
              </h1>
              
              <p className="text-gray-600 text-lg mb-6">
                Problem-Based Learning (PBL) adalah metode pembelajaran yang menggunakan masalah nyata 
                sebagai media untuk mengembangkan pengetahuan, keterampilan, dan kompetensi melalui 
                proses investigasi yang terstruktur.
              </p>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Brain className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Metode</p>
                    <p className="text-gray-900">Aktif & Kontekstual</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Code2 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fokus</p>
                    <p className="text-gray-900">Praktik Langsung</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white p-2 rounded-3xl shadow-2xl">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1759646827278-27c5733e0cee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBlZHVjYXRpb24lMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2MjA5NTMyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Modern education"
                  className="w-full h-[400px] object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Skills Section */}
      <section className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 mb-4">
              Keterampilan yang Dikembangkan
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              PBL membantu siswa mengembangkan berbagai kompetensi penting untuk dunia kerja
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Critical Thinking</h3>
              <p className="text-sm text-gray-600">
                Berpikir kritis dan analitis dalam memecahkan masalah
              </p>
            </div>

            <div className="group p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Lightbulb className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Problem Solving</h3>
              <p className="text-sm text-gray-600">
                Kemampuan menemukan solusi kreatif untuk tantangan kompleks
              </p>
            </div>

            <div className="group p-6 rounded-2xl bg-gradient-to-br from-green-50 to-white border border-green-100 hover:border-green-300 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Collaboration</h3>
              <p className="text-sm text-gray-600">
                Bekerja sama efektif dalam tim dan berbagi tanggung jawab
              </p>
            </div>

            <div className="group p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-white border border-orange-100 hover:border-orange-300 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Communication</h3>
              <p className="text-sm text-gray-600">
                Menyampaikan ide dan hasil kerja secara jelas dan persuasif
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Characteristics Section */}
      <section className="w-full bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 mb-4">
              4 Pilar Utama PBL
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Elemen-elemen kunci yang membedakan PBL dengan metode pembelajaran tradisional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Driving Question */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-blue-300 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform"></div>
              <Card className="relative border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Target className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-gray-900 mb-2">Driving Question</h3>
                      <p className="text-sm text-gray-600">
                        Pertanyaan menantang yang mendorong eksplorasi mendalam
                      </p>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-700 mb-2">
                      Setiap pembelajaran dimulai dengan pertanyaan atau masalah nyata yang relevan dengan kehidupan siswa.
                    </p>
                    <div className="flex items-start gap-2 text-sm text-blue-700">
                      <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p className="italic">
                        "Bagaimana cara membuat website e-commerce untuk UMKM lokal?"
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Inquiry & Innovation */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-purple-300 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform"></div>
              <Card className="relative border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-gray-900 mb-2">Inquiry & Innovation</h3>
                      <p className="text-sm text-gray-600">
                        Proses investigasi dan eksperimen yang sistematis
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Riset dan analisis masalah secara mendalam</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Eksplorasi berbagai alternatif solusi</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Iterasi dan perbaikan berkelanjutan</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Collaboration */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-green-300 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform"></div>
              <Card className="relative border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-gray-900 mb-2">Collaboration</h3>
                      <p className="text-sm text-gray-600">
                        Kerja sama tim yang terstruktur dan produktif
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Pembagian tugas yang jelas dan adil</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Komunikasi tim yang efektif dan terbuka</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Saling mendukung dan belajar bersama</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Public Product */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-orange-300 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform"></div>
              <Card className="relative border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 bg-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Rocket className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-gray-900 mb-2">Public Product</h3>
                      <p className="text-sm text-gray-600">
                        Produk nyata yang dipresentasikan dan dipublikasikan
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Website atau aplikasi yang fungsional</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Presentasi dan demo produk kepada publik</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Portfolio digital profesional</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
                Mengapa PBL Cocok<br />
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
                    <p className="text-sm text-gray-600">
                      Belajar konsep programming melalui aplikasi nyata, bukan sekadar menghafal teori. 
                      Siswa langsung memahami bagaimana kode bekerja dalam konteks dunia nyata.
                    </p>
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
                    <p className="text-sm text-gray-600">
                      Mengembangkan soft skills seperti problem solving, teamwork, dan komunikasi yang 
                      sangat dibutuhkan industri IT. Portfolio solusi masalah menjadi nilai tambah saat melamar kerja.
                    </p>
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
                    <p className="text-sm text-gray-600">
                      Masalah yang menarik dan relevan meningkatkan motivasi belajar. Dengan sistem gamifikasi, 
                      siswa lebih engaged dan bersemangat menyelesaikan setiap tantangan.
                    </p>
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
            <h2 className="text-white mb-4">
              Implementasi PBL di Platform Kami
            </h2>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Bagaimana kami menerapkan metode PBL secara efektif dalam pembelajaran digital
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4">
                <Code2 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-white mb-2">Masalah Terstruktur</h3>
              <p className="text-sm text-blue-100">
                Setiap masalah memiliki tahapan jelas: identifikasi, perencanaan, penyusunan jadwal, pelaksanaan, dan evaluasi
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-white mb-2">Level System</h3>
              <p className="text-sm text-blue-100">
                Masalah dikategorikan dalam 3 level (Beginner, Intermediate, Expert) sesuai kompleksitas
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-white mb-2">Forum Kolaborasi</h3>
              <p className="text-sm text-blue-100">
                Diskusi aktif dengan teman dan guru untuk berbagi solusi dan mengatasi kendala
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-white mb-2">Gamifikasi</h3>
              <p className="text-sm text-blue-100">
                Sistem poin, badge, dan leaderboard untuk meningkatkan motivasi dan engagement
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-white mb-2">Progress Tracking</h3>
              <p className="text-sm text-blue-100">
                Pantau progres pembelajaran secara real-time melalui dashboard interaktif
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-white mb-2">Evaluasi Komprehensif</h3>
              <p className="text-sm text-blue-100">
                Penilaian holistik dari hasil akhir, proses kerja, dan kolaborasi tim
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
