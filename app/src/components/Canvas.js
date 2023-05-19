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
    const [nodes, setNodes] = useState([]);

    const handleSubmitDialogueNode = (id) => {
        const newNode = {type: tooltips.DIALOGUE, id};
        updateNodes(newNode);
    }
    
    const handleSubmitNode = (speaker, line, type) => {
        const newNode = {type, speaker, line};
        updateNodes(newNode);
    }
    const handleSubmitNodeOption = (value) => {
        const newNode = {value};
        updateNodes(newNode);
    }

    const updateNodes = (newNode) => {
        const copy = [...nodes];
        copy.push(newNode);
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
        <DialogueNode
            currentId="1"
            canvasOffset={ canvasOffset }
        />
        <Node
            id="2"
            canvasOffset={ canvasOffset }
            currentSpeaker="Sam"
            currentLine="We needa go now"
        />
        {nodes.map((n, key) => {
            switch(n.type) {
                case nodeType.DIALOGUE:
                    return createDialogueNode(n, key, canvasOffset);
                case nodeType.DEFAULT || nodeType.OPTION:
                    return createNode(n, key, canvasOffset);
                case nodeType.NODE_OPTION:
                    return createOption(n, key, canvasOffset);
                default:
                    return null;
            }
        })}
        <button className="reset-btn">Reset</button>
    </div>
  )
}

function createDialogueNode (node, key, canvasOffset) {
    return (
        <DialogueNode key={key}
            id="2"
        />
    )
}

function createNode(node, key, canvasOffset) {
    return (
        <Node key={key}
            id={`node-${key}`}
            type={node.type}
            canvasOffset={ canvasOffset }
            currentSpeaker={node.speaker}
            currentLine={node.line}
        />
    )
}

function createOption(node, key, canvasOffset) {
    return (
        <Option key={key}
            id={`node-option-${key}`}
            canvasOffset={ canvasOffset }
            currentValue={node.value}
        />
    )
}

