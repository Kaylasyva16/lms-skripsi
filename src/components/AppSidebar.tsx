import { LayoutDashboard, BookOpen, ClipboardCheck, FolderKanban, FileText, ArrowRightLeft, Lightbulb, Code2 } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface AppSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userRole: "siswa" | "guru";
  userName: string;
  userSubtitle: string;
}

export function AppSidebar({ currentPage, onNavigate, userRole, userName, userSubtitle }: AppSidebarProps) {
  const siswaMenu = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "materi", label: "Materi", icon: BookOpen },
    { id: "kuis", label: "Kuis", icon: ClipboardCheck },
    { id: "project", label: "Problem Based Learning", icon: FolderKanban },
    { id: "nilai", label: "Nilai", icon: FileText },
  ];

  const guruMenu = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "evaluation", label: "Evaluasi", icon: ClipboardCheck },
    { id: "materi", label: "Materi", icon: BookOpen },
    { id: "kuis", label: "Kuis", icon: ClipboardCheck },
    { id: "project", label: "Problem Based Learning", icon: FolderKanban },
    { id: "nilai", label: "Nilai", icon: FileText },
  ];

  const menuItems = userRole === "siswa" ? siswaMenu : guruMenu;

  // Get user initials
  const getInitials = (name: string) => {
    if (!name) return "US";

    const words = name.split(" ");
    if (words.length >= 2) {
      return words[0][0] + words[1][0];
    }
    return name.substring(0, 2);
  };

  const tips = [
    "Gunakan rubrik penilaian untuk evaluasi yang lebih objektif",
    "Diskusikan proyek dengan teman untuk mendapat perspektif baru",
    "Jangan lupa commit perubahan code secara berkala",
    "Break down proyek besar menjadi task-task kecil",
    "Testing adalah bagian penting dari development",
  ];

  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-gray-900">RPL Learn</h2>
            <p className="text-xs text-gray-500">{userRole === "guru" ? "Portal Guru" : "Portal Siswa"}</p>
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 bg-blue-50 rounded-xl p-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-blue-600 text-white">{getInitials(userName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900 truncate">{userName}</p>
            <p className="text-xs text-gray-600 truncate">{userSubtitle}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button key={item.id} onClick={() => onNavigate(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? "bg-blue-600 text-white shadow-md" : "text-gray-700 hover:bg-gray-50"}`}>
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-white" : "text-gray-600"}`} />
              <span className="text-sm truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 space-y-3 border-t border-gray-100">
        {/* Mode Switch */}
        <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
          <ArrowRightLeft className="w-4 h-4" />
          <span className="text-sm">{userRole === "guru" ? "Mode Siswa" : "Mode Guru"}</span>
        </button>

        {/* Tips Card */}
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
          <div className="flex items-start gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-900">Tips Hari Ini</p>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">{randomTip}</p>
        </div>
      </div>
    </div>
  );
}
