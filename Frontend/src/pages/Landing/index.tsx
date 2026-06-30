import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {


  return (
    <div className="font-hanken text-on-surface bg-[#05050A] min-h-screen flex flex-col relative overflow-x-hidden w-full">
      <main className="flex-grow pt-xxl">
        {/* Hero Section */}
        <section className="relative pt-xxl pb-xl px-margin-mobile md:px-lg max-w-container-max mx-auto flex flex-col items-center text-center">
          {/* Abstract Background Glow */}
          <div className="absolute inset-0 z-[-1] flex items-center justify-center opacity-60 pointer-events-none">
            <div className="w-[800px] h-[800px] bg-gradient-radial rounded-full blur-3xl"></div>
          </div>
          <h1 className="font-display-lg text-display-lg md:text-[84px] text-on-surface max-w-4xl mb-lg leading-tight relative z-10">
            The Premier Talent Network <br />
            <span className="text-gradient">for High-Signal Merit.</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-xl relative z-10">
            TalentDNA makes everyone evaluable on merit, not pedigree. We architect the talent layer of the digital future through precision, transparency, and deep intelligence.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-wrap gap-4 justify-center relative z-10 mb-xl">
            <Link
              to="/leaderboard"
              className="px-6 py-3 rounded-full font-label-md text-label-md font-semibold text-on-primary-container bg-primary-container hover:opacity-90 transition-opacity glow-primary flex items-center gap-2"
            >
              Explore Talent
              <span className="material-symbols-outlined text-sm">trending_up</span>
            </Link>
            <Link
              to="/diamonds"
              className="px-6 py-3 rounded-full font-label-md text-label-md font-semibold text-on-surface bg-surface-container hover:bg-surface-container-highest transition-colors border border-outline-variant/30 flex items-center gap-2"
            >
              View Diamonds
              <span className="material-symbols-outlined text-sm">gem</span>
            </Link>
            <Link
              to="/upload"
              className="px-6 py-3 rounded-full font-label-md text-label-md font-semibold text-white bg-secondary-container hover:opacity-90 transition-opacity glow-secondary flex items-center gap-2"
            >
              Upload Candidate
              <span className="material-symbols-outlined text-sm">upload_file</span>
            </Link>
          </div>
        </section>

        {/* Divider Section */}
        <section className="py-xl border-y border-outline-variant/10 bg-[#131319]/20"></section>

        {/* Features Asymmetrical Grid */}
        <section className="py-xxl px-margin-mobile md:px-lg max-w-container-max mx-auto relative">
          <div className="absolute right-0 top-1/4 w-96 h-96 bg-lp-primary/10 rounded-full blur-3xl pointer-events-none z-0"></div>
          <div className="absolute left-10 top-1/2 w-64 h-64 bg-lp-secondary/10 rounded-full blur-3xl pointer-events-none z-0"></div>
          
          <div className="text-center mb-xl max-w-3xl mx-auto relative z-10">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-md">
              Talent Architecture Isn’t Transactional. It’s Transformational.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-lg relative z-10">
            {/* Feature 1 (Large, Merit-Based Ranking) */}
            <div className="md:col-span-8 glass-panel-heavy rounded-2xl p-xl flex flex-col justify-between relative overflow-hidden group transition-all duration-500 hover:border-lp-primary/40 hover:-translate-y-2 shadow-2xl">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-lp-primary/20 rounded-full blur-3xl opacity-50 transition-opacity group-hover:opacity-100"></div>
              <span className="material-symbols-outlined text-lp-primary text-5xl mb-lg relative z-10">verified</span>
              <div className="relative z-10 max-w-xl">
                <h3 className="font-headline-md text-headline-md text-on-surface mb-sm">Merit-Based Ranking</h3>
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  Our algorithm evaluates actual output, code quality, and problem-solving patterns rather than relying on brand names.
                </p>
                <div className="mt-6">
                  <Link
                    to="/leaderboard"
                    className="inline-flex items-center gap-1.5 text-lp-primary hover:underline text-sm font-medium"
                  >
                    See Candidate Rankings
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Feature 2 (Stacked, High-Signal Intelligence) */}
            <div className="md:col-span-4 glass-panel-heavy rounded-2xl p-xl flex flex-col justify-between hover:border-lp-primary/30 transition-all duration-500 hover:-translate-y-2 relative z-20 backdrop-blur-2xl bg-surface-container/60 shadow-2xl">
              <span className="material-symbols-outlined text-lp-primary text-4xl mb-md">memory</span>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-xs">High-Signal Intelligence</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  We extract meaning from fragmented data—open-source contributions, technical history, and verified execution metrics to build a complete profile.
                </p>
                <div className="mt-6">
                  <Link
                    to="/upload"
                    className="inline-flex items-center gap-1.5 text-lp-primary hover:underline text-sm font-medium"
                  >
                    Start Evaluating Candidates
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Feature 3 (Offset, Pedigree Gap Analysis) */}
            <div className="md:col-span-12 glass-panel-heavy rounded-2xl p-xl flex flex-col md:flex-row items-center gap-lg justify-between hover:border-lp-secondary/30 transition-all duration-500 hover:-translate-y-2 relative z-10 shadow-2xl bg-surface-container-high/40">
              <div className="flex-shrink-0">
                <span className="material-symbols-outlined text-lp-secondary text-[64px]">analytics</span>
              </div>
              <div className="flex-grow">
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-xs">Pedigree Gap Analysis</h3>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
                  Identify "Diamonds in the rough"—candidates whose actual verified skill level far exceeds their formal education or past employer prestige.
                </p>
              </div>
              <div className="flex-shrink-0 mt-4 md:mt-0">
                <Link
                  to="/diamonds"
                  className="inline-flex items-center gap-1.5 text-lp-secondary hover:underline text-sm font-medium px-4 py-2 rounded-full border border-outline-variant/30 bg-surface-container hover:bg-surface-container-highest transition-colors"
                >
                  Discover Hidden Talent
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-xxl bg-surface-container-lowest border-t border-outline-variant/5 relative z-10 mt-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter px-margin-mobile md:px-lg max-w-container-max mx-auto">
          <div className="col-span-2 md:col-span-1 flex flex-col gap-md">
            <span className="font-headline-md text-headline-md font-black text-on-surface mb-sm">TalentDNA</span>
            <p className="font-body-md text-body-md text-on-surface-variant opacity-80">
              &copy; 2024 TalentDNA AI. All rights reserved.
            </p>
          </div>
          <div className="flex flex-col gap-sm">
            <a className="font-label-md text-label-md text-on-surface-variant hover:text-lp-primary transition-colors opacity-80 hover:opacity-100" href="#team">
              Build your team
            </a>
            <a className="font-label-md text-label-md text-on-surface-variant hover:text-lp-primary transition-colors opacity-80 hover:opacity-100" href="#jobs">
              Job Opportunities
            </a>
            <a className="font-label-md text-label-md text-on-surface-variant hover:text-lp-primary transition-colors opacity-80 hover:opacity-100" href="#about">
              About us
            </a>
          </div>
          <div className="flex flex-col gap-sm">
            <a className="font-label-md text-label-md text-on-surface-variant hover:text-lp-primary transition-colors opacity-80 hover:opacity-100" href="#blog">
              Blog
            </a>
            <a className="font-label-md text-label-md text-on-surface-variant hover:text-lp-primary transition-colors opacity-80 hover:opacity-100" href="#contact">
              Contact
            </a>
          </div>
          <div className="flex flex-col gap-sm">
            <a className="font-label-md text-label-md text-on-surface-variant hover:text-lp-primary transition-colors opacity-80 hover:opacity-100" href="#terms">
              Terms of Service
            </a>
            <a className="font-label-md text-label-md text-on-surface-variant hover:text-lp-primary transition-colors opacity-80 hover:opacity-100" href="#privacy">
              Privacy Notice
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
