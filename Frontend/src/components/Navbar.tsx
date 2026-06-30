import { NavLink, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "../utils/cn";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#131319]/80 backdrop-blur-xl border-b border-[#414753]/15 shadow-2xl font-hanken">
      <div className="flex justify-between items-center h-20 px-margin-mobile md:px-lg max-w-container-max mx-auto">
        <Link to="/" className="font-headline-sm text-headline-sm font-bold text-on-surface tracking-tight hover:opacity-90 transition-opacity">
          TalentDNA
        </Link>
        <div className="hidden md:flex gap-lg items-center">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cn(
                "font-label-md text-label-md pb-1 border-b-2 transition-all duration-200",
                isActive
                  ? "text-lp-primary border-lp-primary"
                  : "text-on-surface-variant border-transparent hover:text-on-surface hover:bg-primary-container/10 px-sm py-xs rounded"
              )
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/leaderboard"
            className={({ isActive }) =>
              cn(
                "font-label-md text-label-md pb-1 border-b-2 transition-all duration-200",
                isActive
                  ? "text-lp-primary border-lp-primary"
                  : "text-on-surface-variant border-transparent hover:text-on-surface hover:bg-primary-container/10 px-sm py-xs rounded"
              )
            }
          >
            Leaderboard
          </NavLink>
          <NavLink
            to="/diamonds"
            className={({ isActive }) =>
              cn(
                "font-label-md text-label-md pb-1 border-b-2 transition-all duration-200",
                isActive
                  ? "text-lp-primary border-lp-primary"
                  : "text-on-surface-variant border-transparent hover:text-on-surface hover:bg-primary-container/10 px-sm py-xs rounded"
              )
            }
          >
            Diamonds
          </NavLink>
        </div>
        <NavLink
          to="/upload"
          className={({ isActive }) =>
            cn(
              "hidden md:block px-md py-xs rounded-full font-label-md text-label-md font-semibold transition-all active:scale-95 duration-200",
              isActive
                ? "bg-[#acc7ff] text-[#002e68] glow-primary"
                : "bg-primary-container text-on-primary-container glow-primary hover:opacity-90"
            )
          }
        >
          Upload
        </NavLink>
        
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-on-surface"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen ? (
        <div className="md:hidden border-t border-[#414753]/15 bg-[#131319]/95 backdrop-blur-xl px-4 py-4 space-y-3">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              cn(
                "block px-3 py-2 rounded-md text-base font-medium transition-all",
                isActive
                  ? "text-lp-primary bg-primary-container/10"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-primary-container/10"
              )
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/leaderboard"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              cn(
                "block px-3 py-2 rounded-md text-base font-medium transition-all",
                isActive
                  ? "text-lp-primary bg-primary-container/10"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-primary-container/10"
              )
            }
          >
            Leaderboard
          </NavLink>
          <NavLink
            to="/diamonds"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              cn(
                "block px-3 py-2 rounded-md text-base font-medium transition-all",
                isActive
                  ? "text-lp-primary bg-primary-container/10"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-primary-container/10"
              )
            }
          >
            Diamonds
          </NavLink>
          <NavLink
            to="/upload"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              cn(
                "block w-full text-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200",
                isActive
                  ? "bg-[#acc7ff] text-[#002e68] glow-primary"
                  : "bg-primary-container text-on-primary-container glow-primary"
              )
            }
          >
            Upload
          </NavLink>
        </div>
      ) : null}
    </nav>
  );
}
