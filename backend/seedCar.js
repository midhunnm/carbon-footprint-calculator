// =============================================================================
// seedCars.js — run once: node seedCars.js
// Scores every car using the paper's exact 5-vehicle reference matrix.
// The user car row is NEVER inserted into the matrix.
// =============================================================================

import mongoose from "mongoose";
import dotenv   from "dotenv";
import Car      from "./models/carModel.js";

dotenv.config();

// ── Paper's reference matrix (Fig. 5, Ashraf et al. 2025) ──────────────────
const REF = [
  [0,    1, 5, 9  ],   // BEV
  [2.8,  2, 0, 10 ],   // Diesel
  [2.4,  2, 0, 10 ],   // Petrol
  [2.34, 2, 0, 9.5],   // Biodiesel
  [2.3,  2, 1, 9  ],   // Hybrid
];

const M = 5, N = 4;

const COL_SUMS = Array(N).fill(0).map((_, j) => REF.reduce((a, r) => a + r[j], 0));
const NORM_REF = REF.map(row => row.map((v, j) => v / COL_SUMS[j]));

const H = 1 / Math.log(M);
const ENTROPY = Array(N).fill(0).map((_, j) => {
  let s = 0;
  for (let i = 0; i < M; i++) { const p = NORM_REF[i][j]; if (p > 0) s += p * Math.log(p); }
  return -H * s;
});
const D_SUM  = ENTROPY.reduce((a, e) => a + (1 - e), 0);
const WEIGHTS = ENTROPY.map(e => (1 - e) / D_SUM);

const WM_REF  = NORM_REF.map(row => row.map((v, j) => v * WEIGHTS[j]));
const V_BEST  = Array(N).fill(0).map((_, j) => Math.min(...WM_REF.map(r => r[j])));
const V_WORST = Array(N).fill(0).map((_, j) => Math.max(...WM_REF.map(r => r[j])));

const EF   = { Electric: 0.233, Hybrid: 1.5, Petrol: 2.31, Diesel: 2.68 };
const BATT = { Electric: 5, Hybrid: 1, Petrol: 0, Diesel: 0 };
const VMFG = { Electric: 9, Hybrid: 9, Petrol: 10, Diesel: 10 };

function computeTOPSIS(type, efficiency) {
  const fuelUsed  = 12000 / efficiency;
  const annualCO2 = Math.round(fuelUsed * EF[type]);
  const userFuel  = (fuelUsed * EF[type]) / 12000 * 100;

  const normU = [userFuel, 1, BATT[type], VMFG[type]].map((v, j) => v / COL_SUMS[j]);
  const wmU   = normU.map((v, j) => v * WEIGHTS[j]);

  let sp = 0, sm = 0;
  for (let j = 0; j < N; j++) {
    sp += (wmU[j] - V_BEST[j])  ** 2;
    sm += (wmU[j] - V_WORST[j]) ** 2;
  }
  sp = Math.sqrt(sp); sm = Math.sqrt(sm);
  const pi = (sm + sp) === 0 ? 0 : sm / (sm + sp);

  return { ecoScore: Number((pi * 10).toFixed(2)), annualCO2 };
}

