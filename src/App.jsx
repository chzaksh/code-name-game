import { useState, useEffect, useRef } from 'react';
import './utils/App.css';
import initialCards from './utils/gameData.json';


// ייבוא הרכיבים החדשים שפיצלנו
import IntroScreen from './components/IntroScreen';
import Sidebar from './components/Sidebar';
import GameBoard from './components/GameBoard';
import { ConfirmModal, AlertModal, RestartModal, VideoModal, VictoryModal } from './components/Modals';
import {UI_TEXTS} from "./utils/uiTexts.js";
import {TEAMS} from "./utils/constants.js";

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [cards, setCards] = useState(() => {
    const savedCards = localStorage.getItem('family_codenames_cards');
    return savedCards ? JSON.parse(savedCards) : initialCards;
  });

  const [activeVideo, setActiveVideo] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [winningTeam, setWinningTeam] = useState(null);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  // מצבי פופ-אפים
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, card: null });
  const [alertModal, setAlertModal] = useState({ isOpen: false, text: '' });
  const [restartModalOpen, setRestartModalOpen] = useState(false);

  const bgAudioRef = useRef(null);
  const tickingAudioRef = useRef(null);
  const alarmAudioRef = useRef(null);
  const victoryAudioRef = useRef(null);

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
  // בדיקת ניצחון אוטומטית אחרי כל שינוי בכרטיסים
  useEffect(() => {
    if (showIntro || winningTeam || hasCelebrated) return;

    // בודק את כל 3 הקבוצות
    const teamsToCheck = ['team1', 'team2', 'team3'];
    
    for (const teamId of teamsToCheck) {
      const teamCards = cards.filter(c => c.team === teamId);
      // אם לקבוצה יש כרטיסים על הלוח וכולם הפוכים - היא ניצחה!
      if (teamCards.length > 0 && teamCards.every(c => c.isFlipped)) {
        // מציאת אובייקט הקבוצה מתוך TEAMS (בהנחה שייבאת אותו מ-constants)
        const theWinningTeam = Object.values(TEAMS).find(t => t.id === teamId);
        
        setWinningTeam(theWinningTeam);
        setIsTimerActive(false); // עוצרים את השעון
        
        if (!isMuted && victoryAudioRef.current) {
          if (bgAudioRef.current) bgAudioRef.current.pause(); // משתיקים מוזיקת רקע
          victoryAudioRef.current.currentTime = 0;
          victoryAudioRef.current.play().catch(() => {});
        }
        break;
      }
    }
  }, [cards, showIntro, winningTeam, isMuted]);

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


  const startTimer = (seconds) => {
    setTimeLeft(seconds);
    setIsTimerActive(true);
  };

  const pauseTimer = () => setIsTimerActive(false);
  const resumeTimer = () => setIsTimerActive(true);

  const resetTimer = () => {
    setIsTimerActive(false);
    setTimeLeft(0);
  };

  const handleContinuePlaying = () => {
    setWinningTeam(null);
    setHasCelebrated(true); 
    if (victoryAudioRef.current) victoryAudioRef.current.pause(); // משתיק את שירי הניצחון
  };

  const getRemainingCount = (teamKey) => cards.filter(c => c.team === teamKey && !c.isFlipped).length;



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
      setWinningTeam(null);
      setHasCelebrated(false);
      setShowIntro(true);
      if (victoryAudioRef.current) victoryAudioRef.current.pause();
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
              startTimer={startTimer}
              pauseTimer={pauseTimer}
              resumeTimer={resumeTimer}
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
        <VictoryModal 
           team={winningTeam} 
           onRestart={() => confirmRestartAction(true)} 
           onContinue={handleContinuePlaying} 
        />
      </div>
  );
}

export default App;