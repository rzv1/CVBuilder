import React from 'react';
import { useTypewriter } from './hooks/useTypewriter.js';

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

  return (
    <span className="inline break-words">
      {visibleText.split('\n').map((line, idx, arr) => (
        <React.Fragment key={idx}>
          {line}
          {idx < arr.length - 1 && <br />}
        </React.Fragment>
      ))}
      {(isCurrentlyTyping || isStreaming) && (
        <span className="inline-block ml-0.5 animate-pulse text-indigo-400 font-mono select-none">
          ▋
        </span>
      )}
    </span>
  );
}
