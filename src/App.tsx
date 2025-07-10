import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimeProvider } from './context/AnimeContext';
import Header from './components/Header';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import MyLists from './pages/MyLists';
import AnimeDetail from './pages/AnimeDetail';
import Recommendations from './pages/Recommendations';
import './index.css';

function App() {
  return (
    <AnimeProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/my-lists" element={<MyLists />} />
                      <Route path="/anime/:id" element={<AnimeDetail />} />
        <Route path="/recommendations" element={<Recommendations />} />
      </Routes>
          </main>
        </div>
      </Router>
    </AnimeProvider>
  );
}

export default App; 