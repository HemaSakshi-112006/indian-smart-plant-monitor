# 🌿 VanaRaksha — script.js Complete Viva Explanation

> Use this as your preparation guide. Each section explains **what the code does**, **why it was written that way**, and **what to say during your viva**.

---

## `'use strict';` — Line 1

This is a JavaScript directive that enables **Strict Mode**.
- It prevents common mistakes like using undeclared variables.
- It makes your code safer and easier to debug.
- **Say in viva:** *"I used strict mode to ensure JavaScript throws errors for bad coding patterns, which improves code quality."*

---

## Section 1 — PLANT DATA (`const PLANTS = [...]`) · Lines 11–274

This is a **constant array** (list) of 10 plant objects. Each plant object contains:

| Property | Meaning |
|---|---|
| `id` | Unique text identifier, e.g. `'tulsi'` |
| `name` | English display name |
| `hindiName` | Hindi name shown on the card (e.g. `'तुलसी'`) |
| `species` | Scientific/botanical name |
| `emoji` | Emoji icon shown in the UI |
| `location` | Where the plant is kept (e.g. Pooja Room) |
| `accent` | Hex color code for the card's color strip |
| `bg` | Background color of the avatar circle |
| `desc` | Short description of the plant |
| `thresholds` | Safe and ideal sensor ranges for **this specific plant** |
| `base` | Starting sensor values when the app loads |
| `tips` | Care guide — watering, sunlight, soil, and seasonal advice |

### What are `thresholds`?
```js
moisture: { min: 35, max: 70, ideal: [45, 65] }
```
- `min` / `max` = the absolute danger limits. Going outside these triggers a **Critical** alert.
- `ideal` = the green "optimal zone". Being outside ideal (but within min/max) triggers a **Warning**.
- Every plant has different thresholds because different plants have different needs (e.g. Lotus needs 80–100% moisture; Aloe Vera only needs 5–40%).

### What is `base`?
```js
base: { moisture: 30, temperature: 26, humidity: 62, light: 520, ph: 6.5, water: 74 }
```
- These are the **starting sensor values** when the dashboard first loads.
- They are chosen to be within the ideal range so the plant starts healthy.

**Viva answer:** *"PLANTS is my data layer. In a real IoT system, this data would come from a database like MongoDB or Firebase. Here, it is hardcoded to simulate the same behaviour."*

---

## Section 2 — SENSOR METADATA (`const SENSOR_META`) · Lines 279–286

```js
const SENSOR_META = {
  moisture: { label: 'Soil Moisture', icon: '💧', unit: '%', absMin: 0, absMax: 100, color: '#2196F3', bgColor: '#e3f2fd' },
  ...
}
```

This is a **lookup table** (dictionary/object) for all 6 sensors. Each sensor key holds:

| Property | Purpose |
|---|---|
| `label` | Human-readable name shown in the UI |
| `icon` | Emoji icon for the sensor card |
| `unit` | Unit of measurement (%, °C, lux) |
| `absMin` / `absMax` | The physical absolute limits of the sensor hardware |
| `color` | Chart and progress bar color |
| `bgColor` | Light background for the icon badge |

### Why separate SENSOR_META from PLANTS?
- SENSOR_META is **sensor-level** info (same for every plant).
- PLANTS thresholds are **plant-level** info (different per plant).
- This avoids repeating unit/color/label 10 times inside every plant object.

**Viva answer:** *"This is a separation of concerns pattern. Sensor metadata is global — it doesn't change per plant. Keeping it separate makes the code DRY (Don't Repeat Yourself)."*

---

## Section 3 — APPLICATION STATE · Lines 291–308

These are the **global state variables** — the live memory of the running application.

