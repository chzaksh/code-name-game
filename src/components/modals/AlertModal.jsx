import { UI_TEXTS } from '../../utils/uiTexts';

export default function AlertModal({ isOpen, text, onClose }) {
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

