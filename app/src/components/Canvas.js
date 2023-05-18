import React, { useState, useRef, useEffect } from 'react'

import IconButton from '@mui/material/IconButton';
import AddNode from '@mui/icons-material/Add';
import AddDefault from '@mui/icons-material/AddComment';
import DefaultNodeForm from './Nodes/Forms/DefaultNodeForm';
import Popover from './Popover';
import Tooltip from './Tooltip';
import DialogueNode from './Nodes/DialogueNode';
import DefaultNode from './Nodes/DefaultNode';
import DialogueNodeForm from './Nodes/Forms/DialogueNodeForm';

const tooltips = {
    NONE: '',
    DIALOGUE: 'dialogue',
    DEFAULT: 'default'
};

export default function Canvas() {
    const canvasRef = useRef();
    const [selectedTooltip, setSelectedTooltip] = useState(tooltips.NONE);
    const [togglePopover, setTogglePopover] = useState(true);
    const [toggleNodeTooltip, setToggleNodeTooltip] = useState(false);
    const [toggleDefaultNodeTooltip, setToggleDefaultNodeTooltip] = useState(false);
    const [canvasOffset, setCanvasOffset] = useState({x: 0, y: 0});
    const [nodes, setNodes] = useState([]);
    const handleSubmitDefaultNode = (speaker, line) => {
        const newNode = {type: tooltips.DEFAULT, speaker, line};
        updateNodes(newNode);
    }

    const handleSubmitDialogueNode = (id) => {
        const newNode = {type: tooltips.DIALOGUE, id};
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
                onMouseEnter={() => setToggleNodeTooltip(true)}
                onMouseLeave={() => setToggleNodeTooltip(false)}
            >
                <AddNode/>
                <Tooltip open={toggleNodeTooltip}>
                    Dialogue Node
                </Tooltip>
            </IconButton>

            <IconButton
                className="tooltip-anchor"
                onClick={() => handlePopover(tooltips.DEFAULT)}
                onMouseEnter={() => setToggleDefaultNodeTooltip(true)}
                onMouseLeave={() => setToggleDefaultNodeTooltip(false)}
            >
                <AddDefault/>
                <Tooltip open={toggleDefaultNodeTooltip}>
                    Default Node
                </Tooltip>
            </IconButton>
            <Popover open={togglePopover}>
                {selectedTooltip === tooltips.DIALOGUE && (
                    <DialogueNodeForm submit={handleSubmitDialogueNode}/>
                )}
                {selectedTooltip === tooltips.DEFAULT && (
                    <DefaultNodeForm submit={handleSubmitDefaultNode}/>
                )}
            </Popover>

        </div>
        <DialogueNode
            currentId="1"
            canvasOffset={ canvasOffset }
        />
        <DefaultNode
            id="2"
            canvasOffset={ canvasOffset }
            currentSpeaker="Sam"
            currentLine="We needa go now"
        />
        {nodes.map((n, key) => {
            if (n.type === 'default') {
                return createDefaultNode(n, key, canvasOffset);
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

function createDefaultNode(node, key, canvasOffset) {
    return (
        <DefaultNode key={key}
            id={`node-default-${key}`}
            canvasOffset={ canvasOffset }
            currentSpeaker={node.speaker}
            currentLine={node.line}
        />
    )
}


