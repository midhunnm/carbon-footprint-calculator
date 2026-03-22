import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/logo.png";

const Navbar = () => {
  const location  = useLocation();
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const navLink = (path, label) => (
    <Link
      to={path}
      className={`relative text-sm font-medium tracking-wide transition-colors duration-200 group ${
        isActive(path) ? "text-white" : "text-[var(--color-text-secondary)] hover:text-white"
      }`}
    >
      {label}
      <span className={`absolute -bottom-1 left-0 h-[2px] rounded-full bg-[var(--color-primary)] transition-all duration-300 ${
        isActive(path) ? "w-full" : "w-0 group-hover:w-full"
      }`} />
    </Link>
  );

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "glass border-b border-[var(--color-dark-border)] py-3" : "bg-transparent py-5"
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img src={logo} alt="CFC Logo" className="h-9 w-auto transition-transform duration-300 group-hover:scale-105" />
          <div className="hidden sm:block">
            <p className="text-white font-semibold text-sm leading-tight" style={{fontFamily:"Syne,sans-serif"}}>
              Carbon Footprint
            </p>
            <p className="text-[var(--color-accent)] text-xs tracking-widest uppercase leading-tight">
              Calculator
            </p>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLink("/",          "Home")}
          {navLink("/find-car",  "Find Car")}
          {navLink("/gallery",   "Gallery")}
        </div>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-4">
          <Link
            to="/calculator"
            className="btn-primary hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
          >
            Calculate Now
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-1.5"
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-white rounded transition-all duration-300 ${menuOpen?"rotate-45 translate-y-2":""}`} />
            <span className={`block w-6 h-0.5 bg-white rounded transition-all duration-300 ${menuOpen?"opacity-0":""}`} />
            <span className={`block w-6 h-0.5 bg-white rounded transition-all duration-300 ${menuOpen?"-rotate-45 -translate-y-2":""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-[var(--color-dark-border)] px-6 py-4 flex flex-col gap-4 animate-fade-in">
          <Link to="/"           className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-white transition">Home</Link>
          <Link to="/find-car"   className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-white transition">Find Car</Link>
          <Link to="/gallery"    className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-white transition">Gallery</Link>
          <Link to="/calculator" className="btn-primary text-center px-5 py-2.5 rounded-xl text-sm font-semibold">Calculate Now</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;