import React, { useState } from 'react';
import { Terminal, Copy, Check, Sparkles } from '../Icons.jsx';

const SAMPLE_DSL_SNIPPETS = {
  profile: `@profile "Alexandru Popescu" {
  title: "Senior Full Stack Engineer"
  email: "alex.popescu@dev.ro"
  phone: "+40 722 123 456"
  location: "București, RO"
}`,
  experience: `@section "Experiență Profesională" icon="briefcase" {
  @item company="TechCorp Solutions" role="Lead Architect" period="2023 - Prezent" {
    @variant "backend"
    * Migrat microservicii în Go și Node.js cu reducere 80% latență
    * Coordonat echipă de 8 ingineri seniori
  }
}`,
  skills: `@section "Abilități Tehnice" icon="code" {
  @category "Frontend": ["React", "TypeScript", "Tailwind CSS", "Vite"]
  @category "Backend": ["Node.js", "PostgreSQL", "Docker", "GraphQL"]
}`
};

export default function SyntaxPlayground() {
  const [activeSnippetKey, setActiveSnippetKey] = useState('profile');
  const [dslCode, setDslCode] = useState(SAMPLE_DSL_SNIPPETS.profile);
  const [copied, setCopied] = useState(false);

  const handleSelectTemplate = (key) => {
    setActiveSnippetKey(key);
    setDslCode(SAMPLE_DSL_SNIPPETS[key]);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(dslCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mock parser for DSL code into structured AST/JSON preview
  const parseDslToAst = (code) => {
    const lines = code.split('\n');
    const result = {
      directives: [],
      properties: {},
      bullets: []
    };

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('@profile')) {
        result.directives.push({ type: 'PROFILE_DECLARATION', raw: trimmed });
      } else if (trimmed.startsWith('@section')) {
        result.directives.push({ type: 'SECTION_DECLARATION', raw: trimmed });
      } else if (trimmed.startsWith('@variant')) {
        result.directives.push({ type: 'VARIANT_FILTER', raw: trimmed });
      } else if (trimmed.startsWith('*')) {
        result.bullets.push(trimmed.replace('*', '').trim());
      } else if (trimmed.includes(':')) {
        const [k, v] = trimmed.split(':');
        if (k && v) {
          result.properties[k.trim()] = v.trim().replace(/["',]/g, '');
        }
      }
    });

    return JSON.stringify(result, null, 2);
  };

  return (
    <div className="syntax-playground glass-panel">
      <div className="playground-header">
        <div className="playground-title">
          <Terminal size={18} style={{ color: '#60a5fa' }} />
          <span>Code Editor DSL Playground (Live Demo)</span>
          <span className="badge badge-purple" style={{ fontSize: '0.65rem', marginLeft: '8px' }}>
            <Sparkles size={10} /> Future Feature Preview
          </span>
        </div>

        <div className="playground-actions">
          <button className="action-btn-sm" onClick={handleCopy}>
            {copied ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
            <span>{copied ? 'Copiat!' : 'Copiază Cod'}</span>
          </button>
        </div>
      </div>

      <div className="playground-templates">
        <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600 }}>Șabloane Sintaxă:</span>
        <button 
          className={`template-chip ${activeSnippetKey === 'profile' ? 'active' : ''}`}
          onClick={() => handleSelectTemplate('profile')}
        >
          @profile
        </button>
        <button 
          className={`template-chip ${activeSnippetKey === 'experience' ? 'active' : ''}`}
          onClick={() => handleSelectTemplate('experience')}
        >
          @section & @item
        </button>
        <button 
          className={`template-chip ${activeSnippetKey === 'skills' ? 'active' : ''}`}
          onClick={() => handleSelectTemplate('skills')}
        >
          @category
        </button>
      </div>

      <div className="playground-grid">
        {/* Editor input column */}
        <div className="playground-col">
          <div className="col-label">
            <span>DSL Code Input (.cv)</span>
          </div>
          <textarea 
            className="dsl-editor-textarea"
            value={dslCode}
            onChange={(e) => setDslCode(e.target.value)}
            placeholder="Scrie sintaxa CV-DSL..."
            rows={10}
          />
        </div>

        {/* Parsed JSON AST output column */}
        <div className="playground-col">
          <div className="col-label">
            <span>Parsed AST / CV State Tree</span>
            <span className="badge badge-blue" style={{ fontSize: '0.6rem' }}>Live Parser</span>
          </div>
          <pre className="dsl-ast-preview">
            <code>{parseDslToAst(dslCode)}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
