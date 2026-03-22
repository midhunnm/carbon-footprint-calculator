import { useState } from "react";
import Footer from "../components/Footer";

const breakdownAccent = {
  fuelConsumption: { color: "#F97316", bg: "rgba(249,115,22,0.08)",  border: "rgba(249,115,22,0.2)",  label: "Fuel"        },
  maintenance:     { color: "#38BDF8", bg: "rgba(56,189,248,0.08)",  border: "rgba(56,189,248,0.2)",  label: "Maint."      },
  batteryMfg:      { color: "#A78BFA", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.2)", label: "Battery"     },
  vehicleMfg:      { color: "#94A3B8", bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.2)", label: "Vehicle Mfg" },
};

const ecoColor = (score) => {
  if (score >= 8) return { bar: "#22C55E", badge: "bg-green-500/15 text-green-400 border border-green-500/30"  };
  if (score >= 6) return { bar: "#38BDF8", badge: "bg-sky-500/15 text-sky-400 border border-sky-500/30"         };
  if (score >= 4) return { bar: "#FACC15", badge: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"};
  if (score >= 2) return { bar: "#FB923C", badge: "bg-orange-500/15 text-orange-400 border border-orange-500/30"};
  return               { bar: "#EF4444", badge: "bg-red-500/15 text-red-400 border border-red-500/30"           };
};

const rankLabel = (rank) => {
  if (rank === 1) return { text: "#1", color: "#FACC15" };
  if (rank === 2) return { text: "#2", color: "#94A3B8" };
  if (rank === 3) return { text: "#3", color: "#FB923C" };
  return { text: `#${rank}`, color: "#475569" };
};

const FUEL_TYPES = [
  { val:"Petrol",   label:"Petrol"   },
  { val:"Diesel",   label:"Diesel"   },
  { val:"Hybrid",   label:"Hybrid"   },
  { val:"Electric", label:"Electric" },
];

const MAINTENANCE = [
  { val:"Good",    desc:"Well serviced"     },
  { val:"Average", desc:"Occasional service"},
  { val:"Poor",    desc:"Rarely serviced"   },
];

const Calculator = () => {
  const [formData, setFormData] = useState({
    type: "Petrol", mileage: "", distance: "", maintenance: "Good",
  });
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const isElectric = formData.type === "Electric";

  const handleChange = (e) => {
    const updated = { ...formData, [e.target.name]: e.target.value };
    if (e.target.name === "type") updated.mileage = "";
    setFormData(updated);
    setResult(null);
    setError("");
  };

  const handleSelect = (name, value) => handleChange({ target: { name, value } });

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/calculator/calculate`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mileage:     Number(formData.mileage),
          fuelType:    formData.type,
          maintenance: formData.maintenance,
          distance:    Number(formData.distance),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Calculation failed");
      setResult(data);
    } catch (err) {
      setError("Failed to calculate. Please check your inputs and try again.");
    }
    setLoading(false);
  };

  const labelClass = "block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2";

  return (
    <div className="min-h-screen bg-[var(--color-dark)] flex flex-col">

      {/* Background blobs */}
      <div className="fixed top-20 left-0 w-96 h-96 bg-[var(--color-primary)] opacity-8 blur-[140px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-80 h-80 bg-[var(--color-accent)] opacity-5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative flex-1 max-w-2xl mx-auto w-full px-4 pt-28 pb-16">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs font-medium text-[var(--color-accent)] mb-5">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
            Entropy-TOPSIS · Ashraf et al., 2025
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-3" style={{fontFamily:"Syne,sans-serif"}}>
            Eco Score Calculator
          </h1>
          <p className="text-[var(--color-text-secondary)] text-base">
            Get your vehicle's full lifecycle carbon footprint score in seconds.
          </p>
        </div>

        {/* Form */}
        <div className="glass rounded-3xl p-8 mb-6">
          <form onSubmit={handleCalculate} className="space-y-6">

            {/* Fuel type */}
            <div>
              <label className={labelClass}>Fuel Type</label>
              <div className="grid grid-cols-4 gap-2">
                {FUEL_TYPES.map(({ val, label }) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleSelect("type", val)}
                    className={`py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                      formData.type === val
                        ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-lg shadow-blue-500/20"
                        : "glass-light border-[var(--color-dark-border)] text-[var(--color-text-secondary)] hover:text-white hover:border-[var(--color-primary)]/40"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mileage / Efficiency */}
            <div>
              <label className={labelClass}>
                {isElectric ? "Efficiency (km / kWh)" : "Mileage (km / litre)"}
              </label>
              <input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                placeholder={isElectric ? "e.g. 6" : "e.g. 15"}
                min="0.1" step="0.1" required
                className="input-dark"
              />
              <p className="text-[var(--color-text-muted)] text-xs mt-1.5">
                {isElectric ? "Typical EVs: 5–7 km/kWh" : "Typical cars: 10–20 km/l"}
              </p>
            </div>

            {/* Distance */}
            <div>
              <label className={labelClass}>Annual Distance (km)</label>
              <input
                type="number"
                name="distance"
                value={formData.distance}
                onChange={handleChange}
                placeholder="e.g. 12000"
                min="1" step="1" required
                className="input-dark"
              />
              <p className="text-[var(--color-text-muted)] text-xs mt-1.5">India average: 12,000 km/year</p>
            </div>

            {/* Maintenance */}
            <div>
              <label className={labelClass}>Maintenance Condition</label>
              <div className="grid grid-cols-3 gap-2">
                {MAINTENANCE.map(({ val, desc }) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleSelect("maintenance", val)}
                    className={`py-3 rounded-xl text-xs font-medium transition-all duration-200 border flex flex-col items-center gap-1 ${
                      formData.maintenance === val
                        ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white"
                        : "glass-light border-[var(--color-dark-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]/40 hover:text-white"
                    }`}
                  >
                    <span className="font-semibold">{val}</span>
                    <span className="opacity-70 text-[10px]">{desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Calculating...
                </>
              ) : "Calculate Eco Score"}
            </button>
          </form>

          {error && (
            <p className="mt-4 text-center text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl py-3 px-4">
              {error}
            </p>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-5 animate-fade-up">

            {/* Main score card */}
            <div className="glass rounded-3xl p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none"
                   style={{background:`radial-gradient(circle at 50% 0%, ${ecoColor(result.ecoScore).bar}15 0%, transparent 70%)`}} />

              <p className="text-[var(--color-text-secondary)] text-sm mb-2">Annual CO₂ Emission</p>
              <p className="text-5xl font-extrabold text-white mb-1" style={{fontFamily:"Syne,sans-serif"}}>
                {result.annualCO2}
                <span className="text-2xl font-normal text-[var(--color-text-secondary)] ml-1">kg</span>
              </p>
              <p className="text-[var(--color-text-muted)] text-xs mb-8">
                at {Number(formData.distance).toLocaleString()} km/yr
              </p>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[var(--color-text-secondary)] text-sm">Eco Score (TOPSIS)</span>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${ecoColor(result.ecoScore).badge}`}>
                    {result.ecoScore} / 10
                  </span>
                </div>
                <div className="eco-bar-track h-3">
                  <div className="eco-bar-fill h-3"
                       style={{width:`${result.ecoScore*10}%`, background:ecoColor(result.ecoScore).bar}} />
                </div>
              </div>

              <span className={`inline-flex items-center px-5 py-2 rounded-full font-bold text-sm ${ecoColor(result.ecoScore).badge}`}>
                {result.category}
              </span>
              <p className="text-[var(--color-text-secondary)] text-sm mt-3">{result.message}</p>
            </div>

            {/* Breakdown */}
            {result.breakdown && (
              <div className="glass rounded-3xl p-6">
                <h3 className="text-white font-semibold text-base mb-5" style={{fontFamily:"Syne,sans-serif"}}>
                  Emission Breakdown
                </h3>
                <div className="space-y-3">
                  {Object.entries(result.breakdown).map(([key, item]) => {
                    const a = breakdownAccent[key];
                    return (
                      <div key={key} className="rounded-2xl p-4"
                           style={{background:a.bg, border:`1px solid ${a.border}`}}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {/* Colored dot instead of emoji */}
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold"
                                 style={{background:a.border, color:a.color}}>
                              {a.label}
                            </div>
                            <div>
                              <p className="text-white font-semibold text-sm">{item.label}</p>
                              <p className="text-[var(--color-text-muted)] text-xs">{item.unit}</p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-white font-bold text-lg">{item.value}</p>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                                  style={{background:a.border, color:a.color}}>
                              {item.weight}% weight
                            </span>
                          </div>
                        </div>
                        <p className="mt-3 text-[var(--color-text-secondary)] text-xs leading-relaxed border-t pt-3"
                           style={{borderColor:a.border}}>
                          {item.context}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Entropy weights */}
            {result.weights && (
              <div className="glass rounded-3xl p-6">
                <h3 className="text-white font-semibold text-base mb-5" style={{fontFamily:"Syne,sans-serif"}}>
                  Entropy Weights
                </h3>
                <div className="space-y-3">
                  {[
                    ["Fuel Consumption", result.weights.fuelConsumption, "#F97316"],
                    ["Maintenance",      result.weights.maintenance,     "#38BDF8"],
                    ["Battery Mfg",      result.weights.batteryMfg,      "#A78BFA"],
                    ["Vehicle Mfg",      result.weights.vehicleMfg,      "#94A3B8"],
                  ].map(([label, val, color]) => (
                    <div key={label}>
                      <div className="flex justify-between mb-1">
                        <span className="text-[var(--color-text-secondary)] text-xs">{label}</span>
                        <span className="text-white text-xs font-semibold">{(val*100).toFixed(1)}%</span>
                      </div>
                      <div className="eco-bar-track h-1.5">
                        <div className="eco-bar-fill h-1.5" style={{width:`${val*100}%`, background:color}} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TOPSIS Ranking */}
            {result.topsisRanking && (
              <div className="glass rounded-3xl p-6">
                <h3 className="text-white font-semibold text-base mb-5" style={{fontFamily:"Syne,sans-serif"}}>
                  TOPSIS Ranking
                </h3>
                <div className="space-y-2">
                  {result.topsisRanking.map(item => {
                    const isUser = item.vehicle === "Your vehicle";
                    const c  = ecoColor(item.ecoScore);
                    const rl = rankLabel(item.rank);
                    return (
                      <div key={item.rank}
                           className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${
                             isUser
                               ? "bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30"
                               : "glass-light border border-transparent hover:border-[var(--color-dark-border)]"
                           }`}>
                        <span className="text-sm font-bold w-8 text-center flex-shrink-0"
                              style={{color: rl.color}}>
                          {rl.text}
                        </span>
                        <span className={`flex-1 text-sm font-medium ${isUser ? "text-white" : "text-[var(--color-text-secondary)]"}`}>
                          {item.vehicle}
                          {isUser && <span className="ml-2 text-[var(--color-accent)] text-xs">you</span>}
                        </span>
                        <span className="text-[var(--color-text-muted)] text-xs w-14 text-right">{item.piScore}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold w-16 text-center ${c.badge}`}>
                          {item.ecoScore}/10
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Calculator;