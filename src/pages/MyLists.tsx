import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Play, Clock, CheckCircle, Heart, RotateCcw, Trash2, Edit3, Star } from 'lucide-react';
import { useAnime } from '../context/AnimeContext';
import { AnimeStatus, UserAnime } from '../types';
import AnimeCard from '../components/AnimeCard';

const MyLists: React.FC = () => {
  const { state, removeAnime, updateAnime } = useAnime();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<AnimeStatus>('WATCHING');
  const [editingAnime, setEditingAnime] = useState<UserAnime | null>(null);

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash && ['watching', 'planned', 'watched', 'dropped', 'rewatching'].includes(hash)) {
      setActiveTab(hash.toUpperCase() as AnimeStatus);
    }
  }, [location]);

  const tabs = [
    { 
      status: 'WATCHING' as AnimeStatus, 
      label: 'Смотрю', 
      icon: Play, 
      color: 'bg-blue-500',
      count: state.lists.watching.length
    },
    { 
      status: 'PLANNED' as AnimeStatus, 
      label: 'Запланировано', 
      icon: Clock, 
      color: 'bg-yellow-500',
      count: state.lists.planned.length
    },
    { 
      status: 'WATCHED' as AnimeStatus, 
      label: 'Просмотрено', 
      icon: CheckCircle, 
      color: 'bg-green-500',
      count: state.lists.watched.length
    },
    { 
      status: 'DROPPED' as AnimeStatus, 
      label: 'Брошено', 
      icon: Heart, 
      color: 'bg-red-500',
      count: state.lists.dropped.length
    },
    { 
      status: 'REWATCHING' as AnimeStatus, 
      label: 'Пересматриваю', 
      icon: RotateCcw, 
      color: 'bg-purple-500',
      count: state.lists.rewatching.length
    }
  ];

  const getCurrentList = () => {
    switch (activeTab) {
      case 'WATCHING': return state.lists.watching;
      case 'PLANNED': return state.lists.planned;
      case 'WATCHED': return state.lists.watched;
      case 'DROPPED': return state.lists.dropped;
      case 'REWATCHING': return state.lists.rewatching;
      default: return [];
    }
  };

  const handleRemoveAnime = (animeId: number) => {
    removeAnime(animeId, activeTab);
  };

  const handleUpdateAnime = (animeId: number, updates: Partial<UserAnime>) => {
    updateAnime(animeId, activeTab, updates);
    setEditingAnime(null);
  };

  const currentList = getCurrentList();
  const totalAnime = Object.values(state.lists).reduce((sum, list) => sum + list.length, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-effect rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-white mb-4">Мои списки</h1>
        <p className="text-white/80 mb-4">
          Управляйте своими списками аниме и отслеживайте прогресс просмотра
        </p>
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-2">{totalAnime}</div>
          <div className="text-white/80">Всего аниме в списках</div>
        </div>
      </div>

      <div className="glass-effect rounded-2xl p-6">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.status}
                onClick={() => setActiveTab(tab.status)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-300 ${
                  activeTab === tab.status
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  activeTab === tab.status ? 'bg-white/20' : 'bg-white/10'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="glass-effect rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {tabs.find(tab => tab.status === activeTab)?.label} ({currentList.length})
          </h2>
        </div>

        {currentList.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-white/60 text-lg mb-4">
              В этом списке пока нет аниме
            </div>
            <p className="text-white/40">
              Добавьте аниме из каталога, чтобы начать отслеживать
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentList.map((userAnime) => (
              <div key={userAnime.anime.id} className="relative group">
                <AnimeCard anime={userAnime.anime} showAddButton={false} />
                
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingAnime(userAnime)}
                      className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all duration-300"
                      title="Редактировать"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveAnime(userAnime.anime.id)}
                      className="bg-red-500/80 backdrop-blur-sm text-white p-2 rounded-full hover:bg-red-500 transition-all duration-300"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {userAnime.progress > 0 && (
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="bg-black/50 backdrop-blur-sm rounded-full p-2">
                      <div className="flex items-center justify-between text-white text-xs mb-1">
                        <span>Прогресс</span>
                        <span>{userAnime.progress}/{userAnime.anime.episodes || '?'}</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${userAnime.anime.episodes ? (userAnime.progress / userAnime.anime.episodes) * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {userAnime.rating && (
                  <div className="absolute top-2 left-2">
                    <div className="bg-yellow-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{userAnime.rating}/10</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {editingAnime && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-effect rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">
              Редактировать: {editingAnime.anime.title.romaji}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm mb-2">Прогресс (эпизоды)</label>
                <input
                  type="number"
                  min="0"
                  max={editingAnime.anime.episodes || 999}
                  value={editingAnime.progress}
                  onChange={(e) => setEditingAnime({
                    ...editingAnime,
                    progress: parseInt(e.target.value) || 0
                  })}
                  className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">Рейтинг (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={editingAnime.rating || ''}
                  onChange={(e) => setEditingAnime({
                    ...editingAnime,
                    rating: parseInt(e.target.value) || undefined
                  })}
                  className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">Заметки</label>
                <textarea
                  value={editingAnime.notes || ''}
                  onChange={(e) => setEditingAnime({
                    ...editingAnime,
                    notes: e.target.value
                  })}
                  rows={3}
                  className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Ваши мысли об аниме..."
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => handleUpdateAnime(editingAnime.anime.id, {
                  progress: editingAnime.progress,
                  rating: editingAnime.rating,
                  notes: editingAnime.notes
                })}
                className="btn-primary flex-1"
              >
                Сохранить
              </button>
              <button
                onClick={() => setEditingAnime(null)}
                className="btn-secondary flex-1"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLists; 