import React from 'react';

/**
 * Simple Markdown Parser Helper for rendering inline formatting (bold, italic, code)
 */
export function parseInlineMarkdown(text) {
  if (!text) return null;
  const tokens = [];
  const regex = /(\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|`[^`]+`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(text.substring(lastIndex, match.index));
    }
    const chunk = match[0];
    if ((chunk.startsWith('**') && chunk.endsWith('**')) || (chunk.startsWith('__') && chunk.endsWith('__'))) {
      tokens.push(<strong key={match.index} className="font-semibold text-slate-100">{chunk.slice(2, -2)}</strong>);
    } else if ((chunk.startsWith('*') && chunk.endsWith('*')) || (chunk.startsWith('_') && chunk.endsWith('_'))) {
      tokens.push(<em key={match.index} className="italic text-purple-200">{chunk.slice(1, -1)}</em>);
    } else if (chunk.startsWith('`') && chunk.endsWith('`')) {
      tokens.push(
        <code key={match.index} className="px-1 py-0.5 rounded bg-slate-900 text-purple-300 font-mono text-[11px] border border-slate-800">
          {chunk.slice(1, -1)}
        </code>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push(text.substring(lastIndex));
  }

  return tokens.length > 0 ? tokens : text;
}

/**
 * Reusable SimpleMarkdown Component
 * Parses headers (#, ##, ###), lists (-, *, •, 1.), bold, italic, code, and newlines.
 * Optionally supports an inline `cursor` prop attached to the last line for typewriter streaming.
 */
export function SimpleMarkdown({ content = '', cursor = null, className = '' }) {
  if (!content && !cursor) return null;
  if (!content) return cursor;

  const rawLines = content.split('\n');
  const elements = [];
  let currentList = null;
  let inCodeBlock = false;
  let codeBuffer = [];

  // Find the index of the last non-empty line to attach cursor
  let lastNonEmptyIndex = -1;
  for (let i = rawLines.length - 1; i >= 0; i--) {
    if (rawLines[i].trim().length > 0) {
      lastNonEmptyIndex = i;
      break;
    }
  }

  rawLines.forEach((line, index) => {
    const trimmed = line.trim();
    const isLast = index === lastNonEmptyIndex;
    const inlineCursor = isLast ? cursor : null;

    // Fenced code blocks
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`code-${index}`} className="p-2 my-1 rounded bg-slate-950 text-purple-300 font-mono text-[11px] overflow-x-auto border border-slate-800">
            <code>{codeBuffer.join('\n')}{inlineCursor}</code>
          </pre>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        if (currentList) { elements.push(currentList); currentList = null; }
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    // Empty line (paragraph break)
    if (!trimmed) {
      if (currentList) {
        elements.push(currentList);
        currentList = null;
      }
      return;
    }

    // Headers
    if (trimmed.startsWith('### ')) {
      if (currentList) { elements.push(currentList); currentList = null; }
      elements.push(
        <h5 key={`h3-${index}`} className="font-bold text-xs text-purple-300 mt-2 mb-1">
          {parseInlineMarkdown(trimmed.slice(4))}
          {inlineCursor}
        </h5>
      );
      return;
    }
    if (trimmed.startsWith('## ')) {
      if (currentList) { elements.push(currentList); currentList = null; }
      elements.push(
        <h4 key={`h2-${index}`} className="font-bold text-xs text-indigo-300 mt-2 mb-1">
          {parseInlineMarkdown(trimmed.slice(3))}
          {inlineCursor}
        </h4>
      );
      return;
    }
    if (trimmed.startsWith('# ')) {
      if (currentList) { elements.push(currentList); currentList = null; }
      elements.push(
        <h3 key={`h1-${index}`} className="font-extrabold text-sm text-slate-100 mt-2.5 mb-1">
          {parseInlineMarkdown(trimmed.slice(2))}
          {inlineCursor}
        </h3>
      );
      return;
    }

    // Unordered List Items
    if (/^[-*•]\s+/.test(trimmed)) {
      const itemText = trimmed.replace(/^[-*•]\s+/, '');
      const li = (
        <li key={`li-${index}`} className="flex items-start gap-1.5 my-0.5 text-xs text-slate-300">
          <span className="text-purple-400 select-none leading-relaxed">•</span>
          <span className="flex-1 leading-relaxed">
            {parseInlineMarkdown(itemText)}
            {inlineCursor}
          </span>
        </li>
      );
      if (!currentList) {
        currentList = <ul key={`ul-${index}`} className="my-1 space-y-0.5 list-none p-0">{[li]}</ul>;
      } else {
        currentList = React.cloneElement(currentList, {
          children: [...React.Children.toArray(currentList.props.children), li]
        });
      }
      return;
    }

    // Ordered List Items
    const orderedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (orderedMatch) {
      const num = orderedMatch[1];
      const itemText = orderedMatch[2];
      const li = (
        <li key={`oli-${index}`} className="flex items-start gap-1.5 my-0.5 text-xs text-slate-300">
          <span className="text-purple-400 font-semibold select-none leading-relaxed text-[11px]">{num}.</span>
          <span className="flex-1 leading-relaxed">
            {parseInlineMarkdown(itemText)}
            {inlineCursor}
          </span>
        </li>
      );
      if (!currentList) {
        currentList = <ol key={`ol-${index}`} className="my-1 space-y-0.5 list-none p-0">{[li]}</ol>;
      } else {
        currentList = React.cloneElement(currentList, {
          children: [...React.Children.toArray(currentList.props.children), li]
        });
      }
      return;
    }

    // Regular paragraph
    if (currentList) {
      elements.push(currentList);
      currentList = null;
    }

    elements.push(
      <p key={`p-${index}`} className="my-1 leading-relaxed text-xs text-slate-300">
        {parseInlineMarkdown(trimmed)}
        {inlineCursor}
      </p>
    );
  });

  if (inCodeBlock && codeBuffer.length > 0) {
    elements.push(
      <pre key="code-unclosed" className="p-2 my-1 rounded bg-slate-950 text-purple-300 font-mono text-[11px] overflow-x-auto border border-slate-800">
        <code>{codeBuffer.join('\n')}{cursor}</code>
      </pre>
    );
  }

  if (currentList) {
    elements.push(currentList);
  }

  // Fallback if cursor wasn't attached because all lines were empty
  if (cursor && lastNonEmptyIndex === -1) {
    elements.push(<span key="standalone-cursor">{cursor}</span>);
  }

  return <div className={`space-y-1 ${className}`}>{elements}</div>;
}

export default SimpleMarkdown;