```js
let sensorState = {};      // Current live sensor readings for ALL plants
let sensorHistory = {};    // Historical readings (last 20 ticks) for charts
let selectedId = PLANTS[0].id;  // Which plant is currently selected (default: Tulsi)
let historyChart = null;   // Reference to the Chart.js line chart object
let healthChart = null;    // Reference to the bar chart object
let statusChart = null;    // Reference to the donut chart object
let eventLog = [];         // List of system events/alerts shown in the log panel
let alertTracker = {};     // Remembers the LAST alert status of each sensor (to avoid duplicate alerts)
let openTips = {};         // Tracks whether the care tips panel is open for each plant
let wateredToday = 0;      // Counter of how many times the user clicked "Water Now" today
```

```js
const MAX_HISTORY = 20;   // Keep only the last 20 data points in charts
const TICK_MS = 5000;     // Sensor data updates every 5 seconds (5000 milliseconds)
```

### JITTER — The noise constants:
```js
const JITTER = {
  moisture: 1.8, temperature: 0.35, humidity: 1.4,
  light: 30, ph: 0.06, water: 0.4
};
```
- Jitter = how much each sensor value randomly fluctuates each tick.
- `moisture: 1.8` means moisture can randomly change by up to ±1.8% per tick.
- `light: 30` is large because light (lux) naturally fluctuates a lot.
- `ph: 0.06` is very small because soil pH changes slowly.
- **This simulates real sensor noise** — real hardware sensors always have slight fluctuations.

**Viva answer:** *"In real IoT, sensor readings are never perfectly stable due to electrical noise and environmental changes. The JITTER values simulate this realistic sensor behaviour."*

---

## Section 4 — INITIALISATION (`initState()`) · Lines 313–324

```js
function initState() {
  PLANTS.forEach(p => {
    sensorState[p.id] = { ...p.base };   // Copy base values as starting readings
    alertTracker[p.id] = {};             // Empty alert history for this plant
    sensorHistory[p.id] = { labels: [] }; // Empty time-label array for charts
    openTips[p.id] = false;              // Tips panel starts closed
    Object.keys(SENSOR_META).forEach(k => {
      sensorHistory[p.id][k] = [];       // Empty data array for each sensor
      alertTracker[p.id][k] = 'ok';     // Start all sensors in 'ok' state
    });
  });
}
```

**Line by line:**
- `PLANTS.forEach(p => {...})` — loops through every plant one by one.
- `{ ...p.base }` — the **spread operator** copies all 6 sensor values from `p.base` into a new object. This prevents mutation — changing `sensorState` won't change `p.base`.
- `alertTracker[p.id][k] = 'ok'` — marks every sensor as "ok" at the start so the first tick doesn't fire false alerts.

**Viva answer:** *"initState prepares all the data structures before any rendering happens. Using the spread operator ensures we work with a copy, not a reference to the original plant data."*

---

## Section 5 — SIMULATION ENGINE · Lines 329–369

This is the **heart of the IoT simulation**. It runs every 5 seconds.

### `simulate(plantId)` — Lines 329–353

```js
function simulate(plantId) {
  const plant = PLANTS.find(p => p.id === plantId);  // Find the plant object
  const s = sensorState[plantId];                    // Get its current readings (by reference)
```

#### Step 1 — Add random jitter
```js
const jitter = (Math.random() - 0.5) * 2 * (JITTER[k] || 1);
s[k] += jitter;
```
- `Math.random()` returns a value between 0 and 1.
- `(Math.random() - 0.5) * 2` turns this into a value between **-1 and +1**.
- Multiplying by `JITTER[k]` scales it to the sensor's realistic noise range.
- Result: the sensor value randomly goes slightly up or down.

#### Step 2 — Drift toward the ideal centre
```js
const ideal = plant.thresholds[k].ideal;
const centre = (ideal[0] + ideal[1]) / 2;  // midpoint of ideal range
s[k] += (centre - s[k]) * 0.015;
```
- This is a **mean-reversion** algorithm — a common technique in simulations.
- If the value drifts too far from the ideal centre, it is slowly pulled back.
- `0.015` means only 1.5% of the gap is corrected each tick — a very gradual correction.
- **Why?** So values don't endlessly wander out of range; they stay realistic.

