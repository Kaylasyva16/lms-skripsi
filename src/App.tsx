import { useState, useEffect } from "react";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { LandingPage } from "./components/LandingPage";
import { AboutPBL } from "./components/AboutPBL";
import { MateriPage } from "./components/MateriPage";
import { ProjectPage } from "./components/ProjectPage";
import { QuizPage } from "./components/QuizPage";
import { DebuggingPuzzlePage } from "./components/DebuggingPuzzlePage";
import { Leaderboard } from "./components/Leaderboard";
import { Forum } from "./components/Forum";
import { StudentProfile } from "./components/StudentProfile";
import { AppSidebar } from "./components/AppSidebar";
import { NilaiPage } from "./components/NilaiPage";
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/sonner";
import { Code2, LogOut } from "lucide-react";
import TeacherApp from "./components/teacher/teacherApp";
import AdminDashboard from "./components/admin/AdminDashboard";
import StudentDashboard from "./components/StudentDashboard";

type Role = "siswa" | "guru" | "admin";
type AdminPage = "dashboard" | "guru" | "mapel" | "kelas" | "siswa";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [currentPage, setCurrentPage] = useState("home");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const savedPage = localStorage.getItem("currentPage");

    if (token && role) {
      setIsLoggedIn(true);
      setUserRole(role as Role);
      setCurrentPage(savedPage || "dashboard");
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!isLoggedIn || !token) return;

    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.log("TOKEN ERROR");
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Gagal fetch user:", err);
      }
    };

    fetchUser();
  }, [isLoggedIn]);
  // student / public page
  const pageConfig: Record<string, { title: string; subtitle?: string }> = {
    dashboard: {
      title: "Dashboard",
      subtitle: "Ringkasan aktivitas dan progres belajar",
    },
    materi: {
      title: "Materi",
      subtitle: "Daftar materi pembelajaran",
    },
    kuis: {
      title: "Kuis",
      subtitle: "Latihan dan evaluasi pembelajaran",
    },
    project: {
      title: "Project PBL",
      subtitle: "Tugas berbasis proyek",
    },
    nilai: {
      title: "Nilai",
      subtitle: "Rekap dan progres nilai akademik",
    },
    leaderboard: {
      title: "Leaderboard",
      subtitle: "Peringkat siswa",
    },
    forum: {
      title: "Forum Diskusi",
    },
    profile: {
      title: "Profil Siswa",
    },
  };

  // ===== LOGIN =====
  const handleLogin = (role: Role) => {
    localStorage.setItem("role", role);
    localStorage.setItem("currentPage", "dashboard");

    setUserRole(role);
    setIsLoggedIn(true);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.clear();

    setIsLoggedIn(false);
    setUserRole(null);
    setUser(null);
    setCurrentPage("home");
  };

  // =========================
  // 1️ REGISTER PAGE
  // =========================
  if (currentPage === "register") {
    return <RegisterPage onBack={() => setCurrentPage("login")} onSuccess={() => setCurrentPage("login")} />;
  }

  // =========================
  // 2 LOGIN PAGE
  // =========================
  if (currentPage === "login") {
    return <LoginPage onLogin={handleLogin} onRegister={() => setCurrentPage("register")} />;
  }

  // =========================
  // 3 PUBLIC (BELUM LOGIN)
  // =========================
  if (!isLoggedIn && (currentPage === "home" || currentPage === "about")) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <Toaster />

        {/* HEADER */}
        <header className="bg-white border-b shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage("home")}>
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Code2 className="text-white" />
              </div>
              <div>
                <h1 className="text-blue-900">LMS PBL</h1>
                <p className="text-xs text-gray-600">SMK RPL</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <button onClick={() => setCurrentPage("home")}>Beranda</button>
              <button onClick={() => setCurrentPage("about")}>Tentang PBL</button>
              <Button onClick={() => setCurrentPage("login")} className="bg-blue-600 hover:bg-blue-700 text-white">
                Login
              </Button>
            </div>
          </div>
        </header>

        {currentPage === "home" && <LandingPage onNavigate={setCurrentPage} />}
        {currentPage === "about" && <AboutPBL />}
      </div>
    );
  }

  // =========================

  // =========================
  // 4️⃣ TEACHER DASHBOARD
  // =========================
  if (isLoggedIn && userRole === "guru") {
    return <TeacherApp />;
  }

  // =========================
  // 4️⃣ ADMIN DASHBOARD
  // =========================
  if (isLoggedIn && userRole === "admin") {
    return <AdminDashboard />;
  }

  // =========================
  // 5️⃣ STUDENT DASHBOARD
  // =========================

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Toaster />

      <AppSidebar currentPage={currentPage} onNavigate={setCurrentPage} userRole={userRole || "siswa"} userName={user?.nama || "User"} userSubtitle={user?.nis ? `NIS: ${user.nis}` : ""} />

      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b shadow-sm sticky top-0 z-40">
          <div className="px-6 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{pageConfig[currentPage]?.title}</h1>

              {pageConfig[currentPage]?.subtitle && <p className="text-sm text-gray-500">{pageConfig[currentPage]?.subtitle}</p>}
            </div>

            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Keluar
            </Button>
          </div>
        </header>

        <div className="p-6">
          {currentPage === "dashboard" && <StudentDashboard user={user} onNavigate={setCurrentPage} />}
          {currentPage === "materi" && <MateriPage />}
          {currentPage === "kuis" && <QuizPage />}
          {currentPage === "debugging" && <DebuggingPuzzlePage onClose={() => setCurrentPage("dashboard")} />}
          {currentPage === "project" && <ProjectPage />}
          {currentPage === "leaderboard" && <Leaderboard />}
          {currentPage === "forum" && <Forum />}
          {currentPage === "profile" && <StudentProfile />}
          {currentPage === "nilai" && <NilaiPage />}
        </div>
      </div>
    </div>
  );
}
