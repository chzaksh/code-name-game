import { TEAMS } from '../utils/constants';
import { UI_TEXTS } from '../utils/uiTexts';

export default function GameBoard({ cards, handleCardClick }) {
    const t = UI_TEXTS.board;
    return (
        <main className="main-board">
            <div className="grid-25">
                {cards.map(card => {
                    const teamConfig = TEAMS[card.team];
                    return (
                        <div key={card.id} className={`game-card ${card.isFlipped ? 'flipped' : ''}`} onClick={() => handleCardClick(card)}>
                            <div className="card-inner">
                                <div className="card-front">
                                    <span className="card-text">{card.text}</span>
                                </div>
                                <div className="card-back" style={{ '--team-color': teamConfig.color }}>
                                    {card.imageUrl && (
                                        <img
                                            src={card.imageUrl}
                                            alt=""
                                            className="card-back-img"
                                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                        />
                                    )}
                                    <div className="card-back-overlay"></div>
                                    <div className="card-back-content">
                    <span className="flipped-team-name">
                      {card.team === 'bomb' ? t.bombCardLabel : teamConfig.name}
                    </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </main>
    );
}