#### Step 3 — Clamp to hard limits
```js
const t = plant.thresholds[k];
s[k] = Math.min(t.max + 5, Math.max(t.min - 5, s[k]));
```
- `Math.max(t.min - 5, s[k])` — prevents value from going below `min - 5`.
- `Math.min(t.max + 5, s[k])` — prevents value from going above `max + 5`.
- The `+5 / -5` buffer allows the sensor to momentarily go slightly outside the threshold (triggering a Critical alert) but not go to impossible values.

#### Step 4 — Natural depletion (after the loop)
```js
s.water = Math.max(0, s.water - Math.random() * 0.25);
s.moisture = Math.max(
  plant.thresholds.moisture.min - 5,
  s.moisture - Math.random() * 0.35
);
```
- Water and moisture are **consumed** naturally every tick (plants drink water!).
- `Math.random() * 0.25` = up to 0.25% water loss per tick.
- This means the water level slowly falls, simulating real evaporation and root uptake.
- When the user clicks **"Water Now"**, these values are reset to 100%.

**Viva answer:** *"The simulation uses three techniques: random jitter for sensor noise, mean-reversion to keep values realistic, and clamping to enforce physical limits. Natural depletion of moisture and water mimics how a real plant consumes water over time."*

---

### `pushHistory(plantId)` — Lines 355–369

```js
function pushHistory(plantId) {
  const s = sensorState[plantId];
  const h = sensorHistory[plantId];
  const t = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
```
- Gets the current time formatted in Indian locale (e.g. `10:35:20 pm`).

```js
  h.labels.push(t);  // Add timestamp to the X-axis labels array
  Object.keys(SENSOR_META).forEach(k => h[k].push(parseFloat(s[k].toFixed(2))));
```
- `s[k].toFixed(2)` rounds value to 2 decimal places (e.g. `62.47`).
- `parseFloat(...)` converts the string back to a number for the chart.
- Each sensor's reading is pushed into its history array.

```js
  if (h.labels.length > MAX_HISTORY) {
    h.labels.shift();
    Object.keys(SENSOR_META).forEach(k => h[k].shift());
  }
```
- If history exceeds 20 entries, the **oldest** entry is removed using `.shift()`.
- This creates a **sliding window** — the chart always shows the last 20 readings.
- `.shift()` removes from the front; `.push()` adds to the back.

**Viva answer:** *"pushHistory creates a circular buffer of the last 20 readings. This is memory-efficient — we never store more data than needed for the chart display."*

---

## Section 6 — HEALTH & STATUS HELPERS · Lines 374–431

### `calcHealth(plantId)` — Lines 374–387
```js
function calcHealth(plantId) {
  let score = 100;  // Start with perfect health
  Object.keys(SENSOR_META).forEach(k => {
    const { ideal, min, max } = plant.thresholds[k];
    const v = s[k];  // current sensor value
    if (v < ideal[0]) score -= ((ideal[0] - v) / (ideal[0] - min + 1)) * 15;
    if (v > ideal[1]) score -= ((v - ideal[1]) / (max - ideal[1] + 1)) * 15;
  });
  return Math.round(Math.min(100, Math.max(0, score)));
}
```
- Start from 100% and deduct points for each sensor that is outside its ideal range.
- The further from ideal, the more points are deducted (proportional penalty).
- Maximum penalty per sensor: 15 points. With 6 sensors, the plant can score as low as 10%.
- Final score is clamped between 0 and 100.

### `healthLabel(score)` — Lines 389–394
| Score | Label | Badge |
|---|---|---|
| ≥ 85 | Thriving | Green |
| ≥ 65 | Stable | Blue |
| ≥ 45 | Attention | Yellow |
| < 45 | Critical | Red |

