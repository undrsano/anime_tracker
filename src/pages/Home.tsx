import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Play, Clock, CheckCircle, Heart, RotateCcw, Sparkles } from 'lucide-react';
import { useAnime } from '../context/AnimeContext';
import { animeApi } from '../services/animeApi';
import { Anime } from '../types';
import AnimeCard from '../components/AnimeCard';

const Home: React.FC = () => {
  const { state } = useAnime();
  const [popularAnime, setPopularAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPopularAnime = async () => {
      try {
        setLoading(true);
        const anime = await animeApi.getPopularAnime();
        if (anime && anime.length > 0) {
          setPopularAnime(anime);
        } else {
          console.warn('No popular anime loaded');
        }
      } catch (error) {
        console.error('Error loading popular anime:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPopularAnime();
  }, []);

  const listStats = [
    {
      title: 'Смотрю',
      count: state.lists.watching.length,
      icon: Play,
      color: 'bg-blue-500',
      path: '/my-lists#watching'
    },
    {
      title: 'Запланировано',
      count: state.lists.planned.length,
      icon: Clock,
      color: 'bg-yellow-500',
      path: '/my-lists#planned'
    },
    {
      title: 'Просмотрено',
      count: state.lists.watched.length,
      icon: CheckCircle,
      color: 'bg-green-500',
      path: '/my-lists#watched'
    },
    {
      title: 'Брошено',
      count: state.lists.dropped.length,
      icon: Heart,
      color: 'bg-red-500',
      path: '/my-lists#dropped'
    },
    {
      title: 'Пересматриваю',
      count: state.lists.rewatching.length,
      icon: RotateCcw,
      color: 'bg-purple-500',
      path: '/my-lists#rewatching'
    }
  ];

  const totalAnime = Object.values(state.lists).reduce((sum, list) => sum + list.length, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center py-12">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Добро пожаловать в <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">AnimeTracker</span>
        </h1>
        <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
          Отслеживайте свои любимые аниме, открывайте новые тайтлы и делитесь своими впечатлениями
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/catalog" className="btn-primary">
            Найти аниме
          </Link>
          <Link to="/my-lists" className="btn-secondary">
            Мои списки
          </Link>
        </div>
      </div>

      <div className="glass-effect rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2" />
          Статистика
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {listStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.title}
                to={stat.path}
                className="glass-effect rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-300"
              >
                <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.count}</div>
                <div className="text-white/80 text-sm">{stat.title}</div>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <div className="text-3xl font-bold text-white mb-2">{totalAnime}</div>
          <div className="text-white/80">Всего аниме в списках</div>
        </div>
      </div>

      <div className="glass-effect rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Популярные аниме</h2>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {popularAnime.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link to="/catalog" className="btn-primary">
            Смотреть больше
          </Link>
        </div>
      </div>

      <div className="glass-effect rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Быстрые действия</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/catalog"
            className="glass-effect rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 group"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Play className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Найти аниме</h3>
            <p className="text-white/80">Откройте для себя новые тайтлы в нашем каталоге</p>
          </Link>

          <Link
            to="/my-lists"
            className="glass-effect rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 group"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Мои списки</h3>
            <p className="text-white/80">Управляйте своими списками аниме</p>
          </Link>

          <Link
            to="/recommendations"
            className="glass-effect rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 group"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Рекомендации</h3>
            <p className="text-white/80">Персонализированные рекомендации на основе ваших предпочтений</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home; 