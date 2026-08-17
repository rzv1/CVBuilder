import React from 'react';
import { Clock, Tag, ArrowRight } from '../Icons.jsx';

export default function ArticleCard({ article, onSelectArticle }) {
  return (
    <div className="article-card glass-panel" onClick={() => onSelectArticle(article)}>
      <div className="card-top">
        <span className="category-pill">{article.categoryName}</span>
        <span className="read-time">
          <Clock size={12} /> {article.readTime}
        </span>
      </div>

      <h3 className="card-title">{article.title}</h3>
      <p className="card-summary">{article.summary}</p>

      <div className="card-tags">
        {article.tags.map((tag, idx) => (
          <span key={idx} className="tag-chip">
            <Tag size={10} /> {tag}
          </span>
        ))}
      </div>

      <div className="card-footer">
        <div className="author-info">
          <img src={article.avatar} alt={article.author} className="author-avatar" />
          <div>
            <div className="author-name">{article.author}</div>
            <div className="article-date">{article.date}</div>
          </div>
        </div>

        <button className="read-more-btn" onClick={(e) => {
          e.stopPropagation();
          onSelectArticle(article);
        }}>
          <span>Citește</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
