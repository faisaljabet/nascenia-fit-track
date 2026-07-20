/**
 * Formats a YYYY-MM-DD date string into a readable format.
 * Uses local timezone construction to avoid date-shifting issues.
 * 
 * @param {string} dateString 'YYYY-MM-DD'
 * @param {boolean} short If true, returns 'MMM DD' format, otherwise 'MMM DD, YYYY'
 * @returns {string}
 */
export function formatDate(dateString, short = false) {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // 0-indexed
  const day = parseInt(parts[2], 10);
  
  const date = new Date(year, month, day);
  
  if (short) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Formats a weight value with 1 decimal place and units.
 * 
 * @param {number} weight 
 * @param {string} unit 
 * @returns {string}
 */
export function formatWeight(weight, unit = 'kg') {
  if (weight === undefined || weight === null) return '-';
  return `${Number(weight).toFixed(1)} ${unit}`;
}

/**
 * Formats a delta weight change, prepending '+' or '-' as appropriate.
 * 
 * @param {number} delta 
 * @param {string} unit 
 * @returns {string}
 */
export function formatDelta(delta, unit = 'kg') {
  if (delta === undefined || delta === null) return '-';
  const val = Number(delta);
  if (val > 0) {
    return `+${val.toFixed(1)} ${unit}`;
  }
  if (val < 0) {
    return `${val.toFixed(1)} ${unit}`; // already includes minus sign
  }
  return `0.0 ${unit}`;
}
