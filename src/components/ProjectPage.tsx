import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar, Award, CheckCircle, Clock, UserPlus, Users2, FileText } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { ProjectDetailPage } from './ProjectDetailPage';

const groupMembers = [
  {
    no: 1,
    name: 'Ahmad Rizki',
    absen: '01',
    status: 'Ketua'
  },
  {
    no: 2,
    name: 'Siti Nurhaliza',
    absen: '15',
    status: 'Anggota'
  },
  {
    no: 3,
    name: 'Budi Santoso',
    absen: '08',
    status: 'Anggota'
  }
];

export function ProjectPage() {
  const [members, setMembers] = useState(groupMembers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', absen: '', status: 'Anggota' });
  const [showDetail, setShowDetail] = useState(false);

  const handleAddMember = () => {
    if (!newMember.name || !newMember.absen) {
      toast.error('Mohon lengkapi data anggota');
      return;
    }

    const member = {
      no: members.length + 1,
      name: newMember.name,
      absen: newMember.absen,
      status: newMember.status
    };

    setMembers([...members, member]);
    setNewMember({ name: '', absen: '', status: 'Anggota' });
    setIsDialogOpen(false);
    toast.success('Anggota berhasil ditambahkan!');
  };

  // Show detail page if showDetail is true
  if (showDetail) {
    return <ProjectDetailPage onClose={() => setShowDetail(false)} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-gray-900 mb-2">Problem Based Learning</h2>
        <p className="text-gray-600">Detail problem dan manajemen kelompok</p>
      </div>

      {/* Deskripsi Proyek */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            Deskripsi Proyek
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-gray-900 mb-2">Sistem Informasi Perpustakaan Digital</h3>
              <p className="text-gray-600 leading-relaxed">
                Membuat aplikasi sistem informasi perpustakaan digital berbasis web menggunakan PHP dan MySQL. 
                Aplikasi harus memiliki fitur manajemen buku, manajemen anggota, peminjaman dan pengembalian buku, 
                serta laporan. Siswa akan belajar konsep CRUD, relasi database, autentikasi, dan UI/UX design.
              </p>
            </div>

            <div className="pt-3 border-t">
              <h4 className="text-gray-900 mb-3">Tujuan Pembelajaran:</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  <span>Memahami konsep sistem informasi dan database relational</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  <span>Mampu mengimplementasikan operasi CRUD dengan PHP dan MySQL</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  <span>Membangun interface yang user-friendly dan responsif</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  <span>Bekerja sama dalam tim untuk menyelesaikan proyek</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail Proyek */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-500" />
            Detail Proyek
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Nama Proyek */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Nama Proyek</p>
                <p className="text-gray-900">Sistem Informasi Perpustakaan Digital</p>
              </div>
            </div>

            {/* Tenggat Waktu */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Tenggat Waktu</p>
                <p className="text-gray-900">20 Desember 2025</p>
              </div>
            </div>

            {/* Nilai */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-purple-50 border border-purple-200">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Nilai</p>
                <p className="text-gray-900">-</p>
                <p className="text-xs text-gray-500">Belum dinilai</p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-orange-50 border border-orange-200">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <Badge className="bg-orange-500 hover:bg-orange-600">
                  Sedang Dikerjakan
                </Badge>
              </div>
            </div>
          </div>

          {/* Button Detail Proyek */}
          <div className="pt-4 border-t">
            <Button 
              className="bg-blue-500 hover:bg-blue-600 gap-2"
              onClick={() => setShowDetail(true)}
            >
              <FileText className="w-4 h-4" />
              Lihat Detail Proyek Lengkap
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabel Anggota Kelompok */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users2 className="w-5 h-5 text-green-500" />
              Anggota Kelompok
            </CardTitle>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-500 hover:bg-green-600 gap-2">
                  <UserPlus className="w-4 h-4" />
                  Tambah Anggota
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Tambah Anggota Kelompok</DialogTitle>
                  <DialogDescription>
                    Masukkan data anggota kelompok baru
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                      id="name"
                      placeholder="Masukkan nama lengkap"
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="absen">No Absen</Label>
                    <Input
                      id="absen"
                      placeholder="Masukkan nomor absen"
                      value={newMember.absen}
                      onChange={(e) => setNewMember({ ...newMember, absen: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newMember.status}
                      onValueChange={(value) => setNewMember({ ...newMember, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ketua">Ketua</SelectItem>
                        <SelectItem value="Anggota">Anggota</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button className="bg-green-500 hover:bg-green-600" onClick={handleAddMember}>
                    Tambah
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-16">No</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead className="w-32">No Absen</TableHead>
                  <TableHead className="w-32">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.no}>
                    <TableCell>{member.no}</TableCell>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.absen}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          member.status === 'Ketua'
                            ? 'bg-blue-500 hover:bg-blue-600'
                            : 'bg-gray-500 hover:bg-gray-600'
                        }
                      >
                        {member.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Info */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">i</span>
              </div>
              <p className="text-sm text-gray-700">
                Total anggota kelompok: <span className="font-medium">{members.length} orang</span>. 
                Minimal 3 orang dan maksimal 5 orang per kelompok.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}