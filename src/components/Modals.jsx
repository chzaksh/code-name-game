import { UI_TEXTS } from '../utils/uiTexts';

export function ConfirmModal({ isOpen, card, onConfirm }) {
    if (!isOpen) return null;
    const t = UI_TEXTS.modals;

    return (
        <div className="custom-modal-overlay">
            <div className="custom-modal">
                <h3>{t.confirmTitle}</h3>
                <p>{t.confirmText.replace("{cardText}", card?.text)}</p>
                <div className="modal-actions">
                    <button className="btn-primary" onClick={() => onConfirm(true)}>{t.confirmBtnYes}</button>
                    <button className="btn-secondary" onClick={() => onConfirm(false)}>{t.confirmBtnNo}</button>
                </div>
            </div>
        </div>
    );
}

export function AlertModal({ isOpen, text, onClose }) {
    if (!isOpen) return null;
    const t = UI_TEXTS.modals;

    return (
        <div className="custom-modal-overlay">
            <div className="custom-modal alert-theme">
                <h3>{t.alertTitle}</h3>
                <p>{text}</p>
                <div className="modal-actions">
                    <button className="btn-primary" onClick={onClose}>{t.alertBtnOk}</button>
                </div>
            </div>
        </div>
    );
}

export function RestartModal({ isOpen, onConfirm }) {
    if (!isOpen) return null;
    const t = UI_TEXTS.modals;

    return (
        <div className="custom-modal-overlay">
            <div className="custom-modal">
                <h3 style={{ color: '#ef4444' }}>{t.restartTitle}</h3>
                <p>{t.restartText}</p>
                <div className="modal-actions">
                    <button className="btn-primary" style={{ background: '#ef4444', color: 'white', boxShadow: 'none' }} onClick={() => onConfirm(true)}>{t.restartBtnYes}</button>
                    <button className="btn-secondary" onClick={() => onConfirm(false)}>{t.restartBtnNo}</button>
                </div>
            </div>
        </div>
    );
}

export function VideoModal({ videoUrl, onEnded }) {
    if (!videoUrl) return null;
    const t = UI_TEXTS.modals;

    return (
        <div className="video-modal">
            <div className="video-wrapper-inner">
                <video src={videoUrl} autoPlay onEnded={onEnded} />
                <button className="skip-btn" onClick={onEnded}>{t.videoBtnClose}</button>
            </div>
        </div>
    );
}

export function VictoryModal({ team, onRestart, onContinue }) {
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