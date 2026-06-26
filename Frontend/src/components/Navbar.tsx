import { NavLink } from "react-router-dom";
import { Gem, LayoutDashboard, Upload, UsersRound } from "lucide-react";
import { cn } from "../utils/cn";

const navItems = [
  { to: "/", label: "Leaderboard", icon: LayoutDashboard },
  { to: "/diamonds", label: "Diamonds", icon: Gem },
  { to: "/upload", label: "Upload", icon: Upload },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="rounded-md bg-blue-600 p-2 text-white">
            <UsersRound className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-base font-bold text-slate-950">TalentDNA AI</p>
            <p className="text-xs text-muted-foreground">Recruiter dashboard</p>
          </div>
        </NavLink>
        <nav className="flex flex-wrap gap-2" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-700",
                  isActive && "bg-blue-50 text-blue-700",
                )
              }
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
