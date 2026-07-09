import axios from 'axios';

import api from './api';

export interface SearchResult {
  id: string | number;
  type: 'doctor' | 'specialty' | 'symptom' | string;
  title: string;
  subtitle?: string | null;
}

export async function searchHome(query: string): Promise<SearchResult[]> {
  const keyword = query.trim();

  if (!keyword) {
    return [];
  }

  try {
    const response = await api.get<SearchResult[]>('/search', {
      params: { q: keyword },
    });

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return [];
    }

    throw error;
  }
}
