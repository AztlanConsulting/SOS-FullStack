/** Format a raw digit string as comma-separated integer e.g. "1234567" → "1,234,567" */
const formatPrice = (raw: string) => {
  if (!raw) return '';
  return Number(raw).toLocaleString('en-US');
};

export default formatPrice;
