import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { animeApi } from '../services/animeApi';
import { Anime, SearchFilters } from '../types';
import AnimeCard from '../components/AnimeCard';
import { translations } from '../services/translations';

const Catalog: React.FC = () => {
  const [anime, setAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);

  const genres = [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror',
    'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Thriller'
  ];

  const seasons = [
    { value: 'WINTER', label: 'Зима' },
    { value: 'SPRING', label: 'Весна' },
    { value: 'SUMMER', label: 'Лето' },
    { value: 'FALL', label: 'Осень' }
  ];

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  const searchAnime = async (query: string, searchFilters: SearchFilters = {}, pageNum: number = 1) => {
    try {
      setLoading(true);
      const results = await animeApi.searchAnime(query, searchFilters, pageNum);
      if (results && results.length > 0) {
        if (pageNum === 1) {
          setAnime(results);
        } else {
          setAnime(prev => [...prev, ...results]);
        }
      } else if (pageNum === 1) {
        setAnime([]);
      }
    } catch (error) {
      console.error('Error searching anime:', error);
      if (pageNum === 1) {
        setAnime([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchAnime(searchQuery, filters, 1);
        setPage(1);
      } else {
        searchAnime('', filters, 1);
        setPage(1);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, filters]);

  useEffect(() => {
    if (!searchQuery.trim() && Object.keys(filters).length === 0) {
      searchAnime('', {}, 1);
      setPage(1);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchAnime(searchQuery, filters, 1);
    setPage(1);
  };

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    setLoading(true);
    try {
      const newAnime = await animeApi.searchAnime(searchQuery, filters, nextPage);
      if (newAnime && newAnime.length > 0) {
        setAnime(prev => [...prev, ...newAnime]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more anime:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key: keyof SearchFilters, value: string | number | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-effect rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-white mb-4">Каталог аниме</h1>
        <p className="text-white/80">Найдите свои любимые аниме или откройте новые тайтлы</p>
      </div>

      <div className="glass-effect rounded-2xl p-6">
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск аниме..."
                className="w-full pl-12 pr-4 py-4 bg-white/15 backdrop-blur-sm text-white placeholder-white/50 rounded-xl border border-white/25 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 font-medium"
              />
            </div>
            <button
              type="submit"
              className="btn-primary px-8 py-4"
            >
              Найти
            </button>
          </div>
        </form>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white/80">
            <Filter className="w-5 h-5" />
            <span className="font-medium">Фильтры:</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">Жанр</label>
              <select
                value={filters.genre || ''}
                onChange={(e) => updateFilter('genre', e.target.value || undefined)}
                className="w-full px-4 py-3 bg-white/15 backdrop-blur-sm text-white rounded-xl border border-white/25 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 font-medium"
              >
                <option value="" className="text-gray-700">Все жанры</option>
                {genres.map(genre => (
                  <option key={genre} value={genre} className="text-gray-700 bg-white">{translations.translateGenre(genre)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">Сезон</label>
              <select
                value={filters.season || ''}
                onChange={(e) => updateFilter('season', e.target.value || undefined)}
                className="w-full px-4 py-3 bg-white/15 backdrop-blur-sm text-white rounded-xl border border-white/25 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 font-medium"
              >
                <option value="" className="text-gray-700">Все сезоны</option>
                {seasons.map(season => (
                  <option key={season.value} value={season.value} className="text-gray-700 bg-white">{season.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">Год</label>
              <select
                value={filters.year || ''}
                onChange={(e) => updateFilter('year', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-4 py-3 bg-white/15 backdrop-blur-sm text-white rounded-xl border border-white/25 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 font-medium"
              >
                <option value="" className="text-gray-700">Все годы</option>
                {years.map(year => (
                  <option key={year} value={year} className="text-gray-700 bg-white">{year}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">Сортировка</label>
              <select
                value={filters.sortBy || ''}
                onChange={(e) => updateFilter('sortBy', e.target.value || undefined)}
                className="w-full px-4 py-3 bg-white/15 backdrop-blur-sm text-white rounded-xl border border-white/25 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 font-medium"
              >
                <option value="POPULARITY" className="text-gray-700">По популярности</option>
                <option value="SCORE" className="text-gray-700">По рейтингу</option>
                <option value="TITLE" className="text-gray-700">По названию</option>
                <option value="DATE" className="text-gray-700">По дате</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-white/80">
          Найдено: {anime.length} аниме
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all duration-300 ${
              viewMode === 'grid'
                ? 'bg-white/20 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all duration-300 ${
              viewMode === 'list'
                ? 'bg-white/20 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="glass-effect rounded-2xl p-6">
        {loading && anime.length === 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {[...Array(8)].map((_, index) => (
              <div key={index} className="anime-card animate-pulse">
                <div className="bg-gray-300 h-64 rounded-t-xl"></div>
                <div className="p-4">
                  <div className="bg-gray-300 h-4 rounded mb-2"></div>
                  <div className="bg-gray-300 h-3 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : anime.length > 0 ? (
          <>
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {anime.map((animeItem) => (
                <AnimeCard key={animeItem.id} anime={animeItem} />
              ))}
            </div>

            <div className="text-center mt-8">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="btn-secondary"
              >
                {loading ? 'Загрузка...' : 'Загрузить еще'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-white/60 text-lg mb-4">
              {searchQuery ? 'По вашему запросу ничего не найдено' : 'Начните поиск аниме'}
            </div>
            <p className="text-white/40">
              Попробуйте изменить параметры поиска или фильтры
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog; 