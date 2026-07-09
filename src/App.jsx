import { useState, useEffect, useRef } from 'react';
import './utils/App.css';
import initialCards from './utils/gameData.json';
import { GAME_SETTINGS } from './utils/constants';

// ייבוא הרכיבים החדשים שפיצלנו
import IntroScreen from './components/IntroScreen';
import Sidebar from './components/Sidebar';
import GameBoard from './components/GameBoard';
import { ConfirmModal, AlertModal, RestartModal, VideoModal } from './components/Modals';
import {UI_TEXTS} from "./utils/uiTexts.js";

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [cards, setCards] = useState(() => {
    const savedCards = localStorage.getItem('family_codenames_cards');
    return savedCards ? JSON.parse(savedCards) : initialCards;
  });

  const [activeVideo, setActiveVideo] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_SETTINGS.defaultTimerSeconds);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // מצבי פופ-אפים
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, card: null });
  const [alertModal, setAlertModal] = useState({ isOpen: false, text: '' });
  const [restartModalOpen, setRestartModalOpen] = useState(false);

  const bgAudioRef = useRef(null);
  const tickingAudioRef = useRef(null);
  const alarmAudioRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('family_codenames_cards', JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    if (bgAudioRef.current) {
      bgAudioRef.current.volume = 0.15;
      if (activeVideo || showIntro) {
        bgAudioRef.current.pause();
      } else if (!isMuted) {
        bgAudioRef.current.play().catch(() => {});
      }
    }
  }, [activeVideo, isMuted, showIntro]);

  useEffect(() => {
    let interval = null;

    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);

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
      // התיקון: עטיפה ב-setTimeout שמונעת את קריסת הלינטר
      setTimeout(() => {
        setIsTimerActive(false);
        if (!isMuted && alarmAudioRef.current) {
          alarmAudioRef.current.currentTime = 0;
          alarmAudioRef.current.play().catch(() => {});
        }
        setAlertModal({ isOpen: true, text: UI_TEXTS.modals.alertTimerDone });
      }, 0);
    }

    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft, isMuted]);

  const getRemainingCount = (teamKey) => cards.filter(c => c.team === teamKey && !c.isFlipped).length;
  const toggleTimer = () => setIsTimerActive(!isTimerActive);
  const resetTimer = () => {
    setIsTimerActive(false);
    setTimeLeft(GAME_SETTINGS.defaultTimerSeconds);
  };

  const handleCardClick = (card) => {
    if (card.isFlipped) return;
    setConfirmModal({ isOpen: true, card });
  };

  const handleConfirmAction = (isConfirmed) => {
    const card = confirmModal.card;
    setConfirmModal({ isOpen: false, card: null });
    if (isConfirmed && card) {
      setActiveVideo(card);
      setIsTimerActive(false);
    }
  };

  const handleVideoEnd = () => {
    setCards(cards.map(c => c.id === activeVideo.id ? { ...c, isFlipped: true } : c));
    // if (activeVideo.team === 'bomb') {
    //   setTimeout(() => setAlertModal({ isOpen: true, text: UI_TEXTS.modals.alertBombTriggered }), 400);
    // }
    setActiveVideo(null);
    resetTimer();
  };

  const handleRestartGameClick = () => setRestartModalOpen(true);

  const confirmRestartAction = (isConfirmed) => {
    setRestartModalOpen(false);
    if (isConfirmed) {
      localStorage.removeItem('family_codenames_cards');
      setCards(initialCards);
      resetTimer();
      setShowIntro(true);
    }
  };

  return (
      <div className="game-wrapper">
        <audio ref={bgAudioRef} src="/audio/bg-music.mp3" loop muted={isMuted} />
        <audio ref={tickingAudioRef} src="/audio/ticking.mp3" muted={isMuted} />
        <audio ref={alarmAudioRef} src="/audio/alarm.wav" muted={isMuted} />

        {showIntro && <IntroScreen startGame={() => setShowIntro(false)} />}

        <div className={`game-wrapper-inner ${showIntro ? 'hidden' : ''}`} style={{ display: 'flex', width: '100%', gap: '30px' }}>
          <Sidebar
              timeLeft={timeLeft}
              isTimerActive={isTimerActive}
              toggleTimer={toggleTimer}
              resetTimer={resetTimer}
              isMuted={isMuted}
              setIsMuted={setIsMuted}
              getRemainingCount={getRemainingCount}
              handleRestartGameClick={handleRestartGameClick}
          />

          <GameBoard cards={cards} handleCardClick={handleCardClick} />
        </div>

        {/* רכיבי פופ-אפ מנותקים */}
        <VideoModal videoUrl={activeVideo?.videoUrl} onEnded={handleVideoEnd} />
        <ConfirmModal isOpen={confirmModal.isOpen} card={confirmModal.card} onConfirm={handleConfirmAction} />
        <AlertModal isOpen={alertModal.isOpen} text={alertModal.text} onClose={() => setAlertModal({ isOpen: false, text: '' })} />
        <RestartModal isOpen={restartModalOpen} onConfirm={confirmRestartAction} />
      </div>
  );
}

export default App;