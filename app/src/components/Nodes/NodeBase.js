import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import ConnectButton from '@mui/icons-material/ControlPoint';

const width = 250;
const height = 100;

export default function NodeBase({index, currentNode, nodeClass, parent, children}) {
    const [node, setNode] = useState(currentNode);
    const { canvasOffset } = parent;
    // const { handleConnectNodeClick } = parent.callbacks;
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [zIndex, setZIndex] = useState(0);
    const [toggleConnectNode, setToggleConnectNode] = useState(false);
    let isClicked = false;

    const handleConnectNodeClick = () => {}
    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
        } else {
            const element = document.getElementById(`node-${index}`);
            element.addEventListener("mousemove", handleDrag);
            element.addEventListener("mouseup", handleClick);
            element.addEventListener("mousedown", handleClick);
            return () => {
                element.removeEventListener("mousemove", handleDrag);
                element.removeEventListener("mouseup", handleClick);
                element.removeEventListener("mousedown", handleClick);
            }
        }
    }, [isFirstRender]);

    const moveNode = (e) => {
        const currentPosition = node.currentPosition;
        currentPosition.x = e.clientX - canvasOffset.x - (width / 2);
        currentPosition.y = e.clientY - canvasOffset.y - (height / 2);
        setNode({...node, currentPosition});
    }

    const handleClick = (e) => {
        const tag = e.target.tagName.toLowerCase();
        // Only drag node if the user is not editing form input
        if (tag !== "input" || tag === "select" || tag === "button") {
            isClicked = !isClicked;
        } else {
            isClicked = false;
        }
    };
    
    const handleDrag = (e) => {
        if (isClicked) {
            moveNode(e);
            setZIndex(1);
        } 
    }

    return (
        <div className={`node-container node ${nodeClass}`} id={`node-${index}`}
            onMouseEnter={() => setToggleConnectNode(true)}
            onMouseLeave={() => setToggleConnectNode(false)}
            style={{ top: node.currentPosition.y, left: node.currentPosition.x, zIndex: zIndex}} 
        >
            {children}
            {toggleConnectNode && (
                <IconButton style={{position: 'absolute', right: -40, bottom: height / 2}}
                    onClick={() => handleConnectNodeClick()}
                >
                    <ConnectButton/>
                </IconButton>
            )}
        </div>
    )
}
