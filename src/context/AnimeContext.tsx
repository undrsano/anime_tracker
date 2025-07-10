import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AnimeList, UserAnime, AnimeStatus, Anime } from '../types';
import { translations } from '../services/translations';

interface AnimeState {
  lists: AnimeList;
  loading: boolean;
  error: string | null;
}

type AnimeAction =
  | { type: 'ADD_ANIME'; payload: { anime: Anime; status: AnimeStatus } }
  | { type: 'REMOVE_ANIME'; payload: { animeId: number; status: AnimeStatus } }
  | { type: 'UPDATE_ANIME'; payload: { animeId: number; status: AnimeStatus; updates: Partial<UserAnime> } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_LISTS'; payload: AnimeList };

const initialState: AnimeState = {
  lists: {
    watched: [],
    watching: [],
    planned: [],
    dropped: [],
    rewatching: []
  },
  loading: false,
  error: null
};

const animeReducer = (state: AnimeState, action: AnimeAction): AnimeState => {
  switch (action.type) {
    case 'ADD_ANIME': {
      const { anime, status } = action.payload;
      const userAnime: UserAnime = {
        anime,
        status,
        progress: 0,
        addedAt: new Date()
      };

      const newLists = { ...state.lists };
      newLists[status.toLowerCase() as keyof AnimeList] = [
        ...newLists[status.toLowerCase() as keyof AnimeList],
        userAnime
      ];

      localStorage.setItem('animeLists', JSON.stringify(newLists));

      return {
        ...state,
        lists: newLists
      };
    }

    case 'REMOVE_ANIME': {
      const { animeId, status } = action.payload;
      const newLists = { ...state.lists };
      const listKey = status.toLowerCase() as keyof AnimeList;
      
      newLists[listKey] = newLists[listKey].filter(
        item => item.anime.id !== animeId
      );

      localStorage.setItem('animeLists', JSON.stringify(newLists));

      return {
        ...state,
        lists: newLists
      };
    }

    case 'UPDATE_ANIME': {
      const { animeId, status, updates } = action.payload;
      const newLists = { ...state.lists };
      const listKey = status.toLowerCase() as keyof AnimeList;
      
      newLists[listKey] = newLists[listKey].map(item =>
        item.anime.id === animeId
          ? { ...item, ...updates }
          : item
      );

      localStorage.setItem('animeLists', JSON.stringify(newLists));

      return {
        ...state,
        lists: newLists
      };
    }

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };

    case 'LOAD_LISTS':
      return {
        ...state,
        lists: action.payload
      };

    default:
      return state;
  }
};

interface AnimeContextType {
  state: AnimeState;
  addAnime: (anime: Anime, status: AnimeStatus) => void;
  removeAnime: (animeId: number, status: AnimeStatus) => void;
  updateAnime: (animeId: number, status: AnimeStatus, updates: Partial<UserAnime>) => void;
  getAnimeFromList: (animeId: number) => UserAnime | null;
}

const AnimeContext = createContext<AnimeContextType | undefined>(undefined);

export const AnimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(animeReducer, initialState);

  useEffect(() => {
    const savedLists = localStorage.getItem('animeLists');
    if (savedLists) {
      try {
        const parsedLists = JSON.parse(savedLists);
        dispatch({ type: 'LOAD_LISTS', payload: parsedLists });
      } catch (error) {
        console.error('Error loading anime lists:', error);
      }
    }
  }, []);

  const addAnime = (anime: Anime, status: AnimeStatus) => {
    dispatch({ type: 'ADD_ANIME', payload: { anime, status } });
  };

  const removeAnime = (animeId: number, status: AnimeStatus) => {
    dispatch({ type: 'REMOVE_ANIME', payload: { animeId, status } });
  };

  const updateAnime = (animeId: number, status: AnimeStatus, updates: Partial<UserAnime>) => {
    dispatch({ type: 'UPDATE_ANIME', payload: { animeId, status, updates } });
  };

  const getAnimeFromList = (animeId: number): UserAnime | null => {
    for (const listKey of Object.keys(state.lists)) {
      const list = state.lists[listKey as keyof AnimeList];
      const found = list.find(item => item.anime.id === animeId);
      if (found) return found;
    }
    return null;
  };

  const value: AnimeContextType = {
    state,
    addAnime,
    removeAnime,
    updateAnime,
    getAnimeFromList
  };

  return (
    <AnimeContext.Provider value={value}>
      {children}
    </AnimeContext.Provider>
  );
};

export const useAnime = (): AnimeContextType => {
  const context = useContext(AnimeContext);
  if (context === undefined) {
    throw new Error('useAnime must be used within an AnimeProvider');
  }
  return context;
}; 