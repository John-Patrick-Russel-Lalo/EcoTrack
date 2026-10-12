export async function searchPlace(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Search request failed');
  }
  const results = await response.json();
  return results[0] || null;
}
