// Converts product name → URL slug
// "Polo Matty 240 GSM" → "Polo-Matty-240-GSM"
// "Polyester Round Neck T-Shirt" → "Polyester-Round-Neck-T~Shirt"
export function nameToSlug(name) {
  return name.trim()
    .replace(/-/g, "~")   // preserve hyphens as ~ 
    .replace(/\s+/g, "-") // spaces become hyphens
}

// Converts URL slug → product name
// "Polo-Matty-240-GSM" → "Polo Matty 240 GSM"
// "Polyester-Round-Neck-T~Shirt" → "Polyester Round Neck T-Shirt"
export function slugToName(slug) {
  return decodeURIComponent(slug)
    .replace(/-/g, " ")   // hyphens back to spaces
    .replace(/~/g, "-")   // ~ back to hyphens
}