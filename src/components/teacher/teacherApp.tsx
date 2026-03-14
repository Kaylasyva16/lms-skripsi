import { useState, useEffect } from "react";

import TeacherLayout from "./TeacherLayout";
import TeacherDashboard from "./TeacherDashboard";
import TeacherMaterials from "./TeacherMaterials";
import TeacherQuiz from "./TeacherQuiz";
import TeacherProjects from "./TeacherProjects";
import TeacherGrades from "./TeacherGrades";
import TeacherEvaluation from "./TeacherEvaluation";

export type TeacherPage = "teacher-dashboard" | "teacher-materials" | "teacher-quiz" | "teacher-projects" | "teacher-grades" | "teacher-evaluation";

export default function TeacherApp() {
  const [currentPage, setCurrentPage] = useState<TeacherPage>("teacher-dashboard");

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setUser(data);
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.reload();
  };

  const renderPage = () => {
    switch (currentPage) {
      case "teacher-dashboard":
        return <TeacherDashboard onNavigate={setCurrentPage} user={user} />;
      case "teacher-materials":
        return <TeacherMaterials onNavigate={setCurrentPage} />;
      case "teacher-quiz":
        return <TeacherQuiz onNavigate={setCurrentPage} />;
      case "teacher-projects":
        return <TeacherProjects onNavigate={setCurrentPage} />;
      case "teacher-grades":
        return <TeacherGrades onNavigate={setCurrentPage} />;
      case "teacher-evaluation":
        return <TeacherEvaluation onNavigate={setCurrentPage} />;
      default:
        return <TeacherDashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <TeacherLayout currentPage={currentPage} onNavigate={setCurrentPage} onLogout={handleLogout} user={user} showSidebar={currentPage !== "teacher-evaluation"}>
      {renderPage()}
    </TeacherLayout>
  );
}
