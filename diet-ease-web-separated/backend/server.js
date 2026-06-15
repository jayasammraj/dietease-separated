/**
 * DietEase+ — Express Backend Server
 * PORT: uses process.env.PORT (cloud) or 3000 (local)
 */
const express = require('express');
const cors    = require('cors');
const fetch   = require('node-fetch');
const path    = require('path');
const { load, save } = require('./db');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

/* ── Helpers ── */
function todayStr() {
  return new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
}
function timeStr() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/* ── External DB lookups ── */
async function lookupOFF(region, code) {
  try {
    const r = await fetch(`https://${region}.openfoodfacts.org/api/v0/product/${code}.json`);
    const d = await r.json();
    if (d.status === 0 || !d.product) return null;
    const p = d.product, n = p.nutriments || {};
    const name = p.product_name || p.product_name_en || p.generic_name || '';
    if (!name) return null;
    const sm = { world: '🌍 Open Food Facts', in: '🇮🇳 OFF India', fr: '🇪🇺 OFF Europe' };
    return {
      name, brand: p.brands || '', barcode: code,
      calories: Math.round(n['energy-kcal_100g'] || (n['energy_100g'] || 0) / 4.184),
      protein:  +((n['proteins_100g']       || 0).toFixed(1)),
      carbs:    +((n['carbohydrates_100g']  || 0).toFixed(1)),
      fat:      +((n['fat_100g']            || 0).toFixed(1)),
      source: `✅ ${sm[region] || 'Open Food Facts'}`,
    };
  } catch { return null; }
}
async function lookupUPC(code) {
  try {
    const r = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${code}`);
    const d = await r.json();
    if (!d.items || !d.items[0] || !d.items[0].title) return null;
    return {
      name: d.items[0].title, brand: d.items[0].brand || '', barcode: code,
      calories: 0, protein: 0, carbs: 0, fat: 0,
      source: '✅ UPC Item DB', noNutrition: true,
    };
  } catch { return null; }
}
async function fetchFromWeb(code) {
  const [r1,r2,r3,r4] = await Promise.allSettled([
    lookupOFF('world', code), lookupOFF('in', code),
    lookupUPC(code),          lookupOFF('fr', code),
  ]);
  const all  = [r1,r2,r3,r4].map(r => r.value).filter(Boolean);
  return all.find(f => f.calories > 0) || all[0] || null;
}

/* ════════════════════════════════════════════════════════════
   API ROUTES
════════════════════════════════════════════════════════════ */

/* Health check */
app.get('/api/health', (req, res) => {
  res.json({ ok: true, version: '1.0.0', time: new Date().toISOString() });
});

/* GET /api/lookup/:barcode */
app.get('/api/lookup/:barcode', async (req, res) => {
  const code = req.params.barcode.trim().replace(/\s/g, '');
  if (!code) return res.status(400).json({ error: 'Barcode required' });

  const db = load();

  // Check local cache first
  if (db.products[code]) {
    return res.json({ ...db.products[code], barcode: code, fromCache: true });
  }

  // Fetch from web
  try {
    const food = await fetchFromWeb(code);
    if (!food) return res.status(404).json({ error: 'not_found' });

    // Cache it
    db.products[code] = {
      barcode: code, name: food.name, brand: food.brand || '',
      calories: food.calories || 0, protein: food.protein || 0,
      carbs: food.carbs || 0, fat: food.fat || 0,
      source: food.source || '', is_manual: false,
      noNutrition: food.noNutrition || false,
    };
    save(db);
    return res.json({ ...food, barcode: code });
  } catch (err) {
    console.error('[lookup error]', err.message);
    return res.status(500).json({ error: 'server_error' });
  }
});

/* GET /api/log?date=YYYY-MM-DD */
app.get('/api/log', (req, res) => {
  const date = req.query.date || todayStr();
  const db = load();
  const entries = db.food_log.filter(e => e.log_date === date);
  res.json({ date, entries });
});

/* POST /api/log */
app.post('/api/log', (req, res) => {
  const { barcode='', name, brand='', source='', calories=0,
          protein=0, carbs=0, fat=0, servings=1 } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });

  const db  = load();
  const id  = Date.now();
  const entry = {
    id, barcode, name, brand, source,
    calories: +calories, protein: +protein, carbs: +carbs, fat: +fat,
    servings: +servings,
    logged_cal: Math.round(+calories * +servings),
    log_date: todayStr(),
    log_time: timeStr(),
  };
  db.food_log.unshift(entry);
  save(db);
  res.json({ id, logged_cal: entry.logged_cal });
});

/* DELETE /api/log/:id */
app.delete('/api/log/:id', (req, res) => {
  const db = load();
  db.food_log = db.food_log.filter(e => e.id !== +req.params.id);
  save(db);
  res.json({ ok: true });
});

/* GET /api/log/dates */
app.get('/api/log/dates', (req, res) => {
  const db = load();
  const dates = [...new Set(db.food_log.map(e => e.log_date))].sort().reverse().slice(0, 30);
  res.json({ dates });
});

/* GET /api/goal */
app.get('/api/goal', (req, res) => {
  const db = load();
  res.json({ goal: db.settings.daily_goal || 2000 });
});

/* PUT /api/goal */
app.put('/api/goal', (req, res) => {
  const { goal } = req.body;
  if (!goal || isNaN(goal)) return res.status(400).json({ error: 'invalid goal' });
  const db = load();
  db.settings.daily_goal = parseInt(goal);
  save(db);
  res.json({ ok: true, goal: parseInt(goal) });
});

/* GET /api/products?q= */
app.get('/api/products', (req, res) => {
  const db = load();
  const q  = (req.query.q || '').toLowerCase();
  let products = Object.values(db.products);
  if (q) {
    products = products.filter(p =>
      (p.name  || '').toLowerCase().includes(q) ||
      (p.brand || '').toLowerCase().includes(q)
    );
  }
  products = products.slice(0, 200);
  res.json({ products });
});

/* POST /api/products */
app.post('/api/products', (req, res) => {
  const { barcode, name, brand='', calories=0, protein=0, carbs=0, fat=0 } = req.body;
  if (!barcode || !name) return res.status(400).json({ error: 'barcode and name required' });
  const db = load();
  db.products[barcode] = { barcode, name, brand,
    calories:+calories, protein:+protein, carbs:+carbs, fat:+fat,
    source: '✍️ Manual Entry', is_manual: true };
  save(db);
  res.json({ ok: true });
});

/* ── Start server ── */
app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════╗');
  console.log('║   DietEase+  Backend  ✅  Running        ║');
  console.log(`║   http://localhost:${PORT}/index.html       ║`);
  console.log('║   Press Ctrl+C to stop                   ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log('');
});
