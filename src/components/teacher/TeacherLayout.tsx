import { useRef, useEffect } from "react";
import TeacherSidebar from "./TeacherSidebar";
import type { TeacherPage } from "./TeacherApp";

interface TeacherLayoutProps {
  currentPage: TeacherPage;
  onNavigate: (page: TeacherPage) => void;
  onLogout: () => void;
  user: any;
  showSidebar?: boolean;
  children: React.ReactNode;
}

export default function TeacherLayout({ currentPage, onNavigate, onLogout, user, children, showSidebar = true }: TeacherLayoutProps) {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [currentPage]);

  return (
    <div className="h-screen flex bg-gradient-to-br from-blue-50 to-white overflow-hidden">
      {/* Sidebar Conditional */}
      {showSidebar && <TeacherSidebar currentPage={currentPage} onNavigate={onNavigate} onLogout={onLogout} user={user} />}

      {/* MAIN */}
      <main ref={mainRef} className={`flex-1 overflow-y-auto ${showSidebar ? "px-8 pt-8" : "px-12 pt-10"}`}>
        {children}
      </main>
    </div>
  );
}
