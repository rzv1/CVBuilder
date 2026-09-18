import React, { useState } from 'react';
import { BLOG_CATEGORIES, BLOG_ARTICLES, DOCS_SECTIONS, DOCS_CONTENT } from '../../data/blogData.js';
import ArticleCard from './ArticleCard.jsx';
import ArticleDetail from './ArticleDetail.jsx';
import {
  BookOpen, 
  Search, 
  ArrowLeft, 
  Cpu, 
  Terminal, 
  Printer, 
  Target, 
  Eye, 
  FileCode, 
  Zap, 
  Users, 
  Sliders,
  FileText,
  X
} from 'lucide-react';
import { Button } from '@/frontend/components/ui/button';
import { Card } from '@/frontend/components/ui/card';
import { Input } from '@/frontend/components/ui/input';
import { Badge } from '@/frontend/components/ui/badge';

export default function TechBlogView({ onBackToApp }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeDocId, setActiveDocId] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Helper for rendering icons dynamically
  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen className="size-4" />;
      case 'Eye': return <Eye className="size-4" />;
      case 'FileCode': return <FileCode className="size-4" />;
      case 'Zap': return <Zap className="size-4" />;
      case 'Users': return <Users className="size-4" />;
      case 'Sliders': return <Sliders className="size-4" />;
      case 'Cpu': return <Cpu className="size-4" />;
      case 'Terminal': return <Terminal className="size-4" />;
      case 'Printer': return <Printer className="size-4" />;
      case 'Target': return <Target className="size-4" />;
      default: return <FileText className="size-4" />;
    }
  };

  // Filter articles based on category and search query
  const filteredArticles = BLOG_ARTICLES.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || 
      article.title.toLowerCase().includes(q) ||
      (article.summary && article.summary.toLowerCase().includes(q)) ||
      (article.tags && article.tags.some(t => t.toLowerCase().includes(q)));

    return matchesCategory && matchesQuery;
  });

  const handleSelectDoc = (docItem) => {
    const docData = DOCS_CONTENT[docItem.id] || {
      title: docItem.title,
      subtitle: '',
      content: '# Documentație în curând'
    };
    const docArticle = {
      id: docItem.id,
      title: docData.title,
      categoryName: 'Documentație',
      readTime: 'Ghid Tehnic',
      author: 'Echipa CVBuilder',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Docs',
      date: 'Documentație Oficială',
      summary: docData.subtitle || '',
      tags: ['Docs', 'Arhitectură'],
      content: docData.content
    };
    setSelectedArticle(docArticle);
    setActiveDocId(docItem.id);
  };

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    setSelectedArticle(null);
    setActiveDocId(null);
  };

  return (
    <div className="w-full flex-1 h-full min-h-0 overflow-hidden bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header Navigation */}
      <header className="shrink-0 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md z-40">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBackToApp}
            className="gap-2 text-xs font-semibold hover:bg-slate-800 text-slate-300 border-slate-700"
          >
            <ArrowLeft className="size-4" />
            <span>Înapoi la CV Studio</span>
          </Button>

          <div className="h-5 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2 font-bold text-slate-100 text-sm sm:text-base">
            <BookOpen className="size-5 text-sky-400" />
            <span>CVBuilder Tech Blog & Docs</span>
          </div>
        </div>

        {/* Global Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500 pointer-events-none" />
          <Input
            type="text"
            placeholder="Căutare articole, sintaxă, docs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-8 bg-slate-950 border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus-visible:ring-sky-500 h-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-slate-400 hover:text-slate-200"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 min-h-0 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="lg:col-span-1 h-full overflow-y-auto pr-1 space-y-6">
          <Card className="bg-slate-900 border-slate-800 p-4 space-y-5 shadow-lg">
            {/* Section: Blog Categories */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
                <BookOpen className="size-3.5 text-sky-400" />
                <span>Categorii Articole</span>
              </div>
              <div className="space-y-1">
                {BLOG_CATEGORIES.map(cat => {
                  const isActive = !activeDocId && selectedCategory === cat.id && !selectedArticle;
                  const count = cat.id === 'all'
                    ? BLOG_ARTICLES.length
                    : BLOG_ARTICLES.filter(a => a.category === cat.id).length;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={isActive ? 'text-sky-400' : 'text-slate-400'}>
                          {renderIcon(cat.icon)}
                        </span>
                        <span>{cat.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-slate-950 border border-slate-800">
                        {count}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>

            <hr className="border-slate-800" />

            {/* Section: Documentation & Syntax */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
                <Terminal className="size-3.5 text-purple-400" />
                <span>Documentație & Sintaxă</span>
              </div>
              <div className="space-y-1">
                {DOCS_SECTIONS.map(docItem => {
                  const isActive = activeDocId === docItem.id;
                  return (
                    <button
                      key={docItem.id}
                      onClick={() => handleSelectDoc(docItem)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                        isActive
                          ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                      }`}
                    >
                      <span className={isActive ? 'text-purple-400' : 'text-slate-400'}>
                        {renderIcon(docItem.icon)}
                      </span>
                      <span className="truncate">{docItem.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>
        </aside>

        {/* Right Main Content Panel (Article Reader) */}
        <main className="lg:col-span-3 h-full overflow-y-auto pr-1 pb-8">
          {selectedArticle ? (
            /* Render Full Article or Doc Detail */
            <ArticleDetail
              article={selectedArticle}
              onBack={() => {
                setSelectedArticle(null);
                setActiveDocId(null);
              }}
            />
          ) : (
            /* Render Articles Grid List */
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-slate-100">
                    {selectedCategory === 'all' 
                      ? 'Toate Articolele Tehnice' 
                      : BLOG_CATEGORIES.find(c => c.id === selectedCategory)?.name}
                  </h2>
                  {searchQuery && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      Rezultate pentru: <strong className="text-sky-400">"{searchQuery}"</strong>
                    </p>
                  )}
                </div>
                <Badge variant="outline" className="text-xs font-semibold border-slate-800 text-slate-400">
                  {filteredArticles.length} {filteredArticles.length === 1 ? 'articol' : 'articole'}
                </Badge>
              </div>

              {filteredArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredArticles.map(article => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      onSelectArticle={(art) => {
                        setSelectedArticle(art);
                        setActiveDocId(null);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <Card className="bg-slate-900 border-slate-800 p-8 text-center space-y-3">
                  <BookOpen className="size-10 text-slate-600 mx-auto" />
                  <h3 className="text-base font-bold text-slate-200">
                    Nu s-au găsit articole pentru această căutare
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Încearcă să selectezi altă categorie sau să resetezi filtrul de căutare.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                    className="text-xs font-semibold"
                  >
                    Resetează Filtrele
                  </Button>
                </Card>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
