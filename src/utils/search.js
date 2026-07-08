export function normalizeText(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function splitSearchTerms(value = "") {
  return normalizeText(value).split(/\s+/).filter(Boolean);
}

export function matchesAllTerms(searchText, terms) {
  if (!terms.length) return true;
  return terms.every((term) => searchText.includes(term));
}
