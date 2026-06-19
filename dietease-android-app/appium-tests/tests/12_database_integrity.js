/**
 * TEST 12 — Database Integrity
 * Verifies that all 16 built-in products in the Android app
 * can be looked up by barcode and display correct data.
 */
const { clickTab, findByText, findByTextContains } = require('../utils/driver');

// Must exactly match the BUILTIN_PRODUCTS map in FoodRepository.kt
const BUILTIN_PRODUCTS = [
  { barcode: '8901719100018', name: 'Parle-G Biscuits',     brand: 'Parle',     calories: 450, protein: 6.7,  carbs: 76.0, fat: 11.7 },
  { barcode: '8901719110017', name: 'Parle Hide & Seek',    brand: 'Parle',     calories: 496, protein: 6.2,  carbs: 66.0, fat: 23.0 },
  { barcode: '8901063032019', name: 'Britannia Good Day',   brand: 'Britannia', calories: 503, protein: 7.0,  carbs: 64.0, fat: 24.0 },
  { barcode: '8901030810054', name: 'Parle-G Gold',         brand: 'Parle',     calories: 450, protein: 6.7,  carbs: 76.0, fat: 11.7 },
  { barcode: '8901088002230', name: 'Amul Butter',          brand: 'Amul',      calories: 720, protein: 0.5,  carbs: 0.0,  fat: 80.0 },
  { barcode: '8901058200401', name: 'Amul Taaza Milk',      brand: 'Amul',      calories: 62,  protein: 3.2,  carbs: 4.7,  fat: 3.2  },
  { barcode: '8904004400019', name: 'Sunfeast Dark Fantasy',brand: 'ITC',       calories: 517, protein: 6.5,  carbs: 64.0, fat: 26.0 },
  { barcode: '8901499000018', name: "Kellogg's Cornflakes", brand: "Kellogg's", calories: 357, protein: 8.0,  carbs: 79.0, fat: 1.0  },
  { barcode: '7622210449283', name: 'Cadbury Dairy Milk',   brand: 'Cadbury',   calories: 534, protein: 7.7,  carbs: 57.6, fat: 29.7 },
  { barcode: '7622210979063', name: 'Cadbury 5 Star',       brand: 'Cadbury',   calories: 462, protein: 4.0,  carbs: 70.0, fat: 18.0 },
  { barcode: '8901058501203', name: 'KitKat 4 Finger',      brand: 'Nestlé',    calories: 518, protein: 6.3,  carbs: 63.0, fat: 27.0 },
  { barcode: '8901552004123', name: 'Coca-Cola 250ml',      brand: 'Coca-Cola', calories: 44,  protein: 0.0,  carbs: 11.0, fat: 0.0  },
  { barcode: '8901012000016', name: 'Pepsi 250ml',          brand: 'PepsiCo',   calories: 42,  protein: 0.0,  carbs: 10.6, fat: 0.0  },
  { barcode: '049000050103',  name: 'Coca-Cola Classic',    brand: 'Coca-Cola', calories: 42,  protein: 0.0,  carbs: 10.6, fat: 0.0  },
  { barcode: '038000845321',  name: "Kellogg's Corn Flakes",brand: "Kellogg's", calories: 357, protein: 8.0,  carbs: 79.0, fat: 0.5  },
  { barcode: '037600164801',  name: 'Oreo Cookies',         brand: 'Nabisco',   calories: 471, protein: 5.0,  carbs: 70.0, fat: 20.0 },
];

async function lookupBarcode(driver, barcode) {
  await clickTab(driver, 'scan');
  const inp = await driver.$('android.widget.EditText');
  await inp.waitForExist({ timeout: 5000 });
  await inp.clearValue();
  await inp.setValue(barcode);
  const searchBtn = await driver.$('~Search');
  await searchBtn.waitForExist({ timeout: 5000 });
  await searchBtn.click();
  await driver.pause(3000);
}

module.exports = async function runTests(driver) {
  const results = [];

  const push = (name, pass, dur, info) => results.push({
    name,
    status: pass ? 'PASS' : 'FAIL',
    duration: dur,
    category: 'Database Integrity',
    error: info,
    timestamp: Date.now()
  });

  for (const prod of BUILTIN_PRODUCTS) {
    const { barcode, name, brand, calories, protein, carbs, fat } = prod;
    let t0 = Date.now();

    try {
      // 1. Perform lookup
      await lookupBarcode(driver, barcode);

      // 2. Wait until result card shows the correct product name
      const nameEl = await findByText(driver, name);
      await nameEl.waitForExist({ timeout: 10000 });
      const passName = await nameEl.isDisplayed();
      const dur = Date.now() - t0;

      push(`[${barcode}] Name: ${name}`, passName, dur, passName ? `Found` : `Not displayed`);

      // Assert Brand
      const brandEl = await findByText(driver, brand);
      const passBrand = await brandEl.isExisting();
      push(`[${barcode}] Brand: ${brand}`, passBrand, 0, passBrand ? `Matched` : `Not found`);

      // Assert Source (Android app uses "Built-in DB")
      const srcEl = await findByTextContains(driver, 'Built-in DB');
      const passSrc = await srcEl.isExisting();
      push(`[${barcode}] Source: Built-in DB`, passSrc, 0, passSrc ? `Matched` : `Not found`);

      // Assert Calories
      const calEl = await findByTextContains(driver, String(calories));
      const passCal = await calEl.isExisting();
      push(`[${barcode}] Calories: ${calories}`, passCal, 0, passCal ? `Matched` : `Not found`);

      // Assert Protein
      const formattedProt = protein.toFixed(1) + 'g';
      const protEl = await findByTextContains(driver, formattedProt);
      const passProt = await protEl.isExisting();
      push(`[${barcode}] Protein: ${formattedProt}`, passProt, 0, passProt ? `Matched` : `Not found`);

      // Assert Carbs
      const formattedCarbs = carbs.toFixed(1) + 'g';
      const carbsEl = await findByTextContains(driver, formattedCarbs);
      const passCarbs = await carbsEl.isExisting();
      push(`[${barcode}] Carbs: ${formattedCarbs}`, passCarbs, 0, passCarbs ? `Matched` : `Not found`);

      // Assert Fat
      const formattedFat = fat.toFixed(1) + 'g';
      const fatEl = await findByTextContains(driver, formattedFat);
      const passFat = await fatEl.isExisting();
      push(`[${barcode}] Fat: ${formattedFat}`, passFat, 0, passFat ? `Matched` : `Not found`);

      // 3. Dismiss result card
      const closeBtn = await driver.$('~Close');
      if (await closeBtn.isExisting()) {
        await closeBtn.click();
        await driver.pause(1000);
      }

    } catch (e) {
      const dur = Date.now() - t0;
      push(`[${barcode}] Lookup: ${name}`, false, dur, e.message);
      push(`[${barcode}] Brand Check`, false, 0, 'Lookup failed');
      push(`[${barcode}] Source Check`, false, 0, 'Lookup failed');
      push(`[${barcode}] Calories Check`, false, 0, 'Lookup failed');
      push(`[${barcode}] Protein Check`, false, 0, 'Lookup failed');
      push(`[${barcode}] Carbs Check`, false, 0, 'Lookup failed');
      push(`[${barcode}] Fat Check`, false, 0, 'Lookup failed');

      // Attempt cleanup
      try {
        const closeBtn = await driver.$('~Close');
        if (await closeBtn.isExisting()) {
          await closeBtn.click();
          await driver.pause(1000);
        }
      } catch (_) {}
    }
  }

  return results;
};
