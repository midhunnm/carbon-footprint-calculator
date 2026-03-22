import { useState } from "react";
import Footer from "../components/Footer";

// Load every image from all asset subfolders
const imageModules = import.meta.glob(
  "../assets/**/*.{jpg,jpeg,png,webp,avif}",
  { eager: true }
);

// Build a typed gallery from all asset paths
// Skip logo, main_car, martin-katler (non-car-card assets)
const SKIP = ["logo.png", "main_car.png", "martin-katler", "car1", "car2", "car3", "react.svg", "vite.svg"];

const allImages = Object.entries(imageModules)
  .filter(([path]) => !SKIP.some(s => path.includes(s)))
  .map(([path, mod]) => {
    const parts   = path.replace("../assets/", "").split("/");
    const folder  = parts.length > 1 ? parts[0] : "other";
    const file    = parts[parts.length - 1];
    const nameRaw = file.replace(/\.[^.]+$/, "");            // strip extension
    const name    = nameRaw
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase());               // Title Case

    const typeMap = { ev:"Electric", hybrid:"Hybrid", petrol:"Petrol", diesel:"Diesel" };
    const type    = typeMap[folder] ?? "Other";

    return { path, src: mod.default, name, type, folder };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

const TYPES = ["All", "Electric", "Hybrid", "Petrol", "Diesel"];

const Gallery = () => {
  const [filter,   setFilter]   = useState("All");
  const [selected, setSelected] = useState(null);   // lightbox

  const visible = filter === "All"
    ? allImages
    : allImages.filter(img => img.type === filter);

  const typeColor = (type) => {
    switch (type) {
      case "Electric": return "bg-green-500/15 text-green-400 border border-green-500/25";
      case "Hybrid":   return "bg-sky-500/15 text-sky-400 border border-sky-500/25";
      case "Petrol":   return "bg-orange-500/15 text-orange-400 border border-orange-500/25";
      case "Diesel":   return "bg-slate-500/15 text-slate-400 border border-slate-500/25";
      default:         return "bg-gray-500/15 text-gray-400 border border-gray-500/25";
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-dark)]">

      {/* Background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-64 bg-[var(--color-primary)] opacity-5 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-16">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs font-medium text-[var(--color-accent)] mb-5">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
            {visible.length} vehicles
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3" style={{fontFamily:"Syne,sans-serif"}}>
            Car Gallery
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Browse every vehicle in our database by fuel type.
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 flex-wrap justify-center mb-10">
          {TYPES.map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                filter === t
                  ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-lg shadow-blue-500/20"
                  : "glass-light border-[var(--color-dark-border)] text-[var(--color-text-secondary)] hover:text-white hover:border-[var(--color-primary)]/40"
              }`}
            >
              {t === "All" ? `All (${allImages.length})` : `${t} (${allImages.filter(i=>i.type===t).length})`}
            </button>
          ))}
        </div>

        {/* Image grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {visible.map((img, i) => (
            <div
              key={i}
              onClick={() => setSelected(img)}
              className="glass rounded-2xl overflow-hidden cursor-pointer group hover:-translate-y-1 transition-all duration-300 hover:border-[var(--color-primary)]/30"
              style={{border:"1px solid var(--color-dark-border)"}}
            >
              <div className="relative h-40 overflow-hidden bg-[var(--color-dark-2)]">
                <img
                  src={img.src}
                  alt={img.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark-card)] via-transparent to-transparent" />
                <span className={`absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full font-semibold ${typeColor(img.type)}`}
                      style={{backdropFilter:"blur(8px)"}}>
                  {img.type}
                </span>
              </div>
              <div className="p-3">
                <p className="text-white text-xs font-medium truncate">{img.name}</p>
              </div>
            </div>
          ))}
        </div>

        {visible.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[var(--color-text-secondary)]">No images found.</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          style={{backdropFilter:"blur(12px)"}}
          onClick={() => setSelected(null)}
        >
          <div
            className="glass rounded-3xl overflow-hidden max-w-3xl w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selected.src}
                alt={selected.name}
                className="w-full max-h-[70vh] object-contain bg-[var(--color-dark-2)]"
              />
            </div>
            <div className="p-5 flex items-center justify-between">
              <div>
                <p className="text-white font-semibold text-base" style={{fontFamily:"Syne,sans-serif"}}>
                  {selected.name}
                </p>
                <span className={`inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full font-semibold ${typeColor(selected.type)}`}>
                  {selected.type}
                </span>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="glass-light border border-[var(--color-dark-border)] text-[var(--color-text-secondary)] hover:text-white px-4 py-2 rounded-xl text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Gallery;