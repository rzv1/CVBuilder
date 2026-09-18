import { useState, useEffect, useRef } from 'react';

/**
 * Custom Hook to handle typewriter typing effect state and timers
 */
export function useTypewriter({
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

  return {
    visibleText,
    isCurrentlyTyping,
    isStreaming,
    displayedCount
  };
}
