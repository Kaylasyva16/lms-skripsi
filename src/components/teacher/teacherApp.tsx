import { useState, useEffect } from "react";

import TeacherLayout from "./TeacherLayout";
import TeacherDashboard from "./TeacherDashboard";
import TeacherMaterials from "./TeacherMaterials";
import TeacherQuiz from "./TeacherQuiz";
import TeacherProjects from "./TeacherProjects";
import TeacherGrades from "./TeacherGrades";
import TeacherEvaluation from "./TeacherEvaluation";
import EssayGrading from "./EssayGrading";
import StudentEssayDetail from "./StudentEssayDetail";
import StudentGradeDetail from "./StudentGradeDetail";
import TeacherLearningObjectives from "./TeacherLearningObjectives";

interface StudentSubmission {
  id: string;
  studentName: string;
  studentClass: string;
  submittedAt: string;
  answers: {
    question: string;
    answer: string;
    score?: number;
    feedback?: string;
  }[];
  totalScore?: number;
}

export type TeacherPage =
  | "teacher-dashboard"
  | "teacher-materials"
  | "teacher-quiz"
  | "teacher-projects"
  | "teacher-grades"
  | "teacher-evaluation"
  | "essay-grading"
  | "student-essay-detail"
  | "student-detail"
  | "teacher-learning-objectives";

export default function TeacherApp() {
  const [currentPage, setCurrentPage] = useState<TeacherPage>("teacher-dashboard");
  const [selectedProjectId, setSelectedProjectId] = useState<number | string | null>(null);

  const [essayGradingData, setEssayGradingData] = useState<{ quizId: string; quizTitle: string } | null>(null);
  const [studentDetailData, setStudentDetailData] = useState<{ submission: StudentSubmission; quizTitle: string } | null>(null);

  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

  const [refreshEssayListKey, setRefreshEssayListKey] = useState(0);
  const [user, setUser] = useState<any>(null);

  const handleBackToEssayGrading = () => {
    setRefreshEssayListKey((prev) => prev + 1);
    setCurrentPage("essay-grading");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.reload();
  };

  const handleViewEssayGrading = (quizId: string, quizTitle: string) => {
    setEssayGradingData({ quizId, quizTitle });
    setCurrentPage("essay-grading");
  };

  const handleViewStudentDetail = (submission: StudentSubmission) => {
    setStudentDetailData({
      submission,
      quizTitle: essayGradingData?.quizTitle || "",
    });
    setCurrentPage("student-essay-detail");
  };

  const handleViewProjectEvaluation = (projectId: number | string) => {
    setSelectedProjectId(projectId);
    setCurrentPage("teacher-evaluation");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "teacher-dashboard":
        return <TeacherDashboard onNavigate={setCurrentPage} user={user} />;

      case "teacher-learning-objectives":
        return <TeacherLearningObjectives onNavigate={setCurrentPage} />;

      case "teacher-materials":
        return <TeacherMaterials onNavigate={setCurrentPage} />;

      case "teacher-quiz":
        return <TeacherQuiz onNavigate={setCurrentPage} onLogout={handleLogout} onViewEssayGrading={handleViewEssayGrading} />;

      case "teacher-projects":
        return <TeacherProjects onNavigate={setCurrentPage} onViewEvaluation={handleViewProjectEvaluation} />;

      case "teacher-grades":
        return (
          <TeacherGrades
            onNavigate={setCurrentPage}
            onViewStudentGradeDetail={(id) => {
              setSelectedStudentId(id); // simpan id siswa
              setCurrentPage("student-detail"); // pindah halaman
            }}
          />
        );

      case "student-detail":
        return <StudentGradeDetail studentId={selectedStudentId} />;

      case "teacher-evaluation":
        return selectedProjectId ? <TeacherEvaluation onNavigate={setCurrentPage} projectId={selectedProjectId} /> : <TeacherProjects onNavigate={setCurrentPage} onViewEvaluation={handleViewProjectEvaluation} />;

      case "essay-grading":
        return essayGradingData ? (
          <EssayGrading quizId={essayGradingData.quizId} quizTitle={essayGradingData.quizTitle} onNavigate={setCurrentPage} onLogout={handleLogout} onViewStudentDetail={handleViewStudentDetail} refreshKey={refreshEssayListKey} />
        ) : (
          <TeacherQuiz onNavigate={setCurrentPage} onLogout={handleLogout} onViewEssayGrading={handleViewEssayGrading} />
        );

      case "student-essay-detail":
        return studentDetailData ? (
          <StudentEssayDetail submission={studentDetailData.submission} quizTitle={studentDetailData.quizTitle} onNavigate={setCurrentPage} onLogout={handleLogout} onBackToEssayGrading={handleBackToEssayGrading} />
        ) : (
          <TeacherQuiz onNavigate={setCurrentPage} onLogout={handleLogout} onViewEssayGrading={handleViewEssayGrading} />
        );

      default:
        return <TeacherDashboard onNavigate={setCurrentPage} user={user} />;
    }
  };

  return (
    <TeacherLayout
      currentPage={currentPage === "essay-grading" || currentPage === "student-essay-detail" ? "teacher-quiz" : currentPage}
      onNavigate={setCurrentPage}
      onLogout={handleLogout}
      user={user}
      showSidebar={currentPage !== "teacher-evaluation"}
    >
      {renderPage()}
    </TeacherLayout>
  );
}
