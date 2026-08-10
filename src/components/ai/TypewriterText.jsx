import React, { useState, useEffect, useRef } from 'react';

/**
 * Reusable Typewriter / Streaming Text Component
 * 
 * @param {string} text - Full or streaming text content to render
 * @param {number} speed - Typing speed in ms per character (default: 15ms)
 * @param {boolean} animate - Whether to animate typing or render instantly
 * @param {boolean} isStreaming - Whether active streaming is taking place from API
 * @param {function} onCharacterTyped - Optional callback invoked on each character typed (great for auto-scroll)
 * @param {function} onComplete - Optional callback when typing effect finishes
 */
export default function TypewriterText({
  text = '',
  speed = 15,
  animate = true,
  isStreaming = false,
  onCharacterTyped,
  onComplete
}) {
  const [displayedCount, setDisplayedCount] = useState(animate ? 0 : text.length);
  const timerRef = useRef(null);

  useEffect(() => {
    // If animation is disabled, instantly display entire text
    if (!animate) {
      setDisplayedCount(text.length);
      return;
    }

    // Incrementally type characters
    if (displayedCount < text.length) {
      timerRef.current = setTimeout(() => {
        setDisplayedCount(prev => {
          const next = prev + 1;
          if (onCharacterTyped) onCharacterTyped();
          if (next >= text.length && onComplete) {
            onComplete();
          }
          return next;
        });
      }, speed);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [text, displayedCount, speed, animate, onCharacterTyped, onComplete]);

  // If text grows dynamically during streaming, ensure count can catch up
  useEffect(() => {
    if (!animate) {
      setDisplayedCount(text.length);
    }
  }, [text, animate]);

  const visibleText = animate ? text.slice(0, displayedCount) : text;
  const isCurrentlyTyping = animate && displayedCount < text.length;

  return (
    <span className="typewriter-text">
      {visibleText.split('\n').map((line, idx, arr) => (
        <React.Fragment key={idx}>
          {line}
          {idx < arr.length - 1 && <br />}
        </React.Fragment>
      ))}
      {(isCurrentlyTyping || isStreaming) && (
        <span className="typewriter-cursor">▋</span>
      )}
    </span>
  );
}