### `sensorStatus(val, thresholds)` — Lines 403–408
```js
if (val <= min || val >= max) return 'danger';
if (val < ideal[0] || val > ideal[1]) return 'warn';
return 'ok';
```
- Three levels: `'ok'`, `'warn'`, `'danger'`.
- **danger** = outside the hard min/max limits.
- **warn** = outside ideal but within safe limits.
- **ok** = within ideal range.

### `trendArrow(plantId, sensor)` — Lines 414–425
```js
const delta = h[h.length - 1] - h[h.length - 4];
```
- Compares the **latest** reading with the reading **4 ticks ago**.
- If the difference is large enough: shows ↗ (rising) or ↘ (falling).
- Otherwise shows → (stable).
- Each sensor has a different sensitivity threshold (e.g. moisture needs 0.5% change, light needs 15 lux).

---

## Section 7 — WATER NOW (`waterPlant()`) · Lines 436–466

```js
function waterPlant(event, plantId) {
  event.stopPropagation();  // Prevents the click from also selecting the plant card
  s.water = 100;            // Instantly fill water tank to 100%
  s.moisture = plant.thresholds.moisture.ideal[1];  // Set moisture to the top of ideal range
  wateredToday++;           // Increment the "Watered Today" counter
  ...
  // Blue flash animation on screen
  flash.classList.add('active');
  setTimeout(() => flash.classList.remove('active'), 400);
  ...
  // Button text changes to "✓ Watered!" for 2 seconds
  btn.textContent = '✓ Watered!';
  setTimeout(() => { btn.innerHTML = '💧 Water Now'; }, 2000);
}
```
**Viva answer:** *"When a user clicks Water Now, it simulates an irrigation command being sent to the plant. In a real IoT system, this would trigger an actuator — like a solenoid valve or a water pump — via MQTT or HTTP."*

---

## Section 8 — CARE TIPS TOGGLE (`toggleTips()`) · Lines 471–480

```js
function toggleTips(event, plantId) {
  event.stopPropagation();
  openTips[plantId] = !openTips[plantId];  // Flip true/false (toggle)
  panel.classList.toggle('open', openTips[plantId]);  // Add/remove CSS class
  btn.textContent = openTips[plantId] ? '✕ Close' : '🌿 Care Tips';  // Change button text
}
```
- `!openTips[plantId]` — the `!` operator flips `true` to `false` and vice versa.
- `.classList.toggle('open', condition)` — adds the `open` CSS class if true, removes it if false.
- The CSS `open` class animates the panel sliding down using `max-height` transition.

---

## Section 9 — RENDER PLANT CARDS (`renderPlantCards()`) · Lines 485–607

This function **builds the entire plant card grid** dynamically using JavaScript.

```js
grid.innerHTML = PLANTS.map((p, i) => { ... }).join('');
```
- `.map()` transforms each plant object into an HTML string.
- `.join('')` combines all the HTML strings into one big string.
- Assigning to `innerHTML` makes the browser render all the cards at once.
- The cards include: avatar, name, Hindi name, species, location, health bar, mini metrics, action buttons, and the care tips panel.

**Viva answer:** *"Instead of hardcoding HTML for each plant, I use JavaScript's map function to dynamically generate cards. Adding a new plant to the PLANTS array automatically creates its card — no HTML changes needed."*

---

## Section 10 — RENDER SENSOR CARDS (`renderSensors()`) · Lines 612–675

Renders the 6 sensor cards for the currently selected plant.

Key calculations:
```js
const fillPct = ((val - meta.absMin) / range) * 100;    // Where is the value on the bar?
const idealLoPct = ((t.ideal[0] - meta.absMin) / range) * 100;  // Where does ideal start?
const idealHiPct = ((t.ideal[1] - meta.absMin) / range) * 100;  // Where does ideal end?
const idealWidth = idealHiPct - idealLoPct;             // Width of the ideal zone overlay
```
- These percentages are used to draw the progress bar and the **ideal zone shading** on top of it.

