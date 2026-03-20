import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Textarea } from "./ui/textarea";
import { Clock, Trophy, CheckCircle, CheckCircle2, XCircle, Award, Play, BookOpen, Timer, GripVertical, Sparkles, Flame } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

type QuestionType = "multiple-choice" | "essay" | "matching" | "logic-flow" | "debugging" | "simulation" | "drag-drop";
type DifficultyLevel = "Mudah" | "Sedang" | "Sulit";

interface BaseQuestion {
  id: number;
  type: QuestionType;
  question: string;
  points: number;
  difficulty: DifficultyLevel;
}

interface MultipleChoiceQuestion extends BaseQuestion {
  type: "multiple-choice";
  options: string[];
  correctAnswer: number;
  optionIds?: number[];
}

interface EssayQuestion extends BaseQuestion {
  type: "essay";
  sampleAnswer?: string;
  keywords?: string[];
  minWords?: number;
}

interface MatchingQuestion extends BaseQuestion {
  type: "matching";
  leftItems: string[];
  rightItems: string[];
  correctMatches: Record<number, number>;
}

interface LogicFlowQuestion extends BaseQuestion {
  type: "logic-flow";
  flowSteps: string[];
  blanks: number[];
  options: string[];
  correctAnswers: number[];
}

interface DebuggingQuestion extends BaseQuestion {
  type: "debugging";
  code: string;
  errorLines: number[];
  options: string[];
  correctAnswer: number;
}

interface SimulationQuestion extends BaseQuestion {
  type: "simulation";
  scenario: string;
  instruction: string;
  steps: string[];
  correctOrder: number[];
  explanation?: string;
}

interface DragDropQuestion extends BaseQuestion {
  type: "drag-drop";
  items: string[];
  correctOrder: number[];
}

type Question = MultipleChoiceQuestion | EssayQuestion | MatchingQuestion | LogicFlowQuestion | DebuggingQuestion | SimulationQuestion | DragDropQuestion;

interface DragItem {
  index: number;
  text: string;
}

function DraggableItem({ item, index, moveItem }: { item: string; index: number; moveItem: (from: number, to: number) => void }) {
  const [{ isDragging }, drag] = useDrag({
    type: "item",
    item: { index, text: item },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "item",
    hover: (draggedItem: DragItem) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`flex items-center gap-3 p-4 rounded-lg border-2 bg-white cursor-move transition-all ${isDragging ? "opacity-50 border-blue-500" : "border-gray-200 hover:border-blue-300 hover:shadow-md"}`}
    >
      <GripVertical className="w-5 h-5 text-gray-400" />
      <span className="flex-1 text-gray-700">{item}</span>
      <Badge className="bg-blue-500">{index + 1}</Badge>
    </div>
  );
}

function MatchingItem({ leftItem, index, selectedMatch, onSelect }: { leftItem: string; index: number; selectedMatch: number | null; onSelect: () => void }) {
  return (
    <button onClick={onSelect} className={`w-full text-left p-4 rounded-lg border-2 transition-all ${selectedMatch === index ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-200 hover:border-blue-300 bg-white"}`}>
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedMatch === index ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"}`}>{index + 1}</div>
        <span className="text-gray-700">{leftItem}</span>
      </div>
    </button>
  );
}

const getLevelColor = (level: string) => {
  switch (level) {
    case "Beginner":
      return "bg-green-500 hover:bg-green-600";
    case "Intermediate":
      return "bg-blue-500 hover:bg-blue-600";
    case "Expert":
      return "bg-purple-500 hover:bg-purple-600";
    default:
      return "bg-gray-500 hover:bg-gray-600";
  }
};

type ViewMode = "list" | "detail" | "quiz" | "result";

