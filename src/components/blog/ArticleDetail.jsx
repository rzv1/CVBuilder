import React, { useState } from 'react';
import { ArrowLeft, Clock, Copy, Check, Tag, Share2 } from '../Icons';

export default function ArticleDetail({ article, onBack }) {
  const [copiedSnippetIndex, setCopiedSnippetIndex] = useState(null);

  const handleCopyCode = (codeText, index) => {
    navigator.clipboard.writeText(codeText);
    setCopiedSnippetIndex(index);
    setTimeout(() => setCopiedSnippetIndex(null), 2000);
  };

  // Helper to render content with interactive code blocks and copy buttons
  const renderArticleContent = (rawContent) => {
    const parts = rawContent.split('```');
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // Code snippet block
        const firstLineEnd = part.indexOf('\n');
        const language = part.substring(0, firstLineEnd).trim() || 'javascript';
        const codeText = part.substring(firstLineEnd + 1).trim();

        return (
          <div key={index} className="article-code-block glass-panel">
            <div className="code-block-header">
              <span className="code-lang-label">{language}</span>
              <button 
                className="copy-snippet-btn"
                onClick={() => handleCopyCode(codeText, index)}
                title="Copiază fragmentul de cod"
              >
                {copiedSnippetIndex === index ? (
                  <>
                    <Check size={13} style={{ color: '#10b981' }} />
                    <span style={{ color: '#10b981' }}>Copiat!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy Snippet</span>
                  </>
                )}
              </button>
            </div>
            <pre className="code-pre">
              <code>{codeText}</code>
            </pre>
          </div>
        );
      } else {
        // Normal text / markdown formatting
        const paragraphs = part.split('\n\n').filter(Boolean);
        return (
          <div key={index} className="article-text-block">
            {paragraphs.map((p, pIdx) => {
              if (p.startsWith('# ')) {
                return <h1 key={pIdx} className="article-heading-1">{p.replace('# ', '')}</h1>;
              } else if (p.startsWith('### ')) {
                return <h3 key={pIdx} className="article-heading-3">{p.replace('### ', '')}</h3>;
              } else if (p.startsWith('- ')) {
                const items = p.split('\n- ');
                return (
                  <ul key={pIdx} className="article-list">
                    {items.map((item, iIdx) => (
                      <li key={iIdx}>{item.replace('- ', '')}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={pIdx} className="article-paragraph">{p}</p>;
            })}
          </div>
        );
      }
    });
  };

  return (
    <div className="article-detail-container glass-panel">
      <div className="article-header-nav">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Înapoi la Articole</span>
        </button>

        <div className="article-header-meta">
          <span className="category-pill">{article.categoryName}</span>
          <span className="read-time">
            <Clock size={12} /> {article.readTime}
          </span>
        </div>
      </div>

      <div className="article-main-header">
        <h1 className="article-title-large">{article.title}</h1>

        <div className="article-author-bar">
          <img src={article.avatar} alt={article.author} className="author-avatar-lg" />
          <div className="author-details">
            <div className="author-name-lg">{article.author}</div>
            <div className="article-pub-date">Publicat pe {article.date}</div>
          </div>
        </div>

        <div className="article-tags-bar">
          {article.tags.map((tag, idx) => (
            <span key={idx} className="tag-chip">
              <Tag size={11} /> {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="article-body-content">
        {renderArticleContent(article.content)}
      </div>
    </div>
  );
}
