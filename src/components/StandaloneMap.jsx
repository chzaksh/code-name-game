import { useState, useEffect } from 'react';
import { TEAMS } from '../utils/constants';

export default function StandaloneMap() {
  // שולף את הכרטיסים ההתחלתיים מהזיכרון
  const [cards, setCards] = useState(() => {
    const savedCards = localStorage.getItem('family_codenames_cards');
    return savedCards ? JSON.parse(savedCards) : [];
  });

  // מאזין בזמן אמת לעדכונים מהחלון הראשי (המקרן)
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'family_codenames_cards' && e.newValue) {
        setCards(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', direction: 'rtl', fontFamily: 'system-ui, sans-serif' }}>
      <h2 style={{ color: 'white', marginBottom: '5px' }}>🗺️ מפת רב-מרגלים (סודי)</h2>
      <p style={{ color: '#94a3b8', marginBottom: '30px' }}>חלון זה מסונכרן בזמן אמת ללוח הראשי. הסתר אותו מהשחקנים.</p>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        gap: '10px',
        width: '100%',
        maxWidth: '1200px', /* התיקון המרכזי: הגדלנו את המעטפת כדי שיהיה מקום ל-8 עמודות */
        background: '#1a1a2e',
        padding: '20px',
        borderRadius: '16px',
        border: '2px solid rgba(255,255,255,0.1)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        {cards.map(card => {
          const teamObj = Object.values(TEAMS).find(t => t.id === card.team);
          
          const bgColor = teamObj ? teamObj.color : '#e2e8f0';
          const textColor = (!teamObj || card.team === 'neutral') ? '#0f172a' : '#ffffff';
          const textShadow = textColor === '#ffffff' ? '0 1px 3px rgba(0,0,0,0.8)' : 'none';

          return (
            <div key={card.id} style={{
              backgroundColor: bgColor,
              aspectRatio: '1.8',
              borderRadius: '8px',
              border: card.team === 'bomb' ? '3px solid white' : '1px solid rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: card.isFlipped ? 0.3 : 1,
              transform: card.isFlipped ? 'scale(0.95)' : 'none',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease',
              padding: '5px',
              textAlign: 'center',
              minWidth: 0, /* קריטי: מאפשר למשבצת להתכווץ ולא לפרוץ את הגריד */
              overflow: 'hidden' /* חותך תוכן שחורג מהגבולות */
            }}>
              {card.team === 'bomb' && <span style={{ fontSize: 'clamp(14px, 2vw, 20px)', marginBottom: '2px' }}>💣</span>}
              
              <span style={{ 
                color: textColor, 
                textShadow: textShadow,
                fontSize: 'clamp(10px, 1.1vw, 14px)', /* הפונט עכשיו גמיש ומותאם אישית לרוחב המסך */
                fontWeight: '900',
                lineHeight: '1.1',
                wordBreak: 'break-word',
                display: '-webkit-box',
                WebkitLineClamp: 3, /* מגביל את הטקסט ל-3 שורות כדי שלא יישפך למטה */
                WebkitBoxOrient: 'vertical'
              }}>
                {card.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}