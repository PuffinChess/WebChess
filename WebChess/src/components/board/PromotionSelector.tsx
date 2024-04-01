import React from 'react';

const PromotionSelection = ({ onSelectPiece }: any) => {
    const pieces = ['queen', 'rook', 'bishop', 'knight']; // Available promotion options

    const handleSelectPiece = (piece: any) => {
        onSelectPiece(piece); // Call the provided function with the chosen piece
    };

    return (
        <div className="promotion-popup">
            <h2>Promote Pawn!</h2>
            <div className="promotion-options">
                {pieces.map((piece) => (
                    <button key={piece} onClick={() => handleSelectPiece(piece)}>
                        {piece}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PromotionSelection;