// =============================================================================
// Carbon Footprint Calculator — Entropy-TOPSIS
// Ashraf et al., Green Technologies and Sustainability, 2025
// DOI: https://doi.org/10.1016/j.grets.2024.100128
//
// Implementation note:
//   The 5-vehicle reference matrix (Fig. 5) is normalised ONCE at module load.
//   Fixed column sums, entropy weights, and ideal solutions come solely from
//   those 5 reference vehicles — exactly as in the paper.
//   The user's car is projected into this fixed space for scoring.
//   It NEVER modifies the reference matrix, weights, or ideal solutions.
// =============================================================================

// ── Paper's reference matrix (Fig. 5 / Table 1) ────────────────────────────
// Rows : BEV, Diesel, Petrol, Biodiesel, Hybrid
// Cols : [Fuel consumption kg CO₂/100km, Maintenance level, Battery mfg t, Vehicle mfg t]
const REF = [
  [0,    1, 5, 9  ],   // BEV
  [2.8,  2, 0, 10 ],   // Diesel
  [2.4,  2, 0, 10 ],   // Petrol
  [2.34, 2, 0, 9.5],   // Biodiesel
  [2.3,  2, 1, 9  ],   // Hybrid
];

const REF_LABELS = ["Electric (BEV)", "Diesel", "Petrol", "Biodiesel", "Hybrid"];
const M = 5;   // number of reference alternatives
const N = 4;   // number of criteria

// ── Step 1: Column-sum normalisation of reference matrix (Eq. 4 / 7) ────────
const COL_SUMS = Array(N).fill(0).map((_, j) =>
  REF.reduce((a, r) => a + r[j], 0)
);
const NORM_REF = REF.map(row => row.map((v, j) => v / COL_SUMS[j]));

// ── Step 2: Entropy weights from reference matrix (Eq. 5 / 6) ───────────────
// h = 1 / ln(m)
const H = 1 / Math.log(M);
const ENTROPY = Array(N).fill(0).map((_, j) => {
  let s = 0;
  for (let i = 0; i < M; i++) {
    const p = NORM_REF[i][j];
    if (p > 0) s += p * Math.log(p);
  }
  return -H * s;
});
const D_SUM  = ENTROPY.reduce((a, e) => a + (1 - e), 0);
const WEIGHTS = ENTROPY.map(e => (1 - e) / D_SUM);
// WEIGHTS ≈ [15.99%, 2.00%, 81.92%, 0.08%] — matches paper exactly

// ── Step 3: Weighted reference matrix ───────────────────────────────────────
const WM_REF = NORM_REF.map(row => row.map((v, j) => v * WEIGHTS[j]));

// ── Step 4: Fixed ideal best (V+) and worst (V−) — all cost criteria ────────
const V_BEST  = Array(N).fill(0).map((_, j) => Math.min(...WM_REF.map(r => r[j])));
const V_WORST = Array(N).fill(0).map((_, j) => Math.max(...WM_REF.map(r => r[j])));

// ── Step 5: Pre-score all 5 reference vehicles for the ranking table ─────────
const REF_PI = REF.map((_, i) => {
  let sp = 0, sm = 0;
  for (let j = 0; j < N; j++) {
    sp += (WM_REF[i][j] - V_BEST[j])  ** 2;
    sm += (WM_REF[i][j] - V_WORST[j]) ** 2;
  }
  sp = Math.sqrt(sp); sm = Math.sqrt(sm);
  return sm / (sm + sp);
});

// ── Lookup tables ─────────────────────────────────────────────────────────────
const EMISSION_FACTOR = {
  Petrol: 2.31, Diesel: 2.68, Hybrid: 1.5, Electric: 0.233
};
const BATTERY_MFG = { Petrol: 0, Diesel: 0, Hybrid: 1, Electric: 5  };
const VEHICLE_MFG = { Petrol: 10, Diesel: 10, Hybrid: 9, Electric: 9 };

