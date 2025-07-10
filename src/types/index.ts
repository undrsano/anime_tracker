export interface Anime {
  id: number;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  coverImage: {
    large: string;
    medium: string;
  };
  description: string;
  episodes: number;
  duration: number;
  genres: string[];
  status: 'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED' | 'CANCELLED' | 'HIATUS';
  season: 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL';
  seasonYear: number;
  averageScore: number;
  meanScore: number;
  popularity: number;
  studios: {
    nodes: Array<{
      name: string;
    }>;
  };
}

export type AnimeStatus = 'WATCHED' | 'WATCHING' | 'PLANNED' | 'DROPPED' | 'REWATCHING';

export interface UserAnime {
  anime: Anime;
  status: AnimeStatus;
  progress: number;
  rating?: number;
  notes?: string;
  addedAt: Date;
}

export interface AnimeList {
  watched: UserAnime[];
  watching: UserAnime[];
  planned: UserAnime[];
  dropped: UserAnime[];
  rewatching: UserAnime[];
}

export interface SearchFilters {
  genre?: string;
  season?: string;
  year?: number;
  status?: string;
  sortBy?: 'POPULARITY' | 'SCORE' | 'TITLE' | 'DATE';
  sortOrder?: 'ASC' | 'DESC';
} 