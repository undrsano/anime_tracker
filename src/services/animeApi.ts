import axios from 'axios';
import { Anime, SearchFilters } from '../types';

const ANILIST_API = 'https://graphql.anilist.co';

const searchQuery = `
  query ($search: String, $page: Int, $perPage: Int, $genre: String, $season: MediaSeason, $seasonYear: Int, $sort: [MediaSort]) {
    Page(page: $page, perPage: $perPage) {
      media(search: $search, genre: $genre, season: $season, seasonYear: $seasonYear, sort: $sort, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          medium
        }
        description
        episodes
        duration
        genres
        status
        season
        seasonYear
        averageScore
        meanScore
        popularity
        studios {
          nodes {
            name
          }
        }
      }
    }
  }
`;

const getAnimeByIdQuery = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title {
        romaji
        english
        native
      }
      coverImage {
        large
        medium
      }
      description
      episodes
      duration
      genres
      status
      season
      seasonYear
      averageScore
      meanScore
      popularity
      studios {
        nodes {
          name
        }
      }
    }
  }
`;

export const animeApi = {
  async searchAnime(search: string, filters: SearchFilters = {}, page: number = 1): Promise<Anime[]> {
    try {
      const variables = {
        search,
        page,
        perPage: 24,
        genre: filters.genre,
        season: filters.season,
        seasonYear: filters.year,
        sort: search.trim() ? ['SEARCH_MATCH'] : ['POPULARITY_DESC']
      };

      const response = await axios.post(ANILIST_API, {
        query: searchQuery,
        variables
      });

      return response.data?.data?.Page?.media || [];
    } catch (error) {
      console.error('Error searching anime:', error);
      return [];
    }
  },

  async getAnimeById(id: number): Promise<Anime | null> {
    try {
      const response = await axios.post(ANILIST_API, {
        query: getAnimeByIdQuery,
        variables: { id }
      });

      return response.data.data.Media;
    } catch (error) {
      console.error('Error getting anime by id:', error);
      return null;
    }
  },

  async getPopularAnime(page: number = 1): Promise<Anime[]> {
    try {
      const variables = {
        page,
        perPage: 24,
        sort: ['POPULARITY_DESC']
      };

      const response = await axios.post(ANILIST_API, {
        query: searchQuery,
        variables
      });

      return response.data?.data?.Page?.media || [];
    } catch (error) {
      console.error('Error getting popular anime:', error);
      return [];
    }
  },

  async getSeasonalAnime(season: string, year: number): Promise<Anime[]> {
    try {
      const variables = {
        page: 1,
        perPage: 20,
        season,
        seasonYear: year,
        sort: ['POPULARITY_DESC']
      };

      const response = await axios.post(ANILIST_API, {
        query: searchQuery,
        variables
      });

      return response.data?.data?.Page?.media || [];
    } catch (error) {
      console.error('Error getting seasonal anime:', error);
      return [];
    }
  }
}; 