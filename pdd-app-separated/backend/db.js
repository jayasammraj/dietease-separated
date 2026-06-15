/**
 * DietEase+ — JSON File Database (no compilation required)
 * Stores data in dietease-data.json beside this file
 */
const fs   = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'dietease-data.json');

// ── Default structure ─────────────────────────────────────────────────────────
const DEFAULT = {
  settings: { daily_goal: 2000 },
  products: {},   // barcode -> product object
  food_log: [],   // array of log entries
};

// ── Built-in products ─────────────────────────────────────────────────────────
const BUILTIN = {
  '8901719100018': { name:'Parle-G Biscuits',       brand:'Parle',      calories:450, protein:6.7,  carbs:76,   fat:11.7, source:'⚡ Built-in DB' },
  '8901719110017': { name:'Parle Hide & Seek',       brand:'Parle',      calories:496, protein:6.2,  carbs:66,   fat:23,   source:'⚡ Built-in DB' },
  '8901030810054': { name:'Parle-G Gold',             brand:'Parle',      calories:450, protein:6.7,  carbs:76,   fat:11.7, source:'⚡ Built-in DB' },
  '8901063032019': { name:'Britannia Good Day',       brand:'Britannia',  calories:503, protein:7,    carbs:64,   fat:24,   source:'⚡ Built-in DB' },
  '8901063030015': { name:'Britannia Marie Gold',     brand:'Britannia',  calories:416, protein:8,    carbs:74,   fat:9,    source:'⚡ Built-in DB' },
  '8901058851336': { name:'Maggi 2-Min Noodles',      brand:'Nestlé',     calories:375, protein:9.4,  carbs:57,   fat:12.2, source:'⚡ Built-in DB' },
  '8901088002230': { name:'Amul Butter',              brand:'Amul',       calories:720, protein:0.5,  carbs:0,    fat:80,   source:'⚡ Built-in DB' },
  '8901088000885': { name:'Amul Taaza Milk',          brand:'Amul',       calories:58,  protein:3.2,  carbs:4.8,  fat:3,    source:'⚡ Built-in DB' },
  '8901088012007': { name:'Amul Cheese Slice',        brand:'Amul',       calories:300, protein:18,   carbs:4,    fat:24,   source:'⚡ Built-in DB' },
  '8902045000018': { name:'Haldirams Bhujia',         brand:'Haldirams',  calories:536, protein:12,   carbs:56,   fat:28,   source:'⚡ Built-in DB' },
  '8901491502759': { name:"Lay's Classic Salted",     brand:"Lay's",      calories:536, protein:6.2,  carbs:52.3, fat:34,   source:'⚡ Built-in DB' },
  '8901491107474': { name:"Lay's Magic Masala",       brand:"Lay's",      calories:547, protein:6.4,  carbs:54,   fat:33,   source:'⚡ Built-in DB' },
  '8901491100109': { name:'Kurkure Masala Munch',     brand:'PepsiCo',    calories:537, protein:6.7,  carbs:58,   fat:30,   source:'⚡ Built-in DB' },
  '8904004400019': { name:'Sunfeast Dark Fantasy',    brand:'ITC',        calories:517, protein:6.5,  carbs:64,   fat:26,   source:'⚡ Built-in DB' },
  '8901499000018': { name:"Kellogg's Cornflakes",     brand:"Kellogg's",  calories:357, protein:8,    carbs:79,   fat:1,    source:'⚡ Built-in DB' },
  '7622210449283': { name:'Cadbury Dairy Milk',       brand:'Cadbury',    calories:534, protein:7.7,  carbs:57.6, fat:29.7, source:'⚡ Built-in DB' },
  '7622210979063': { name:'Cadbury 5 Star',           brand:'Cadbury',    calories:462, protein:4,    carbs:70,   fat:18,   source:'⚡ Built-in DB' },
  '8901058501203': { name:'KitKat 4 Finger',          brand:'Nestlé',     calories:518, protein:6.3,  carbs:63,   fat:27,   source:'⚡ Built-in DB' },
  '8901552004123': { name:'Coca-Cola 250ml',          brand:'Coca-Cola',  calories:44,  protein:0,    carbs:11,   fat:0,    source:'⚡ Built-in DB' },
  '8901012000016': { name:'Pepsi 250ml',              brand:'PepsiCo',    calories:42,  protein:0,    carbs:10.6, fat:0,    source:'⚡ Built-in DB' },
  '049000050103':  { name:'Coca-Cola Classic',        brand:'Coca-Cola',  calories:42,  protein:0,    carbs:10.6, fat:0,    source:'⚡ Built-in DB' },
  '038000845321':  { name:"Kellogg's Corn Flakes",    brand:"Kellogg's",  calories:357, protein:8,    carbs:79,   fat:0.5,  source:'⚡ Built-in DB' },
  '037600164801':  { name:'Oreo Cookies',             brand:'Nabisco',    calories:471, protein:5,    carbs:70,   fat:20,   source:'⚡ Built-in DB' },
};

// ── Load or create data file ──────────────────────────────────────────────────
function load() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const data = JSON.parse(raw);
    // Merge built-ins (don't overwrite user-cached products)
    for (const [k, v] of Object.entries(BUILTIN)) {
      if (!data.products[k]) data.products[k] = { ...v, barcode: k };
    }
    return data;
  } catch {
    const data = { ...DEFAULT, products: {} };
    for (const [k, v] of Object.entries(BUILTIN)) {
      data.products[k] = { ...v, barcode: k };
    }
    save(data);
    return data;
  }
}

function save(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// ── Export DB interface ───────────────────────────────────────────────────────
module.exports = { load, save };
