export default function SpymasterMapModal({ isOpen, onClose, cards, TEAMS }) {
  if (!isOpen) return null;

  return (
    <div className="custom-modal-overlay" style={{ direction: 'rtl' }}> {/* הוספנו RTL כדי שיציג בדיוק כמו הלוח */}
      <div className="custom-modal" style={{ maxWidth: '800px', width: '95%' }}> {/* הגדלנו משמעותית את החלון */}
        <h3 style={{ fontSize: '28px', marginBottom: '10px' }}>מפת רב-מרגלים</h3>
        <p style={{ marginBottom: '25px', fontSize: '18px' }}>צלמו את המסך ותנו לשחקנים הראשיים, לאחר מכן סגרו את החלון.</p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)', // 8 עמודות בדיוק כמו בלוח
          gap: '10px', // מרווח נעים יותר
          margin: '0 auto 30px auto',
          padding: '20px',
          background: '#1a1a2e', // רקע כהה שמבליט את הצבעים
          borderRadius: '16px',
          border: '2px solid rgba(255,255,255,0.1)',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
        }}>
          {cards.map(card => {
            const teamObj = Object.values(TEAMS).find(t => t.id === card.team);
            return (
              <div key={card.id} style={{
                backgroundColor: teamObj ? teamObj.color : '#333',
                aspectRatio: '1.8', // פרופורציה מלבנית כמו כרטיס אמיתי
                borderRadius: '8px',
                border: card.team === 'bomb' ? '3px solid white' : '1px solid rgba(0,0,0,0.2)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: card.isFlipped ? 0.3 : 1, // קלף שנחשף הופך לשקוף חלקית
                transform: card.isFlipped ? 'scale(0.95)' : 'none',
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
              }}>
                {/* אייקון קטן לפצצה כדי למנוע טעויות */}
                {card.team === 'bomb' && <span style={{ fontSize: '24px' }}>💣</span>}
              </div>
            );
          })}
        </div>

        <div className="modal-actions">
          <button 
            className="btn-primary" 
            onClick={onClose} 
            style={{ width: '100%', fontSize: '20px', padding: '15px' }}
          >
            סגור מפה והתחל לשחק
          </button>
        </div>
      </div>
    </div>
  );
}