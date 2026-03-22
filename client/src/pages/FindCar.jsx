import { useEffect, useState } from "react";
import Footer from "../components/Footer";

const imageModules = import.meta.glob(
  "../assets/**/*.{jpg,jpeg,png,webp,avif}",
  { eager: true }
);
const getImage = (p) => imageModules[`../assets/${p}`]?.default ?? "";

const ANNUAL_KM = 12000;

const ecoColor = (s) => {
  if (s >= 7) return { bar:"#22C55E", badge:"bg-green-500/15 text-green-400 border border-green-500/25"  };
  if (s >= 5) return { bar:"#38BDF8", badge:"bg-sky-500/15 text-sky-400 border border-sky-500/25"         };
  if (s >= 3) return { bar:"#FACC15", badge:"bg-yellow-500/15 text-yellow-400 border border-yellow-500/25"};
  return           { bar:"#EF4444", badge:"bg-red-500/15 text-red-400 border border-red-500/25"           };
};

const typePill = (t) => {
  switch (t) {
    case "Electric": return "bg-green-500/15 text-green-400 border border-green-500/25";
    case "Hybrid":   return "bg-sky-500/15 text-sky-400 border border-sky-500/25";
    case "Petrol":   return "bg-orange-500/15 text-orange-400 border border-orange-500/25";
    default:         return "bg-slate-500/15 text-slate-400 border border-slate-500/25";
  }
};

const starRating = (r) => {
  const map = { "5-star":5,"4-star":4,"3-star":3,"2-star":2 };
  const count = map[r];
  if (!count) return null;
  const color = count>=5?"#22C55E":count>=4?"#FACC15":count>=3?"#FCD34D":"#FB923C";
  return { count, color };
};

const parsePriceMin = (s) => {
  if (!s) return 0;
  const cr = s.includes("crore");
  const m  = s.match(/[\d.]+/);
  if (!m) return 0;
  return cr ? parseFloat(m[0])*100 : parseFloat(m[0]);
};

const FILTER_TYPES = ["All","Electric","Hybrid","Petrol","Diesel"];

