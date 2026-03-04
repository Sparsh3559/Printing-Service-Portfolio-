// Converts product name → URL slug
// "Polo Matty 240 GSM" → "Polo-Matty-240-GSM"
export function nameToSlug(name) {
    return name.trim().replace(/\s+/g, "-")
  }
  
  // Converts URL slug → product name
  // "Polo-Matty-240-GSM" → "Polo Matty 240 GSM"
  export function slugToName(slug) {
    return decodeURIComponent(slug).replace(/-/g, " ")
  }