const MAINT_FACTOR = { Good: 1.0, Average: 1.2, Poor: 2.0 };
const MAINT_LEVEL  = { Good: 1,   Average: 2,   Poor: 2   };

// =============================================================================
// Controller
// =============================================================================
export const calculateEcoScore = (req, res) => {
  try {

    let { mileage, fuelType, maintenance, distance } = req.body;
    mileage  = Number(mileage);
    distance = Number(distance);

    if (!mileage || !distance || !fuelType) {
      return res.status(400).json({ message: "Missing required inputs" });
    }
    if (mileage <= 0 || distance <= 0) {
      return res.status(400).json({ message: "Mileage and distance must be greater than 0" });
    }

    // ── User vehicle criteria values ───────────────────────────────────────
    const ef      = EMISSION_FACTOR[fuelType]  ?? 2.31;
    const mf      = MAINT_FACTOR[maintenance]  ?? 1.0;
    const ml      = MAINT_LEVEL[maintenance]   ?? 2;
    const bMfg    = BATTERY_MFG[fuelType]      ?? 0;
    const vMfg    = VEHICLE_MFG[fuelType]      ?? 10;

    const fuelUsed    = distance / mileage;          // litres or kWh
    const annualCO2   = fuelUsed * ef * mf;          // kg CO₂

    // Fuel col: kg CO₂ per 100 km (maintenance factor applied)
    const userFuel = (fuelUsed * ef * mf) / distance * 100;

    // ── Project user car into the FIXED reference space ────────────────────
    // Normalise using fixed column sums — reference matrix is NOT touched
    const normU = [userFuel, ml, bMfg, vMfg].map((v, j) => v / COL_SUMS[j]);

    // Apply fixed entropy weights
    const wmU = normU.map((v, j) => v * WEIGHTS[j]);

    // Distance to fixed ideal best / worst (Eq. 12 & 13)
    let sp = 0, sm = 0;
    for (let j = 0; j < N; j++) {
      sp += (wmU[j] - V_BEST[j])  ** 2;
      sm += (wmU[j] - V_WORST[j]) ** 2;
    }
    sp = Math.sqrt(sp);
    sm = Math.sqrt(sm);

    // Performance Index (Eq. 14)
    const userPI   = (sm + sp) === 0 ? 0 : sm / (sm + sp);
    const ecoScore = Number((userPI * 10).toFixed(2));

    // ── TOPSIS ranking table (5 reference + user) ─────────────────────────
    const ranking = [
      ...REF_LABELS.map((label, i) => ({
        vehicle:  label,
        piScore:  Number(REF_PI[i].toFixed(4)),
        ecoScore: Number((REF_PI[i] * 10).toFixed(2))
      })),
      {
        vehicle:  "Your vehicle",
        piScore:  Number(userPI.toFixed(4)),
        ecoScore
      }
    ]
      .sort((a, b) => b.piScore - a.piScore)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));

    // ── Category ───────────────────────────────────────────────────────────
    let category, message;
    if      (ecoScore >= 8) { category = "Excellent";  message = "Highly eco-friendly vehicle."; }
    else if (ecoScore >= 6) { category = "Good";       message = "Good environmental performance."; }
    else if (ecoScore >= 4) { category = "Average";    message = "Moderate environmental impact."; }
    else if (ecoScore >= 2) { category = "Poor";       message = "High emissions."; }
    else                    { category = "Very Poor";  message = "Very high environmental impact."; }

    // ── Criteria breakdown ─────────────────────────────────────────────────
    const fuelCtx = {
      Petrol:   `Your petrol engine emits ${userFuel.toFixed(2)} kg CO₂ per 100 km. Petrol releases 2.31 kg CO₂ per litre burned.`,
      Diesel:   `Your diesel engine emits ${userFuel.toFixed(2)} kg CO₂ per 100 km. Diesel releases 2.68 kg CO₂ per litre — higher than petrol.`,
      Hybrid:   `Your hybrid emits ${userFuel.toFixed(2)} kg CO₂ per 100 km. The electric motor reduces fuel use significantly in city driving.`,
      Electric: `Your EV emits ${userFuel.toFixed(2)} kg CO₂ per 100 km based on the India grid factor (0.233 kg CO₂/kWh). Zero tailpipe emissions.`
    };
    const maintCtx = {
      Good:    "Well-maintained engine runs at peak efficiency — clean filters and fresh spark plugs minimise excess emissions.",
      Average: "Average maintenance adds ~20% to fuel-related emissions due to minor inefficiencies like partially clogged air filters.",
      Poor:    "Poor maintenance can double emissions. Worn spark plugs, dirty filters, and faulty injectors cause incomplete combustion."
    };
    const battCtx = {
      Electric: "A full EV battery pack (60–100 kWh) requires intensive mining of lithium, cobalt, and nickel — estimated at 5 t CO₂-eq over its lifecycle.",
      Hybrid:   "A hybrid's smaller battery (1–2 kWh) has a much lower manufacturing footprint than a full BEV — estimated at 1 t CO₂-eq.",
      Petrol:   "No traction battery fitted — zero battery manufacturing emissions for this vehicle type.",
      Diesel:   "No traction battery fitted — zero battery manufacturing emissions for this vehicle type."
    };
    const vehCtx = {
      Electric: "Skips ICE components but battery integration and electric motor production still contribute ~9 t CO₂-eq at the manufacturing stage.",
      Hybrid:   "Dual drivetrain (combustion engine + electric motor) adds manufacturing complexity — estimated at ~9 t CO₂-eq.",
      Petrol:   "Complex combustion engine, transmission, and exhaust system manufacturing contributes ~10 t CO₂-eq.",
      Diesel:   "Heavy-duty diesel engine built for high compression — robust casting and material processes contribute ~10 t CO₂-eq."
    };
    const maintLabel = {
      Good: "Low impact (level 1 / 2)", Average: "Standard impact (level 2 / 2)", Poor: "High impact (level 2 / 2)"
    };

    const breakdown = {
      fuelConsumption: {
        label: "Fuel Consumption Emissions", value: Number(userFuel.toFixed(2)),
        unit: "kg CO₂ per 100 km", weight: Number((WEIGHTS[0]*100).toFixed(2)),
        context: fuelCtx[fuelType]
      },
      maintenance: {
        label: "Maintenance Impact", value: ml,
        unit: maintLabel[maintenance], weight: Number((WEIGHTS[1]*100).toFixed(2)),
        context: maintCtx[maintenance]
      },
      batteryMfg: {
        label: "Battery Manufacturing Emissions", value: bMfg,
        unit: "tonnes CO₂-eq (lifecycle)", weight: Number((WEIGHTS[2]*100).toFixed(2)),
        context: battCtx[fuelType]
      },
      vehicleMfg: {
        label: "Vehicle Manufacturing Emissions", value: vMfg,
        unit: "tonnes CO₂-eq (lifecycle)", weight: Number((WEIGHTS[3]*100).toFixed(2)),
        context: vehCtx[fuelType]
      }
    };

    // ── Response ───────────────────────────────────────────────────────────
    res.json({
      ecoScore,
      category,
      message,
      annualCO2:     Number(annualCO2.toFixed(2)),
      fuelUsed:      Number(fuelUsed.toFixed(2)),
      breakdown,
      weights: {
        fuelConsumption: Number(WEIGHTS[0].toFixed(4)),
        maintenance:     Number(WEIGHTS[1].toFixed(4)),
        batteryMfg:      Number(WEIGHTS[2].toFixed(4)),
        vehicleMfg:      Number(WEIGHTS[3].toFixed(4))
      },
      topsisRanking: ranking
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};