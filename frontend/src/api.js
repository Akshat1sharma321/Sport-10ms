
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export async function fetchMatches() {
  const response = await fetch(`${API_BASE_URL}/matches`);
  if (!response.ok) {
    throw new Error('Failed to fetch matches');
  }
  return response.json();
}

export async function fetchMatchDetails(id) {
    const response = await fetch(`${API_BASE_URL}/matches/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch match details');
    }
    return response.json();
}
