import React, { useState, useRef, useEffect } from 'react'

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
    OPTION: 'option'
}

export default function Canvas() {
    const canvasRef = useRef();
    const [selectedTooltip, setSelectedTooltip] = useState(tooltips.NONE);
    const [togglePopover, setTogglePopover] = useState(true);
    const [toggleDialogueNodeTooltip, setToggleDialogueNodeTooltip] = useState(false);
    const [toggleNodeTooltip, setToggleNodeTooltip] = useState(false);
    const [toggleNodeOptionTooltip, setToggleNodeOptionTooltip] = useState(false);
    const [canvasOffset, setCanvasOffset] = useState({x: 0, y: 0});
    const [startNode, setStartNode] = useState(-1);
    const [endNode, setEndNode] = useState(-1);
    const [nodes, setNodes] = useState([]);
    const currentPosition = { x: 50, y: 200 };

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
        newNode = {...newNode, currentPosition};
        const copy = [...nodes, newNode];
        console.log(newNode)
        setNodes(copy);
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
            {/* <line onClick={() => console.log("clicked")} x1="400" y1="200" x2="800" y2="250" stroke="black"/>
            <line x1="200" y1="400" x2="600" y2="400" stroke="black"/> */}
        </svg>
        
        {/* <DialogueNode
            currentId="1"
            canvasOffset={ canvasOffset }
        />
        <Node
            id="2"
            canvasOffset={ canvasOffset }
            currentSpeaker="Sam"
            currentLine="We needa go now"
        /> */}
        {nodes.map((n, key) => {
            const parent = {
                canvasOffset,
                callbacks: {}
            }
            switch(n.type) {
                case nodeType.DIALOGUE:
                    return createDialogueNode(n, key, parent);
                case nodeType.DEFAULT || nodeType.OPTION:
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

