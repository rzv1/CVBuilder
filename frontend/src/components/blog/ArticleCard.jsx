import React from 'react';
import { Clock, Tag, ArrowRight } from 'lucide-react';
import { Card } from '@/frontend/components/ui/card';
import { Badge } from '@/frontend/components/ui/badge';
import { Button } from '@/frontend/components/ui/button';

export default function ArticleCard({ article, onSelectArticle }) {
  return (
    <Card 
      className="bg-slate-900 border-slate-800 p-5 shadow-lg hover:border-indigo-500/50 hover:shadow-indigo-500/10 transition-all cursor-pointer flex flex-col justify-between group"
      onClick={() => onSelectArticle(article)}
    >
      <div className="space-y-3">
        {/* Top bar: Category badge & read time */}
        <div className="flex items-center justify-between text-xs">
          {article.categoryName && (
            <Badge variant="purple" className="font-semibold text-[11px] px-2 py-0.5">
              {article.categoryName}
            </Badge>
          )}
          {article.readTime && (
            <span className="flex items-center gap-1 text-slate-400 text-[11px]">
              <Clock className="size-3 text-slate-400" /> {article.readTime}
            </span>
          )}
        </div>

        {/* Title & Summary */}
        <div>
          <h3 className="text-base font-bold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-2">
            {article.title}
          </h3>
          {article.summary && (
            <p className="text-xs text-slate-400 mt-1.5 line-clamp-3 leading-relaxed">
              {article.summary}
            </p>
          )}
        </div>

        {/* Tags */}
        {Array.isArray(article.tags) && article.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 pt-1">
            {article.tags.map((tag, idx) => (
              <Badge key={idx} variant="secondary" className="gap-1 text-[10px] text-slate-400 bg-slate-950 border border-slate-800/80">
                <Tag className="size-2.5 text-sky-400" /> {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer: Author & Read More */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/60">
        <div className="flex items-center gap-2.5">
          {article.avatar ? (
            <img src={article.avatar} alt={article.author} className="size-7 rounded-full border border-slate-700 object-cover" />
          ) : (
            <div className="size-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
              {(article.author || 'A').charAt(0)}
            </div>
          )}
          <div className="text-left">
            <div className="text-xs font-semibold text-slate-200">{article.author}</div>
            <div className="text-[10px] text-slate-400">{article.date}</div>
          </div>
        </div>

        <Button 
          variant="ghost" 
          size="xs"
          onClick={(e) => {
            e.stopPropagation();
            onSelectArticle(article);
          }}
          className="gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/40"
        >
          <span>Citește</span>
          <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>
    </Card>
  );
}
