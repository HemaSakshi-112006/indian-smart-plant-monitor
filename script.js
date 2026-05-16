'use strict';

/* ═══════════════════════════════════════════════════════════
   VanaRaksha — script.js
   Indian Plant IoT Monitor · v3.0
   ═══════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────
   1. PLANT DATA
───────────────────────────────────────────── */
const PLANTS = [
  {
    id: 'tulsi', name: 'Tulsi', hindiName: 'तुलसी', species: 'Ocimum tenuiflorum',
    emoji: '🌿', location: 'Pooja Room · Balcony', accent: '#3a8c5e', bg: '#e8f5ed',
    desc: 'Sacred Holy Basil — revered in Indian homes',
    thresholds: {
      moisture: { min: 35, max: 70, ideal: [45, 65] },
      temperature: { min: 18, max: 35, ideal: [20, 30] },
      humidity: { min: 40, max: 75, ideal: [50, 70] },
      light: { min: 200, max: 900, ideal: [400, 700] },
      ph: { min: 5.5, max: 7.5, ideal: [6.0, 7.0] },
      water: { min: 20, max: 100, ideal: [40, 90] }
    },
    base: { moisture: 30, temperature: 26, humidity: 62, light: 520, ph: 6.5, water: 74 },
    tips: {
      watering: 'Water every 2–3 days in summer, reduce in winter. Keep soil moist but not waterlogged.',
      sunlight: 'Needs 4–6 hours of direct morning sunlight. South or east facing window ideal.',
      soil: 'Well-draining loamy soil with pH 6–7. Add sand or perlite for drainage.',
      bestTime: '🌅 Best watered early morning (6–8 AM) to prevent fungal diseases.',
      seasons: {
        summer: 'Water daily, provide afternoon shade above 38°C.',
        monsoon: 'Reduce watering drastically. Ensure drainage holes are clear.',
        winter: 'Water every 4–5 days. Protect from cold winds below 10°C.'
      }
    }
  },
  {
    id: 'neem', name: 'Neem', hindiName: 'नीम', species: 'Azadirachta indica',
    emoji: '🌳', location: 'Garden · Open Sun', accent: '#4a7c2e', bg: '#eaf3e0',
    desc: 'Village Pharmacy — natural insect repellent',
    thresholds: {
      moisture: { min: 20, max: 55, ideal: [28, 45] },
      temperature: { min: 15, max: 45, ideal: [25, 38] },
      humidity: { min: 30, max: 70, ideal: [40, 60] },
      light: { min: 500, max: 1400, ideal: [800, 1200] },
      ph: { min: 6.0, max: 8.5, ideal: [7.0, 8.0] },
      water: { min: 15, max: 100, ideal: [30, 80] }
    },
    base: { moisture: 36, temperature: 33, humidity: 31, light: 980, ph: 7.4, water: 58 },
    tips: {
      watering: 'Drought-tolerant once established. Water deeply once a week; twice in peak summer.',
      sunlight: 'Full sun — needs 6+ hours. Thrives in intense Indian sun, struggles in shade.',
      soil: 'Sandy or loamy, slightly alkaline soil (pH 7–8). Excellent drainage essential.',
      bestTime: '🌄 Water in the evening when sun is down to minimise evaporation.',
      seasons: {
        summer: 'Water twice weekly. Mulch around roots to retain moisture.',
        monsoon: 'No extra watering needed. Watch for root rot in clay soils.',
        winter: 'Water monthly only. Neem is semi-deciduous — leaf drop is normal.'
      }
    }
  },
  {
    id: 'curry', name: 'Curry Leaf', hindiName: 'कड़ी पत्ता', species: 'Murraya koenigii',
    emoji: '🍃', location: 'Kitchen Garden · East', accent: '#7ab02a', bg: '#f0f7e0',
    desc: 'Kadi Patta — essential South Indian herb',
    thresholds: {
      moisture: { min: 30, max: 65, ideal: [40, 60] },
      temperature: { min: 16, max: 38, ideal: [22, 32] },
      humidity: { min: 45, max: 80, ideal: [55, 72] },
      light: { min: 300, max: 1000, ideal: [500, 800] },
      ph: { min: 6.0, max: 7.5, ideal: [6.4, 7.0] },
      water: { min: 20, max: 100, ideal: [40, 85] }
    },
    base: { moisture: 50, temperature: 28, humidity: 64, light: 640, ph: 6.7, water: 65 },
    tips: {
      watering: 'Keep soil evenly moist. Water when top 2 cm of soil feels dry — roughly every 2 days.',
      sunlight: 'Bright indirect to partial sun. East-facing balcony or kitchen window is perfect.',
      soil: 'Rich, well-draining mix with compost. Slightly acidic to neutral pH preferred.',
      bestTime: '🌅 Morning watering (7–9 AM) keeps leaves fresh for day-long harvest.',
      seasons: {
        summer: 'Water daily, mist leaves to boost humidity. Harvest leaves to encourage bushiness.',
        monsoon: 'Reduce watering. Watch for yellow leaves indicating waterlogging.',
        winter: 'Water every 3 days. Bring indoors if temperature drops below 10°C.'
      }
    }
  },
  {
    id: 'lotus', name: 'Lotus', hindiName: 'कमल', species: 'Nelumbo nucifera',
    emoji: '🪷', location: 'Pond · Open Water', accent: '#d4607e', bg: '#fce8ef',
    desc: 'National Flower of India — sacred water plant',
    thresholds: {
      moisture: { min: 80, max: 100, ideal: [90, 100] },
      temperature: { min: 20, max: 38, ideal: [25, 34] },
      humidity: { min: 60, max: 95, ideal: [70, 88] },
      light: { min: 400, max: 1200, ideal: [700, 1100] },
      ph: { min: 6.5, max: 8.0, ideal: [7.0, 7.8] },
      water: { min: 70, max: 100, ideal: [85, 100] }
    },
    base: { moisture: 95, temperature: 30, humidity: 80, light: 880, ph: 7.3, water: 95 },
    tips: {
      watering: 'Aquatic plant — keep in 15–40 cm of standing water at all times. Top up as water evaporates.',
      sunlight: 'Full sun is mandatory — minimum 6 hours of direct sunlight for blooming.',
      soil: 'Heavy clay soil or aquatic planting mix. Do NOT use regular potting soil (it floats).',
      bestTime: '🌞 Replenish water in the morning. Lotus opens at sunrise and closes by afternoon.',
      seasons: {
        summer: "Peak growing season. Ensure water doesn't overheat above 35°C.",
        monsoon: 'Thrives! Protect from overflow and strong winds that may damage flowers.',
        winter: 'Goes dormant. Reduce water level, protect tubers from frost below 5°C.'
      }
    }
  },
  {
    id: 'jasmine', name: 'Mogra', hindiName: 'मोगरा', species: 'Jasminum sambac',
    emoji: '🌸', location: 'Terrace · Shade Net', accent: '#c8a000', bg: '#fdf6d9',
    desc: 'Arabian Jasmine — fragrant night bloomer',
    thresholds: {
      moisture: { min: 35, max: 68, ideal: [45, 62] },
      temperature: { min: 18, max: 36, ideal: [22, 30] },
      humidity: { min: 50, max: 80, ideal: [58, 74] },
      light: { min: 200, max: 800, ideal: [400, 700] },
      ph: { min: 6.0, max: 7.5, ideal: [6.5, 7.2] },
      water: { min: 20, max: 100, ideal: [45, 88] }
    },
    base: { moisture: 54, temperature: 27, humidity: 67, light: 560, ph: 6.8, water: 70 },
    tips: {
      watering: 'Keep consistently moist. Water every 2 days; daily in summer. Never let it dry out completely.',
      sunlight: 'Partial sun — 4–6 hours. Harsh afternoon sun can scorch leaves; shade net recommended.',
      soil: 'Rich, well-draining loam with compost. Mulch to retain moisture.',
      bestTime: '🌙 Evening watering suits Mogra — blooms at night and needs moisture for flower production.',
      seasons: {
        summer: 'Water generously, mist flowers in the evening. Deadhead spent blooms.',
        monsoon: 'Excellent blooming season. Reduce watering, ensure no waterlogging.',
        winter: 'Reduce watering significantly. Prune lightly after flowering stops.'
      }
    }
  },
  {
    id: 'snake', name: 'Snake Plant', hindiName: 'सास की जुबान', species: 'Sansevieria trifasciata',
    emoji: '🗡️', location: 'Bedroom · Low Light', accent: '#5a7a3a', bg: '#edf5e0',
    desc: 'Air purifier — tolerates neglect beautifully',
    thresholds: {
      moisture: { min: 10, max: 45, ideal: [15, 35] },
      temperature: { min: 10, max: 38, ideal: [18, 30] },
      humidity: { min: 20, max: 60, ideal: [30, 50] },
      light: { min: 50, max: 700, ideal: [100, 500] },
      ph: { min: 5.5, max: 7.5, ideal: [6.0, 7.0] },
      water: { min: 5, max: 100, ideal: [15, 60] }
    },
    base: { moisture: 22, temperature: 25, humidity: 40, light: 280, ph: 6.4, water: 35 },
    tips: {
      watering: 'Water only when soil is completely dry — every 2–6 weeks. Overwatering is the #1 killer.',
      sunlight: 'Extremely adaptable — thrives in low to bright indirect light. Avoid direct harsh sun.',
      soil: 'Sandy, well-draining cactus or succulent mix. Excellent for testing moisture sensors (wide dry range).',
      bestTime: '☀️ Water in the morning. Ensure pot drains fully — never let it sit in water.',
      seasons: {
        summer: 'Water every 2–3 weeks. Can tolerate more light outdoors in shade.',
        monsoon: 'Water monthly or less. High humidity may cause rot — ensure airflow.',
        winter: 'Water every 6–8 weeks. Goes semi-dormant. Keep away from cold drafts.'
      }
    }
  },
  {
    id: 'money', name: 'Money Plant', hindiName: 'मनी प्लांट', species: 'Epipremnum aureum',
    emoji: '💚', location: 'Living Room · Indirect Light', accent: '#2e8b57', bg: '#e0f5ec',
    desc: 'Lucky charm — rapid indoor grower',
    thresholds: {
      moisture: { min: 30, max: 65, ideal: [40, 58] },
      temperature: { min: 15, max: 35, ideal: [20, 30] },
      humidity: { min: 40, max: 80, ideal: [50, 70] },
      light: { min: 100, max: 800, ideal: [200, 600] },
      ph: { min: 6.0, max: 7.5, ideal: [6.0, 6.8] },
      water: { min: 20, max: 100, ideal: [40, 80] }
    },
    base: { moisture: 48, temperature: 26, humidity: 58, light: 380, ph: 6.4, water: 62 },
    tips: {
      watering: 'Water when top 2–3 cm of soil is dry — roughly every 5–7 days. Moderate watering is ideal.',
      sunlight: 'Thrives in indirect bright light. Can grow in low light but variegation may fade.',
      soil: 'Well-draining potting mix with cocopeat. Can also grow in water jars — ideal for IoT experiments.',
      bestTime: '🌤️ Water in the morning. Growth is fast — great for tracking progress over days.',
      seasons: {
        summer: 'Water every 4–5 days. Mist leaves to increase humidity. Fertilise monthly.',
        monsoon: 'Grows vigorously! Reduce watering. Pinch tips to control leggy growth.',
        winter: 'Slow growth phase. Water every 7–10 days. Keep away from AC vents.'
      }
    }
  },
  {
    id: 'aloe', name: 'Aloe Vera', hindiName: 'घृतकुमारी', species: 'Aloe barbadensis miller',
    emoji: '🌵', location: 'Sunny Windowsill · South', accent: '#a0b832', bg: '#f4f9e0',
    desc: 'Medicinal succulent — stores water in leaves',
    thresholds: {
      moisture: { min: 5, max: 40, ideal: [10, 30] },
      temperature: { min: 10, max: 42, ideal: [18, 35] },
      humidity: { min: 15, max: 55, ideal: [20, 40] },
      light: { min: 300, max: 1400, ideal: [600, 1100] },
      ph: { min: 6.0, max: 8.0, ideal: [6.5, 7.5] },
      water: { min: 5, max: 100, ideal: [15, 50] }
    },
    base: { moisture: 18, temperature: 30, humidity: 30, light: 820, ph: 7.0, water: 30 },
    tips: {
      watering: 'Water deeply but infrequently — every 3 weeks in summer, monthly in winter. Soak and dry method.',
      sunlight: 'Loves bright direct sunlight. South-facing window or outdoor terrace is perfect.',
      soil: 'Gritty succulent/cactus mix with excellent drainage. Terracotta pots work best.',
      bestTime: '🌞 Water in the morning. Let soil dry completely before the next watering — ideal for dry-sensor testing.',
      seasons: {
        summer: 'Tolerates heat well. Water every 2 weeks maximum. Watch for sunburn above 45°C.',
        monsoon: 'Danger zone — root rot risk. Move indoors or to covered area. No extra watering.',
        winter: 'Near dormant. Water only once a month. Cold below 5°C can damage leaves.'
      }
    }
  },
  {
    id: 'spider', name: 'Spider Plant', hindiName: 'मकड़ी पौधा', species: 'Chlorophytum comosum',
    emoji: '🕷️', location: 'Hanging Basket · East Window', accent: '#6aab4e', bg: '#e8f7e0',
    desc: 'Hardy & responsive — ideal for environmental sensing',
    thresholds: {
      moisture: { min: 25, max: 60, ideal: [35, 55] },
      temperature: { min: 10, max: 35, ideal: [18, 28] },
      humidity: { min: 35, max: 75, ideal: [45, 65] },
      light: { min: 100, max: 700, ideal: [200, 550] },
      ph: { min: 6.0, max: 7.2, ideal: [6.0, 6.8] },
      water: { min: 20, max: 100, ideal: [40, 75] }
    },
    base: { moisture: 44, temperature: 24, humidity: 55, light: 340, ph: 6.4, water: 58 },
    tips: {
      watering: 'Water moderately — every 5–7 days. Sensitive to fluoride in tap water; use filtered or rain water.',
      sunlight: 'Thrives in indirect bright light. Variegation is best near east-facing window.',
      soil: 'Standard well-draining potting mix. Produces "spiderettes" (offshoots) when happy.',
      bestTime: '🌅 Morning watering. Extremely responsive to light/humidity changes — great for IoT demos.',
      seasons: {
        summer: 'Water every 4 days, mist regularly. Brown tips indicate low humidity or fluoride.',
        monsoon: 'Grows rapidly! Reduce watering. Repot if roots outgrow container.',
        winter: 'Slow growth. Water every 10 days. Bring indoors if below 7°C.'
      }
    }
  },
  {
    id: 'rose',                          // unique ID, no spaces
    name: 'Rose',                        // display name
    hindiName: 'गुलाब',                  // Hindi name
    species: 'Rosa indica',              // scientific name
    emoji: '🌹',
    location: 'Front Garden · Morning Sun',
    accent: '#e05c7a',                   // card colour (hex)
    bg: '#fce8ef',                       // avatar background
    desc: 'Classic ornamental flower',

    thresholds: {
      // For each sensor: min/max = absolute danger limits
      //                  ideal  = the green "optimal" zone
      moisture: { min: 35, max: 70, ideal: [45, 62] },
      temperature: { min: 15, max: 38, ideal: [20, 30] },
      humidity: { min: 45, max: 80, ideal: [55, 72] },
      light: { min: 300, max: 1000, ideal: [500, 800] },
      ph: { min: 6.0, max: 7.0, ideal: [6.3, 6.8] },
      water: { min: 20, max: 100, ideal: [45, 85] }
    },

    // Starting values — should sit inside ideal ranges
    base: { moisture: 52, temperature: 26, humidity: 64, light: 640, ph: 6.5, water: 68 },

    tips: {
      watering: 'Water deeply 2–3 times a week. Keep soil moist but not waterlogged. Increase watering during flowering season.',
      sunlight: 'Needs 6–8 hours of direct sunlight daily for healthy blooms and strong growth.',
      soil: 'Prefers rich, well-draining soil with compost. Slightly acidic soil works best for roses.',
      bestTime: '🌅 Early morning watering is ideal. Remove dried flowers regularly to encourage new blooms.',
      seasons: {
        summer: 'Water frequently during hot days. Mulching helps retain moisture and protect roots.',
        monsoon: 'Watch for fungal diseases due to excess moisture. Ensure proper drainage and airflow.',
        winter: 'Growth slows down. Water less often and prune lightly to prepare for spring flowering.'
      }
    }
  }
];

