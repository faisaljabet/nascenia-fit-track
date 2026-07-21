/**
 * Parses raw CSV text into a 2D array of cells.
 * Handles quoted fields, commas, and newlines correctly.
 * 
 * @param {string} csvText Raw CSV text
 * @returns {Array<Array<string>>} 2D array of rows and cells
 */
export function parseCSV(csvText) {
  const lines = [];
  let row = [""];
  let insideQuote = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (insideQuote && nextChar === '"') {
        row[row.length - 1] += '"';
        i++; // skip next quote
      } else {
        insideQuote = !insideQuote;
      }
    } else if (char === ',' && !insideQuote) {
      row.push("");
    } else if ((char === '\r' || char === '\n') && !insideQuote) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      lines.push(row);
      row = [""];
    } else {
      row[row.length - 1] += char;
    }
  }
  if (row.length > 1 || row[0] !== "") {
    lines.push(row);
  }
  
  // Filter out completely empty rows and trim values
  return lines
    .filter(row => row.some(cell => cell.trim() !== ""))
    .map(row => row.map(cell => cell.trim()));
}

/**
 * Fetches and parses members and weights data from a Google Spreadsheet.
 * 
 * @param {string} spreadsheetId Google Spreadsheet ID
 * @returns {Promise<{membersData: Array, weightsData: Object}>} Parsed members and weights data
 */
export async function fetchSheetsData(spreadsheetId) {
  if (!spreadsheetId) {
    throw new Error("No spreadsheet ID provided");
  }

  const membersUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=members`;
  const weightsUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=weights`;

  const [membersRes, weightsRes] = await Promise.all([
    fetch(membersUrl),
    fetch(weightsUrl)
  ]);

  if (!membersRes.ok) {
    throw new Error(`Failed to fetch members sheet. Status: ${membersRes.status}`);
  }
  if (!weightsRes.ok) {
    throw new Error(`Failed to fetch weights sheet. Status: ${weightsRes.status}`);
  }

  const membersText = await membersRes.text();
  const weightsText = await weightsRes.text();

  const membersRows = parseCSV(membersText);
  const weightsRows = parseCSV(weightsText);

  if (membersRows.length < 2) {
    throw new Error("Members sheet is empty or invalid");
  }
  if (weightsRows.length < 2) {
    throw new Error("Weights sheet is empty or invalid");
  }

  // 1. Parse members data
  const membersHeaders = membersRows[0].map(h => h.trim());
  const membersData = membersRows.slice(1).map(row => {
    const member = {};
    membersHeaders.forEach((header, index) => {
      let val = row[index];
      if (header === "heightCm") {
        val = val ? Number(val) : 0;
      }
      member[header] = val;
    });
    return member;
  });

  // 2. Parse weights data (Matrix format: rows = members, columns = dates)
  const weightsHeaders = weightsRows[0].map(h => h.trim()); // First cell should be "id", others are dates
  const weightsData = {};

  // Initialize date objects
  for (let j = 1; j < weightsHeaders.length; j++) {
    const date = weightsHeaders[j];
    if (date) {
      weightsData[date] = {};
    }
  }

  // Populate data: date -> memberId -> weight
  for (let i = 1; i < weightsRows.length; i++) {
    const row = weightsRows[i];
    const memberId = row[0];
    if (!memberId) continue;

    for (let j = 1; j < row.length; j++) {
      const date = weightsHeaders[j];
      const weightStr = row[j];
      if (date && weightStr !== undefined && weightStr !== "") {
        const weightNum = Number(weightStr);
        if (!isNaN(weightNum)) {
          weightsData[date][memberId] = weightNum;
        }
      }
    }
  }

  return { membersData, weightsData };
}
