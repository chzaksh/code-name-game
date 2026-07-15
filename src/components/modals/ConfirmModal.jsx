import { UI_TEXTS } from '../../utils/uiTexts';

// רכיב המציג חלון אישור לפני פתיחת כרטיס
export default function ConfirmModal({ isOpen, card, onConfirm }) {
    if (!isOpen) return null; // אם החלון לא פתוח, אל תציג כלום
    const t = UI_TEXTS.modals;

    return (
        <div className="custom-modal-overlay">
            <div className="custom-modal">
                <h3>{t.confirmTitle}</h3>
                {/* מחליף את מציין המיקום בטקסט האמיתי של הכרטיס */}
                <p>{t.confirmText.replace("{cardText}", card?.text)}</p>
                <div className="modal-actions">
                    <button className="btn-primary" onClick={() => onConfirm(true)}>{t.confirmBtnYes}</button>
                    <button className="btn-secondary" onClick={() => onConfirm(false)}>{t.confirmBtnNo}</button>
                </div>
            </div>
        </div>
    );
}