export function QuizPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedQuiz, setSelectedQuiz] = useState<any | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizResult, setQuizResult] = useState<{
    score: number;
    correct: number;
    total: number;
    totalPoints: number;
    earnedPoints: number;
    hasEssay: boolean;
  } | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const [dragItems, setDragItems] = useState<string[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matches, setMatches] = useState<Record<number, number>>({});
  const [logicAnswers, setLogicAnswers] = useState<string[]>([]);
  const [simulationSteps, setSimulationSteps] = useState<string[]>([]);
  const [simulationRun, setSimulationRun] = useState(false);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const isQuizAllowed = (quiz: any) => {
    return !(quiz.submissionStatus === "submitted" || quiz.submissionStatus === "graded" || quiz.submissionId);
  };

  const getQuizButtonLabel = (quiz: any) => {
    if (quiz.submissionStatus === "graded") return "Lihat Hasil";
    if (quiz.submissionStatus === "submitted" || quiz.submissionId) return "Sudah Dikerjakan";
    return "Mulai Kuis";
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/student/quizzes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Quiz list error:", text);
          throw new Error("Gagal memuat kuis");
        }

        const data = await res.json();

        const mapped = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          level: item.level ?? "Beginner",
          totalQuestions: item.totalQuestions,
          duration: item.duration,
          status: item.status ?? "available",
          subject: item.subject ?? "-",
          type: item.type,
          icon: item.icon ?? "📝",
          score: item.score ?? null,
          totalPoints: item.totalPoints ?? 0,
          submissionId: item.submissionId ?? null,
          submissionStatus: item.submissionStatus ?? "not_started",
          submittedAt: item.submittedAt ?? null,
          totalScore: item.totalScore ?? null,
        }));

        setQuizzes(mapped);
      } catch (error) {
        console.error(error);
        toast.error("Gagal memuat kuis");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  useEffect(() => {
    if (viewMode === "quiz" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [viewMode, timeLeft]);

  const handleStartQuiz = async (quiz: any) => {
    if (!isQuizAllowed(quiz)) {
      toast.error("Kuis ini tidak tersedia untuk siswa.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const detailRes = await fetch(`http://localhost:5000/api/student/quizzes/${quiz.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!detailRes.ok) {
        throw new Error("Gagal mengambil status quiz");
      }

      const latestQuiz = await detailRes.json();

      if (latestQuiz.submissionStatus === "submitted" || latestQuiz.submissionStatus === "graded" || latestQuiz.submissionId) {
        const hasEssaySubmission = latestQuiz.submissionStatus === "submitted";

        setSelectedQuiz(latestQuiz);
        setQuizResult({
          score: latestQuiz.totalScore ?? 0,
          correct: 0,
          total: latestQuiz.totalQuestions ?? 0,
          totalPoints: latestQuiz.totalPoints ?? 0,
          earnedPoints: 0,
          hasEssay: hasEssaySubmission,
        });
        setViewMode("result");
        return;
      }

      const res = await fetch(`http://localhost:5000/api/student/quizzes/${quiz.id}/questions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("GET QUESTIONS ERROR:", errText);
        throw new Error("Gagal mengambil detail kuis");
      }

      const data = await res.json();

      const filteredQuestions = data
        .filter((q: any) => q.type === "multiple-choice" || q.type === "essay")
        .map((q: any) => ({
          id: q.id,
          type: q.type,
          question: q.questionText,
          points: q.points ?? 10,
          difficulty: q.payload?.difficulty ?? "Sedang",
          options: q.options?.map((opt: any) => opt.optionText) || [],
          optionIds: q.options?.map((opt: any) => opt.id) || [],
          correctAnswer: q.options?.findIndex((opt: any) => opt.isCorrect) ?? 0,
        }));

      setSelectedQuiz(latestQuiz);
      setQuizQuestions(filteredQuestions);
      setViewMode("detail");
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengambil detail kuis");
    }
  };

  const handleBeginQuiz = () => {
    if (selectedQuiz) {
      setViewMode("quiz");
      setCurrentQuestion(0);
      setAnswers({});
      setTimeLeft(selectedQuiz.duration * 60);
      setQuizResult(null);
      setMatches({});
      setSelectedLeft(null);
      setLogicAnswers([]);
      setSimulationSteps([]);
      setSimulationRun(false);

      const questions = quizQuestions;
      const firstQ = questions[0];

      if (!firstQ) return;

      if (firstQ.type === "drag-drop") {
        setDragItems([...(firstQ as DragDropQuestion).items]);
      } else if (firstQ.type === "logic-flow") {
        setLogicAnswers(new Array((firstQ as LogicFlowQuestion).blanks.length).fill(""));
      } else if (firstQ.type === "simulation") {
        setSimulationSteps([...(firstQ as SimulationQuestion).steps]);
      }
    }
  };

  const handleAnswerChange = (questionId: number, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newItems = [...dragItems];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    setDragItems(newItems);
  };

  const moveSimulationItem = (fromIndex: number, toIndex: number) => {
    const newItems = [...simulationSteps];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    setSimulationSteps(newItems);
  };

  const handleMatchingSelect = (leftIndex: number, rightIndex: number) => {
    if (selectedLeft === null) {
      setSelectedLeft(leftIndex);
    } else {
      const newMatches = { ...matches };
      newMatches[selectedLeft] = rightIndex;
      setMatches(newMatches);
      setSelectedLeft(null);
    }
  };

  const handleNextQuestion = () => {
    if (!selectedQuiz) return;

    const questions = quizQuestions;
    const currentQ = questions[currentQuestion];

    if (!currentQ) return;

    if (currentQ.type === "drag-drop") {
      handleAnswerChange(currentQ.id, [...dragItems]);
    } else if (currentQ.type === "matching") {
      handleAnswerChange(currentQ.id, { ...matches });
    } else if (currentQ.type === "logic-flow") {
      handleAnswerChange(currentQ.id, [...logicAnswers]);
    } else if (currentQ.type === "simulation") {
      handleAnswerChange(currentQ.id, [...simulationSteps]);
    }

    const nextIndex = currentQuestion + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestion(nextIndex);
      setSimulationRun(false);
      const nextQ = questions[nextIndex];

      if (nextQ.type === "drag-drop") {
        const savedAnswer = answers[nextQ.id];
        setDragItems(savedAnswer || [...(nextQ as DragDropQuestion).items]);
      } else if (nextQ.type === "matching") {
        const savedAnswer = answers[nextQ.id] || {};
        setMatches(savedAnswer);
        setSelectedLeft(null);
      } else if (nextQ.type === "logic-flow") {
        const savedAnswer = answers[nextQ.id] || [];
        setLogicAnswers(savedAnswer.length > 0 ? savedAnswer : new Array((nextQ as LogicFlowQuestion).blanks.length).fill(""));
      } else if (nextQ.type === "simulation") {
        const savedAnswer = answers[nextQ.id];
        setSimulationSteps(savedAnswer || [...(nextQ as SimulationQuestion).steps]);
      }
    }
  };

  const handlePrevQuestion = () => {
    if (!selectedQuiz) return;

    const questions = quizQuestions;
    const currentQ = questions[currentQuestion];

    if (!currentQ) return;

    if (currentQ.type === "drag-drop") {
      handleAnswerChange(currentQ.id, [...dragItems]);
    } else if (currentQ.type === "matching") {
      handleAnswerChange(currentQ.id, { ...matches });
    } else if (currentQ.type === "logic-flow") {
      handleAnswerChange(currentQ.id, [...logicAnswers]);
    } else if (currentQ.type === "simulation") {
      handleAnswerChange(currentQ.id, [...simulationSteps]);
    }

    const prevIndex = currentQuestion - 1;
    if (prevIndex >= 0) {
      setCurrentQuestion(prevIndex);
      setSimulationRun(false);
      const prevQ = questions[prevIndex];

      if (prevQ.type === "drag-drop") {
        const savedAnswer = answers[prevQ.id];
        setDragItems(savedAnswer || [...(prevQ as DragDropQuestion).items]);
      } else if (prevQ.type === "matching") {
        const savedAnswer = answers[prevQ.id] || {};
        setMatches(savedAnswer);
        setSelectedLeft(null);
      } else if (prevQ.type === "logic-flow") {
        const savedAnswer = answers[prevQ.id] || [];
        setLogicAnswers(savedAnswer.length > 0 ? savedAnswer : new Array((prevQ as LogicFlowQuestion).blanks.length).fill(""));
      } else if (prevQ.type === "simulation") {
        const savedAnswer = answers[prevQ.id];
        setSimulationSteps(savedAnswer || [...(prevQ as SimulationQuestion).steps]);
      }
    }
  };

  const handleSubmitQuiz = async () => {
    if (!selectedQuiz) return;

    const questions = quizQuestions;
    const currentQ = questions[currentQuestion];

    if (currentQ) {
      if (currentQ.type === "drag-drop") {
        handleAnswerChange(currentQ.id, [...dragItems]);
      } else if (currentQ.type === "matching") {
        handleAnswerChange(currentQ.id, { ...matches });
      } else if (currentQ.type === "logic-flow") {
        handleAnswerChange(currentQ.id, [...logicAnswers]);
      } else if (currentQ.type === "simulation") {
        handleAnswerChange(currentQ.id, [...simulationSteps]);
      }
    }

    const token = localStorage.getItem("token");

    const essayQuestions = questions.filter((q) => q.type === "essay");
    const mcQuestions = questions.filter((q) => q.type === "multiple-choice") as MultipleChoiceQuestion[];

    const hasEssay = essayQuestions.length > 0;
    const hasMC = mcQuestions.length > 0;

    if (hasEssay) {
      try {
        const essayAnswers = essayQuestions
          .filter((q) => answers[q.id]?.trim())
          .map((q) => ({
            questionId: q.id,
            answerText: answers[q.id].trim(),
          }));

        if (essayAnswers.length === 0) {
          toast.error("Jawaban essay belum diisi");
          return;
        }

        const res = await fetch(`http://localhost:5000/api/student/quizzes/${selectedQuiz.id}/submit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            answers: essayAnswers,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Gagal mengumpulkan quiz");
        }

        setQuizzes((prev) =>
          prev.map((q) =>
            q.id === selectedQuiz.id
              ? {
                  ...q,
                  submissionId: data.submission?.id ?? true,
                  submissionStatus: "submitted",
                  submittedAt: data.submission?.submittedAt || new Date().toISOString(),
                  totalScore: null,
                }
              : q
          )
        );

        setSelectedQuiz((prev: any) =>
          prev
            ? {
                ...prev,
                submissionId: data.submission?.id ?? true,
                submissionStatus: "submitted",
                submittedAt: data.submission?.submittedAt || new Date().toISOString(),
                totalScore: null,
              }
            : prev
        );

        setQuizResult({
          score: 0,
          correct: 0,
          total: questions.length,
          totalPoints: 0,
          earnedPoints: 0,
          hasEssay: true,
        });

        setShowSuccess(true);
        setViewMode("result");
        return;
      } catch (error: any) {
        toast.error(error.message || "Gagal mengumpulkan quiz");
        return;
      }
    }

    if (hasMC) {
      try {
        const mcAnswers = mcQuestions
          .filter((q) => answers[q.id] !== undefined && answers[q.id] !== null)
          .map((q) => {
            const selectedIndex = answers[q.id];
            const selectedOptionId = q.optionIds?.[selectedIndex];

            return {
              questionId: q.id,
              selectedOptionId,
            };
          })
          .filter((item) => item.selectedOptionId);

        if (mcAnswers.length !== mcQuestions.length) {
          toast.error("Masih ada soal pilihan ganda yang belum dijawab");
          return;
        }

        const res = await fetch(`http://localhost:5000/api/student/quizzes/${selectedQuiz.id}/submit-mc`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            answers: mcAnswers,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Gagal submit quiz pilihan ganda");
        }

        const backendScore = Number(data.score ?? data.submission?.total_score ?? 0);

        let totalPoints = 0;
        let earnedPoints = 0;
        let correct = 0;

        mcQuestions.forEach((q) => {
          totalPoints += q.points;
          if (answers[q.id] === q.correctAnswer) {
            correct++;
            earnedPoints += q.points;
          }
        });

        setQuizzes((prev) =>
          prev.map((q) =>
            q.id === selectedQuiz.id
              ? {
                  ...q,
                  submissionId: data.submission?.id ?? true,
                  submissionStatus: "graded",
                  submittedAt: data.submission?.submitted_at || new Date().toISOString(),
                  totalScore: backendScore,
                }
              : q
          )
        );

        setSelectedQuiz((prev: any) =>
          prev
            ? {
                ...prev,
                submissionId: data.submission?.id ?? true,
                submissionStatus: "graded",
                submittedAt: data.submission?.submitted_at || new Date().toISOString(),
                totalScore: backendScore,
              }
            : prev
        );

        setQuizResult({
          score: backendScore,
          correct,
          total: mcQuestions.length,
          totalPoints,
          earnedPoints,
          hasEssay: false,
        });

        setShowSuccess(true);
        setViewMode("result");
        toast.success("Kuis berhasil diselesaikan!");
        return;
      } catch (error: any) {
        console.error(error);
        toast.error(error.message || "Gagal submit quiz pilihan ganda");
        return;
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const successToast = showSuccess ? (
    <div className="fixed top-6 right-6 z-[9999] max-w-md rounded-xl bg-green-500 px-5 py-3 text-white shadow-lg">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 font-bold">✓</span>
        <p className="font-medium">Kuis berhasil dikumpulkan!</p>
      </div>
    </div>
  ) : null;

  if (viewMode === "list") {
    return (
      <>
        {successToast}

        <div className="space-y-8 px-3 md:px-5 py-3">
          <div>
            <h2 className="text-gray-900 mb-2">Kuis Gamifikasi 🎮</h2>
            <p className="text-gray-600">6 tipe kuis interaktif dengan level kesulitan bertingkat</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm mb-1">Total Kuis</p>
                    <p className="text-2xl font-bold">{quizzes.length}</p>
                  </div>
                  <BookOpen className="w-10 h-10 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm mb-1">Tipe Soal</p>
                    <p className="text-2xl font-bold">6</p>
                  </div>
                  <Sparkles className="w-10 h-10 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm mb-1">Level Soal</p>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                  <Flame className="w-10 h-10 text-orange-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm mb-1">Total Poin</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                  <Trophy className="w-10 h-10 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[...quizzes]
              .sort((a, b) => {
                const aAllowed = isQuizAllowed(a);
                const bAllowed = isQuizAllowed(b);

                if (aAllowed && !bAllowed) return -1;
                if (!aAllowed && bAllowed) return 1;
                return 0;
              })
              .map((quiz) => {
                const disabled = !isQuizAllowed(quiz);

                return (
                  <Card key={quiz.id} className={`relative h-full rounded-2xl border-2 transition-all ${disabled ? "opacity-50 border-gray-200" : "border-gray-200 hover:border-blue-300 hover:shadow-lg"}`}>
                    {disabled && <Badge className="absolute top-3 right-3 bg-red-500 text-white">🔒 Terkunci</Badge>}

                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-4xl mb-2">{quiz.icon}</div>
                        <Badge className={getLevelColor(quiz.level)}>{quiz.level}</Badge>
                      </div>
                      <CardTitle className="text-lg leading-snug">{quiz.title}</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-5 pt-0">
                      <p className="text-sm leading-7 text-gray-600">{quiz.description}</p>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <BookOpen className="w-4 h-4 text-blue-500" />
                          <span>{quiz.totalQuestions} Soal</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4 text-orange-500" />
                          <span>{quiz.duration} Menit</span>
                        </div>
                      </div>

                      <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-4">
                        <p className="text-xs text-gray-600 mb-3">Level Kesulitan:</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs bg-green-50 border-green-300">
                            ⭐ Mudah
                          </Badge>
                          <Badge variant="outline" className="text-xs bg-orange-50 border-orange-300">
                            ⭐⭐ Sedang
                          </Badge>
                          <Badge variant="outline" className="text-xs bg-red-50 border-red-300">
                            ⭐⭐⭐ Sulit
                          </Badge>
                        </div>
                      </div>

                      <Button
                        disabled={disabled}
                        className={`w-full gap-2 h-12 ${disabled ? "bg-gray-300 cursor-not-allowed" : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"}`}
                        onClick={() => {
                          if (!disabled) handleStartQuiz(quiz);
                        }}
                      >
                        <Play className="w-4 h-4" />
                        {disabled ? "Tidak Tersedia" : getQuizButtonLabel(quiz)}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      </>
    );
  }

  if (viewMode === "detail" && selectedQuiz) {
    const questions = quizQuestions;

    const difficultyCount = {
      mudah: questions.filter((q) => q.difficulty === "Mudah").length,
      sedang: questions.filter((q) => q.difficulty === "Sedang").length,
      sulit: questions.filter((q) => q.difficulty === "Sulit").length,
    };

    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

    return (
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{selectedQuiz.icon}</span>
              <h2 className="text-gray-900">{selectedQuiz.title}</h2>
            </div>
            <p className="text-gray-600">Siap untuk tantangan interaktif?</p>
          </div>
          <Button variant="outline" onClick={() => setViewMode("list")}>
            Kembali
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tentang Kuis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed mb-4">{selectedQuiz.description}</p>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm font-medium text-gray-900 mb-2">Tipe Kuis: {selectedQuiz.type}</p>
                  <p className="text-sm text-gray-600">
                    Semua soal dalam kuis ini menggunakan format <strong>{selectedQuiz.type}</strong>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  Distribusi Level Soal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center border-2 border-green-200">
                    <div className="text-2xl mb-2">⭐</div>
                    <p className="text-sm font-medium text-gray-900">Mudah</p>
                    <p className="text-2xl font-bold text-green-600">{difficultyCount.mudah}</p>
                    <p className="text-xs text-gray-600 mt-1">10 poin/soal</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center border-2 border-orange-200">
                    <div className="text-2xl mb-2">⭐⭐</div>
                    <p className="text-sm font-medium text-gray-900">Sedang</p>
                    <p className="text-2xl font-bold text-orange-600">{difficultyCount.sedang}</p>
                    <p className="text-xs text-gray-600 mt-1">20 poin/soal</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center border-2 border-red-200">
                    <div className="text-2xl mb-2">⭐⭐⭐</div>
                    <p className="text-sm font-medium text-gray-900">Sulit</p>
                    <p className="text-2xl font-bold text-red-600">{difficultyCount.sulit}</p>
                    <p className="text-xs text-gray-600 mt-1">30 poin/soal</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <CardHeader>
                <CardTitle className="text-white">Informasi Kuis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5" />
                  <div>
                    <p className="text-blue-100 text-sm">Jumlah Soal</p>
                    <p className="font-bold">{selectedQuiz.totalQuestions} Soal</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5" />
                  <div>
                    <p className="text-blue-100 text-sm">Durasi</p>
                    <p className="font-bold">{selectedQuiz.duration} Menit</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5" />
                  <div>
                    <p className="text-blue-100 text-sm">Level</p>
                    <p className="font-bold">{selectedQuiz.level}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5" />
                  <div>
                    <p className="text-blue-100 text-sm">Total Poin</p>
                    <p className="font-bold">{totalPoints} Poin</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {selectedQuiz.submissionStatus === "graded" ? (
              <div className="space-y-3">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                  Kuis ini sudah dinilai.
                  {selectedQuiz.totalScore !== null && selectedQuiz.totalScore !== undefined ? ` Skor kamu: ${selectedQuiz.totalScore}` : ""}
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 gap-2 h-12"
                  onClick={() => {
                    setQuizResult({
                      score: selectedQuiz.totalScore ?? 0,
                      correct: 0,
                      total: selectedQuiz.totalQuestions ?? 0,
                      totalPoints: selectedQuiz.totalPoints ?? 0,
                      earnedPoints: 0,
                      hasEssay: false,
                    });
                    setViewMode("result");
                  }}
                >
                  <Award className="w-5 h-5" />
                  Lihat Hasil
                </Button>
              </div>
            ) : selectedQuiz.submissionStatus === "submitted" || selectedQuiz.submissionId ? (
              <div className="space-y-3">
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">Kuis ini sudah pernah dikerjakan dan sedang menunggu penilaian guru. Kuis hanya bisa dikerjakan 1 kali.</div>
                <Button
                  variant="outline"
                  className="w-full gap-2 h-12"
                  onClick={() => {
                    setQuizResult({
                      score: 0,
                      correct: 0,
                      total: selectedQuiz.totalQuestions ?? 0,
                      totalPoints: selectedQuiz.totalPoints ?? 0,
                      earnedPoints: 0,
                      hasEssay: true,
                    });
                    setViewMode("result");
                  }}
                >
                  <Clock className="w-5 h-5" />
                  Lihat Status Kuis
                </Button>
              </div>
            ) : (
              <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 gap-2 h-12" onClick={handleBeginQuiz}>
                <Play className="w-5 h-5" />
                Mulai Mengerjakan
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === "quiz" && selectedQuiz) {
    const questions = quizQuestions;
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const currentQ = questions[currentQuestion];

    if (!currentQ) return null;

    return (
      <div className="fixed inset-0 z-50 bg-[#eef5ff] overflow-auto">
        <DndProvider backend={HTML5Backend}>
          <div className="max-w-5xl mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">{selectedQuiz.title}</h2>

              <Button
                className="bg-red-500 hover:bg-red-600 text-white font-semibold"
                onClick={() => {
                  const confirmExit = window.confirm("Yakin ingin keluar dari kuis?");
                  if (confirmExit) {
                    setViewMode("list");
                    setSelectedQuiz(null);
                    setCurrentQuestion(0);
                    setAnswers({});
                    setQuizQuestions([]);
                    setTimeLeft(0);
                  }
                }}
              >
                Keluar Kuis
              </Button>
            </div>

            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
              <CardContent className="p-4">
                <div className="flex justify-between mb-2">
                  <div>
                    <p className="text-sm opacity-90">Waktu Tersisa</p>
                    <p className="text-2xl font-bold">{formatTime(timeLeft)}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm opacity-90">Progress</p>
                    <p className="text-xl font-bold">
                      {currentQuestion + 1}/{questions.length}
                    </p>
                  </div>
                </div>

                <Progress value={progress} className="h-2 bg-white/30" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-2">
                  <Badge>Soal {currentQuestion + 1}</Badge>
                  <Badge variant="secondary">{currentQ.difficulty}</Badge>
                  <Badge className="ml-auto bg-yellow-400 text-black">{currentQ.points} poin</Badge>
                </div>

                <p className="text-lg font-semibold text-gray-800 mb-2">{currentQ.question}</p>

                {currentQ.type === "multiple-choice" && (
                  <div className="space-y-3">
                    {currentQ.options.map((option: string, i: number) => {
                      const selected = answers[currentQ.id] === i;

                      return (
                        <div
                          key={i}
                          onClick={() => setAnswers({ ...answers, [currentQ.id]: i })}
                          className={`p-4 border rounded-lg cursor-pointer transition ${selected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`}
                        >
                          {option}
                        </div>
                      );
                    })}
                  </div>
                )}

                {currentQ.type === "essay" && (
                  <Textarea
                    value={answers[currentQ.id] || ""}
                    onChange={(e) =>
                      setAnswers({
                        ...answers,
                        [currentQ.id]: e.target.value,
                      })
                    }
                    placeholder="Tulis jawaban anda..."
                  />
                )}
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" disabled={currentQuestion === 0} onClick={handlePrevQuestion}>
                Sebelumnya
              </Button>

              {currentQuestion < questions.length - 1 ? (
                <Button onClick={handleNextQuestion}>Selanjutnya</Button>
              ) : (
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleSubmitQuiz}>
                  Selesai
                </Button>
              )}
            </div>
          </div>
        </DndProvider>
      </div>
    );
  }

  if (viewMode === "result" && quizResult && selectedQuiz) {
    if (quizResult.hasEssay) {
      return (
        <>
          {successToast}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="mb-4">
                  <Clock className="w-20 h-20 mx-auto text-white animate-pulse" />
                </div>
                <h2 className="text-white mb-2">Status Penilaian</h2>
                <p className="text-sm mb-6 opacity-90">Jawaban essay Anda sudah berhasil dikumpulkan.</p>

                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 mb-6">
                  <p className="text-sm opacity-90 mb-2">Status</p>
                  <p className="text-3xl font-bold mb-2">Menunggu Penilaian Guru</p>
                  <p className="text-sm opacity-90">{quizResult.total} soal telah dikerjakan</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/20">
                  <p className="text-sm opacity-90 mb-2">Informasi</p>
                  <p className="text-sm opacity-80">Nilai akan muncul setelah guru selesai memeriksa jawaban essay Anda.</p>
                </div>

                <Badge className="bg-white/20 text-white hover:bg-white/30 px-6 py-2 text-base border border-white/30">
                  Dikumpulkan:{" "}
                  {selectedQuiz?.submittedAt
                    ? new Date(selectedQuiz.submittedAt).toLocaleString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="w-5 h-5 text-blue-600" />
                  Proses Selanjutnya
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Jawaban Tersimpan</p>
                    <p className="text-sm text-gray-600">Semua jawaban Anda telah tersimpan dengan aman</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Penilaian Guru</p>
                    <p className="text-sm text-gray-600">Guru akan menilai jawaban essay Anda</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-gray-400">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-400">Nilai Keluar</p>
                    <p className="text-sm text-gray-400">Cek halaman Nilai untuk melihat hasil</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              variant="outline"
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              onClick={() => {
                setViewMode("list");
                setSelectedQuiz(null);
                setQuizResult(null);
              }}
            >
              Kembali ke Daftar Kuis
            </Button>
          </div>
        </>
      );
    }

    const isPassed = quizResult.score >= 70;

    return (
      <>
        {showSuccess && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">✓</span>
            <span className="font-medium">Kuis berhasil diselesaikan!</span>
          </div>
        )}

        <div className="space-y-6">
          <Card className={`${isPassed ? "bg-gradient-to-br from-green-500 to-emerald-600" : "bg-gradient-to-br from-blue-500 to-indigo-600"} text-white`}>
            <CardContent className="pt-8 pb-8 text-center">
              <div className="mb-4">{isPassed ? <Trophy className="w-20 h-20 mx-auto text-yellow-300 animate-bounce" /> : <CheckCircle className="w-20 h-20 mx-auto text-white" />}</div>
              <h2 className="text-white mb-2">{isPassed ? "🎉 Selamat! Kuis Selesai" : "✅ Kuis Selesai"}</h2>
              <p className="text-sm mb-6 opacity-90">{isPassed ? "Anda berhasil menyelesaikan kuis dengan baik!" : "Kuis telah selesai dikerjakan. Terus semangat belajar!"}</p>

              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 mb-6">
                <p className="text-sm opacity-90 mb-2">Nilai Anda</p>
                <p className="text-6xl font-bold mb-2">{quizResult.score}</p>
                <p className="text-sm opacity-90">
                  {quizResult.earnedPoints} dari {quizResult.totalPoints} poin • {quizResult.correct} dari {quizResult.total} soal benar
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm opacity-90 mb-1">Benar</p>
                  <p className="text-xl font-bold">{quizResult.correct}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <XCircle className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm opacity-90 mb-1">Salah</p>
                  <p className="text-xl font-bold">{quizResult.total - quizResult.correct}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <Award className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm opacity-90 mb-1">Poin</p>
                  <p className="text-xl font-bold">+{quizResult.earnedPoints}</p>
                </div>
              </div>

              {isPassed && <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-500 px-6 py-2 text-base">🏆 Badge: Quiz Master</Badge>}
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setViewMode("list");
                setSelectedQuiz(null);
                setQuizResult(null);
              }}
            >
              Kembali ke Daftar Kuis
            </Button>
          </div>
        </div>
      </>
    );
  }

  return null;
}