/* ─────────────────────────────────────────────
   2. SENSOR METADATA
───────────────────────────────────────────── */
const SENSOR_META = {
  moisture: { label: 'Soil Moisture', icon: '💧', unit: '%', absMin: 0, absMax: 100, color: '#2196F3', bgColor: '#e3f2fd' },
  temperature: { label: 'Temperature', icon: '🌡️', unit: '°C', absMin: 0, absMax: 50, color: '#ff7043', bgColor: '#fbe9e7' },
  humidity: { label: 'Air Humidity', icon: '🌫️', unit: '%', absMin: 0, absMax: 100, color: '#00bcd4', bgColor: '#e0f7fa' },
  light: { label: 'Light (Lux)', icon: '☀️', unit: 'lux', absMin: 0, absMax: 1500, color: '#ffc107', bgColor: '#fff8e1' },
  ph: { label: 'Soil pH', icon: '⚗️', unit: '', absMin: 4, absMax: 9, color: '#9c27b0', bgColor: '#f3e5f5' },
  water: { label: 'Water Level', icon: '🪣', unit: '%', absMin: 0, absMax: 100, color: '#4caf50', bgColor: '#e8f5e9' }
};

/* ─────────────────────────────────────────────
   3. APPLICATION STATE
───────────────────────────────────────────── */
let sensorState = {};
let sensorHistory = {};
let selectedId = PLANTS[0].id;
let historyChart = null;
let healthChart = null;
let statusChart = null;
let eventLog = [];
let alertTracker = {};
let openTips = {};
let wateredToday = 0;