// ── Raw car definitions ─────────────────────────────────────────────────────
const rawCars = [

  // Electric
  { id:1,  name:"Tata Nexon EV",            type:"Electric", year:2024, vehicleClass:"Compact SUV",  range:"312–465 km", efficiency:6.5,  price:"₹14.5–19.5 lakh", safetyRating:"5-star",    image:"ev/Tata Nexon EV.avif"           },
  { id:2,  name:"Mahindra XUV400 EV",       type:"Electric", year:2024, vehicleClass:"SUV",          range:"375–456 km", efficiency:6.2,  price:"₹15.5–19.5 lakh", safetyRating:"5-star",    image:"ev/Mahindra XUV400 EV.png"       },
  { id:3,  name:"Tata Tiago EV",            type:"Electric", year:2024, vehicleClass:"Hatchback",    range:"250–315 km", efficiency:7.0,  price:"₹8–12 lakh",       safetyRating:"Not rated", image:"ev/Tata Tiago EV.jpg"            },
  { id:4,  name:"MG ZS EV",                 type:"Electric", year:2024, vehicleClass:"SUV",          range:"461 km",     efficiency:6.0,  price:"₹22–26 lakh",      safetyRating:"5-star",    image:"ev/MG ZS EV.webp"               },
  { id:5,  name:"Hyundai Kona Electric",    type:"Electric", year:2024, vehicleClass:"SUV",          range:"452 km",     efficiency:6.8,  price:"₹23–25 lakh",      safetyRating:"5-star",    image:"ev/Hyundai Kona Electric.jpg"    },
  { id:6,  name:"BYD Atto 3",               type:"Electric", year:2024, vehicleClass:"SUV",          range:"468–521 km", efficiency:6.3,  price:"₹25–34 lakh",      safetyRating:"5-star",    image:"ev/BYD Atto 3.avif"             },
  { id:7,  name:"Kia EV6",                  type:"Electric", year:2024, vehicleClass:"Premium",      range:"708 km",     efficiency:6.5,  price:"₹60+ lakh",        safetyRating:"5-star",    image:"ev/Kia EV6.avif"                },
  { id:8,  name:"Tata Punch EV",            type:"Electric", year:2024, vehicleClass:"Compact SUV",  range:"300 km",     efficiency:7.1,  price:"₹10–14 lakh",      safetyRating:"5-star",    image:"ev/Tata Punch EV.avif"           },
  { id:9,  name:"Tata Harrier EV",          type:"Electric", year:2025, vehicleClass:"SUV",          range:"480–627 km", efficiency:5.8,  price:"₹21+ lakh",        safetyRating:"5-star",    image:"ev/Tata Harrier EV.avif"         },
  { id:10, name:"Hyundai Creta Electric",   type:"Electric", year:2025, vehicleClass:"SUV",          range:"390–473 km", efficiency:6.1,  price:"₹20–27 lakh",      safetyRating:"5-star",    image:"ev/Hyundai Creta Electric.avif"  },

  // Hybrid
  { id:11, name:"Maruti Suzuki Grand Vitara",   type:"Hybrid", year:2024, vehicleClass:"SUV",          efficiency:27.9, price:"₹10.7–19.7 lakh", safetyRating:"Not officially tested", image:"hybrid/maruti suzuki grand vitara.avif"                  },
  { id:12, name:"Toyota Urban Cruiser Hyryder", type:"Hybrid", year:2024, vehicleClass:"SUV",          efficiency:27.9, price:"₹10.9–19.9 lakh", safetyRating:"4-star",                image:"hybrid/toyota urban cruiser.jpg"                         },
  { id:13, name:"Honda City Hybrid eHEV",       type:"Hybrid", year:2024, vehicleClass:"Sedan",        efficiency:27.1, price:"₹19–21 lakh",      safetyRating:"5-star",                image:"hybrid/hobda city hybrid ehev.avif"                      },
  { id:14, name:"Toyota Innova Hycross",        type:"Hybrid", year:2024, vehicleClass:"MPV",          efficiency:21.0, price:"₹18–31 lakh",      safetyRating:"5-star",                image:"hybrid/innova-hycross.avif"                              },
  { id:15, name:"Maruti Suzuki Invicto",        type:"Hybrid", year:2024, vehicleClass:"MPV",          efficiency:23.0, price:"₹25–30 lakh",      safetyRating:"5-star",                image:"hybrid/maruti suzuki invicto.avif"                       },
  { id:16, name:"Toyota Camry Hybrid",          type:"Hybrid", year:2024, vehicleClass:"Sedan",        efficiency:25.0, price:"₹46+ lakh",        safetyRating:"5-star",                image:"hybrid/toyota camry hybrid.jpg"                          },
  { id:17, name:"Lexus ES 300h",                type:"Hybrid", year:2024, vehicleClass:"Luxury Sedan", efficiency:22.0, price:"₹60+ lakh",        safetyRating:"5-star",                image:"hybrid/lexus es 300h.avif"                               },
  { id:18, name:"Toyota Vellfire",              type:"Hybrid", year:2024, vehicleClass:"Luxury MPV",   efficiency:16.0, price:"₹1.2+ crore",      safetyRating:"5-star",                image:"hybrid/toyota_vellfire_hybrid_2023_5k-3840x2160(1).jpg" },
  { id:19, name:"Land Rover Range Rover",       type:"Hybrid", year:2024, vehicleClass:"Luxury SUV",   efficiency:17.5, price:"₹2+ crore",        safetyRating:"5-star",                image:"hybrid/range rover.jpg"                                  },
  { id:20, name:"BMW XM",                       type:"Hybrid", year:2024, vehicleClass:"Luxury SUV",   efficiency:14.0, price:"₹2+ crore",        safetyRating:"5-star",                image:"hybrid/bmw-xm-.jpeg"                                     },

  // Diesel
  { id:21, name:"Tata Nexon 1.5L Revotorq Diesel",      type:"Diesel", year:2024, vehicleClass:"Compact SUV",   efficiency:24.08, price:"₹9–15 lakh",       safetyRating:"5-star", engine:"1.5L Turbocharged Revotorq", image:"diesel/tata nexon diesel.webp"                     },
  { id:22, name:"Hyundai Venue 1.5L CRDi Diesel",       type:"Diesel", year:2024, vehicleClass:"Compact SUV",   efficiency:22.0,  price:"₹10–15.7 lakh",    safetyRating:"4-star", engine:"U2 1.5L CRDi Diesel",        image:"diesel/Hyundai Venue (Diesel).avif"                },
  { id:23, name:"Kia Sonet 1.5L CRDi VGT Diesel",       type:"Diesel", year:2024, vehicleClass:"Compact SUV",   efficiency:24.1,  price:"₹10–15.6 lakh",    safetyRating:"4-star", engine:"1.5L CRDi VGT",              image:"diesel/Kia Sonet (Diesel).avif"                    },
  { id:24, name:"Mahindra XUV 3XO 1.5L Turbo Diesel",   type:"Diesel", year:2024, vehicleClass:"Compact SUV",   efficiency:20.6,  price:"₹10–15 lakh",      safetyRating:"5-star", engine:"1.5L mHawk Turbo Diesel",    image:"diesel/Mahindra XUV 3XO (Diesel).avif"            },
  { id:25, name:"Hyundai Creta 1.5L CRDi Diesel",       type:"Diesel", year:2024, vehicleClass:"SUV",           efficiency:20.4,  price:"₹12–20 lakh",      safetyRating:"4-star", engine:"1.5L CRDi Diesel",           image:"diesel/Hyundai Creta (Diesel).avif"                },
  { id:26, name:"Kia Seltos 1.5L CRDi VGT Diesel",      type:"Diesel", year:2024, vehicleClass:"SUV",           efficiency:18.85, price:"₹12.7–20.5 lakh",  safetyRating:"4-star", engine:"1.5L CRDi VGT Diesel",       image:"diesel/Kia Seltos 1.5L CRDi VGT Diesel.avif"      },
  { id:27, name:"Tata Altroz 1.5L Revotorq Diesel",     type:"Diesel", year:2024, vehicleClass:"Hatchback",     efficiency:24.0,  price:"₹8–11 lakh",       safetyRating:"5-star", engine:"1.5L Revotorq Diesel",       image:"diesel/Tata Altroz 1.5L Revotorq Diesel.webp"     },
  { id:28, name:"Honda Amaze 1.5L i-DTEC Diesel",       type:"Diesel", year:2023, vehicleClass:"Sedan",         efficiency:24.0,  price:"₹8–11 lakh",       safetyRating:"4-star", engine:"1.5L i-DTEC Diesel",         image:"diesel/Honda Amaze 1.5L i-DTEC Diesel.webp"       },
  { id:29, name:"Mahindra Scorpio N 2.2L mHawk Diesel", type:"Diesel", year:2024, vehicleClass:"Full-size SUV", efficiency:16.5,  price:"₹13–24 lakh",      safetyRating:"5-star", engine:"2.2L mHawk Diesel",          image:"diesel/Mahindra Scorpio N 2.2L mHawk Diesel.webp" },
  { id:30, name:"Tata Harrier 2.0L Kryotec Diesel",     type:"Diesel", year:2024, vehicleClass:"SUV",           efficiency:17.0,  price:"₹17–25 lakh",      safetyRating:"5-star", engine:"2.0L Kryotec Diesel",        image:"diesel/Tata Harrier 2.0L Kryotec Diesel.webp"     },

  // Petrol
  { id:31, name:"Maruti Suzuki Swift",  type:"Petrol", year:2024, vehicleClass:"Hatchback",   efficiency:23.0,  price:"₹6.49–9.64 lakh",   safetyRating:"3-star",    image:"petrol/swift.jpg"               },
  { id:32, name:"Hyundai Creta",        type:"Petrol", year:2024, vehicleClass:"SUV",         efficiency:19.0,  price:"₹11–20.45 lakh",    safetyRating:"5-star",    image:"petrol/hyundai_creta.jpg"        },
  { id:33, name:"Tata Nexon",           type:"Petrol", year:2024, vehicleClass:"Compact SUV", efficiency:18.0,  price:"₹8.10–15.50 lakh",  safetyRating:"5-star",    image:"petrol/nexon.jpg"                },
  { id:34, name:"Honda City",           type:"Petrol", year:2024, vehicleClass:"Sedan",       efficiency:17.5,  price:"₹11.89–16.39 lakh", safetyRating:"4-star",    image:"petrol/honada_city.jpg"          },
  { id:35, name:"Maruti Suzuki Baleno", type:"Petrol", year:2024, vehicleClass:"Hatchback",   efficiency:22.5,  price:"₹6.61–9.88 lakh",   safetyRating:"2-star",    image:"petrol/maruti-suzuki-baleno.jpg" },
  { id:36, name:"Kia Seltos",           type:"Petrol", year:2024, vehicleClass:"SUV",         efficiency:17.5,  price:"₹10.90–20.35 lakh", safetyRating:"3-star",    image:"petrol/kia_seltos.jpg"           },
  { id:37, name:"Toyota Innova Crysta", type:"Petrol", year:2024, vehicleClass:"MPV",         efficiency:13.0,  price:"₹19.77–26.17 lakh", safetyRating:"Not Rated", image:"petrol/innova_crysta.jpg"        },
  { id:38, name:"Volkswagen Virtus",    type:"Petrol", year:2024, vehicleClass:"Sedan",       efficiency:19.5,  price:"₹11.56–20.07 lakh", safetyRating:"5-star",    image:"petrol/Volkswagen-Virtus.jpg"    },
  { id:39, name:"Skoda Slavia",         type:"Petrol", year:2024, vehicleClass:"Sedan",       efficiency:19.5,  price:"₹10.99–19.19 lakh", safetyRating:"5-star",    image:"petrol/skoda_slavia.jpg"         },
  { id:40, name:"Mahindra XUV700",      type:"Petrol", year:2024, vehicleClass:"SUV",         efficiency:15.5,  price:"₹13.99–26.99 lakh", safetyRating:"5-star",    image:"petrol/mahindra_xuv700.jpg"      },
];

