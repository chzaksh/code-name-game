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