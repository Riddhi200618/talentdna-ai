import { Navigate, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import CandidateUploadPage from "./pages/CandidateUpload";
import DiamondPanelPage from "./pages/DiamondPanel";
import LeaderboardPage from "./pages/Leaderboard";
import LandingPage from "./pages/Landing";

export default function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/leaderboard"
          element={
            <main className="mx-auto max-w-7xl px-4 pt-28 pb-8 sm:px-6 lg:px-8 w-full flex-grow">
              <LeaderboardPage />
            </main>
          }
        />
        <Route
          path="/diamonds"
          element={
            <main className="mx-auto max-w-7xl px-4 pt-28 pb-8 sm:px-6 lg:px-8 w-full flex-grow">
              <DiamondPanelPage />
            </main>
          }
        />
        <Route
          path="/upload"
          element={
            <main className="mx-auto max-w-7xl px-4 pt-28 pb-8 sm:px-6 lg:px-8 w-full flex-grow">
              <CandidateUploadPage />
            </main>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
