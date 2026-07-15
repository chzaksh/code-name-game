import { UI_TEXTS } from '../../utils/uiTexts';

export default function VideoModal({ videoUrl, onEnded }) {
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