const MAX_HISTORY = 20;
const TICK_MS = 5000;

const JITTER = {
  moisture: 1.8, temperature: 0.35, humidity: 1.4,
  light: 30, ph: 0.06, water: 0.4
};

/* ─────────────────────────────────────────────
   4. INITIALISATION
───────────────────────────────────────────── */
function initState() {
  PLANTS.forEach(p => {
    sensorState[p.id] = { ...p.base };
    alertTracker[p.id] = {};
    sensorHistory[p.id] = { labels: [] };
    openTips[p.id] = false;
    Object.keys(SENSOR_META).forEach(k => {
      sensorHistory[p.id][k] = [];
      alertTracker[p.id][k] = 'ok';
    });
  });
}

/* ─────────────────────────────────────────────
   5. SIMULATION ENGINE
───────────────────────────────────────────── */
function simulate(plantId) {
  const plant = PLANTS.find(p => p.id === plantId);
  const s = sensorState[plantId];

  Object.keys(SENSOR_META).forEach(k => {
    const jitter = (Math.random() - 0.5) * 2 * (JITTER[k] || 1);
    s[k] += jitter;

    // Drift toward ideal centre
    const ideal = plant.thresholds[k].ideal;
    const centre = (ideal[0] + ideal[1]) / 2;
    s[k] += (centre - s[k]) * 0.015;

    // Clamp to threshold bounds
    const t = plant.thresholds[k];
    s[k] = Math.min(t.max + 5, Math.max(t.min - 5, s[k]));
  });

  // Natural depletion
  s.water = Math.max(0, s.water - Math.random() * 0.25);
  s.moisture = Math.max(
    plant.thresholds.moisture.min - 5,
    s.moisture - Math.random() * 0.35
  );
}

