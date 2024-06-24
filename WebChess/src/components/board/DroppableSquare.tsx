import React from 'react';
import { useDrop } from 'react-dnd';
import { Piece } from '../pieces/Piece';
import { ChessTileProps } from './Square';

const ChessTile: React.FC<ChessTileProps> = ({ position, color, onDrop, children }) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'PIECE',
        drop: (item: Piece) => {
            onDrop(item.position, position, false);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }));


    const tileStyle = {
        backgroundColor: isOver ? 'lightgreen' : '',
    };

    return (
        <div ref={drop} id={color} style={tileStyle}>
            {children}
        </div>
    );
};

export default ChessTile;
