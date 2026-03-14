import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Mail, Phone, MapPin, Calendar, Award, BookOpen, Trophy, Star, Edit } from "lucide-react";
import { useEffect, useState } from "react";

const projectHistory = [
  {
    id: 1,
    title: "Website Portfolio",
    date: "5 Okt 2025",
    score: 95,
    level: "Beginner",
    status: "completed",
  },
  {
    id: 2,
    title: "Aplikasi To-Do List",
    date: "20 Sep 2025",
    score: 88,
    level: "Beginner",
    status: "completed",
  },
  {
    id: 3,
    title: "Kalkulator Sederhana",
    date: "10 Sep 2025",
    score: 92,
    level: "Beginner",
    status: "completed",
  },
  {
    id: 4,
    title: "Landing Page Produk",
    date: "25 Agu 2025",
    score: 90,
    level: "Beginner",
    status: "completed",
  },
  {
    id: 5,
    title: "Form Validasi",
    date: "15 Agu 2025",
    score: 85,
    level: "Beginner",
    status: "completed",
  },
];

const achievements = [
  { name: "First Project", description: "Menyelesaikan proyek pertama", icon: "🎯", earned: true, date: "15 Agu 2025" },
  { name: "Fast Learner", description: "Menyelesaikan 5 proyek dalam sebulan", icon: "⚡", earned: true, date: "5 Sep 2025" },
  { name: "Team Player", description: "Aktif dalam kolaborasi tim", icon: "🤝", earned: true, date: "20 Sep 2025" },
  { name: "Code Master", description: "Mendapat nilai 95+ pada 3 proyek", icon: "💻", earned: false, date: "-" },
  { name: "Perfect Score", description: "Mendapat nilai 100", icon: "🌟", earned: false, date: "-" },
  { name: "Helpful Hand", description: "Membantu 10 teman di forum", icon: "🙌", earned: false, date: "-" },
  { name: "Early Bird", description: "Mengumpulkan 5 proyek sebelum deadline", icon: "🐦", earned: true, date: "10 Okt 2025" },
  { name: "Night Owl", description: "Aktif belajar malam hari", icon: "🦉", earned: false, date: "-" },
];

const skills = [
  { name: "HTML & CSS", level: 90 },
  { name: "JavaScript", level: 75 },
  { name: "Java", level: 80 },
  { name: "MySQL", level: 70 },
  { name: "Git & GitHub", level: 65 },
  { name: "Problem Solving", level: 85 },
];

export function StudentProfile() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    fetch("http://localhost:5000/api/auth/me", {
      headers: {
        Authorization: token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      })
      .catch((err) => console.error(err));
  }, []);

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                <AvatarImage src="" />
                <AvatarFallback className="bg-blue-500 text-white text-2xl">AR</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center border-4 border-white">
                <Trophy className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="text-blue-900 mb-2">{user?.nama || "Loading..."}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{user?.nama_kelas}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>NIS: {user?.nis}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-blue-500">Intermediate</Badge>
                    <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                      <Star className="w-3 h-3 mr-1" />
                      1,250 Poin
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Profil
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-600">ahmad.rizki@smk.sch.id</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-600">+62 812-3456-7890</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-600">Jakarta, Indonesia</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-gray-600 text-sm mb-1">Total Proyek</p>
            <p className="text-blue-900">8 Proyek</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-gray-600 text-sm mb-1">Rata-rata Nilai</p>
            <p className="text-blue-900">90.0</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-gray-600 text-sm mb-1">Badge Terkumpul</p>
            <p className="text-blue-900">4 / 8</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
            <p className="text-gray-600 text-sm mb-1">Peringkat Kelas</p>
            <p className="text-blue-900">#3</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList>
          <TabsTrigger value="projects">Riwayat Proyek</TabsTrigger>
          <TabsTrigger value="badges">Badge & Pencapaian</TabsTrigger>
          <TabsTrigger value="skills">Keterampilan</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Proyek</CardTitle>
              <CardDescription>Daftar semua proyek yang telah diselesaikan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {projectHistory.map((project) => (
                  <Card key={project.id} className="border-l-4 border-l-green-500">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3>{project.title}</h3>
                            <Badge variant="outline" className="text-blue-600 border-blue-300">
                              {project.level}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">Diselesaikan pada {project.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-1">Nilai</p>
                          <p className="text-blue-900">{project.score}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Badge & Pencapaian</CardTitle>
              <CardDescription>Koleksi badge yang telah kamu raih</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <Card key={index} className={`${achievement.earned ? "border-l-4 border-l-blue-500 bg-blue-50" : "opacity-50 bg-gray-50"}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${achievement.earned ? "bg-gradient-to-br from-blue-100 to-blue-200" : "bg-gray-200"}`}>{achievement.icon}</div>
                        <div className="flex-1">
                          <h3 className="mb-1">{achievement.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                          {achievement.earned && <p className="text-sm text-blue-600">Diraih pada: {achievement.date}</p>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Keterampilan</CardTitle>
              <CardDescription>Level penguasaan berbagai teknologi dan soft skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span>{skill.name}</span>
                      <Badge variant="outline">{skill.level}%</Badge>
                    </div>
                    <Progress value={skill.level} className="h-3" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="mb-2">Tips Meningkatkan Skills</p>
                  <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                    <li>Kerjakan lebih banyak proyek untuk meningkatkan pengalaman</li>
                    <li>Ikuti tutorial dan dokumentasi resmi teknologi yang kamu pelajari</li>
                    <li>Berkolaborasi dengan teman untuk belajar best practices</li>
                    <li>Aktif bertanya dan menjawab di forum diskusi</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