function pushHistory(plantId) {
  const s = sensorState[plantId];
  const h = sensorHistory[plantId];
  const t = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  h.labels.push(t);
  Object.keys(SENSOR_META).forEach(k => h[k].push(parseFloat(s[k].toFixed(2))));

  if (h.labels.length > MAX_HISTORY) {
    h.labels.shift();
    Object.keys(SENSOR_META).forEach(k => h[k].shift());
  }
}

/* ─────────────────────────────────────────────
   6. HEALTH & STATUS HELPERS
───────────────────────────────────────────── */
function calcHealth(plantId) {
  const plant = PLANTS.find(p => p.id === plantId);
  const s = sensorState[plantId];
  let score = 100;

  Object.keys(SENSOR_META).forEach(k => {
    const { ideal, min, max } = plant.thresholds[k];
    const v = s[k];
    if (v < ideal[0]) score -= ((ideal[0] - v) / (ideal[0] - min + 1)) * 15;
    if (v > ideal[1]) score -= ((v - ideal[1]) / (max - ideal[1] + 1)) * 15;
  });

  return Math.round(Math.min(100, Math.max(0, score)));
}

function healthLabel(score) {
  if (score >= 85) return { text: 'Thriving', cls: 'badge-great' };
  if (score >= 65) return { text: 'Stable', cls: 'badge-good' };
  if (score >= 45) return { text: 'Attention', cls: 'badge-warn' };
  return { text: 'Critical', cls: 'badge-danger' };
}