---

## Section 11 — ALERT SYSTEM (`processAlerts()`) · Lines 680–716

```js
const curr = sensorStatus(s[key], p.thresholds[key]);  // Current alert level
const prev = alertTracker[p.id][key];                  // Previous alert level

if (curr !== prev) {   // Only log if status CHANGED
  if (curr === 'danger') addLog(...'CRITICAL');
  else if (curr === 'warn') addLog(...'out of ideal range');
  else if (prev !== 'ok') addLog(...'back to normal ✓');
  alertTracker[p.id][key] = curr;  // Update the tracker
}
```
- `alertTracker` stores the **last known state** of every sensor.
- Alerts are only logged when the state **changes** (e.g. ok → warn, or danger → ok).
- This prevents the same alert from being spammed every 5 seconds.

**Viva answer:** *"The alertTracker implements edge-triggered alerting — alerts fire only on state transitions, not repeatedly. This is the same pattern used in real IoT alert systems like AWS IoT Events."*

---

## Section 12 — STATS ROW (`updateStats()`) · Lines 721–725

```js
const scores = PLANTS.map(p => calcHealth(p.id));
const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
```
- `.map()` creates an array of health scores for all plants.
- `.reduce((a, b) => a + b, 0)` adds them all up (starting from 0).
- Dividing by `scores.length` gives the average.

---

## Section 13 — CHARTS (`initCharts()`, `updateHistoryChart()`, etc.) · Lines 730–883

Uses the **Chart.js** library to render three charts:

| Chart | Type | Shows |
|---|---|---|
| `historyChart` | Line | Moisture, Temperature, Humidity over last 20 ticks |
| `healthChart` | Bar | Health score of each plant side-by-side |
| `statusChart` | Doughnut | Count of all sensors in Optimal / Warning / Critical states |

- `initCharts()` creates all three chart objects once at startup.
- `updateHistoryChart()` / `updateHealthChart()` / `updateStatusChart()` update the data arrays and call `.update('none')` (no animation) for smooth live updates.

**Viva answer:** *"Chart.js is a popular open-source charting library. I initialise the charts once and then update their data arrays in place — this is more efficient than destroying and recreating charts every 5 seconds."*

---

## Section 14 — EVENT LOG · Lines 888–917

```js
function addLog(plant, msg, type = 'info') {
  const time = new Date().toLocaleTimeString('en-IN', {...});
  eventLog.unshift({ time, msg: `${plant.emoji} ${plant.name} — ${msg}`, type });
  if (eventLog.length > 60) eventLog.pop();  // Keep max 60 entries
  renderLog();
}
```
- `.unshift()` adds new events to the **front** of the array (newest first).
- `.pop()` removes from the **back** (oldest event) if limit is exceeded.
- `type` can be `'ok'`, `'warn'`, `'danger'`, or `'info'` — determines the color of the dot.

---

## Section 15 — PLANT SELECTION (`selectPlant()`) · Lines 922–931

```js
function selectPlant(id) {
  selectedId = id;         // Update the global selected plant ID
  renderPlantCards();      // Re-render all cards (so the active card gets highlighted)
  renderSensors();         // Re-render sensor cards for the new plant
  updateHistoryChart();    // Update the line chart to show the new plant's history
  // Brief scale animation on the selected badge
  badge.style.transform = 'scale(1.05)';
  setTimeout(() => badge.style.transform = '', 200);
}
```

---

## Section 16 — EXPORT CSV (`exportCSV()`) · Lines 936–970

Generates a downloadable `.csv` file in the browser without any server:

```js
const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `vanaraksha-${new Date().toISOString().slice(0, 10)}.csv`;
a.click();
URL.revokeObjectURL(url);  // Clean up memory after download
```
- `Blob` = Binary Large Object — a file-like object in memory.
- `URL.createObjectURL()` creates a temporary download URL for the blob.
- A hidden `<a>` tag is programmatically clicked to trigger the download.
- `URL.revokeObjectURL()` frees the memory immediately after.

