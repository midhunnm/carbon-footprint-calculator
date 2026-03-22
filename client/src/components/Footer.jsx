import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const team = [
  { name: "Midhun",  role: "Developer",  email: "tl23btcs0251@vidyaacademy.ac.in" },
  { name: "Athulya", role: "Developer",  email: "tl23btcs0084@vidyaacademy.ac.in" },
  { name: "Alanraj", role: "Developer",  email: "tl23btcs0562@vidyaacademy.ac.in" },
  { name: "Mayukh",  role: "Developer",  email: "tl23btcs0420@vidyaacademy.ac.in" },
];

const Footer = () => (
  <footer className="border-t border-[var(--color-dark-border)] bg-[var(--color-dark-2)]">
    <div className="max-w-7xl mx-auto px-6 py-14">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="CFC Logo" className="h-9 w-auto" />
            <div>
              <p className="text-white font-semibold text-sm" style={{fontFamily:"Syne,sans-serif"}}>Carbon Footprint</p>
              <p className="text-[var(--color-accent)] text-xs tracking-widest uppercase">Calculator</p>
            </div>
          </div>
          <p className="text-[var(--color-text-muted)] text-xs leading-relaxed max-w-xs">
            Lifecycle vehicle emission analysis using Entropy-TOPSIS methodology.
            Built for informed, sustainable transportation decisions in India.
          </p>
        </div>

        {/* Team */}
        <div>
          <p className="text-white font-semibold text-sm mb-4" style={{fontFamily:"Syne,sans-serif"}}>
            Team
          </p>
          <div className="space-y-3">
            {team.map((m) => (
              <div key={m.name} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[var(--color-primary)] text-xs font-bold">{m.name[0]}</span>
                </div>
                <div>
                  <p className="text-white text-xs font-medium">{m.name}
                    <span className="text-[var(--color-text-muted)] font-normal ml-1.5">— {m.role}</span>
                  </p>
                  {m.email ? (
                    <a
                      href={`mailto:${m.email}`}
                      className="text-[var(--color-accent)] text-[10px] hover:underline break-all"
                    >
                      {m.email}
                    </a>
                  ) : (
                    <p className="text-[var(--color-text-muted)] text-[10px]">Vidya Academy of Science & Technology</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Research & Links */}
        <div>
          <p className="text-white font-semibold text-sm mb-4" style={{fontFamily:"Syne,sans-serif"}}>
            Research Paper
          </p>
          <a
            href="https://doi.org/10.1016/j.grets.2024.100128"
            target="_blank"
            rel="noopener noreferrer"
            className="block glass rounded-xl p-4 hover:border-[var(--color-primary)]/40 transition-colors duration-200 group"
          >
            <p className="text-white text-xs font-semibold mb-1 group-hover:text-[var(--color-accent)] transition-colors">
              Assessment and ranking of different vehicles carbon footprint
            </p>
            <p className="text-[var(--color-text-muted)] text-[10px] mb-2">
              Ashraf et al. · Green Technologies and Sustainability · 2025
            </p>
            <p className="text-[var(--color-primary)] text-[10px] break-all group-hover:underline">
              doi.org/10.1016/j.grets.2024.100128
            </p>
          </a>

          <div className="mt-4 flex gap-3">
            <Link to="/"           className="text-[var(--color-text-muted)] text-xs hover:text-white transition">Home</Link>
            <Link to="/find-car"   className="text-[var(--color-text-muted)] text-xs hover:text-white transition">Find Car</Link>
            <Link to="/calculator" className="text-[var(--color-text-muted)] text-xs hover:text-white transition">Calculator</Link>
            <Link to="/gallery"    className="text-[var(--color-text-muted)] text-xs hover:text-white transition">Gallery</Link>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="mt-10 pt-6 border-t border-[var(--color-dark-border)] flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-[var(--color-text-muted)] text-xs">
          © 2025 Carbon Footprint Calculator · Vidya Academy of Science & Technology
        </p>
        <p className="text-[var(--color-text-muted)] text-xs">
          Entropy-TOPSIS Methodology · Ashraf et al., 2025
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;