function healthColor(score) {
  if (score >= 85) return '#22c55e';
  if (score >= 65) return '#3b82f6';
  if (score >= 45) return '#f59e0b';
  return '#ef4444';
}

function sensorStatus(val, thresholds) {
  const { min, max, ideal } = thresholds;
  if (val <= min || val >= max) return 'danger';
  if (val < ideal[0] || val > ideal[1]) return 'warn';
  return 'ok';
}

function statusColor(status) {
  return status === 'ok' ? '#22c55e' : status === 'warn' ? '#f59e0b' : '#ef4444';
}

function trendArrow(plantId, sensor) {
  const h = sensorHistory[plantId][sensor];
  if (h.length < 4) return '→';
  const delta = h[h.length - 1] - h[h.length - 4];
  const thr = {
    moisture: 0.5, temperature: 0.15, humidity: 0.5,
    light: 15, ph: 0.02, water: 0.2
  }[sensor] || 0.3;
  if (delta > thr) return '↗';
  if (delta < -thr) return '↘';
  return '→';
}

function formatVal(key, val) {
  if (key === 'ph' || key === 'temperature') return val.toFixed(1);
  if (key === 'light') return Math.round(val).toLocaleString('en-IN');
  return Math.round(val);
}

/* ─────────────────────────────────────────────
   7. WATER NOW
───────────────────────────────────────────── */
function waterPlant(event, plantId) {
  event.stopPropagation();
  const plant = PLANTS.find(p => p.id === plantId);
  const s = sensorState[plantId];

  s.water = 100;
  s.moisture = plant.thresholds.moisture.ideal[1];

  wateredToday++;
  document.getElementById('stat-watered').textContent = wateredToday;

  // Blue screen flash
  const flash = document.getElementById('water-flash');
  flash.classList.add('active');
  setTimeout(() => flash.classList.remove('active'), 400);

  // Animate button
  const btn = document.getElementById('wbtn-' + plantId);
  if (btn) {
    btn.classList.add('watered');
    btn.textContent = '✓ Watered!';
    setTimeout(() => {
      btn.classList.remove('watered');
      btn.innerHTML = '💧 Water Now';
    }, 2000);
  }

  addLog(plant, `💧 Manually watered — moisture reset to ${Math.round(s.moisture)}%`, 'ok');
  renderPlantCards();
  renderSensors();
}

/* ─────────────────────────────────────────────
   8. CARE TIPS TOGGLE
───────────────────────────────────────────── */
function toggleTips(event, plantId) {
  event.stopPropagation();
  openTips[plantId] = !openTips[plantId];

  const panel = document.getElementById('tips-' + plantId);
  if (panel) panel.classList.toggle('open', openTips[plantId]);

  const btn = document.getElementById('tipbtn-' + plantId);
  if (btn) btn.textContent = openTips[plantId] ? '✕ Close' : '🌿 Care Tips';
}

/* ─────────────────────────────────────────────
   9. RENDER — PLANT CARDS
───────────────────────────────────────────── */
function renderPlantCards() {
  const grid = document.getElementById('plants-grid');

  grid.innerHTML = PLANTS.map((p, i) => {
    const s = sensorState[p.id];
    const health = calcHealth(p.id);
    const { text, cls } = healthLabel(health);
    const hColor = healthColor(health);
    const isActive = p.id === selectedId;
    const tips = p.tips;

    return `
    <div class="plant-card ${isActive ? 'active' : ''}"
         style="animation-delay:${i * 0.06}s"
         onclick="selectPlant('${p.id}')">

      <div class="plant-card-strip"
           style="background:linear-gradient(90deg,${p.accent},${p.accent}aa)"></div>

      <div class="plant-card-body">
        <div class="plant-card-top">
          <div class="plant-avatar"
               style="background:${p.bg};border:2px solid ${p.accent}33">
            <span>${p.emoji}</span>
          </div>
          <div class="plant-meta">
            <div class="plant-name">${p.name}</div>
            <span class="plant-name-hindi">${p.hindiName}</span>
            <div class="plant-species">${p.species}</div>
            <span class="plant-location-tag">📍 ${p.location}</span>
          </div>
          <span class="status-badge ${cls}">${text}</span>
        </div>

        <div class="plant-mini-metrics">
          <div class="pmm">
            <span class="pmm-icon">💧</span>
            <span class="pmm-val">${Math.round(s.moisture)}%</span>
            <span class="pmm-lbl">Soil</span>
          </div>
          <div class="pmm">
            <span class="pmm-icon">🌡️</span>
            <span class="pmm-val">${s.temperature.toFixed(1)}°</span>
            <span class="pmm-lbl">Temp</span>
          </div>
          <div class="pmm">
            <span class="pmm-icon">☀️</span>
            <span class="pmm-val">${Math.round(s.light)}</span>
            <span class="pmm-lbl">Lux</span>
          </div>
        </div>

        <div class="health-row">
          <span>Plant Health</span>
          <span class="health-score" style="color:${hColor}">${health}%</span>
        </div>
        <div class="health-track">
          <div class="health-fill"
               style="width:${health}%;
                      background:linear-gradient(90deg,${hColor}cc,${hColor})">
          </div>
        </div>

        <div class="card-actions">
          <button class="water-btn" id="wbtn-${p.id}"
                  onclick="waterPlant(event,'${p.id}')">
            💧 Water Now
          </button>
          <button class="tips-btn" id="tipbtn-${p.id}"
                  onclick="toggleTips(event,'${p.id}')">
            ${openTips[p.id] ? '✕ Close' : '🌿 Care Tips'}
          </button>
        </div>
      </div>

      <div class="care-tips-panel ${openTips[p.id] ? 'open' : ''}"
           id="tips-${p.id}">
        <div class="care-tips-title">🌱 Care Guide — ${p.name}</div>
        <div class="care-tip-row">
          <span class="care-tip-icon">💧</span>
          <span class="care-tip-text">
            <strong>Watering:</strong> ${tips.watering}
          </span>
        </div>
        <div class="care-tip-row">
          <span class="care-tip-icon">☀️</span>
          <span class="care-tip-text">
            <strong>Sunlight:</strong> ${tips.sunlight}
          </span>
        </div>
        <div class="care-tip-row">
          <span class="care-tip-icon">🪱</span>
          <span class="care-tip-text">
            <strong>Soil:</strong> ${tips.soil}
          </span>
        </div>
        <div class="care-tip-row">
          <span class="care-tip-icon">⏰</span>
          <span class="care-tip-text">${tips.bestTime}</span>
        </div>
        <div class="care-tips-title" style="margin-top:10px">🗓️ Seasonal Care</div>
        <div class="seasonal-row">
          <div class="season-chip">
            <span class="s-icon">☀️</span>
            <span class="s-name">Summer</span>
            <span class="s-tip">${tips.seasons.summer}</span>
          </div>
          <div class="season-chip">
            <span class="s-icon">🌧️</span>
            <span class="s-name">Monsoon</span>
            <span class="s-tip">${tips.seasons.monsoon}</span>
          </div>
          <div class="season-chip">
            <span class="s-icon">❄️</span>
            <span class="s-name">Winter</span>
            <span class="s-tip">${tips.seasons.winter}</span>
          </div>
        </div>
      </div>

    </div>`;
  }).join('');
}

