import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { WelcomePage } from "./pages/WelcomePage";
import { AboutPage } from "./pages/AboutPage";
import { QuizPage } from "./pages/QuizPage";
import { ResultPage } from "./pages/ResultPage";
import { StudentProfile } from "./pages/StudentProfile";
import { ProgramDetailsPage } from "./pages/ProgramDetailsPage";
import { ProgramComparison } from "./pages/ProgramComparison";
import { LoginPage } from "./pages/auth/LoginPage";
import { StudentInfoForm } from "./pages/auth/StudentInfoForm";
import { AnalyticsDashboard } from "./pages/admin/AnalyticsDashboard";
import { StudentProvider } from "./context/StudentContext";
import { GamificationProvider } from "./context/GamificationContext";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import { Layout } from "./components/layout/Layout";

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="myunipath-theme">
      <StudentProvider>
        <GamificationProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<StudentInfoForm />} />
              <Route path="/profile/edit" element={<StudentInfoForm />} />
              <Route path="/student-info" element={<StudentInfoForm />} />

              <Route path="/profile" element={<StudentProfile />} />
              <Route path="/student-profile" element={<StudentProfile />} />

              <Route path="/quiz" element={<QuizPage />} />

              <Route path="/results" element={<ResultPage />} />
              <Route path="/results/:persona" element={<ResultPage />} />
              <Route path="/result" element={<ResultPage />} />
              <Route path="/result/:persona" element={<ResultPage />} />

              <Route path="/programs" element={<ProgramDetailsPage />} />
              <Route path="/program/:programId" element={<ProgramDetailsPage />} />

              <Route path="/compare" element={<ProgramComparison />} />

              <Route path="/admin" element={<AnalyticsDashboard />} />
              <Route path="/analytics" element={<AnalyticsDashboard />} />
            </Routes>
          </Layout>
        </Router>
        </GamificationProvider>
      </StudentProvider>
    </ThemeProvider>
  );
}