**Viva answer:** *"The CSV export uses the Blob API to create a file entirely in the browser's memory and trigger a download — no server or file system access is needed."*

---

## Section 18 — MAIN TICK LOOP (`tick()`) · Lines 983–1010

```js
let tickCount = 0;

function tick() {
  PLANTS.forEach(p => { simulate(p.id); pushHistory(p.id); });  // Update all plant sensors
  processAlerts();      // Check for new alerts
  renderPlantCards();   // Redraw plant cards
  renderSensors();      // Redraw sensor cards
  updateStats();        // Recalculate average health
  updateHistoryChart(); // Refresh line chart
  updateHealthChart();  // Refresh bar chart
  updateStatusChart();  // Refresh donut chart
  updateClock();        // Update the "Last Sync" timestamp

  if (tickCount % 5 === 0) {  // Every 5th tick (every 25 seconds)
    // Log a random system message (simulates IoT system diagnostics)
    addLog(randomPlant, randomMessage, 'info');
  }
  tickCount++;
}
```

This single function is the **master controller** called every 5 seconds by:
```js
setInterval(tick, TICK_MS);  // TICK_MS = 5000ms
```
- `setInterval` is a JavaScript timer that calls `tick()` repeatedly forever.
- Every call = one "sensor reading cycle" — simulating an IoT device sending data.

**Viva answer:** *"The tick function simulates an IoT polling cycle. In real systems, data arrives via MQTT subscriptions or WebSocket push. Here, setInterval replaces the network layer — everything else (processing, alerting, rendering) is identical to a real IoT dashboard."*

---

## Section 19 — BOOT (`window.addEventListener('load', ...)`) · Lines 1015–1036

```js
window.addEventListener('load', () => {
  initState();  // Set up all data structures

  // Warm up 15 history ticks before rendering (so charts aren't empty on load)
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

  setInterval(tick, TICK_MS);  // Start the live update loop
});
```

- `window.addEventListener('load', ...)` waits until **all HTML, CSS, and images** are fully loaded before running the JavaScript.
- The 15 warm-up ticks pre-populate the chart with data so it looks like the system has been running.
- `setInterval(tick, TICK_MS)` starts the live simulation loop.

**Viva answer:** *"The load event ensures the DOM is ready before we try to access elements like the chart canvas or the plants grid. The 15-tick warm-up makes the dashboard feel like it's been running live — a common UX technique in IoT dashboards."*

---

## 🎓 Key Talking Points for Your Viva

### Why is this an IoT project?
> *"IoT = Internet of Things — devices that sense the physical world and send data to a dashboard. This project simulates the full IoT pipeline: sensor data generation → data processing → real-time visualisation → alerting → actuator control (Water Now button). In production, the sensor simulation would be replaced by real Arduino/ESP32 sensors sending data via MQTT or HTTP."*

### What sensors are monitored?
> *"Six sensors: Soil Moisture, Temperature, Air Humidity, Light (Lux), Soil pH, and Water Level — the same sensors used in commercial smart agriculture systems."*

### How does the simulation work?
> *"Three-part simulation: random jitter for sensor noise, mean-reversion to keep values realistic, and hard clamping for safety. Plus natural depletion of water and moisture to mimic real plant behaviour."*

### How is health score calculated?
> *"We start at 100% and subtract points proportionally for each of the 6 sensors that falls outside its ideal range. Maximum 15 points deducted per sensor."*

### What design patterns did you use?
> *"Separation of concerns (SENSOR_META vs PLANTS), observer pattern (alert tracker monitors state changes), sliding window buffer (MAX_HISTORY = 20 for charts), and event-driven rendering (all UI updates triggered by the tick loop)."*
