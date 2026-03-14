import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { MessageSquare, ThumbsUp, Send, Pin, Search } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const threads = [
  {
    id: 1,
    title: 'Tips Implementasi Login dengan Session di Java',
    author: 'Ahmad Rizki',
    class: 'XII RPL 1',
    timestamp: '2 jam lalu',
    replies: 5,
    likes: 12,
    category: 'Backend',
    isPinned: true,
    preview: 'Ada yang bisa kasih saran cara implementasi login dengan session management yang baik?'
  },
  {
    id: 2,
    title: 'Rekomendasi Library untuk Chart di Website',
    author: 'Siti Nurhaliza',
    class: 'XII RPL 1',
    timestamp: '5 jam lalu',
    replies: 8,
    likes: 15,
    category: 'Frontend',
    isPinned: false,
    preview: 'Lagi butuh library chart yang bagus dan mudah digunakan untuk proyek web portfolio...'
  },
  {
    id: 3,
    title: 'Cara Membuat ERD yang Baik dan Benar',
    author: 'Budi Santoso',
    class: 'XII RPL 2',
    timestamp: '1 hari lalu',
    replies: 12,
    likes: 20,
    category: 'Database',
    isPinned: false,
    preview: 'Mau tanya cara membuat ERD yang efisien untuk sistem perpustakaan, ada tips?'
  },
  {
    id: 4,
    title: 'Share Project Terbaik Kalian!',
    author: 'Dewi Lestari',
    class: 'XII RPL 1',
    timestamp: '2 hari lalu',
    replies: 25,
    likes: 35,
    category: 'Showcase',
    isPinned: true,
    preview: 'Yuk sharing project terbaik kalian di sini, biar saling belajar!'
  }
];

const categories = ['Semua', 'Backend', 'Frontend', 'Database', 'Mobile', 'Showcase', 'Tanya Jawab'];

interface ThreadDetailProps {
  thread: typeof threads[0];
  onBack: () => void;
}

function ThreadDetail({ thread, onBack }: ThreadDetailProps) {
  const [reply, setReply] = useState('');

  const replies = [
    {
      id: 1,
      author: 'Eko Prasetyo',
      class: 'XII RPL 3',
      timestamp: '1 jam lalu',
      content: 'Kalau aku biasanya pakai HttpSession di Java. Cukup reliable dan mudah diimplementasi. Tapi jangan lupa handle logout dengan baik ya!',
      likes: 5
    },
    {
      id: 2,
      author: 'Fitri Handayani',
      class: 'XII RPL 2',
      timestamp: '30 menit lalu',
      content: 'Setuju sama Eko. Aku juga tambahin security dengan menyimpan hash password pakai BCrypt. Jadi lebih aman.',
      likes: 3
    }
  ];

  const handleSendReply = () => {
    if (reply.trim()) {
      toast.success('Balasan berhasil dikirim!');
      setReply('');
    }
  };

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={onBack}>
        ← Kembali ke Forum
      </Button>

      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {thread.isPinned && <Pin className="w-4 h-4 text-blue-500" />}
                <CardTitle>{thread.title}</CardTitle>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-blue-500 text-white text-xs">
                      {thread.author.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span>{thread.author}</span>
                </div>
                <span>•</span>
                <span>{thread.class}</span>
                <span>•</span>
                <span>{thread.timestamp}</span>
              </div>
            </div>
            <Badge className="bg-blue-500">{thread.category}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            Halo teman-teman! Saya lagi mengerjakan proyek aplikasi kasir dan butuh implementasi sistem login. 
            Saya mau tanya cara implementasi session management yang baik gimana ya? Supaya user tetap login 
            meskipun pindah halaman. Ada yang punya pengalaman atau referensi yang bagus?
            <br /><br />
            Yang udah saya coba:
            <br />
            - Pakai HttpSession tapi masih bingung cara maintain sessionnya
            <br />
            - Belum tau cara handle timeout
            <br />
            - Security masih basic banget
            <br /><br />
            Mohon bantuannya ya! Terima kasih 🙏
          </p>
          <div className="flex items-center gap-4 pt-3 border-t">
            <Button variant="ghost" size="sm" className="gap-2">
              <ThumbsUp className="w-4 h-4" />
              {thread.likes} Suka
            </Button>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MessageSquare className="w-4 h-4" />
              {thread.replies} Balasan
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{replies.length} Balasan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {replies.map((reply) => (
            <div key={reply.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-3 mb-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-blue-500 text-white text-xs">
                    {reply.author.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{reply.author}</span>
                    <span className="text-sm text-gray-600">• {reply.class}</span>
                    <span className="text-sm text-gray-600">• {reply.timestamp}</span>
                  </div>
                  <p className="text-gray-700">{reply.content}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="gap-2">
                <ThumbsUp className="w-3 h-3" />
                {reply.likes}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tambah Balasan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Tulis balasan kamu di sini..."
            rows={4}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <Button className="bg-blue-500 hover:bg-blue-600 gap-2" onClick={handleSendReply}>
            <Send className="w-4 h-4" />
            Kirim Balasan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function Forum() {
  const [selectedThread, setSelectedThread] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  if (selectedThread !== null) {
    const thread = threads.find((t) => t.id === selectedThread);
    if (thread) {
      return <ThreadDetail thread={thread} onBack={() => setSelectedThread(null)} />;
    }
  }

  const filteredThreads = selectedCategory === 'Semua' 
    ? threads 
    : threads.filter(t => t.category === selectedCategory);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-white">Forum Diskusi</CardTitle>
                <CardDescription className="text-blue-100">
                  Tempat berbagi pengetahuan dan berkolaborasi
                </CardDescription>
              </div>
            </div>
            <Button className="bg-white text-blue-600 hover:bg-blue-50">
              Buat Diskusi Baru
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Cari diskusi..." className="pl-10" />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2 flex-wrap">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? 'bg-blue-500 hover:bg-blue-600' : ''}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredThreads.map((thread) => (
          <Card
            key={thread.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedThread(thread.id)}
          >
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-blue-500 text-white">
                    {thread.author.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {thread.isPinned && <Pin className="w-4 h-4 text-blue-500" />}
                        <h3>{thread.title}</h3>
                        <Badge variant="outline" className="text-blue-600 border-blue-300">
                          {thread.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{thread.preview}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>{thread.author}</span>
                        <span>•</span>
                        <span>{thread.class}</span>
                        <span>•</span>
                        <span>{thread.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-center min-w-[80px]">
                  <div className="flex items-center justify-center gap-1 text-sm">
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                    <span>{thread.replies}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-sm">
                    <ThumbsUp className="w-4 h-4 text-gray-400" />
                    <span>{thread.likes}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
