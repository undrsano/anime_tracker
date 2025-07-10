import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Heart, Eye } from 'lucide-react';
import { useAnime } from '../context/AnimeContext';
import { recommendationsService } from '../services/recommendations';
import { Anime } from '../types';
import AnimeCard from '../components/AnimeCard';

const Recommendations: React.FC = () => {
  const { state } = useAnime();
  const [recommendations, setRecommendations] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'personal' | 'popular' | 'trending'>('personal');

  useEffect(() => {
    loadRecommendations();
  }, [state.lists, activeTab]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const allUserAnime = [
        ...state.lists.watched,
        ...state.lists.watching,
        ...state.lists.planned,
        ...state.lists.dropped,
        ...state.lists.rewatching
      ];

      let recs: Anime[] = [];
      
      switch (activeTab) {
        case 'personal':
          recs = await recommendationsService.getPersonalRecommendations(allUserAnime);
          break;
        case 'popular':
          recs = await recommendationsService.getPopularRecommendations();
          break;
        case 'trending':
          recs = await recommendationsService.getTrendingRecommendations();
          break;
        default:
          recs = await recommendationsService.getPersonalRecommendations(allUserAnime);
      }
      
      setRecommendations(recs);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationReason = (anime: Anime) => {
    const userGenres = recommendationsService.extractUserGenres([
      ...state.lists.watched,
      ...state.lists.watching
    ]);

    const commonGenres = anime.genres?.filter(genre => 
      userGenres.includes(genre)
    ) || [];

    if (commonGenres.length > 0) {
      return `Похоже на ваши любимые жанры: ${commonGenres.slice(0, 2).join(', ')}`;
    }

    return 'Популярное аниме, которое может вам понравиться';
  };

  const tabs = [
    {
      id: 'personal' as const,
      label: 'Персональные',
      icon: Sparkles,
      description: 'Основано на ваших предпочтениях'
    },
    {
      id: 'popular' as const,
      label: 'Популярные',
      icon: TrendingUp,
      description: 'Самые популярные аниме'
    },
    {
      id: 'trending' as const,
      label: 'Тренды',
      icon: Heart,
      description: 'Что сейчас в тренде'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-effect rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-white mb-4 flex items-center">
          <Sparkles className="w-8 h-8 mr-3 text-purple-400" />
          Рекомендации
        </h1>
        <p className="text-white/80">
          Откройте для себя новые аниме, подобранные специально для вас
        </p>
      </div>

      <div className="glass-effect rounded-2xl p-6">
        <div className="flex flex-wrap gap-2 mb-6">
                      {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setRecommendations([]);
                  }}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="anime-card animate-pulse">
                <div className="bg-gray-700 h-64 rounded-t-2xl"></div>
                <div className="p-5 bg-gray-800">
                  <div className="bg-gray-700 h-4 rounded mb-2"></div>
                  <div className="bg-gray-700 h-3 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : recommendations.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendations.map((anime) => (
                <div key={anime.id} className="relative group">
                  <AnimeCard anime={anime} />
                  <div className="absolute -bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 text-xs text-white/90">
                      <div className="flex items-center space-x-1 mb-1">
                        <Eye className="w-3 h-3" />
                        <span className="font-medium">Рекомендация</span>
                      </div>
                      <p className="text-white/70 leading-relaxed">
                        {getRecommendationReason(anime)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <button
                onClick={loadRecommendations}
                className="btn-primary"
              >
                Обновить рекомендации
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-white/60 text-lg mb-4">
              Нет рекомендаций
            </div>
            <p className="text-white/40">
              Добавьте аниме в свои списки, чтобы получить персонализированные рекомендации
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations; 