import React, { useState } from 'react';
import { BLOG_CATEGORIES, BLOG_ARTICLES, DOCS_SECTIONS } from '../../data/blogData';
import ArticleCard from './ArticleCard';
import ArticleDetail from './ArticleDetail';
import DocsSection from './DocsSection';
import SyntaxPlayground from './SyntaxPlayground';
import { 
  BookOpen, 
  Search, 
  ArrowLeft, 
  Sparkles, 
  Cpu, 
  Terminal, 
  Printer, 
  Target, 
  Eye, 
  FileCode, 
  Zap, 
  Users, 
  Sliders,
  Book,
  Tag
} from '../Icons';

export default function TechBlogView({ onBackToApp }) {
  const [activeTabMode, setActiveTabMode] = useState('blog'); // 'blog' | 'docs' | 'playground'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDocId, setSelectedDocId] = useState('architecture');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Icon mapping helper
  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen size={16} />;
      case 'Eye': return <Eye size={16} />;
      case 'FileCode': return <FileCode size={16} />;
      case 'Zap': return <Zap size={16} />;
      case 'Users': return <Users size={16} />;
      case 'Sliders': return <Sliders size={16} />;
      case 'Cpu': return <Cpu size={16} />;
      case 'Terminal': return <Terminal size={16} />;
      case 'Printer': return <Printer size={16} />;
      case 'Target': return <Target size={16} />;
      default: return <Book size={16} />;
    }
  };

  // Filter articles based on active category & search query
  const filteredArticles = BLOG_ARTICLES.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || 
      article.title.toLowerCase().includes(q) ||
      article.summary.toLowerCase().includes(q) ||
      article.tags.some(t => t.toLowerCase().includes(q));

    return matchesCategory && matchesQuery;
  });

  return (
    <div className="tech-blog-view-container">
      {/* Top Blog Navigation Header */}
      <header className="blog-top-bar glass-panel">
        <div className="blog-brand">
          <button className="back-to-app-btn" onClick={onBackToApp} title="Revenire la CV Studio">
            <ArrowLeft size={16} />
            <span>Înapoi la CV Studio</span>
          </button>
          <div className="brand-divider"></div>
          <div className="blog-title-box">
            <BookOpen size={20} style={{ color: '#60a5fa' }} />
            <span className="blog-main-heading">CVBuilder Tech Blog & Docs</span>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="blog-search-box">
          <Search size={15} style={{ color: '#9ca3af' }} />
          <input 
            type="text" 
            placeholder="Căutare articole, sintaxă, documentație..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>×</button>
          )}
        </div>
      </header>

      {/* Main Blog Workspace with Left Sidebar & Content Panel */}
      <div className="blog-workspace">
        {/* Left Sidebar */}
        <aside className="blog-sidebar glass-panel">
          {/* Section: Blog Categories */}
          <div className="sidebar-group">
            <div className="sidebar-group-title">
              <BookOpen size={14} />
              <span>Categorii Articole</span>
            </div>

            <div className="sidebar-menu">
              {BLOG_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  className={`sidebar-menu-btn ${activeTabMode === 'blog' && selectedCategory === cat.id && !selectedArticle ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTabMode('blog');
                    setSelectedCategory(cat.id);
                    setSelectedArticle(null);
                  }}
                >
                  <span className="menu-btn-icon">{renderIcon(cat.icon)}</span>
                  <span className="menu-btn-label">{cat.name}</span>
                  <span className="menu-btn-count">{cat.id === 'all' ? BLOG_ARTICLES.length : BLOG_ARTICLES.filter(a => a.category === cat.id).length}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-divider"></div>

          {/* Section: Documentation & Syntax */}
          <div className="sidebar-group">
            <div className="sidebar-group-title">
              <Terminal size={14} />
              <span>Documentație & Sintaxă</span>
            </div>

            <div className="sidebar-menu">
              {DOCS_SECTIONS.map(docItem => (
                <button
                  key={docItem.id}
                  className={`sidebar-menu-btn ${activeTabMode === 'docs' && selectedDocId === docItem.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTabMode('docs');
                    setSelectedDocId(docItem.id);
                    setSelectedArticle(null);
                  }}
                >
                  <span className="menu-btn-icon">{renderIcon(docItem.icon)}</span>
                  <span className="menu-btn-label">{docItem.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-divider"></div>

          {/* Section: Interactive Playground Direct Link */}
          <div className="sidebar-group">
            <button 
              className={`sidebar-menu-btn playground-highlight-btn ${activeTabMode === 'playground' ? 'active' : ''}`}
              onClick={() => {
                setActiveTabMode('playground');
                setSelectedArticle(null);
              }}
            >
              <span className="menu-btn-icon"><Sparkles size={16} style={{ color: '#c084fc' }} /></span>
              <span className="menu-btn-label">Code Editor Playground</span>
            </button>
          </div>
        </aside>

        {/* Right Main Content Area */}
        <main className="blog-main-content">
          {/* Render Full Article Reader */}
          {selectedArticle ? (
            <ArticleDetail 
              article={selectedArticle} 
              onBack={() => setSelectedArticle(null)} 
            />
          ) : activeTabMode === 'docs' ? (
            /* Render Documentation Section */
            <DocsSection selectedDocId={selectedDocId} />
          ) : activeTabMode === 'playground' ? (
            /* Render Interactive Playground */
            <SyntaxPlayground />
          ) : (
            /* Render Articles Grid List */
            <div className="articles-grid-container">
              <div className="articles-grid-header">
                <div className="grid-title-info">
                  <h2>
                    {selectedCategory === 'all' 
                      ? 'Toate Articolele Tehnic' 
                      : BLOG_CATEGORIES.find(c => c.id === selectedCategory)?.name}
                  </h2>
                  <span className="articles-count-badge">
                    {filteredArticles.length} {filteredArticles.length === 1 ? 'articol' : 'articole'}
                  </span>
                </div>

                {searchQuery && (
                  <div className="search-status">
                    Rezultate pentru: <strong>"{searchQuery}"</strong>
                  </div>
                )}
              </div>

              {filteredArticles.length > 0 ? (
                <div className="articles-cards-grid">
                  {filteredArticles.map(article => (
                    <ArticleCard 
                      key={article.id} 
                      article={article} 
                      onSelectArticle={(art) => setSelectedArticle(art)} 
                    />
                  ))}
                </div>
              ) : (
                <div className="no-articles-box glass-panel">
                  <BookOpen size={36} style={{ color: '#6b7280', marginBottom: '12px' }} />
                  <h3>Nu s-au găsit articole pentru această căutare</h3>
                  <p>Încearcă să selectezi altă categorie sau să ștergi filtrul de căutare.</p>
                  <button className="action-btn-primary" onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}>
                    Resetează Filtrele
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
