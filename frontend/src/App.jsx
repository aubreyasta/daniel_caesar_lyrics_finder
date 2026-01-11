import React, { useState, useEffect, useCallback } from 'react';
import { Search, Music, Disc3, Loader2 } from 'lucide-react';
import Footer from './components/Footer.jsx';

export default function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState('all');
  const [error, setError] = useState(null);

  // Debounce function
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Fetch from FastAPI backend
  const searchLyrics = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const BACKEND_URL = import.meta.env.PROD
        ? 'https://daniel-caesar-lyrics-api.onrender.com'
        : 'http://localhost:8000';

      const response = await fetch(`${BACKEND_URL}/search?query=${encodeURIComponent(searchQuery)}`);

      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      console.error('Search error:', err);
      setError('Could not connect to the API. Make sure FastAPI is running on localhost:8000');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(debounce(searchLyrics, 300), []);

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  // Filter by album
  const filteredResults = selectedAlbum === 'all'
    ? results
    : results.filter(r => r.album === selectedAlbum);

  // Stats
  const uniqueSongs = new Set(filteredResults.map(r => r.title)).size;
  const totalLines = filteredResults.length;

  // Highlight matching text
  const highlightMatch = (text, searchQuery) => {
    if (!text || !searchQuery.trim()) return text;

    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark
          key={i}
          style={{
            background: 'rgba(244, 199, 199, 0.9)',
            color: '#1e1b4b',
            padding: '0 4px',
            borderRadius: '4px'
          }}
        >
          {part}
        </mark>
      ) : part
    );
  };

  const albums = ['Freudian', 'Case Study 01', 'NEVER ENOUGH'];

  return (
    <>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Cormorant+Garamond:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* Global styles */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body, #root {
          width: 100%;
          min-height: 100vh;
          margin: 0;
          padding: 0;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        input::placeholder {
          color: rgba(199, 167, 167, 0.4);
        }
        select option {
          background: #1e1b4b;
          color: white;
        }
      `}</style>

      <div
        style={{
          width: '100%',
          minHeight: '100vh',
          color: 'white',
          padding: '2rem',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
          fontFamily: "'Playfair Display', Georgia, serif",
          boxSizing: 'border-box'
        }}
      >
        <div style={{
          width: '100%',
          maxWidth: '900px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>

          {/* Header */}
          <header style={{ textAlign: 'center', marginBottom: '3rem', paddingTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <Disc3
                size={48}
                style={{ color: '#d4a5a5', opacity: 0.8, animation: 'spin 8s linear infinite' }}
              />
              <h1
                style={{
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  color: '#e2d1f9',
                  textShadow: '0 0 60px rgba(226, 209, 249, 0.3)',
                  margin: 0
                }}
              >
                DANIEL CAESAR
              </h1>
            </div>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.1rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: '#d4b8b8',
                opacity: 0.6
              }}
            >
              Lyrics Search
            </p>
          </header>

          {/* Search Bar */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
              <input
                type="text"
                placeholder="Search lyrics..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1.25rem 3.5rem 1.25rem 1.5rem',
                  borderRadius: '1rem',
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(199, 167, 167, 0.2)',
                  color: 'white',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.1rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)' }}>
                {isLoading ? (
                  <Loader2 size={24} style={{ color: '#d4a5a5', animation: 'spin 1s linear infinite' }} />
                ) : (
                  <Search size={24} style={{ color: '#d4a5a5', opacity: 0.6 }} />
                )}
              </div>
            </div>

            {/* Album Filter */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", color: '#d4b8b8', opacity: 0.6, fontSize: '0.9rem' }}>
                Filter:
              </span>
              <select
                value={selectedAlbum}
                onChange={(e) => setSelectedAlbum(e.target.value)}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '0.75rem',
                  background: 'rgba(99, 102, 241, 0.2)',
                  border: '1px solid rgba(199, 167, 167, 0.2)',
                  color: 'white',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="all">All Albums</option>
                {albums.map(album => (
                  <option key={album} value={album}>{album}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              marginBottom: '2rem',
              padding: '1rem',
              background: 'rgba(220, 38, 38, 0.2)',
              border: '1px solid rgba(220, 38, 38, 0.4)',
              borderRadius: '1rem',
              textAlign: 'center',
              color: '#fca5a5',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          {/* Results Count */}
          {query && !error && (
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              {isLoading ? (
                <p style={{ fontFamily: "'Cormorant Garamond', serif", color: '#c7a7a7' }}>
                  Searching...
                </p>
              ) : (
                <p style={{ fontFamily: "'Cormorant Garamond', serif", color: '#c7a7a7' }}>
                  Found in{' '}
                  <span style={{ fontWeight: 600, color: '#f4c7c7' }}>
                    {uniqueSongs} {uniqueSongs === 1 ? 'song' : 'songs'}
                  </span>
                  {' · '}
                  <span style={{ fontWeight: 600, color: '#f4c7c7' }}>
                    {totalLines} {totalLines === 1 ? 'line' : 'lines'}
                  </span>
                </p>
              )}
            </div>
          )}

          {/* Empty State */}
          {!query && (
            <div style={{ textAlign: 'center', padding: '6rem 0' }}>
              <Music size={80} style={{ color: '#d4b8b8', opacity: 0.2, margin: '0 auto 1.5rem', display: 'block' }} />
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', color: '#d4b8b8', opacity: 0.4 }}>
                Start typing to search lyrics...
              </p>
            </div>
          )}

          {/* No Results */}
          {query && !isLoading && !error && filteredResults.length === 0 && (
            <div style={{ textAlign: 'center', padding: '6rem 0' }}>
              <p style={{ fontSize: '1.25rem', color: '#d4b8b8', opacity: 0.6 }}>
                No results found for "{query}"
              </p>
              <p style={{ fontSize: '0.9rem', color: '#d4b8b8', opacity: 0.4, marginTop: '0.75rem' }}>
                Try a different search term
              </p>
            </div>
          )}

          {/* Loading State - Skeleton Cards */}
          {isLoading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)',
                    border: '1px solid rgba(199, 167, 167, 0.15)',
                    borderRadius: '1rem',
                    padding: '1.75rem',
                    animation: 'pulse 1.5s ease-in-out infinite'
                  }}
                >
                  {/* Skeleton Song Info */}
                  <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(199, 167, 167, 0.15)' }}>
                    <div style={{ height: '1.5rem', width: '40%', background: 'rgba(199, 167, 167, 0.15)', borderRadius: '0.5rem', marginBottom: '0.5rem' }} />
                    <div style={{ height: '0.85rem', width: '25%', background: 'rgba(199, 167, 167, 0.1)', borderRadius: '0.25rem' }} />
                  </div>
                  {/* Skeleton Lyrics */}
                  <div>
                    <div style={{ height: '1rem', width: '60%', background: 'rgba(199, 167, 167, 0.08)', borderRadius: '0.25rem', marginBottom: '0.75rem' }} />
                    <div style={{ height: '2.5rem', width: '100%', background: 'rgba(199, 167, 167, 0.12)', borderRadius: '0.5rem', marginBottom: '0.75rem', borderLeft: '3px solid rgba(212, 165, 165, 0.3)' }} />
                    <div style={{ height: '1rem', width: '55%', background: 'rgba(199, 167, 167, 0.08)', borderRadius: '0.25rem' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {!isLoading && filteredResults.map((result, idx) => (
              <article
                key={idx}
                style={{
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)',
                  border: '1px solid rgba(199, 167, 167, 0.15)',
                  borderRadius: '1rem',
                  padding: '1.75rem',
                  transition: 'transform 0.3s ease'
                }}
              >
                {/* Song Info */}
                <div style={{
                  marginBottom: '1.25rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid rgba(199, 167, 167, 0.15)'
                }}>
                  <h3 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.5rem',
                    fontWeight: 500,
                    color: '#f0e6fa',
                    margin: '0 0 0.25rem 0'
                  }}>
                    {result.title}
                  </h3>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '0.85rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: '#d4b8b8',
                    opacity: 0.5,
                    margin: 0
                  }}>
                    {result.album}
                  </p>
                </div>

                {/* Lyrics with Context */}
                <div style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {/* Before line */}
                  {result.before && (
                    <p style={{ color: '#c7a7a7', opacity: 0.4, fontStyle: 'italic', margin: '0 0 0.75rem 0', fontSize: '1rem' }}>
                      {result.before}
                    </p>
                  )}

                  {/* Matching line */}
                  <p style={{
                    color: '#f8f0ff',
                    background: 'rgba(199, 167, 167, 0.1)',
                    borderLeft: '3px solid #d4a5a5',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    margin: '0 0 0.75rem 0',
                    fontSize: '1.1rem',
                    lineHeight: 1.6
                  }}>
                    {highlightMatch(result.match, query)}
                  </p>

                  {/* After line */}
                  {result.after && (
                    <p style={{ color: '#c7a7a7', opacity: 0.4, fontStyle: 'italic', margin: 0, fontSize: '1rem' }}>
                      {result.after}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>

          {/* Results Footer */}
          {/* Results footer */}
          {query && filteredResults.length > 0 && (
            <div style={{
              marginTop: '3rem',
              marginBottom: '2rem', /* Add gap before footer */
              textAlign: 'center',
              padding: '1.5rem',
              background: 'rgba(99, 102, 241, 0.08)',
              borderRadius: '1rem',
              border: '1px solid rgba(199, 167, 167, 0.1)'
            }}>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1rem',
                color: '#e2d1f9',
                opacity: 0.7,
                margin: 0
              }}>
                Showing all matches for <span style={{ fontWeight: 600, color: '#f4c7c7' }}>"{query}"</span>
              </p>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}