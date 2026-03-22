import { useNavigate } from "react-router-dom";
import mainCar from "../assets/main_car.png";
import car2    from "../assets/car2.webp";
import car3    from "../assets/car3.webp";
import Footer  from "../components/Footer";

const Home = () => {
  const navigate = useNavigate();

  const stats = [
    { value: "40+",    label: "Cars Analysed",     sub: "Across all fuel types"  },
    { value: "4",      label: "Emission Criteria",  sub: "Per lifecycle stage"    },
    { value: "TOPSIS", label: "Decision Method",    sub: "Ashraf et al., 2025"    },
    { value: "12k",    label: "km / year Baseline", sub: "India average"          },
  ];

  const features = [
    {
      title: "Instant Eco Score",
      desc:  "Enter your vehicle details and get a TOPSIS-based lifecycle score in seconds.",
      color: "from-blue-500/20 to-blue-600/5",
      border: "border-blue-500/20",
      dot: "#2563EB",
    },
    {
      title: "4-Criteria Analysis",
      desc:  "Fuel consumption, maintenance, battery manufacturing, and vehicle manufacturing — all weighted by entropy.",
      color: "from-cyan-500/20 to-cyan-600/5",
      border: "border-cyan-500/20",
      dot: "#38BDF8",
    },
    {
      title: "TOPSIS Ranking",
      desc:  "See exactly where your vehicle ranks against Diesel, Petrol, Hybrid, Biodiesel, and Electric benchmarks.",
      color: "from-emerald-500/20 to-emerald-600/5",
      border: "border-emerald-500/20",
      dot: "#22C55E",
    },
    {
      title: "Browse 40+ Cars",
      desc:  "Explore real Indian market vehicles with pre-computed eco scores, safety ratings, and price filters.",
      color: "from-orange-500/20 to-orange-600/5",
      border: "border-orange-500/20",
      dot: "#F97316",
    },
  ];

  const fuelTypes = [
    { label: "Electric", color: "#22C55E", note: "Lowest operational CO₂" },
    { label: "Hybrid",   color: "#38BDF8", note: "Best lifecycle score"   },
    { label: "Petrol",   color: "#F97316", note: "Widest model range"     },
    { label: "Diesel",   color: "#94A3B8", note: "Best fuel efficiency"   },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-dark)] overflow-x-hidden">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center hero-grid overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-[var(--color-primary)] opacity-10 blur-[120px]" />
          <div className="absolute bottom-1/4 right-0 w-80 h-80 rounded-full bg-[var(--color-accent)] opacity-8 blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-16 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs font-medium text-[var(--color-accent)] mb-8 animate-fade-up">
                <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
                Powered by Entropy-TOPSIS · Ashraf et al., 2025
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] mb-6 animate-fade-up delay-100" style={{fontFamily:"Syne,sans-serif"}}>
                Carbon
                <span className="block text-transparent bg-clip-text" style={{backgroundImage:"linear-gradient(135deg,#2563EB,#38BDF8)"}}>
                  Footprint
                </span>
                Calculator
              </h1>

              <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed max-w-xl mb-10 animate-fade-up delay-200">
                Analyse and rank vehicles by total lifecycle CO₂ — from fuel combustion
                to battery manufacturing — using scientific multi-criteria decision making.
              </p>

              <div className="flex flex-wrap gap-4 animate-fade-up delay-300">
                <button
                  onClick={() => navigate("/calculator")}
                  className="btn-primary flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold"
                >
                  Calculate My Car's Score
                </button>
                <button
                  onClick={() => navigate("/find-car")}
                  className="flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold glass border border-[var(--color-dark-border)] text-white hover:border-[var(--color-primary)] transition-colors duration-200"
                >
                  Browse Cars &rarr;
                </button>
              </div>
            </div>

            {/* Right */}
            <div className="relative flex justify-center items-center animate-fade-up delay-200">
              <div className="absolute inset-0 bg-[var(--color-primary)] opacity-10 blur-[80px] rounded-full scale-75" />
              <img
                src={mainCar}
                alt="Eco Vehicle"
                className="relative w-full max-w-lg lg:max-w-xl drop-shadow-2xl"
                style={{filter:"drop-shadow(0 0 40px rgba(37,99,235,0.3))"}}
              />
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-up delay-500">
            <span className="text-[var(--color-text-muted)] text-xs tracking-widest uppercase">Scroll</span>
            <div className="w-px h-10 bg-gradient-to-b from-[var(--color-primary)] to-transparent" />
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section className="py-16 border-y border-[var(--color-dark-border)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <p className="stat-value mb-1">{s.value}</p>
                <p className="text-white font-semibold text-sm mb-0.5">{s.label}</p>
                <p className="text-[var(--color-text-muted)] text-xs">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FUEL TYPES ────────────────────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <p className="text-[var(--color-accent)] text-xs font-semibold tracking-widest uppercase mb-4 text-center">
          What We Analyse
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12" style={{fontFamily:"Syne,sans-serif"}}>
          All Fuel Types. One Framework.
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {fuelTypes.map((ft, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-6 text-center transition-all duration-300 group cursor-default"
              style={{borderColor: ft.color + "33"}}
            >
              {/* Colored dot instead of emoji */}
              <div className="w-10 h-10 rounded-full mx-auto mb-4 flex items-center justify-center"
                   style={{background: ft.color + "22", border:`1.5px solid ${ft.color}55`}}>
                <div className="w-3 h-3 rounded-full" style={{background: ft.color}} />
              </div>
              <p className="text-white font-semibold text-base mb-1" style={{fontFamily:"Syne,sans-serif"}}>{ft.label}</p>
              <p className="text-[var(--color-text-muted)] text-xs">{ft.note}</p>
              <div className="mt-4 h-0.5 w-12 mx-auto rounded-full transition-all duration-300 group-hover:w-full"
                   style={{background: ft.color}} />
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-[var(--color-dark-2)]">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[var(--color-accent)] text-xs font-semibold tracking-widest uppercase mb-4 text-center">
            Features
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12" style={{fontFamily:"Syne,sans-serif"}}>
            Science-backed. Simple to use.
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <div
                key={i}
                className={`rounded-2xl p-6 border bg-gradient-to-b ${f.color} ${f.border} hover:scale-[1.02] transition-transform duration-200`}
              >
                {/* Numbered badge instead of emoji */}
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 font-bold text-sm"
                     style={{background: f.dot + "22", color: f.dot, border:`1px solid ${f.dot}44`}}>
                  0{i+1}
                </div>
                <h3 className="text-white font-semibold text-base mb-2" style={{fontFamily:"Syne,sans-serif"}}>{f.title}</h3>
                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ───────────────────────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <p className="text-[var(--color-accent)] text-xs font-semibold tracking-widest uppercase mb-4 text-center">Gallery</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12" style={{fontFamily:"Syne,sans-serif"}}>
          Every car tells a carbon story.
        </h2>
        <div className="grid md:grid-cols-2 gap-5">
          <div
            className="rounded-3xl overflow-hidden h-64 relative group cursor-pointer"
            onClick={() => navigate("/gallery")}
          >
            <img src={car2} alt="Petrol and Diesel cars" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)] via-transparent to-transparent" />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-[var(--color-primary)]/0 group-hover:bg-[var(--color-primary)]/10 transition-colors duration-300 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 glass px-5 py-2.5 rounded-xl text-white text-sm font-semibold">
                View Gallery &rarr;
              </span>
            </div>
            <div className="absolute bottom-5 left-5">
              <p className="text-white font-semibold text-lg" style={{fontFamily:"Syne,sans-serif"}}>Petrol &amp; Diesel</p>
              <p className="text-[var(--color-text-secondary)] text-sm">Internal combustion insights</p>
            </div>
          </div>
          <div
            className="rounded-3xl overflow-hidden h-64 relative group cursor-pointer"
            onClick={() => navigate("/gallery")}
          >
            <img src={car3} alt="Electric and Hybrid cars" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)] via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[var(--color-primary)]/0 group-hover:bg-[var(--color-primary)]/10 transition-colors duration-300 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 glass px-5 py-2.5 rounded-xl text-white text-sm font-semibold">
                View Gallery &rarr;
              </span>
            </div>
            <div className="absolute bottom-5 left-5">
              <p className="text-white font-semibold text-lg" style={{fontFamily:"Syne,sans-serif"}}>Electric &amp; Hybrid</p>
              <p className="text-[var(--color-text-secondary)] text-sm">Lifecycle emission analysis</p>
            </div>
          </div>
        </div>
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/gallery")}
            className="glass border border-[var(--color-dark-border)] text-[var(--color-text-secondary)] hover:text-white hover:border-[var(--color-primary)]/40 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
          >
            View Full Gallery &rarr;
          </button>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-[var(--color-dark-2)]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[var(--color-accent)] text-xs font-semibold tracking-widest uppercase mb-4">Methodology</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{fontFamily:"Syne,sans-serif"}}>How it works</h2>
          <p className="text-[var(--color-text-secondary)] mb-12 leading-relaxed">
            Based on <span className="text-white font-medium">Ashraf et al. (2025)</span> published in
            Green Technologies and Sustainability. We implement the full Entropy-TOPSIS pipeline.
          </p>
          <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
            {[
              { step:"01", label:"Input",          desc:"Fuel type, mileage, distance, maintenance"  },
              { step:"02", label:"Entropy Weight",  desc:"4 criteria weighted by information entropy" },
              { step:"03", label:"TOPSIS",          desc:"Rank vs 5 reference vehicle benchmarks"     },
              { step:"04", label:"Eco Score",       desc:"0–10 performance index returned to you"     },
            ].map((s, i) => (
              <div key={i} className="flex md:flex-col items-center gap-4 md:gap-2 flex-1">
                <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-[var(--color-primary)] flex items-center justify-center">
                  <span className="text-[var(--color-primary)] text-xs font-bold">{s.step}</span>
                </div>
                {i < 3 && <div className="hidden md:block h-px flex-1 bg-[var(--color-dark-border)] w-full" />}
                <div className="md:text-center">
                  <p className="text-white font-semibold text-sm">{s.label}</p>
                  <p className="text-[var(--color-text-muted)] text-xs mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[var(--color-primary)] opacity-10 blur-[120px] rounded-full" />
        </div>
        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6" style={{fontFamily:"Syne,sans-serif"}}>
            Know your car's true carbon cost.
          </h2>
          <p className="text-[var(--color-text-secondary)] text-lg mb-10">
            It takes under 60 seconds to calculate your vehicle's full lifecycle eco score.
          </p>
          <button
            onClick={() => navigate("/calculator")}
            className="btn-primary inline-flex items-center gap-3 px-10 py-4 rounded-2xl text-lg font-bold"
          >
            Start Calculating — It's Free
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;