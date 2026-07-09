import { useState } from 'react';
import { GAME_SETTINGS } from '../utils/constants';
import { UI_TEXTS } from '../utils/uiTexts';

export default function IntroScreen({ startGame }) {
    const [tutorialStep, setTutorialStep] = useState(0);
    const introData = UI_TEXTS.intro;
    const currentStep = introData.steps[tutorialStep];

    const nextTutorialStep = () => {
        if (tutorialStep < introData.steps.length - 1) setTutorialStep(prev => prev + 1);
    };

    const prevTutorialStep = () => {
        if (tutorialStep > 0) setTutorialStep(prev => prev - 1);
    };

    return (
        <div className="intro-screen-overlay">
            <div className="intro-screen-content">
                <div className="intro-header">
                    <h1 className="intro-title">{GAME_SETTINGS.gameTitle}</h1>
                    <p className="intro-subtitle">{introData.subtitle}</p>
                </div>

                <div className="modern-carousel-container">
                    <button className="modern-carousel-arrow right-arrow" onClick={prevTutorialStep} disabled={tutorialStep === 0}>
                        <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2.5" fill="none">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>

                    <div className="modern-carousel-slide">
                        <div className="slide-text-content">
                            <div className="slide-icon-badge">{currentStep.icon}</div>
                            <h2>{currentStep.title}</h2>
                            <p>{currentStep.text}</p>
                        </div>

                        <div className="slide-image-wrapper">
                            <img
                                key={tutorialStep}
                                src={currentStep.image}
                                alt={currentStep.title}
                                className="slide-image"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                        </div>

                        <div className="modern-carousel-dots">
                            {introData.steps.map((_, idx) => (
                                <span key={idx} className={`dot ${idx === tutorialStep ? 'active' : ''}`} onClick={() => setTutorialStep(idx)}></span>
                            ))}
                        </div>
                    </div>

                    <button className="modern-carousel-arrow left-arrow" onClick={nextTutorialStep} disabled={tutorialStep === introData.steps.length - 1}>
                        <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2.5" fill="none">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                </div>

                <div className="intro-actions">
                    {tutorialStep === introData.steps.length - 1 ? (
                        <button className="btn-start-massive pulse-animation" onClick={startGame}>
                            {introData.btnStart}
                        </button>
                    ) : (
                        <button className="btn-skip" onClick={startGame}>
                            {introData.btnSkip}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}