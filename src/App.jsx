import { useState, useEffect, useRef } from 'react';
import './styles/App.css';
import initialCards from './utils/gameData.json';

// ==========================================
// 1. ייבוא רכיבי תצוגה ולוגיקה
// ==========================================
import IntroScreen from './components/IntroScreen';
import Sidebar from './components/Sidebar';
import GameBoard from './components/GameBoard';

// ייבוא המודאלים מהתיקייה החדשה (modals)
import ConfirmModal from './components/modals/ConfirmModal';
import AlertModal from './components/modals/AlertModal';
import RestartModal from './components/modals/RestartModal';
import VideoModal from './components/modals/VideoModal';
import VictoryModal from './components/modals/VictoryModal';


import { UI_TEXTS } from "./utils/uiTexts.js";
import { TEAMS } from "./utils/constants.js";
import { useGameTimer } from './hooks/useGameTimer';

// ==========================================
// 2. פונקציות עזר מחוץ לקומפוננטה
// ==========================================
const generateShuffledCards = (baseCards) => {
  const teams = baseCards.map(c => c.team);
  
  // ערבוב הקבוצות
  for (let i = teams.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [teams[i], teams[j]] = [teams[j], teams[i]];
  }

  const shuffledColorsCards = baseCards.map((card, index) => ({
    ...card,
    team: teams[index],
    isFlipped: false
  }));

  // ערבוב המיקומים על הלוח
  for (let i = shuffledColorsCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledColorsCards[i], shuffledColorsCards[j]] = [shuffledColorsCards[j], shuffledColorsCards[i]];
  }

  return shuffledColorsCards;
};

// ==========================================
// 3. הקומפוננטה הראשית
// ==========================================
function App() {
  // --- הגדרות משחק בסיסיות ---
  const [theme, setTheme] = useState(() => localStorage.getItem('game_theme') || 'dark');
  const [showIntro, setShowIntro] = useState(true);

  // --- ניהול הלוח והכרטיסים ---
  const [cards, setCards] = useState(() => {
    const savedCards = localStorage.getItem('family_codenames_cards');
    return savedCards ? JSON.parse(savedCards) : generateShuffledCards(initialCards);
  });

  // --- ניהול תורים וניצחון ---
  const [currentTurn, setCurrentTurn] = useState(() => {
    const playingTeams = ['team1', 'team2', 'team3'];
    return playingTeams[Math.floor(Math.random() * playingTeams.length)];
  });
  const [winningTeam, setWinningTeam] = useState(null);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  // --- ניהול מדיה ומודאלים ---
  const [activeVideo, setActiveVideo] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, card: null });
  const [alertModal, setAlertModal] = useState({ isOpen: false, text: '' });
  const [restartModalOpen, setRestartModalOpen] = useState(false);

  // --- רפרנסים לסאונד הכללי ---
  const bgAudioRef = useRef(null);
  const victoryAudioRef = useRef(null);

  // --- הוק הטיימר החיצוני ---
  // כל הלוגיקה של הזמן מנוהלת בקובץ useGameTimer.js
  const {
    timeLeft,
    isTimerActive,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    tickingAudioRef,
    alarmAudioRef
  } = useGameTimer(isMuted, (timerType) => {
    // קולבק שרץ כשהזמן בטיימר נגמר
    if (timerType === 'team') nextTurn();
    setAlertModal({ isOpen: true, text: UI_TEXTS.modals.alertTimerDone });
  });

  // ==========================================
  // 4. פעולות אוטומטיות (Effects)
  // ==========================================

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('game_theme', theme);
  }, [theme]);

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

  // בדיקת ניצחון בכל עדכון של הלוח
  useEffect(() => {
    if (showIntro || winningTeam || hasCelebrated) return;

    const teamsToCheck = ['team1', 'team2', 'team3'];
    for (const teamId of teamsToCheck) {
      const teamCards = cards.filter(c => c.team === teamId);
      
      if (teamCards.length > 0 && teamCards.every(c => c.isFlipped)) {
        const theWinningTeam = Object.values(TEAMS).find(t => t.id === teamId);
        setWinningTeam(theWinningTeam);
        pauseTimer(); // עוצר את השעון מההוק
        
        if (!isMuted && victoryAudioRef.current) {
          if (bgAudioRef.current) bgAudioRef.current.pause();
          victoryAudioRef.current.currentTime = 0;
          victoryAudioRef.current.play().catch(() => {});
        }
        break;
      }
    }
  }, [cards, showIntro, winningTeam, isMuted, pauseTimer]);

  // ==========================================
  // 5. פונקציות לניהול המשחק
  // ==========================================

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const nextTurn = () => {
    if (!currentTurn) return;
    const playingTeams = ['team1', 'team2', 'team3'];
    const currentIndex = playingTeams.indexOf(currentTurn);
    const nextIndex = (currentIndex + 1) % playingTeams.length; 
    
    setCurrentTurn(playingTeams[nextIndex]);
    resetTimer();
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
      pauseTimer();
    }
  };

  const handleVideoEnd = () => {
    setCards(cards.map(c => c.id === activeVideo.id ? { ...c, isFlipped: true } : c));
    setActiveVideo(null);
    resetTimer();
  };

  const handleContinuePlaying = () => {
    setWinningTeam(null);
    setHasCelebrated(true); 
    if (victoryAudioRef.current) victoryAudioRef.current.pause();
  };

  const handleRestartGameClick = () => setRestartModalOpen(true);

  const confirmRestartAction = (isConfirmed) => {
    setRestartModalOpen(false);
    if (isConfirmed) {
      localStorage.removeItem('family_codenames_cards');
      setCards(generateShuffledCards(initialCards));
      resetTimer();
      setWinningTeam(null);
      setHasCelebrated(false);
      setShowIntro(true);
      if (victoryAudioRef.current) victoryAudioRef.current.pause();
      
      const playingTeams = ['team1', 'team2', 'team3'];
      setCurrentTurn(playingTeams[Math.floor(Math.random() * playingTeams.length)]);
    }
  };

  const handleOpenMapWindow = () => {
    // שומר על הנתיב הנוכחי ומוסיף לו את הדרישה למפה בלבד
    const mapUrl = window.location.href.split('?')[0] + '?map=true';
    // פותח חלון דפדפן אמיתי ונפרד
    window.open(mapUrl, 'SpymasterMap', 'width=850,height=600,left=100,top=100');
  };

  // ==========================================
  // 6. רינדור הממשק (UI)
  // ==========================================
  return (
      <div className="game-wrapper">
        {/* אלמנטים של אודיו */}
        <audio ref={bgAudioRef} src="/audio/bg-music.mp3" loop muted={isMuted} />
        <audio ref={tickingAudioRef} src="/audio/ticking.mp3" muted={isMuted} />
        <audio ref={alarmAudioRef} src="/audio/alarm.wav" muted={isMuted} />
        <audio ref={victoryAudioRef} src="/audio/victory.mp3" muted={isMuted} />

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
              currentTurn={currentTurn}
              nextTurn={nextTurn}
              theme={theme}
              toggleTheme={toggleTheme}
              openMapModal={handleOpenMapWindow}
          />
          <GameBoard cards={cards} handleCardClick={handleCardClick} />
        </div>

        {/* מודאלים */}
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