// ── Seed ────────────────────────────────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas\n");

    console.log("Fixed entropy weights (paper's 5-vehicle reference matrix only):");
    console.log(`  Fuel consumption : ${(WEIGHTS[0]*100).toFixed(2)}%`);
    console.log(`  Maintenance      : ${(WEIGHTS[1]*100).toFixed(2)}%`);
    console.log(`  Battery mfg      : ${(WEIGHTS[2]*100).toFixed(2)}%`);
    console.log(`  Vehicle mfg      : ${(WEIGHTS[3]*100).toFixed(2)}%\n`);

    await Car.deleteMany({});
    console.log("🗑️  Cleared existing collection\n");

    const withScores = rawCars.map(car => {
      const { ecoScore, annualCO2 } = computeTOPSIS(car.type, car.efficiency);
      return { ...car, ecoScore, annualCO2 };
    });

    await Car.insertMany(withScores);
    console.log(`🌱 Seeded ${withScores.length} cars\n`);

    withScores
      .sort((a, b) => b.ecoScore - a.ecoScore)
      .forEach(c =>
        console.log(`  [${String(c.id).padStart(2)}] ${c.name.padEnd(44)} | ${c.type.padEnd(8)} | eco: ${String(c.ecoScore).padEnd(5)} | CO₂: ${c.annualCO2} kg/yr`)
      );

  } catch (err) {
    console.error("❌ Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected");
  }
}

seed();