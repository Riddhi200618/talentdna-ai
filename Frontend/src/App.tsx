import { Navigate, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import CandidateUploadPage from "./pages/CandidateUpload";
import DiamondPanelPage from "./pages/DiamondPanel";
import LeaderboardPage from "./pages/Leaderboard";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<LeaderboardPage />} />
          <Route path="/diamonds" element={<DiamondPanelPage />} />
          <Route path="/upload" element={<CandidateUploadPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
