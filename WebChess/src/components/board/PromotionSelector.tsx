const PromotionSelection = ({ onSelectPiece }: any) => {
  const pieces = ["Queen", "Rook", "Bishop", "Knight"]; // Available promotion options

  const handleSelectPiece = (piece: any) => {
    onSelectPiece(piece); // Call the provided function with the chosen piece
  };

  return (
    <div className="promotion-popup">
        <h2>Promote Pawn: </h2>
      <div className="promotion-options">
        {pieces.map((piece) => (
          <button key={piece} onClick={() => handleSelectPiece(piece)}>
            <p>{piece}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PromotionSelection;
