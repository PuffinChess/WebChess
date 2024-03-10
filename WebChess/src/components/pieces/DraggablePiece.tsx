import { Piece } from "./Piece"
import { useDrag } from 'react-dnd';
import { returnImageUrl } from "../utils/ReturnImageUrl";


const DraggablePiece: React.FC<Piece> = ({ type, position }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'PIECE',
        item: { type, position },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }), []);

    const pieceStyle = {
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
    };

    return (
        <div ref={drag} style={pieceStyle}>
            <img draggable="false" src={returnImageUrl(type)} />
        </div>
    )
}

export default DraggablePiece