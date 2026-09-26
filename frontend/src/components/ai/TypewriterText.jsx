import React from 'react';
import { useTypewriter } from './hooks/useTypewriter.js';
import { SimpleMarkdown } from '../ui/simple-markdown.jsx';

/**
 * Reusable Typewriter / Streaming Text Component using Tailwind CSS and custom hook
 */
export default function TypewriterText({
  text = '',
  speed = 15,
  animate = true,
  isStreaming = false,
  onCharacterTyped,
  onComplete
}) {
  const { visibleText, isCurrentlyTyping } = useTypewriter({
    text,
    speed,
    animate,
    isStreaming,
    onCharacterTyped,
    onComplete
  });

  const cursor = (isCurrentlyTyping || isStreaming) ? (
    <span className="inline-block ml-0.5 animate-pulse text-indigo-400 font-mono select-none">
      ▋
    </span>
  ) : null;

  return (
    <div className="break-words">
      <SimpleMarkdown content={visibleText} cursor={cursor} />
    </div>
  );
}
