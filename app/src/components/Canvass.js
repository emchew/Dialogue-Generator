import React, { useState, useRef, useEffect, useCallback } from 'react'

import IconButton from '@mui/material/IconButton';
import AddDialogueNode from '@mui/icons-material/Add';
import AddNode from '@mui/icons-material/MapsUgc';
import AddNodeOption from '@mui/icons-material/List';
import NodeForm from './Nodes/Forms/NodeForm';
import Popover from './Popover';
import Tooltip from './Tooltip';
import DialogueNode from './Nodes/DialogueNode';
import Node from './Nodes/Node';
import DialogueNodeForm from './Nodes/Forms/DialogueNodeForm';
import OptionForm from './Nodes/Forms/OptionForm';
import Option from './Nodes/Option';

const tooltips = {
    NONE: '',
    DIALOGUE: 'dialogue',
    NODE: 'node',
    NODE_OPTION: 'node_option'
};

export const nodeType = {
    DIALOGUE: 'dialogue',
    DEFAULT: 'default',
    OPTION: 'option',
    NODE_OPTION: 'node_option'
}

export default function Canvas() {
    const canvasRef = useRef();
    const startNode = useRef(-1);
    const endNode = useRef(-1);
    const [selectedTooltip, setSelectedTooltip] = useState(tooltips.NONE);
    const [togglePopover, setTogglePopover] = useState(true);
    const [toggleDialogueNodeTooltip, setToggleDialogueNodeTooltip] = useState(false);
    const [toggleNodeTooltip, setToggleNodeTooltip] = useState(false);
    const [toggleNodeOptionTooltip, setToggleNodeOptionTooltip] = useState(false);
    const [canvasOffset, setCanvasOffset] = useState({x: 0, y: 0});
    const [parent, setParent] = useState({});
    const [nodes, setNodes] = useState([]);
    const currentPosition = { x: 50, y: 200 };

    useEffect(() => {
        console.log(nodes);
        setParent({
            canvasOffset,
            callbacks: {
                updateNode,
                connectNode,
                deselectNodes,
                isSelecting,
            }
        })
    }, [nodes]);
    // const [startNode, setStartNode] = useState(-1);
    // const [endNode, setEndNode] = useState(-1);

    const handleSubmitDialogueNode = (id) => {
        updateNodes({type: tooltips.DIALOGUE, id});
    }
    const handleSubmitNode = (speaker, line, type) => {
        updateNodes({type, speaker, line});
    }
    const handleSubmitNodeOption = (value) => {
        updateNodes({type: tooltips.NODE_OPTION, value});
    }

    const updateNodes = (newNode) => {
        newNode = {...newNode, currentPosition, next: -1, dimensions: {width: 0, height: 0}};
        const copy = [...nodes, newNode];
        setNodes(copy);
    }

    const updateNode = (index, node) => {
        const copy = [...nodes];
        console.log(copy);
        copy[index] = node;
        setNodes(copy);
    }
    
    const connectNode = (index) => {
        const copy = [...nodes];
        const start = startNode.current;
        const end = endNode.current;
        if (!isSelecting()) {
            startNode.current = index;
        } else {
            endNode.current = index;
            copy[start].next = index;
            deselectNodes();
        }
        setNodes(copy);
        // copy[index] = {...node, dimensions};
    }

    const isSelecting = () => {
        return startNode.current !== -1;
    }

    console.log(`start: ${startNode.current} end: ${endNode.current}`);
    const deselectNodes = () => {
        startNode.current = -1;
        endNode.current = -1;
    }

    useEffect(() => {
        setCanvasOffset({
            x: canvasRef.current.offsetLeft,
            y: canvasRef.current.offsetTop
        });
    }, [canvasRef]);
    
    const handlePopover = (tooltipOption) => {
        if (tooltipOption !== selectedTooltip) {
            setTogglePopover(true);
        } else {
            setTogglePopover(p => !p)
        }
        setSelectedTooltip(tooltipOption);
    }

    
    return (
    <div id="canvas" ref={canvasRef}>
        <div className="toolbar popover-anchor">
            <IconButton
                className="tooltip-anchor"
                onClick={() => handlePopover(tooltips.DIALOGUE)}
                onMouseEnter={() => setToggleDialogueNodeTooltip(true)}
                onMouseLeave={() => setToggleDialogueNodeTooltip(false)}
            >
                <AddDialogueNode/>
                <Tooltip open={toggleDialogueNodeTooltip}>
                    Dialogue Node
                </Tooltip>
            </IconButton>

            <IconButton
                className="tooltip-anchor"
                onClick={() => handlePopover(tooltips.NODE)}
                onMouseEnter={() => setToggleNodeTooltip(true)}
                onMouseLeave={() => setToggleNodeTooltip(false)}
            >
                <AddNode/>
                <Tooltip open={toggleNodeTooltip}>
                    Base Node
                </Tooltip>
            </IconButton>

            <IconButton
                className="tooltip-anchor"
                onClick={() => handlePopover(tooltips.NODE_OPTION)}
                onMouseEnter={() => setToggleNodeOptionTooltip(true)}
                onMouseLeave={() => setToggleNodeOptionTooltip(false)}
            >
                <AddNodeOption/>
                <Tooltip open={toggleNodeOptionTooltip}>
                    Node Option
                </Tooltip>
            </IconButton>

            <Popover open={togglePopover}>
                {selectedTooltip === tooltips.DIALOGUE && (
                    <DialogueNodeForm submit={handleSubmitDialogueNode}/>
                )}
                {selectedTooltip === tooltips.NODE && (
                    <NodeForm submit={handleSubmitNode}/>
                )}
                {selectedTooltip === tooltips.NODE_OPTION && (
                    <OptionForm submit={handleSubmitNodeOption}/>
                )}
            </Popover>

        </div>
        <svg width="100%" height="100%" style={{position: 'absolute', top: 0, left: 0, pointerEvents: 'none'}}>
            {nodes.map((n, key) => {
                if (n.next !== -1) {
                    const next = nodes[n.next];
                    const x1 = n.currentPosition.x + n.dimensions.width;
                    const y1 = n.currentPosition.y + (n.dimensions.height / 2);
                    const x2 = next.currentPosition.x;
                    const y2 = next.currentPosition.y + (next.dimensions.height / 2);
                    return <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} stroke="black"></line>
                } else {
                    return null;
                }
            })}
            {/* <line onClick={() => console.log("clicked")} x1="400" y1="200" x2="800" y2="250" stroke="black"/>
            <line x1="200" y1="400" x2="600" y2="400" stroke="black"/> */}
        </svg>
        
       
        
        {nodes.map((n, key) => {
            switch(n.type) {
                case nodeType.DIALOGUE:
                    return createDialogueNode(n, key, parent);
                case nodeType.DEFAULT:
                case nodeType.OPTION:
                    return createNode(n, key, parent);
                case nodeType.NODE_OPTION:
                    return createOption(n, key, parent);
                default:
                    return null;
            }
        })}
        <button className="reset-btn">Reset</button>
    </div>
  )
}

function createDialogueNode (node, key, parent) {
    console.log("rerendering")
    return (
        <DialogueNode key={key}
            index={key}
            parent={parent}
            currentNode={node}
        />
    )
}

function createNode(node, key, parent) {
    return (
        <Node key={key}
            index={key}
            parent={ parent }
            currentNode={node}
        />
    )
}

function createOption(node, key, parent) {
    return (
        <Option key={key}
            index={key}
            parent={ parent }
            currentNode={node}
        />
    )
}

