/**
 * Lightweight CSV parser (no external deps).
 * Handles quoted fields, commas inside quotes, and CRLF / LF line endings.
 */
function parseCsv(csvText) {
  const lines = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  const rows = lines.map(parseCsvLine).filter((r) => r.length > 0);
  if (rows.length === 0) return [];

  const headers = rows[0].map((h) => h.trim().toLowerCase().replace(/\s+/g, '_'));
  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length === 1 && row[0].trim() === '') continue;
    const obj = {};
    headers.forEach((header, idx) => {
      obj[header] = (row[idx] || '').trim();
    });
    result.push(obj);
  }
  return result;
}

function parseCsvLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (ch === ',' && !inQuotes) {
      fields.push(current); current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

/**
 * Extract the transaction ID from a CSV row.
 * Tries common column names from Indian payment portals.
 */
function extractTransactionId(row) {
  const candidates = [
    'transaction_id', 'txn_id', 'utr', 'utr_no', 'reference_id',
    'reference_number', 'transaction_reference', 'payment_id',
    'rrn', 'order_id', 'payment_reference',
  ];
  for (const key of candidates) {
    if (row[key] && String(row[key]).trim()) return String(row[key]).trim();
  }
  const firstVal = Object.values(row)[0];
  if (firstVal && /^[A-Z0-9]{8,}$/i.test(firstVal.trim())) return firstVal.trim();
  return null;
}

module.exports = { parseCsv, extractTransactionId };
