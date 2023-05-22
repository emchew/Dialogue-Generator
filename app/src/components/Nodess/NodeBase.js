import React, { useState, useEffect, useRef } from 'react';
import IconButton from '@mui/material/IconButton';
import ConnectButton from '@mui/icons-material/ControlPoint';

const width = 250;
const height = 100;

export default function NodeBase({index, currentNode, nodeClass, parent, children}) {
    const nodeRef = useRef();
    const { canvasOffset } = parent;
    const { connectNode, deselectNodes, isSelecting, updateNode } = parent.callbacks;
    const [dimensions, setDimensions] = useState({});
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [zIndex, setZIndex] = useState(0);
    const [toggleConnectNode, setToggleConnectNode] = useState(false);
    let isClicked = false;

    useEffect(() => {
        const { offsetHeight, offsetWidth } = nodeRef.current;
        setDimensions({
            height: offsetHeight > 0 ? offsetHeight : height,
            width: offsetWidth > 0 ? offsetWidth : width
        });
    }, [nodeRef]);

    useEffect(() => {
        const element = document.getElementById(`node-${index}`);
        if (element) {
            element.addEventListener("mousemove", handleDrag);
            element.addEventListener("mouseup", handleMouseUp);
            element.addEventListener("mousedown", handleMouseDown);
            return () => {
                element.removeEventListener("mousemove", handleDrag);
                element.removeEventListener("mouseup", handleMouseUp);
                element.removeEventListener("mousedown", handleMouseDown);
            
            }
        } 
    }, [currentNode]);

    console.log(currentNode);
    const moveNode = (e) => {
        const currentPosition = {...currentNode.currentPosition};
        currentPosition.x = e.clientX - canvasOffset.x - (dimensions.width / 2);
        currentPosition.y = e.clientY - canvasOffset.y - (dimensions.height / 2);
        const copy = {...currentNode, currentPosition};
        updateNode(index, copy);
    }

    const handleMouseUp = (e) => {
        isClicked = false;
    }

    const handleMouseDown = (e) => {
        console.log("click");
        const tag = e.target.tagName.toLowerCase();
        // console.log("click");
        // Connect node
        if (isSelecting()) {
            // console.log("selected");
            parent.callbacks.updateNode(index, {...currentNode, dimensions});
            connectNode(index, currentNode, dimensions);
        }
        // Only drag node if the user is not editing form input
        else if (tag !== "input" || tag === "select" || tag === "button") {
            isClicked = true;
        }
    };
    
    const handleDrag = (e) => {
        // console.log("trying to drag");
        if (isClicked) {
            moveNode(e);
            setZIndex(1);
        } 
    }

    const handleConnectNodeClick = () => {
        console.log("handle click")
        connectNode(index, currentNode, dimensions)
    }
    return (
        <div className={`node-container node ${nodeClass}`} id={`node-${index}`}
            ref={nodeRef}
            onMouseEnter={() => setToggleConnectNode(true)}
            onMouseLeave={() => setToggleConnectNode(false)}
            style={{ top: currentNode.currentPosition.y, left: currentNode.currentPosition.x, zIndex: zIndex}} 
        >
            {children}
            {!parent.hasStartNode && toggleConnectNode && (
                <IconButton style={{position: 'absolute', right: -40, bottom:(dimensions.height / 2) - 20}}
                    onClick={handleConnectNodeClick}
                >
                    <ConnectButton/>
                </IconButton>
            )}
        </div>
    )
}
