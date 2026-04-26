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

import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Role = "siswa" | "guru" | "admin";
type AdminPage = "dashboard" | "guru" | "mapel" | "kelas" | "siswa";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [currentPage, setCurrentPage] = useState("home");
  const [user, setUser] = useState<any>(null);

  const [isScrolled, setIsScrolled] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700">
        <Toaster />
        {/* HEADER */}
        <header
          className="sticky top-0 z-50 
  bg-white/20 backdrop-blur-lg 
  border-b border-white/20 
  shadow-sm shadow-black/10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            {/* LOGO */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage("home")}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isScrolled ? "bg-blue-500" : "bg-white/20"}`}>
                <Code2 className="text-white" />
              </div>

              <div>
                <h1 className={`font-semibold text-sm sm:text-base ${isScrolled ? "text-gray-900" : "text-white"}`}>RPL Learn</h1>
                <p className={`text-xs ${isScrolled ? "text-gray-500" : "text-white/70"}`}>SMKN 2 Surabaya</p>
              </div>
            </div>

            {/* DESKTOP MENU */}
            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => setCurrentPage("home")} className={isScrolled ? "text-gray-700" : "text-white/80 hover:text-white"}>
                Beranda
              </button>

              <button onClick={() => setCurrentPage("about")} className={isScrolled ? "text-gray-700" : "text-white/80 hover:text-white"}>
                Tentang PBL
              </button>

              <Button onClick={() => setCurrentPage("login")} className={isScrolled ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-white text-blue-600 hover:bg-yellow-300"}>
                Masuk
              </Button>
            </div>

            {/* MOBILE BUTTON */}
            <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* MOBILE MENU */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="md:hidden absolute top-16 left-0 w-full bg-white shadow-xl rounded-b-2xl z-50"
              >
                <div className="flex flex-col p-4 gap-2">
                  <button
                    onClick={() => {
                      setCurrentPage("home");
                      setMenuOpen(false);
                    }}
                    className="text-left px-4 py-3 rounded-lg hover:bg-gray-100 font-medium text-gray-800"
                  >
                    Beranda
                  </button>

                  <button
                    onClick={() => {
                      setCurrentPage("about");
                      setMenuOpen(false);
                    }}
                    className="text-left px-4 py-3 rounded-lg hover:bg-gray-100 font-medium text-gray-800"
                  >
                    Tentang PBL
                  </button>

                  <div className="pt-2">
                    <Button
                      onClick={() => {
                        setCurrentPage("login");
                        setMenuOpen(false);
                      }}
                      className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Login
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
