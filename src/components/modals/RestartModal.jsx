import { UI_TEXTS } from '../../utils/uiTexts';

export default function RestartModal({ isOpen, onConfirm }) {
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