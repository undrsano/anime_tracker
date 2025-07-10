import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Star, Play, Clock, Heart } from 'lucide-react';
import { Anime, AnimeStatus } from '../types';
import { useAnime } from '../context/AnimeContext';
import { translations } from '../services/translations';

interface AnimeCardProps {
  anime: Anime;
  showAddButton?: boolean;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime, showAddButton = true }) => {
  const { addAnime, getAnimeFromList } = useAnime();
  const [showMenu, setShowMenu] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const userAnime = getAnimeFromList(anime.id);
  const isInList = !!userAnime;

  const handleAddToList = async (status: AnimeStatus) => {
    setIsAdding(true);
    try {
      addAnime(anime, status);
      setShowMenu(false);
    } catch (error) {
      console.error('Error adding anime to list:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const statusOptions = [
    { value: 'WATCHING' as AnimeStatus, label: 'Смотрю', icon: Play, color: 'bg-blue-500' },
    { value: 'PLANNED' as AnimeStatus, label: 'Запланировано', icon: Clock, color: 'bg-yellow-500' },
    { value: 'WATCHED' as AnimeStatus, label: 'Просмотрено', icon: Star, color: 'bg-green-500' },
    { value: 'DROPPED' as AnimeStatus, label: 'Брошено', icon: Heart, color: 'bg-red-500' },
    { value: 'REWATCHING' as AnimeStatus, label: 'Пересматриваю', icon: Play, color: 'bg-purple-500' },
  ];

  return (
    <div className="anime-card group relative overflow-hidden">
      <div className="relative">
        <img
          src={anime.coverImage.large}
          alt={anime.title.romaji}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
              {anime.title.romaji}
            </h3>
            <div className="flex items-center justify-between text-white/90 text-sm">
              <span>{anime.episodes || '?'} эпизодов</span>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{anime.averageScore ? (anime.averageScore / 10).toFixed(1) : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {userAnime && (
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium text-white shadow-lg ${
              statusOptions.find(opt => opt.value === userAnime.status)?.color || 'bg-gray-500'
            }`}>
              {statusOptions.find(opt => opt.value === userAnime.status)?.label}
            </span>
          </div>
        )}

        {showAddButton && !isInList && (
          <div className="absolute top-3 left-3">
            <button
              onClick={() => setShowMenu(!showMenu)}
              disabled={isAdding}
              className="bg-black/40 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/60 transition-all duration-300 shadow-lg"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {showMenu && showAddButton && !isInList && (
        <div className="absolute top-12 left-3 z-10 bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 min-w-[220px]">
          <div className="p-3">
            <p className="text-white/90 text-sm font-medium mb-3 px-2">Добавить в список:</p>
            {statusOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => handleAddToList(option.value)}
                  disabled={isAdding}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 text-left text-white/90 hover:bg-white/10 rounded-lg transition-all duration-200"
                >
                  <div className={`w-3 h-3 rounded-full ${option.color}`}></div>
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="p-5 bg-gradient-to-b from-gray-900 to-gray-800">
        <Link to={`/anime/${anime.id}`} className="block">
          <h3 className="font-semibold text-white mb-3 line-clamp-2 group-hover:text-purple-400 transition-colors duration-300 text-lg">
            {anime.title.romaji}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between text-sm text-gray-300 mb-3">
          <span className="font-medium">{anime.episodes || '?'} эп.</span>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{anime.averageScore ? (anime.averageScore / 10).toFixed(1) : 'N/A'}</span>
          </div>
        </div>

        {anime.genres && anime.genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {anime.genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="px-2.5 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 text-xs rounded-full font-medium border border-purple-500/30"
              >
                {translations.translateGenre(genre)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimeCard; 