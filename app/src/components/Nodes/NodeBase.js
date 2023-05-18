import React, { useState, useEffect } from 'react';

const width = 250;
const height = 100;

export default function Node({id, canvasOffset, nodeClass, children}) {
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [position, setPosition] = useState({ x: 50, y: 200 });
    const [zIndex, setZIndex] = useState(0);
    let isClicked = false;

    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
        } else {
            const element = document.getElementById(id);
            element.addEventListener("mousemove", handleDrag);
            element.addEventListener("mouseup", handleClick);
            element.addEventListener("mousedown", handleClick);
            return () => {
                const element = document.getElementById(id);
                element.removeEventListener("mousemove", handleDrag);
                element.removeEventListener("mouseup", handleClick);
                element.removeEventListener("mousedown", handleClick);
            }
        }
    }, [isFirstRender]);

    const moveNode = (e) => {
        const prevPosition = {...position}
        prevPosition.x = e.clientX - canvasOffset.x - (width / 2);
        prevPosition.y = e.clientY - canvasOffset.y - (height / 2);
        setPosition(prevPosition);
    }

    const handleClick = () => {
        isClicked = !isClicked;
    };
    
    const handleDrag = (e) => {
        if (isClicked) {
            moveNode(e);
            setZIndex(1);
        } 
    }

    return (
        <div className={`node-container node ${nodeClass}`} id={id}
            style={{ top: position.y, left: position.x, zIndex: zIndex}} 
        >
            {children}
        </div>
    )
}
