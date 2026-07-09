import { TEAMS, GAME_SETTINGS } from '../utils/constants';
import { UI_TEXTS } from '../utils/uiTexts';

export default function Sidebar({
                                    timeLeft, isTimerActive, toggleTimer, resetTimer, isMuted, setIsMuted, getRemainingCount, handleRestartGameClick
                                }) {
    const t = UI_TEXTS.sidebar;

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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

                <div className="timer-controls">
                    <button className={`btn-primary ${isTimerActive ? 'pause' : 'play'}`} onClick={toggleTimer}>
                        {isTimerActive ? t.timerPause : t.timerPlay}
                    </button>
                    <button className="btn-secondary" onClick={resetTimer}>{t.timerReset}</button>
                </div>
            </div>

            <div className="sidebar-section scores-section">
                <div className="scores-header">
                    <h2>{t.scoresTitle}</h2>
                    <button className="mute-btn" onClick={() => setIsMuted(!isMuted)}>{isMuted ? '🔇' : '🔊'}</button>
                </div>

                <div className="scores-container">
                    {[TEAMS.team1, TEAMS.team2, TEAMS.team3].map(team => (
                        <div key={team.id} className="team-box" style={{ '--team-color': team.color }}>
                            <div className="team-avatar-wrapper">
                                <img src={`/images/${team.id}.png`} alt="" className="team-img" onError={(e) => { e.target.style.display = 'none'; }} />
                                <span className="team-avatar-fallback">{team.name[0]}</span>
                            </div>
                            <div className="team-info">
                                <span className="team-name">{team.name}</span>
                                <span className="score-val">{getRemainingCount(team.id)}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="btn-danger" onClick={handleRestartGameClick} style={{ marginTop: '20px' }}>
                    {t.btnNewGame}
                </button>
            </div>
        </aside>
    );
}