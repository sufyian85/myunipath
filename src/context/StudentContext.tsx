import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { api, clearApiSessionId, setApiSessionId } from '../lib/api';

interface StudentData {
  id?: number;
  name: string;
  age: string;
  email: string;
  spmResult?: File | null;
  persona?: string;
  quizCompleted?: boolean;
  quizResponse?: any;
  transcriptPath?: string;
  // Gamification fields from backend
  xp?: number;
  level?: number;
  quiz_count?: number;
  best_combo?: number;
}

interface StudentContextType {
  studentData: StudentData;
  updateStudentData: (data: Partial<StudentData>) => void;
  isLoggedIn: boolean;
  isLoaded: boolean;
  login: (student: any) => void;
  logout: () => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export function StudentProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [studentData, setStudentData] = useState<StudentData>({
    name: '',
    age: '',
    email: '',
    spmResult: null,
    persona: undefined,
    quizCompleted: false
  });

  // Load user data on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.getMe();
        if (res.success && res.student) {
          setStudentData({
            id: res.student.id,
            name: res.student.name,
            email: res.student.email,
            age: res.student.age?.toString() || '',
            persona: res.student.persona,
            quizCompleted: res.student.quiz_completed,
            quizResponse: res.student.quiz_response,
            transcriptPath: res.student.transcript_path,
            xp: res.student.xp ?? 0,
            level: res.student.level ?? 1,
            quiz_count: res.student.quiz_count ?? 0,
            best_combo: res.student.best_combo ?? 0,
          });
          setIsLoggedIn(true);
        }
      } catch (err) {
        // Not logged in or session invalid
        console.log("Not authenticated or guest session");
      } finally {
        setIsLoaded(true);
      }
    };

    checkAuth();
  }, []);

  const updateStudentData = (data: Partial<StudentData>) => {
    setStudentData(prev => ({ ...prev, ...data }));
  };

  const login = (student: any) => {
    setApiSessionId(student.session_id);
    setStudentData(prev => ({
      id: student.id,
      name: student.name,
      email: student.email,
      age: student.age?.toString() || '',
      persona: student.persona || undefined,
      quizCompleted: !!student.quiz_completed,
      quizResponse: student.quiz_response,
      transcriptPath: student.transcript_path,
      spmResult: prev.spmResult,
      xp: student.xp ?? 0,
      level: student.level ?? 1,
      quiz_count: student.quiz_count ?? 0,
      best_combo: student.best_combo ?? 0,
    }));
    setIsLoggedIn(true);
  };

  const logout = () => {
    clearApiSessionId();
    setIsLoggedIn(false);
    setStudentData({
      name: '',
      age: '',
      email: '',
      spmResult: null,
      persona: undefined,
      quizCompleted: false
    });
    window.location.href = '/'; // Refresh to clear all state
  };

  return (
    <StudentContext.Provider value={{ studentData, updateStudentData, isLoggedIn, isLoaded, login, logout }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within StudentProvider');
  }
  return context;
}
