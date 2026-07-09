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
                                    handleRestartGameClick
                                }) {
    const t = UI_TEXTS.sidebar;

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // פונקציה מסודרת שמחזירה את הכפתורים הנכונים ומעלימה את האזהרה של העורך (ESLint)
    const renderTimerControls = () => {
        if (isTimerActive) {
            // מצב שהטיימר רץ עכשיו
            return (
                <>
                    <button className="btn-primary pause" onClick={pauseTimer}>{t.timerPause}</button>
                    <button className="btn-secondary" onClick={resetTimer}>{t.timerReset}</button>
                </>
            );
        }

        if (timeLeft > 0) {
            // מצב שהטיימר הופסק באמצע (השהיה)
            return (
                <>
                    <button className="btn-primary play" onClick={resumeTimer}>{t.timerResume}</button>
                    <button className="btn-secondary" onClick={resetTimer}>{t.timerReset}</button>
                </>
            );
        }

        // מצב התחלתי / מאופס - מציג את שני סוגי הטיימרים
        return (
            <>
                <button
                    className="btn-primary"
                    style={{ background: '#f43f5e', color: '#fff', fontSize: '13px' }}
                    onClick={() => startTimer(GAME_SETTINGS.spymasterTimerSeconds)}
                >
                    {t.timerSpymaster}
                </button>

                <button
                    className="btn-primary"
                    style={{ background: '#10b981', color: '#fff', fontSize: '13px' }}
                    onClick={() => startTimer(GAME_SETTINGS.teamTimerSeconds)}
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

                {/* קריאה לפונקציה החדשה שתציג את הכפתורים */}
                <div className="timer-controls" style={{ flexWrap: 'wrap', gap: '8px' }}>
                    {renderTimerControls()}
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