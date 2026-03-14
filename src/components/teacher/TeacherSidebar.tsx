import { Code2, LayoutDashboard, BookOpen, ClipboardCheck, Briefcase, FileBarChart, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import type { TeacherPage } from "./TeacherApp";

interface TeacherSidebarProps {
  currentPage: TeacherPage;
  onNavigate: (page: TeacherPage) => void;
  onLogout: () => void;
  user: any;
}

export default function TeacherSidebar({ currentPage, onNavigate, onLogout, user }: TeacherSidebarProps) {
  const menuItems: Array<{
    id: string;
    label: string;
    icon: any;
    page: TeacherPage;
  }> = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, page: "teacher-dashboard" },
    { id: "materials", label: "Materi", icon: BookOpen, page: "teacher-materials" },
    { id: "quiz", label: "Kuis", icon: ClipboardCheck, page: "teacher-quiz" },
    { id: "projects", label: "Problem Based Learning", icon: Briefcase, page: "teacher-projects" },
    { id: "grades", label: "Nilai", icon: FileBarChart, page: "teacher-grades" },
  ];

  const initials = user?.nama
    ? user.nama
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "G";

  return (
    <div className="w-64 bg-white border-r h-screen flex flex-col shrink-0">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-500 p-2 rounded-lg">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-blue-900">RPL Learn</h2>
            <p className="text-xs text-gray-600">Portal Guru</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
          <Avatar>
            <AvatarFallback className="bg-purple-500 text-white">{initials}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <p className="text-sm text-blue-900 truncate">{user?.nama || "Loading..."}</p>
            <p className="text-xs text-gray-600">{user?.mapel || "Guru"}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.page;

            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start ${isActive ? "bg-blue-500 text-white hover:bg-blue-600" : "text-gray-700 hover:bg-gray-100"}`}
                onClick={() => onNavigate(item.page)}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-700 mb-1">💡 Tips Hari Ini</p>
          <p className="text-xs text-gray-600">Gunakan rubrik penilaian untuk evaluasi yang lebih objektif</p>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="
    flex items-center gap-3 w-full mt-4
    px-4 py-3
    rounded-2xl
    bg-red-50 border border-red-100
    text-red-600 font-medium
    hover:bg-red-100 hover:border-red-200 hover:text-red-700
    transition-colors duration-200
  "
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
