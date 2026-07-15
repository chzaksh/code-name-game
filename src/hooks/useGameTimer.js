import { useState, useEffect, useRef } from 'react';

export function useGameTimer(isMuted, onTimeUp) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [activeTimerType, setActiveTimerType] = useState(null);

  // רפרנסים לסאונד של השעון בלבד
  const tickingAudioRef = useRef(null);
  const alarmAudioRef = useRef(null);

  useEffect(() => {
    let interval = null;

    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);

        // ניהול סאונד תקתוק רגיל + תקתוק כפול ב-11 שניות האחרונות
        if (!isMuted && tickingAudioRef.current) {
          tickingAudioRef.current.currentTime = 0;
          tickingAudioRef.current.play().catch(() => {});

          if (timeLeft <= 11) {
            setTimeout(() => {
              if (!isMuted && tickingAudioRef.current) {
                tickingAudioRef.current.currentTime = 0;
                tickingAudioRef.current.play().catch(() => {});
              }
            }, 500);
          }
        }
      }, 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      // מה קורה כשהזמן מגיע לאפס
      setTimeout(() => {
        setIsTimerActive(false);
        if (!isMuted && alarmAudioRef.current) {
          alarmAudioRef.current.currentTime = 0;
          alarmAudioRef.current.play().catch(() => {});
        }
        // מפעיל את הפונקציה ש-App.jsx העביר לנו
        if (onTimeUp) onTimeUp(activeTimerType);
      }, 0);
    }

    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft, isMuted, onTimeUp]);

  const startTimer = (seconds, timerType) => {
    setTimeLeft(seconds);
    setActiveTimerType(timerType);
    setIsTimerActive(true);
  };
  
  const pauseTimer = () => setIsTimerActive(false);
  const resumeTimer = () => setIsTimerActive(true);
  
  const resetTimer = () => {
    setIsTimerActive(false);
    setTimeLeft(0);
  };

  return {
    timeLeft,
    isTimerActive,
    activeTimerType,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    tickingAudioRef,
    alarmAudioRef
  };
}