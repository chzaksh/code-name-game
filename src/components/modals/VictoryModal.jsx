export default function VictoryModal({ team, onRestart, onContinue }) {
  if (!team) return null;

  return (
    <div className="victory-overlay">
      <div className="victory-content" style={{ '--team-color': team.color }}>
        <div className="confetti-effect">🎉</div>
        <h1 className="victory-title">ניצחון!</h1>
        <h2 className="victory-subtitle">האלופים הם: {team.name}</h2>
        
        <div className="victory-media">
           <video src="/video/victory-celebration.mp4" autoPlay loop muted playsInline />
        </div>

        {/* מעטפת חדשה לשני הכפתורים */}
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn-start-massive victory-btn" style={{ marginTop: '0' }} onClick={onRestart}>
            משחק חדש
          </button>
          
          <button 
            className="btn-skip" 
            style={{ background: 'rgba(255,255,255,0.1)', color: 'white', marginTop: '0', fontSize: '20px' }} 
            onClick={onContinue}
          >
            המשך לשחק
          </button>
        </div>
      </div>
    </div>
  );
}