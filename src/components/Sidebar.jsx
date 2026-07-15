import { TEAMS, GAME_SETTINGS } from '../utils/constants';
import { UI_TEXTS } from '../utils/uiTexts';

export default function Sidebar({
                                    timeLeft,
                                    isTimerActive,
                                    startTimer,
                                    pauseTimer,
                                    resumeTimer,
                                    resetTimer,
                                    isMuted,
                                    setIsMuted,
                                    getRemainingCount,
                                    handleRestartGameClick,
                                    currentTurn,
                                    nextTurn,
                                    theme,
                                    toggleTheme,
                                    openMapModal
                                }) {
    const t = UI_TEXTS.sidebar;

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const renderTimerControls = () => {
        if (isTimerActive) {
            return (
                <>
                    <button className="btn-primary pause" onClick={pauseTimer}>{t.timerPause}</button>
                    <button className="btn-secondary" onClick={resetTimer}>{t.timerReset}</button>
                </>
            );
        }

        if (timeLeft > 0) {
            return (
                <>
                    <button className="btn-primary play" onClick={resumeTimer}>{t.timerResume}</button>
                    <button className="btn-secondary" onClick={resetTimer}>{t.timerReset}</button>
                </>
            );
        }

        return (
            <>
                <button
                    className="btn-primary"
                    style={{ background: '#f43f5e', color: '#fff', fontSize: '13px' }}
                    // מעבירים את סוג הטיימר כפרמטר שני
                    onClick={() => startTimer(GAME_SETTINGS.spymasterTimerSeconds, 'spymaster')}
                >
                    {t.timerSpymaster}
                </button>

                <button
                    className="btn-primary"
                    style={{ background: '#10b981', color: '#fff', fontSize: '13px' }}
                    // מעבירים את סוג הטיימר כפרמטר שני
                    onClick={() => startTimer(GAME_SETTINGS.teamTimerSeconds, 'team')}
                >
                    {t.timerTeam}
                </button>
            </>
        );
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-section game-branding">
                <h1 className="game-title">{GAME_SETTINGS.gameTitle}</h1>
            </div>

            <div className="sidebar-section timer-section">
                <div className="timer-header">
                    <svg viewBox="0 0 24 24" className="timer-icon" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>{t.timerLabel}</span>
                </div>

                <div className={`timer-display ${isTimerActive ? 'active' : ''}`}>
                    {formatTime(timeLeft)}
                </div>

                <div className="timer-controls" style={{ flexWrap: 'wrap', gap: '8px' }}>
                    {renderTimerControls()}
                </div>
                
                {/* כפתור העברת תור ידני (למקרה שלא מצליחים לנחש ורוצים להעביר) */}
                <button className="btn-end-turn" onClick={nextTurn}>
                    סיום תור והעברה
                </button>
            </div>

            <div className="sidebar-section scores-section">
                <div className="scores-header">
                    <h2>{t.scoresTitle}</h2>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                            className="mute-btn" 
                            onClick={toggleTheme} 
                            title="שנה עיצוב"
                        >
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>
                        <button 
                            className="mute-btn" 
                            onClick={() => setIsMuted(!isMuted)}
                        >
                            {isMuted ? '🔇' : '🔊'}
                        </button>
                    </div>
                </div>

                <div className="scores-container">
                    {[TEAMS.team1, TEAMS.team2, TEAMS.team3].map(team => {
                        const isCurrentTurn = team.id === currentTurn;
                        
                        return (
                            // שימוש בקלאס ה-CSS שיצרנו
                            <div 
                                key={team.id} 
                                className={`team-box ${isCurrentTurn ? 'active-turn' : ''}`} 
                                style={{ '--team-color': team.color }}
                            >
                                <div className="team-avatar-wrapper">
                                    <img src={`/images/${team.id}.png`} alt="" className="team-img" onError={(e) => { e.target.style.display = 'none'; }} />
                                    <span className="team-avatar-fallback">{team.name[0]}</span>
                                </div>
                                <div className="team-info">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                        <span className="team-name">{team.name}</span>
                                        {isCurrentTurn && <span className="current-turn-badge">התור שלנו</span>}
                                    </div>
                                    <span className="score-val" style={{ display: 'block', marginTop: '2px' }}>
                                        {getRemainingCount(team.id)}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                
           

            <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '15px' }}>
                    <button 
                        className="btn-secondary" 
                        onClick={openMapModal} 
                        style={{ flex: 1, margin: 0, padding: 'clamp(10px, 1.5vh, 12px)' }}
                    >
                        🗺️ הצג מפה
                    </button>

                    <button 
                        className="btn-danger" 
                        onClick={handleRestartGameClick} 
                        style={{ flex: 1, margin: 0 }}
                    >
                        {t.btnNewGame}
                    </button>
                </div>

           </div>
        </aside>
    );
}