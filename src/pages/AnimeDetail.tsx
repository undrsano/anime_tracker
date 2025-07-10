import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Play, Clock, CheckCircle, Heart, RotateCcw, Plus, Minus, Sparkles } from 'lucide-react';
import { animeApi } from '../services/animeApi';
import { useAnime } from '../context/AnimeContext';
import { recommendationsService } from '../services/recommendations';
import { translations } from '../services/translations';
import { Anime, AnimeStatus } from '../types';

const AnimeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addAnime, getAnimeFromList, removeAnime, state } = useAnime();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [similarAnime, setSimilarAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddMenu, setShowAddMenu] = useState(false);

  useEffect(() => {
    const loadAnime = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const animeData = await animeApi.getAnimeById(parseInt(id));
        setAnime(animeData);
        
        if (animeData) {
          try {
            const allUserAnime = [
              ...state.lists.watched,
              ...state.lists.watching,
              ...state.lists.planned,
              ...state.lists.dropped,
              ...state.lists.rewatching
            ];
            const similar = await recommendationsService.getSimilarAnime(animeData.id, allUserAnime);
            if (similar && similar.length > 0) {
              setSimilarAnime(similar);
            }
          } catch (error) {
            console.error('Error loading similar anime:', error);
          }
        }
      } catch (error) {
        console.error('Error loading anime:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnime();
  }, [id, state.lists]);

  const userAnime = anime ? getAnimeFromList(anime.id) : null;

  const handleAddToList = (status: AnimeStatus) => {
    if (anime) {
      addAnime(anime, status);
      setShowAddMenu(false);
    }
  };

  const handleRemoveFromList = () => {
    if (userAnime && anime) {
      removeAnime(anime.id, userAnime.status);
    }
  };

  const statusOptions = [
    { value: 'WATCHING' as AnimeStatus, label: 'Смотрю', icon: Play, color: 'bg-blue-500' },
    { value: 'PLANNED' as AnimeStatus, label: 'Запланировано', icon: Clock, color: 'bg-yellow-500' },
    { value: 'WATCHED' as AnimeStatus, label: 'Просмотрено', icon: CheckCircle, color: 'bg-green-500' },
    { value: 'DROPPED' as AnimeStatus, label: 'Брошено', icon: Heart, color: 'bg-red-500' },
    { value: 'REWATCHING' as AnimeStatus, label: 'Пересматриваю', icon: RotateCcw, color: 'bg-purple-500' },
  ];

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="glass-effect rounded-2xl p-6 mb-6">
          <div className="animate-pulse">
            <div className="bg-gray-300 h-8 rounded mb-4"></div>
            <div className="bg-gray-300 h-4 rounded w-1/2"></div>
          </div>
        </div>
        <div className="glass-effect rounded-2xl p-6">
          <div className="animate-pulse">
            <div className="bg-gray-300 h-64 rounded mb-4"></div>
            <div className="bg-gray-300 h-4 rounded mb-2"></div>
            <div className="bg-gray-300 h-4 rounded mb-2"></div>
            <div className="bg-gray-300 h-4 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="text-center py-12">
        <div className="text-white/60 text-lg mb-4">Аниме не найдено</div>
        <Link to="/catalog" className="btn-primary">
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Link to="/catalog" className="btn-secondary inline-flex items-center space-x-2">
          <ArrowLeft className="w-5 h-5" />
          <span>Назад к каталогу</span>
        </Link>
      </div>

      <div className="glass-effect rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <img
              src={anime.coverImage.large}
              alt={anime.title.romaji}
              className="w-full rounded-xl shadow-lg"
            />
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {anime.title.romaji}
              </h1>
              {anime.title.english && anime.title.english !== anime.title.romaji && (
                <p className="text-white/80 text-lg mb-4">{anime.title.english}</p>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                <span className="text-white font-semibold text-lg">
                  {anime.averageScore ? (anime.averageScore / 10).toFixed(1) : 'N/A'}
                </span>
              </div>
              <span className="text-white/60">•</span>
              <span className="text-white/80">{anime.episodes || '?'} эпизодов</span>
              <span className="text-white/60">•</span>
              <span className="text-white/80">{anime.duration || '?'} мин</span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-white/60">Статус:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                anime.status === 'FINISHED' ? 'bg-green-500/20 text-green-400' :
                anime.status === 'RELEASING' ? 'bg-blue-500/20 text-blue-400' :
                anime.status === 'NOT_YET_RELEASED' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {translations.translateStatus(anime.status)}
              </span>
            </div>

            {anime.genres && anime.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {anime.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                  >
                    {translations.translateGenre(genre)}
                  </span>
                ))}
              </div>
            )}

            {anime.studios.nodes && anime.studios.nodes.length > 0 && (
              <div>
                <span className="text-white/60 text-sm">Студия: </span>
                <span className="text-white/80 text-sm">
                  {anime.studios.nodes.map(studio => studio.name).join(', ')}
                </span>
              </div>
            )}

            <div className="flex flex-wrap gap-4 pt-4">
              {userAnime ? (
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-2 rounded-lg text-white font-medium ${
                    statusOptions.find(opt => opt.value === userAnime.status)?.color || 'bg-gray-500'
                  }`}>
                    {statusOptions.find(opt => opt.value === userAnime.status)?.label}
                  </span>
                  <button
                    onClick={handleRemoveFromList}
                    className="btn-secondary inline-flex items-center space-x-2"
                  >
                    <Minus className="w-4 h-4" />
                    <span>Удалить из списка</span>
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setShowAddMenu(!showAddMenu)}
                    className="btn-primary inline-flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Добавить в список</span>
                  </button>

                  {showAddMenu && (
                    <div className="absolute top-full left-0 mt-2 z-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 min-w-[200px]">
                      <div className="p-2">
                        <p className="text-gray-600 text-sm font-medium mb-2 px-2">Добавить в список:</p>
                        {statusOptions.map((option) => {
                          const Icon = option.icon;
                          return (
                            <button
                              key={option.value}
                              onClick={() => handleAddToList(option.value)}
                              className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                            >
                              <div className={`w-3 h-3 rounded-full ${option.color}`}></div>
                              <Icon className="w-4 h-4" />
                              <span className="text-sm">{option.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-effect rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Описание</h2>
        <div className="text-white/80 leading-relaxed">
          {anime.description ? (
            <div dangerouslySetInnerHTML={{ __html: anime.description }} />
          ) : (
            <p>Описание недоступно</p>
          )}
        </div>
      </div>

      <div className="glass-effect rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Дополнительная информация</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Детали</h3>
            <div className="space-y-2 text-white/80">
              <div className="flex justify-between">
                <span>Эпизоды:</span>
                <span>{anime.episodes || 'Неизвестно'}</span>
              </div>
              <div className="flex justify-between">
                <span>Длительность:</span>
                <span>{anime.duration ? `${anime.duration} мин` : 'Неизвестно'}</span>
              </div>
              <div className="flex justify-between">
                <span>Сезон:</span>
                <span>
                  {anime.season ? 
                    `${translations.translateSeason(anime.season)} ${anime.seasonYear}` 
                    : 'Неизвестно'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Популярность:</span>
                <span>{anime.popularity ? `#${anime.popularity}` : 'Неизвестно'}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Рейтинги</h3>
            <div className="space-y-2 text-white/80">
              <div className="flex justify-between">
                <span>Средний рейтинг:</span>
                <span>{anime.averageScore ? (anime.averageScore / 10).toFixed(1) : 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Средний балл:</span>
                <span>{anime.meanScore ? (anime.meanScore / 10).toFixed(1) : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {similarAnime.length > 0 && (
        <div className="glass-effect rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-purple-400" />
            Похожие аниме
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {similarAnime.map((similarAnimeItem) => (
              <div key={similarAnimeItem.id} className="relative group">
                <div className="anime-card">
                  <div className="relative">
                    <img
                      src={similarAnimeItem.coverImage.large}
                      alt={similarAnimeItem.title.romaji}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3 className="text-white font-semibold text-sm line-clamp-2">
                          {similarAnimeItem.title.romaji}
                        </h3>
                        <div className="flex items-center justify-between text-white/90 text-xs mt-1">
                          <span>{similarAnimeItem.episodes || '?'} эп.</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{similarAnimeItem.averageScore ? (similarAnimeItem.averageScore / 10).toFixed(1) : 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-b from-gray-900 to-gray-800">
                    <Link to={`/anime/${similarAnimeItem.id}`} className="block">
                      <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors duration-300 text-sm">
                        {similarAnimeItem.title.romaji}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between text-xs text-gray-300">
                      <span>{similarAnimeItem.episodes || '?'} эп.</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{similarAnimeItem.averageScore ? (similarAnimeItem.averageScore / 10).toFixed(1) : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimeDetail; 