const FindCar = () => {
  const [cars, setCars]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [search, setSearch]         = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sortOrder, setSortOrder]   = useState("ecoDesc");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/cars`)
      .then(r => r.json())
      .then(d => { setCars(d.cars); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  const sorted = [...cars]
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    .filter(c => typeFilter==="All" || c.type===typeFilter)
    .sort((a,b) => {
      switch (sortOrder) {
        case "ecoDesc":   return b.ecoScore - a.ecoScore;
        case "ecoAsc":    return a.ecoScore - b.ecoScore;
        case "priceAsc":  return parsePriceMin(a.price) - parsePriceMin(b.price);
        case "priceDesc": return parsePriceMin(b.price) - parsePriceMin(a.price);
        case "yearDesc":  return b.year - a.year;
        case "yearAsc":   return a.year - b.year;
        default:          return b.ecoScore - a.ecoScore;
      }
    });

  const highestScore = sorted.length > 0 ? Math.max(...sorted.map(c=>c.ecoScore)) : null;

  if (loading) return (
    <div className="min-h-screen bg-[var(--color-dark)] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-[var(--color-primary)]/30 border-t-[var(--color-primary)] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[var(--color-text-secondary)] animate-pulse">Loading from database...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[var(--color-dark)] flex items-center justify-center">
      <div className="glass rounded-3xl p-8 text-center max-w-md">
        <p className="text-white font-semibold text-lg mb-2">Connection Error</p>
        <p className="text-[var(--color-text-secondary)] text-sm">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--color-dark)] flex flex-col">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-64 bg-[var(--color-primary)] opacity-5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative flex-1 max-w-7xl mx-auto px-6 pt-28 pb-16 w-full">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs font-medium text-[var(--color-accent)] mb-5">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
            {ANNUAL_KM.toLocaleString()} km/yr · India avg baseline
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3" style={{fontFamily:"Syne,sans-serif"}}>
            Eco-Friendly Cars
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            {sorted.length} vehicle{sorted.length!==1?"s":""} · Lifecycle eco scores via Entropy-TOPSIS
          </p>
        </div>

        {/* Controls */}
        <div className="glass rounded-2xl p-5 mb-8 space-y-3">

          {/* Row 1 — Search full width */}
          <div className="relative w-full">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search by car name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-dark w-full"
              style={{height:"46px", paddingLeft:"44px"}}
            />
          </div>

          {/* Row 2 — Filter pills left, sort dropdown right */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Type pills */}
            <div className="flex gap-2 flex-wrap flex-1 min-w-0">
              {FILTER_TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border whitespace-nowrap ${
                    typeFilter===t
                      ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-lg shadow-blue-500/20"
                      : "glass-light border-[var(--color-dark-border)] text-[var(--color-text-secondary)] hover:text-white hover:border-[var(--color-primary)]/40"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Sort dropdown — fixed width, never wraps */}
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
              className="input-dark flex-shrink-0 w-48"
              style={{height:"38px", padding:"0 12px"}}
            >
              <option value="ecoDesc">Highest Eco Score</option>
              <option value="ecoAsc">Lowest Eco Score</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="yearDesc">Newest First</option>
              <option value="yearAsc">Oldest First</option>
            </select>
          </div>

        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {sorted.length > 0 ? sorted.map(car => {
            const sc    = ecoColor(car.ecoScore);
            const sr    = starRating(car.safetyRating);
            const isTop = car.ecoScore===highestScore;

            return (
              <div
                key={car.id}
                className="glass rounded-2xl overflow-hidden flex flex-col group hover:border-[var(--color-primary)]/30 hover:-translate-y-1 transition-all duration-300"
                style={{border:"1px solid var(--color-dark-border)"}}
              >
                {/* Image */}
                <div className="relative w-full h-44 overflow-hidden bg-[var(--color-dark-2)] flex-shrink-0">
                  <img
                    src={getImage(car.image)}
                    alt={car.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark-card)] via-transparent to-transparent" />
                  {isTop && (
                    <span className="absolute top-3 right-3 bg-yellow-500 text-black text-xs px-2.5 py-1 rounded-full font-bold shadow-lg">
                      Top Ranked
                    </span>
                  )}
                  <span className={`absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-semibold ${typePill(car.type)}`}
                        style={{backdropFilter:"blur(8px)"}}>
                    {car.type}
                  </span>
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col gap-3 flex-1">
                  <h3 className="text-white font-semibold text-sm leading-tight" style={{fontFamily:"Syne,sans-serif"}}>
                    {car.name}
                  </h3>

                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                    <span className="text-[var(--color-text-muted)]">Year</span>
                    <span className="text-[var(--color-text-secondary)] font-medium">{car.year}</span>

                    <span className="text-[var(--color-text-muted)]">Class</span>
                    <span className="text-[var(--color-text-secondary)] font-medium truncate">{car.vehicleClass}</span>

                    {car.type==="Electric" ? (
                      <>
                        <span className="text-[var(--color-text-muted)]">Range</span>
                        <span className="text-[var(--color-text-secondary)] font-medium">{car.range}</span>
                        <span className="text-[var(--color-text-muted)]">Efficiency</span>
                        <span className="text-[var(--color-text-secondary)] font-medium">{car.efficiency} km/kWh</span>
                      </>
                    ) : (
                      <>
                        <span className="text-[var(--color-text-muted)]">Mileage</span>
                        <span className="text-[var(--color-text-secondary)] font-medium">{car.efficiency} km/l</span>
                        {car.engine && (
                          <>
                            <span className="text-[var(--color-text-muted)]">Engine</span>
                            <span className="text-[var(--color-text-secondary)] font-medium truncate">{car.engine}</span>
                          </>
                        )}
                      </>
                    )}

                    <span className="text-[var(--color-text-muted)]">Price</span>
                    <span className="text-[var(--color-text-secondary)] font-medium truncate">{car.price}</span>

                    <span className="text-[var(--color-text-muted)]">Annual CO₂</span>
                    <span className="font-semibold" style={{color:"#FB923C"}}>{car.annualCO2.toLocaleString()} kg</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[var(--color-text-muted)]">Safety</span>
                    {sr ? (
                      <span style={{color:sr.color}}>
                        {"★".repeat(sr.count)}
                        <span style={{color:"rgba(255,255,255,0.12)"}}>{"★".repeat(5-sr.count)}</span>
                      </span>
                    ) : (
                      <span className="text-[var(--color-text-muted)] italic text-[10px]">{car.safetyRating}</span>
                    )}
                  </div>

                  <div className="mt-auto pt-3 border-t border-[var(--color-dark-border)]">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[var(--color-text-muted)] text-xs">Eco Score (TOPSIS)</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${sc.badge}`}>
                        {car.ecoScore} / 10
                      </span>
                    </div>
                    <div className="eco-bar-track h-1.5">
                      <div className="eco-bar-fill h-1.5"
                           style={{width:`${(car.ecoScore/10)*100}%`, background:sc.bar}} />
                    </div>
                    <p className="text-[var(--color-text-muted)] text-[10px] mt-1 text-right">
                      at {ANNUAL_KM.toLocaleString()} km/yr
                    </p>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="col-span-4 text-center py-20">
              <p className="text-[var(--color-text-secondary)]">No cars found matching your filters.</p>
            </div>
          )}
        </div>

        {/* EV note */}
        <div className="mt-12 rounded-2xl p-6 border"
             style={{background:"rgba(251,191,36,0.05)", borderColor:"rgba(251,191,36,0.15)"}}>
          <p className="text-yellow-400 font-semibold text-sm mb-2">About EV Eco Scores</p>
          <p className="text-[var(--color-text-secondary)] text-xs leading-relaxed">
            Electric vehicles score low (~0.11 / 10) because battery manufacturing emissions
            carry approximately <strong className="text-white">78–82% entropy weight</strong> in the TOPSIS model.
            A full EV battery requires intensive mining of lithium, cobalt, and nickel — generating ~5 t CO₂-eq
            over its lifecycle. This matches <em>Ashraf et al. (2025)</em>: BEVs rank last on total lifecycle
            carbon footprint, while Hybrids rank first. EVs still produce significantly less
            <strong className="text-white"> operational CO₂</strong> — 394–482 kg/yr vs 645–2,132 kg/yr for ICE vehicles.
          </p>
          <p className="text-yellow-600 text-[10px] mt-3">
            Source: Entropy-TOPSIS · Ashraf et al., Green Technologies and Sustainability, 2025
          </p>
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default FindCar;