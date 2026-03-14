import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Trophy, Medal, Star, TrendingUp } from 'lucide-react';

const students = [
  {
    id: 1,
    name: 'Ahmad Rizki',
    class: 'XII RPL 1',
    points: 2450,
    level: 'Expert',
    projectsCompleted: 12,
    badges: 8,
    rank: 1,
    trend: 'up'
  },
  {
    id: 2,
    name: 'Siti Nurhaliza',
    class: 'XII RPL 1',
    points: 2380,
    level: 'Expert',
    projectsCompleted: 11,
    badges: 7,
    rank: 2,
    trend: 'up'
  },
  {
    id: 3,
    name: 'Budi Santoso',
    class: 'XII RPL 2',
    points: 2250,
    level: 'Intermediate',
    projectsCompleted: 10,
    badges: 6,
    rank: 3,
    trend: 'same'
  },
  {
    id: 4,
    name: 'Dewi Lestari',
    class: 'XII RPL 1',
    points: 2100,
    level: 'Intermediate',
    projectsCompleted: 9,
    badges: 6,
    rank: 4,
    trend: 'down'
  },
  {
    id: 5,
    name: 'Eko Prasetyo',
    class: 'XII RPL 3',
    points: 1950,
    level: 'Intermediate',
    projectsCompleted: 8,
    badges: 5,
    rank: 5,
    trend: 'up'
  },
  {
    id: 6,
    name: 'Fitri Handayani',
    class: 'XII RPL 2',
    points: 1850,
    level: 'Intermediate',
    projectsCompleted: 8,
    badges: 5,
    rank: 6,
    trend: 'up'
  },
  {
    id: 7,
    name: 'Galih Permana',
    class: 'XII RPL 3',
    points: 1750,
    level: 'Beginner',
    projectsCompleted: 7,
    badges: 4,
    rank: 7,
    trend: 'same'
  },
  {
    id: 8,
    name: 'Hana Safitri',
    class: 'XII RPL 1',
    points: 1680,
    level: 'Beginner',
    projectsCompleted: 7,
    badges: 4,
    rank: 8,
    trend: 'up'
  }
];

const topClasses = [
  { name: 'XII RPL 1', avgPoints: 1980, students: 32 },
  { name: 'XII RPL 2', avgPoints: 1850, students: 30 },
  { name: 'XII RPL 3', avgPoints: 1720, students: 31 }
];

export function Leaderboard() {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert':
        return 'bg-purple-500';
      case 'Intermediate':
        return 'bg-blue-500';
      case 'Beginner':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-600" />;
    return <span className="text-gray-500">{rank}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-white">Papan Skor</CardTitle>
              <CardDescription className="text-blue-100">
                Kompetisi sehat untuk meningkatkan semangat belajar
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Semua Siswa</TabsTrigger>
          <TabsTrigger value="class">Per Kelas</TabsTrigger>
          <TabsTrigger value="week">Mingguan</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Top 3 Podium */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {students.slice(0, 3).map((student, index) => (
              <Card
                key={student.id}
                className={`${
                  index === 0
                    ? 'border-yellow-400 border-2 shadow-lg'
                    : index === 1
                    ? 'border-gray-300 border-2'
                    : 'border-orange-400 border-2'
                }`}
              >
                <CardContent className="pt-6 text-center">
                  <div className="mb-3 flex justify-center">{getRankIcon(student.rank)}</div>
                  <Avatar className="w-16 h-16 mx-auto mb-3 border-4 border-white shadow-md">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-blue-500 text-white">
                      {student.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <p className="mb-1">{student.name}</p>
                  <p className="text-sm text-gray-600 mb-3">{student.class}</p>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-blue-600">{student.points} Poin</span>
                  </div>
                  <Badge className={getLevelColor(student.level)}>{student.level}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Full Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle>Peringkat Lengkap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className={`flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors ${
                      student.rank <= 3 ? 'bg-blue-50' : 'bg-white border'
                    }`}
                  >
                    <div className="w-12 text-center flex-shrink-0">
                      {student.rank <= 3 ? (
                        getRankIcon(student.rank)
                      ) : (
                        <span className="text-gray-500">#{student.rank}</span>
                      )}
                    </div>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-blue-500 text-white text-sm">
                        {student.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="mb-0.5">{student.name}</p>
                      <p className="text-sm text-gray-600">{student.class}</p>
                    </div>
                    <div className="text-right mr-4">
                      <p className="text-sm text-gray-600 mb-0.5">Proyek Selesai</p>
                      <p className="text-blue-600">{student.projectsCompleted}</p>
                    </div>
                    <div className="text-right mr-4">
                      <p className="text-sm text-gray-600 mb-0.5">Badge</p>
                      <p className="text-purple-600">{student.badges}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-blue-900">{student.points}</span>
                      </div>
                      <Badge className={getLevelColor(student.level)} variant="secondary">
                        {student.level}
                      </Badge>
                    </div>
                    <div className="w-8 flex-shrink-0">
                      {student.trend === 'up' && <TrendingUp className="w-5 h-5 text-green-500" />}
                      {student.trend === 'down' && (
                        <TrendingUp className="w-5 h-5 text-red-500 rotate-180" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="class" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Peringkat Kelas</CardTitle>
              <CardDescription>Berdasarkan rata-rata poin siswa di setiap kelas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topClasses.map((classData, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-900">#{index + 1}</span>
                          </div>
                          <div>
                            <p className="mb-1">{classData.name}</p>
                            <p className="text-sm text-gray-600">{classData.students} Siswa</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-1">Rata-rata Poin</p>
                          <p className="text-blue-900">{classData.avgPoints}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="week" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performer Minggu Ini</CardTitle>
              <CardDescription>Siswa dengan poin terbanyak minggu ini (9-15 Okt 2025)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {students.slice(0, 5).map((student, index) => (
                  <div
                    key={student.id}
                    className="flex items-center gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 text-center flex-shrink-0">
                      <span className="text-gray-500">#{index + 1}</span>
                    </div>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-blue-500 text-white text-sm">
                        {student.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="mb-0.5">{student.name}</p>
                      <p className="text-sm text-gray-600">{student.class}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-green-600 border-green-300">
                        +{Math.floor(Math.random() * 300) + 150} Poin
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
