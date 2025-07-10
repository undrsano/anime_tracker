import { animeApi } from './animeApi';
import { Anime, UserAnime } from '../types';

export const recommendationsService = {
  async getPersonalRecommendations(userAnimeList: UserAnime[]): Promise<Anime[]> {
    try {
      const watchedAnime = userAnimeList.filter(item => item.status === 'WATCHED');
      const watchingAnime = userAnimeList.filter(item => item.status === 'WATCHING');
      
      if (watchedAnime.length === 0 && watchingAnime.length === 0) {
        return await animeApi.getPopularAnime();
      }

      const userGenres = this.extractUserGenres([...watchedAnime, ...watchingAnime]);
      const recommendations: Anime[] = [];

      for (const genre of userGenres.slice(0, 3)) {
        const genreAnime = await animeApi.searchAnime('', { genre }, 1);
        const filteredAnime = genreAnime.filter(anime => 
          !userAnimeList.some(userAnime => userAnime.anime.id === anime.id)
        );
        recommendations.push(...filteredAnime.slice(0, 5));
      }

      if (recommendations.length < 10) {
        const popularAnime = await animeApi.getPopularAnime();
        const additionalAnime = popularAnime.filter(anime => 
          !userAnimeList.some(userAnime => userAnime.anime.id === anime.id) &&
          !recommendations.some(rec => rec.id === anime.id)
        );
        recommendations.push(...additionalAnime.slice(0, 10 - recommendations.length));
      }

      return recommendations.slice(0, 20);
    } catch (error) {
      console.error('Error getting personal recommendations:', error);
      return await animeApi.getPopularAnime();
    }
  },

  async getPopularRecommendations(): Promise<Anime[]> {
    try {
      return await animeApi.getPopularAnime();
    } catch (error) {
      console.error('Error getting popular recommendations:', error);
      return [];
    }
  },

  async getTrendingRecommendations(): Promise<Anime[]> {
    try {
      const currentYear = new Date().getFullYear();
      const currentSeason = this.getCurrentSeason();
      
      const seasonalAnime = await animeApi.getSeasonalAnime(currentSeason, currentYear);
      const popularAnime = await animeApi.getPopularAnime();
      
      const trending = [...seasonalAnime, ...popularAnime];
      return trending.slice(0, 20);
    } catch (error) {
      console.error('Error getting trending recommendations:', error);
      return await animeApi.getPopularAnime();
    }
  },

  getCurrentSeason(): string {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'SPRING';
    if (month >= 5 && month <= 7) return 'SUMMER';
    if (month >= 8 && month <= 10) return 'FALL';
    return 'WINTER';
  },

  extractUserGenres(userAnimeList: UserAnime[]): string[] {
    const genreCount: { [key: string]: number } = {};
    
    userAnimeList.forEach(userAnime => {
      const weight = userAnime.status === 'WATCHED' ? 2 : 1;
      userAnime.anime.genres?.forEach(genre => {
        genreCount[genre] = (genreCount[genre] || 0) + weight;
      });
    });

    return Object.entries(genreCount)
      .sort(([,a], [,b]) => b - a)
      .map(([genre]) => genre);
  },

  async getSimilarAnime(animeId: number, userAnimeList: UserAnime[]): Promise<Anime[]> {
    try {
      const targetAnime = await animeApi.getAnimeById(animeId);
      if (!targetAnime) return [];

      const similarAnime: Anime[] = [];
      
      for (const genre of targetAnime.genres?.slice(0, 2) || []) {
        const genreAnime = await animeApi.searchAnime('', { genre }, 1);
        const filteredAnime = genreAnime.filter(anime => 
          anime.id !== animeId && 
          !userAnimeList.some(userAnime => userAnime.anime.id === anime.id)
        );
        similarAnime.push(...filteredAnime.slice(0, 3));
      }

      return similarAnime.slice(0, 6);
    } catch (error) {
      console.error('Error getting similar anime:', error);
      return [];
    }
  }
}; 