/* ─────────────────────────────────────────────
   10. RENDER — SENSOR CARDS
───────────────────────────────────────────── */
function renderSensors() {
  const plant = PLANTS.find(p => p.id === selectedId);
  const s = sensorState[selectedId];

  document.getElementById('selected-plant-emoji').textContent = plant.emoji;
  document.getElementById('selected-plant-name').textContent = plant.name;

  document.getElementById('sensors-grid').innerHTML =
    Object.entries(SENSOR_META).map(([key, meta]) => {
      const val = s[key];
      const t = plant.thresholds[key];
      const status = sensorStatus(val, t);
      const sColor = statusColor(status);
      const arrow = trendArrow(selectedId, key);

      const range = meta.absMax - meta.absMin;
      const fillPct = Math.min(100, Math.max(0, ((val - meta.absMin) / range) * 100));
      const idealLoPct = ((t.ideal[0] - meta.absMin) / range) * 100;
      const idealHiPct = ((t.ideal[1] - meta.absMin) / range) * 100;
      const idealWidth = idealHiPct - idealLoPct;

      const statusLabels = { ok: 'Optimal', warn: 'Out of range', danger: 'Critical' };
      const statusTextColors = { ok: '#16a34a', warn: '#d97706', danger: '#dc2626' };

      return `
      <div class="sensor-card">
        <div class="sensor-accent" style="background:${meta.color}"></div>
        <div class="sensor-card-header">
          <div class="sensor-icon-wrap" style="background:${meta.bgColor}">
            <span>${meta.icon}</span>
          </div>
          <span class="sensor-trend-arrow">${arrow}</span>
        </div>
        <div class="sensor-label">${meta.label}</div>
        <div class="sensor-value">
          ${formatVal(key, val)}<span class="sensor-unit"> ${meta.unit}</span>
        </div>
        <div class="sensor-status-text" style="color:${statusTextColors[status]}">
          ● ${statusLabels[status]}
        </div>
        <div class="sensor-progress">
          <div class="sensor-progress-track">
            <div class="ideal-zone"
                 style="left:${idealLoPct.toFixed(1)}%;
                        width:${idealWidth.toFixed(1)}%;
                        background:${meta.color}22;
                        border:1px dashed ${meta.color}55">
            </div>
            <div class="sensor-progress-fill"
                 style="width:${fillPct.toFixed(1)}%;
                        background:linear-gradient(90deg,${meta.color}99,${sColor})">
            </div>
          </div>
          <div class="sensor-progress-labels">
            <span>${meta.absMin}</span>
            <span>${meta.absMax} ${meta.unit}</span>
          </div>
          <div class="ideal-range-label">
            Ideal: ${t.ideal[0]}–${t.ideal[1]} ${meta.unit}
          </div>
        </div>
      </div>`;
    }).join('');
}

/* ─────────────────────────────────────────────
   11. ALERT SYSTEM
───────────────────────────────────────────── */
function processAlerts() {
  const chips = [];
  let alertCount = 0;

  PLANTS.forEach(p => {
    const s = sensorState[p.id];
    Object.entries(SENSOR_META).forEach(([key, meta]) => {
      const curr = sensorStatus(s[key], p.thresholds[key]);
      const prev = alertTracker[p.id][key];

      if (curr !== prev) {
        if (curr === 'danger') {
          addLog(p, `${meta.label} CRITICAL — ${formatVal(key, s[key])} ${meta.unit}`, 'danger');
        } else if (curr === 'warn') {
          addLog(p, `${meta.label} out of ideal range`, 'warn');
        } else if (prev !== 'ok') {
          addLog(p, `${meta.label} back to normal ✓`, 'ok');
        }
        alertTracker[p.id][key] = curr;
      }

      if (curr === 'danger') {
        alertCount++;
        chips.push(`<span class="chip chip-danger">🚨 ${p.name} · ${meta.label}</span>`);
      } else if (curr === 'warn') {
        alertCount++;
        chips.push(`<span class="chip chip-warn">⚠ ${p.name} · ${meta.label}</span>`);
      }
    });
  });

  document.getElementById('alert-chips').innerHTML = chips.length
    ? chips.join('')
    : '<span class="chip chip-ok">✓ All plants healthy — no alerts</span>';

  document.getElementById('stat-alerts').textContent = alertCount;
}

