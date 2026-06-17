/**
 * Excel Reporter — DietEase+ Appium Format
 * Columns: S.No | Test Module | Test Case | Result | Error/Remarks
 * PASS rows: green fill (C6EFCE), FAIL rows: red fill (FFC7CE)
 */
const ExcelJS = require('exceljs');
const path    = require('path');
const fs      = require('fs');

async function generateReport(allResults, reportDir) {
  if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });

  const wb = new ExcelJS.Workbook();
  wb.creator  = 'DietEase+ Appium Suite';
  wb.created  = new Date();
  wb.modified = new Date();

  /* ────────────────────────────────────────────────
     SHEET 1: Test Results
  ──────────────────────────────────────────────── */
  const ws = wb.addWorksheet('Test Results');

  // Column widths
  ws.columns = [
    { key:'sno',    width: 7  },
    { key:'module', width: 22 },
    { key:'test',   width: 52 },
    { key:'result', width: 12 },
    { key:'error',  width: 60 },
  ];

  // Header row — dark blue bg, bold white text
  const headerRow = ws.addRow(['S.No', 'Test Module', 'Test Case', 'Result', 'Error / Remarks']);
  headerRow.eachCell(cell => {
    cell.fill   = { type:'pattern', pattern:'solid', fgColor:{ argb:'FF1F3864' } };
    cell.font   = { name:'Calibri', size:11, bold:true, color:{ argb:'FFFFFFFF' } };
    cell.alignment = { vertical:'middle', horizontal:'center', wrapText:true };
    cell.border = {
      bottom:{ style:'medium', color:{ argb:'FFFFFFFF' } }
    };
  });
  headerRow.height = 22;

  // Data rows
  allResults.forEach((r, idx) => {
    const isPassed = r.status === 'PASS';
    const fillColor = isPassed ? 'FFC6EFCE' : 'FFFFC7CE';
    const module    = r.category || 'General';
    const testName  = 'test_' + r.name.toLowerCase()
      .replace(/[^a-z0-9 ]+/g,'').trim().replace(/ +/g,'_').substring(0, 60);
    const remark = isPassed ? 'None — test passed successfully.' : (r.error || 'Test failed');

    const row = ws.addRow([idx+1, module, testName, r.status, remark]);
    row.eachCell(cell => {
      cell.fill      = { type:'pattern', pattern:'solid', fgColor:{ argb:fillColor } };
      cell.font      = { name:'Calibri', family:2, size:11 };
      cell.alignment = { vertical:'top', wrapText:true };
    });
    row.height = remark.length > 80 ? 50 : 18;
  });

  // Auto-filter on header
  ws.autoFilter = { from:'A1', to:'E1' };

  /* ────────────────────────────────────────────────
     SHEET 2: Summary Dashboard
  ──────────────────────────────────────────────── */
  const ws2 = wb.addWorksheet('Summary');
  ws2.columns = [{ width:30 }, { width:20 }, { width:20 }, { width:20 }];

  const passed  = allResults.filter(r=>r.status==='PASS').length;
  const failed  = allResults.filter(r=>r.status==='FAIL').length;
  const total   = allResults.length;
  const rate    = total > 0 ? ((passed/total)*100).toFixed(1) : '0.0';
  const genDate = new Date().toLocaleString('en-IN', { timeZone:'Asia/Kolkata' });

  // Title
  const titleRow = ws2.addRow(['DietEase+ — E2E Appium Test Report']);
  ws2.mergeCells(`A1:D1`);
  titleRow.getCell(1).fill   = { type:'pattern', pattern:'solid', fgColor:{ argb:'FF1F3864' } };
  titleRow.getCell(1).font   = { name:'Calibri', size:16, bold:true, color:{ argb:'FFFFFFFF' } };
  titleRow.getCell(1).alignment = { horizontal:'center', vertical:'middle' };
  titleRow.height = 32;

  ws2.addRow([]);

  // Summary stats
  const stats = [
    ['Generated',       genDate,    '', ''],
    ['Target',          'DietEase+ Android Application', '', ''],
    ['Device/Simulator','Samsung SM-A166P (R9ZXA0BDBTM)', '', ''],
    ['Total Tests',     total,      '', ''],
    ['Passed ✅',       passed,     '', ''],
    ['Failed ❌',       failed,     '', ''],
    ['Pass Rate',       rate + '%', '', ''],
  ];
  stats.forEach(([label, val]) => {
    const row = ws2.addRow([label, val]);
    row.getCell(1).font = { name:'Calibri', size:11, bold:true };
    row.getCell(2).font = { name:'Calibri', size:11 };
    row.getCell(1).fill = { type:'pattern', pattern:'solid', fgColor:{ argb:'FFD6E4F0' } };
  });

  ws2.addRow([]);
  ws2.addRow([]);

  // Category breakdown header
  const catHeader = ws2.addRow(['Category', 'Total', 'Passed', 'Failed']);
  catHeader.eachCell(cell => {
    cell.fill = { type:'pattern', pattern:'solid', fgColor:{ argb:'FF1F3864' } };
    cell.font = { name:'Calibri', size:11, bold:true, color:{ argb:'FFFFFFFF' } };
    cell.alignment = { horizontal:'center' };
  });

  const cats = {};
  allResults.forEach(r => {
    const c = r.category || 'General';
    if (!cats[c]) cats[c] = { total:0, pass:0, fail:0 };
    cats[c].total++;
    if (r.status==='PASS') cats[c].pass++; else cats[c].fail++;
  });

  Object.entries(cats).forEach(([cat, s]) => {
    const row = ws2.addRow([cat, s.total, s.pass, s.fail]);
    const allPass = s.fail === 0;
    row.getCell(4).fill = { type:'pattern', pattern:'solid', fgColor:{ argb: allPass ? 'FFC6EFCE' : 'FFFFC7CE' } };
    row.eachCell(cell => { cell.font = { name:'Calibri', size:11 }; cell.alignment = { horizontal:'center' }; });
    row.getCell(1).alignment = { horizontal:'left' };
  });

  // Save
  const stamp = new Date().toISOString().replace(/[:.]/g,'-').slice(0,19);
  const file  = path.join(reportDir, `E2E_Test_Report_DietEasePlus_Appium_${stamp}.xlsx`);
  await wb.xlsx.writeFile(file);
  return file;
}

module.exports = { generateReport };