/* ─────────────────────────────────────────────
   12. STATS ROW
───────────────────────────────────────────── */
function updateStats() {
  const scores = PLANTS.map(p => calcHealth(p.id));
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  document.getElementById('stat-avg-health').textContent = avg + '%';
}

/* ─────────────────────────────────────────────
   13. CHARTS
───────────────────────────────────────────── */
function buildHistoryLegend() {
  document.getElementById('history-legend').innerHTML = [
    { color: '#2196F3', label: 'Moisture %' },
    { color: '#ff7043', label: 'Temp °C' },
    { color: '#00bcd4', label: 'Humidity %' }
  ].map(i =>
    `<span class="legend-item">
      <span class="legend-dot" style="background:${i.color}"></span>${i.label}
    </span>`
  ).join('');
}

function initCharts() {
  buildHistoryLegend();

  /* ── Line chart — sensor history ── */
  const hCtx = document.getElementById('historyChart').getContext('2d');
  historyChart = new Chart(hCtx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Moisture %', data: [],
          borderColor: '#2196F3', backgroundColor: 'rgba(33,150,243,0.07)',
          tension: 0.45, borderWidth: 2.5, pointRadius: 2.5,
          fill: true, pointBackgroundColor: '#2196F3'
        },
        {
          label: 'Temp °C', data: [],
          borderColor: '#ff7043', backgroundColor: 'rgba(255,112,67,0.05)',
          tension: 0.45, borderWidth: 2.5, pointRadius: 2.5,
          fill: false, pointBackgroundColor: '#ff7043'
        },
        {
          label: 'Humidity %', data: [],
          borderColor: '#00bcd4', backgroundColor: 'rgba(0,188,212,0.05)',
          tension: 0.45, borderWidth: 2.5, pointRadius: 2.5,
          fill: false, pointBackgroundColor: '#00bcd4'
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false, animation: { duration: 300 },
      plugins: {
        legend: { display: false },
        tooltip: {
          mode: 'index', intersect: false,
          backgroundColor: 'rgba(27,58,45,0.92)',
          titleFont: { family: 'Outfit', size: 11 },
          bodyFont: { family: 'JetBrains Mono', size: 12 },
          padding: 10
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(0,0,0,0.04)' },
          ticks: { font: { size: 10, family: 'Outfit' }, color: '#6b8070', maxTicksLimit: 8, maxRotation: 0 }
        },
        y: {
          grid: { color: 'rgba(0,0,0,0.04)' },
          ticks: { font: { size: 10, family: 'Outfit' }, color: '#6b8070' }
        }
      }
    }
  });

  /* ── Bar chart — health scores ── */
  const hbCtx = document.getElementById('healthChart').getContext('2d');
  healthChart = new Chart(hbCtx, {
    type: 'bar',
    data: {
      labels: PLANTS.map(p => p.emoji + ' ' + p.name.split(' ')[0]),
      datasets: [{
        label: 'Health',
        data: PLANTS.map(p => calcHealth(p.id)),
        backgroundColor: PLANTS.map(p => healthColor(calcHealth(p.id)) + 'cc'),
        borderRadius: 6, borderSkipped: false
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, animation: { duration: 600 },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: ctx => ' Health: ' + ctx.raw + '%' },
          backgroundColor: 'rgba(27,58,45,0.92)',
          bodyFont: { family: 'JetBrains Mono', size: 12 }, padding: 8
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 9, family: 'Outfit' }, color: '#6b8070' } },
        y: {
          min: 0, max: 100, grid: { color: 'rgba(0,0,0,0.04)' },
          ticks: { font: { size: 10, family: 'Outfit' }, color: '#6b8070', callback: v => v + '%' }
        }
      }
    }
  });

  /* ── Donut chart — sensor status ── */
  const scCtx = document.getElementById('statusChart').getContext('2d');
  statusChart = new Chart(scCtx, {
    type: 'doughnut',
    data: {
      labels: ['Optimal', 'Warning', 'Critical'],
      datasets: [{
        data: [0, 0, 0],
        backgroundColor: ['#22c55ecc', '#f59e0bcc', '#ef4444cc'],
        borderColor: ['#22c55e', '#f59e0b', '#ef4444'],
        borderWidth: 2, hoverOffset: 6
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '65%',
      plugins: {
        legend: {
          display: true, position: 'bottom',
          labels: { font: { size: 10, family: 'Outfit' }, color: '#6b8070', padding: 10, boxWidth: 10 }
        },
        tooltip: {
          backgroundColor: 'rgba(27,58,45,0.92)',
          bodyFont: { family: 'JetBrains Mono', size: 12 }, padding: 8
        }
      }
    }
  });
}

function updateHistoryChart() {
  const h = sensorHistory[selectedId];
  historyChart.data.labels = [...h.labels];
  historyChart.data.datasets[0].data = [...h.moisture];
  historyChart.data.datasets[1].data = [...h.temperature];
  historyChart.data.datasets[2].data = [...h.humidity];
  historyChart.update('none');
}

function updateHealthChart() {
  healthChart.data.datasets[0].data = PLANTS.map(p => calcHealth(p.id));
  healthChart.data.datasets[0].backgroundColor = PLANTS.map(p => healthColor(calcHealth(p.id)) + 'cc');
  healthChart.update('none');
}

function updateStatusChart() {
  const counts = { ok: 0, warn: 0, danger: 0 };
  PLANTS.forEach(p =>
    Object.keys(SENSOR_META).forEach(k =>
      counts[sensorStatus(sensorState[p.id][k], p.thresholds[k])]++
    )
  );
  statusChart.data.datasets[0].data = [counts.ok, counts.warn, counts.danger];
  statusChart.update('none');
}

/* ─────────────────────────────────────────────
   14. EVENT LOG
───────────────────────────────────────────── */
function addLog(plant, msg, type = 'info') {
  const time = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
  eventLog.unshift({ time, msg: `${plant.emoji} ${plant.name} — ${msg}`, type });
  if (eventLog.length > 60) eventLog.pop();
  renderLog();
}

function renderLog() {
  const ul = document.getElementById('event-log');
  const dotC = { ok: 'ldot-ok', warn: 'ldot-warn', danger: 'ldot-danger', info: 'ldot-info' };

  if (!eventLog.length) {
    ul.innerHTML = '<li class="log-empty">No events yet.</li>';
    return;
  }

  ul.innerHTML = eventLog.map(e => `
    <li class="log-item">
      <span class="log-time">${e.time}</span>
      <span class="log-dot ${dotC[e.type] || 'ldot-info'}"></span>
      <span class="log-msg">${e.msg}</span>
    </li>`).join('');
}

function clearLog() {
  eventLog = [];
  renderLog();
}

/* ─────────────────────────────────────────────
   15. PLANT SELECTION
───────────────────────────────────────────── */
function selectPlant(id) {
  selectedId = id;
  renderPlantCards();
  renderSensors();
  updateHistoryChart();

  const badge = document.getElementById('selected-badge');
  badge.style.transform = 'scale(1.05)';
  setTimeout(() => badge.style.transform = '', 200);
}

/* ─────────────────────────────────────────────
   16. EXPORT CSV
───────────────────────────────────────────── */
function exportCSV() {
  const now = new Date().toLocaleString('en-IN');
  const headers = [
    'Plant', 'Hindi Name', 'Species', 'Location', 'Health %',
    ...Object.values(SENSOR_META).map(m => m.label + (m.unit ? ` (${m.unit})` : ''))
  ];

  const rows = PLANTS.map(p => {
    const s = sensorState[p.id];
    const health = calcHealth(p.id);
    return [
      p.name, p.hindiName, p.species, p.location, health,
      ...Object.keys(SENSOR_META).map(k => formatVal(k, s[k]))
    ].map(v => `"${v}"`).join(',');
  });

  const csv = [
    `# VanaRaksha Export — ${now}`,
    `# ${PLANTS.length} plants · ${Object.keys(SENSOR_META).length} sensors each`,
    '',
    headers.join(','),
    ...rows
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vanaraksha-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);

  const dummy = { emoji: '📊', name: 'System' };
  addLog(dummy, `CSV exported — ${PLANTS.length} plants, ${Object.keys(SENSOR_META).length * PLANTS.length} data points`, 'info');
}

/* ─────────────────────────────────────────────
   17. CLOCK
───────────────────────────────────────────── */
function updateClock() {
  document.getElementById('last-sync').textContent =
    new Date().toLocaleTimeString('en-IN');
}

/* ─────────────────────────────────────────────
   18. MAIN TICK LOOP
───────────────────────────────────────────── */
let tickCount = 0;

const RANDOM_EVENTS = [
  'Soil probe OK', 'Sensor calibration complete',
  'Data synced to cloud', 'Fertiliser reminder',
  'Irrigation cycle check', 'Node battery optimal',
  'Mesh network stable', 'Edge gateway responsive'
];

function tick() {
  PLANTS.forEach(p => { simulate(p.id); pushHistory(p.id); });
  processAlerts();
  renderPlantCards();
  renderSensors();
  updateStats();
  updateHistoryChart();
  updateHealthChart();
  updateStatusChart();
  updateClock();

  if (tickCount % 5 === 0) {
    const p = PLANTS[Math.floor(Math.random() * PLANTS.length)];
    const m = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
    addLog(p, m, 'info');
  }

  tickCount++;
}

/* ─────────────────────────────────────────────
   19. BOOT
───────────────────────────────────────────── */
window.addEventListener('load', () => {
  initState();

  // Warm up 15 history ticks before rendering
  for (let i = 0; i < 15; i++) {
    PLANTS.forEach(p => { simulate(p.id); pushHistory(p.id); });
  }

  renderPlantCards();
  renderSensors();
  updateStats();
  processAlerts();
  initCharts();
  updateHistoryChart();
  updateHealthChart();
  updateStatusChart();
  updateClock();

  PLANTS.forEach(p => addLog(p, 'Monitoring initialised ✓', 'ok'));

  setInterval(tick, TICK_MS);
});