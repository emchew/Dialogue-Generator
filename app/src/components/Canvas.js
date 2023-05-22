import React, { useState, Fragment } from 'react'
import Draggable from 'react-draggable';
import IconButton from '@mui/material/IconButton';
import AddDialogueNode from '@mui/icons-material/Add';
import AddNode from '@mui/icons-material/MapsUgc';
import AddNodeOption from '@mui/icons-material/List';
import ConnectButton from '@mui/icons-material/ControlPoint';

import { nodeType } from '../App';
import Popover from './Popover';
import DialogueNodeForm from './Nodes/Forms/DialogueNodeForm';
import NodeForm from './Nodes/Forms/NodeForm';
import OptionForm from './Nodes/Forms/OptionForm';
import DialogueNode from './Nodes/DialogueNode';
import Node from './Nodes/Node';
import Option from './Nodes/Option';
import Tooltip from './Tooltip';
import Line from './Line';

const tooltips = {
    NONE: '',
    DIALOGUE: 'dialogue',
    NODE: 'node',
    NODE_OPTION: 'node_option'
};

export default function Canvas() {
    const currentPosition = { x: 0, y: 0 };
    const [nodes, setNodes] = useState([]);
    const [togglePopover, setTogglePopover] = useState(true);
    const [selectedTooltip, setSelectedTooltip] = useState(tooltips.NONE);
    const [toggleDialogueNodeTooltip, setToggleDialogueNodeTooltip] = useState(false);
    const [toggleNodeTooltip, setToggleNodeTooltip] = useState(false);
    const [toggleNodeOptionTooltip, setToggleNodeOptionTooltip] = useState(false);
    const [startNode, setStartNode] = useState(-1);
    const [endNode, setEndNode] = useState(-1);

    const handleSubmitDialogueNode = (id) => updateNodes({type: tooltips.DIALOGUE, id, nextDialogue: -1});
    const handleSubmitNode = (speaker, line, type) => updateNodes({type, speaker, line});
    const handleSubmitNodeOption = (value) => updateNodes({type: tooltips.NODE_OPTION, value});

    const getNode = (index) => {
        if (index >= 0 && index < nodes.length) {
            return nodes[index];
        }
        return null;
    }
    const updateNodes = (newNode) => {
        newNode = {...newNode, currentPosition, next: -1, prev: -1, dimensions: {width: 0, height: 0}};
        const copy = [...nodes, newNode];
        setNodes(copy);
    }
    const updateNode = (index, node) => {
        const copy = [...nodes];
        copy[index] = node;
        setNodes(copy);
    }
    
    const updateNodePosition = (index, node, data) => {
        const {x, y} = node.currentPosition;
        console.log(`x delta ${data.deltaX} y delta ${data.deltaY}`);
        node.currentPosition = { x: data.x, y: data.y };
        // node.currentPosition = { x: x + data.deltaX, y: y + data.deltaY };
        console.log(node.currentPosition);
        updateNode(index, node);
    }
    
    const handlePopover = (tooltipOption) => {
        if (tooltipOption !== selectedTooltip) {
            setTogglePopover(true);
        } else {
            setTogglePopover(p => !p)
        }
        setSelectedTooltip(tooltipOption);
    }
    console.log(`startNode ${startNode} end ${endNode}`);
    const connectNode = (index, node) => {
        const copy = [...nodes];
        if (startNode === -1) {
            setStartNode(index);
        } else if (startNode !== index && checkNodeConnection(copy[startNode], node)) {
            if (copy[startNode].type === nodeType.DIALOGUE && copy[index].type === nodeType.DIALOGUE) {
                copy[startNode].nextDialogue = index;
                console.log("in dialogue");
            } else {
                copy[startNode].next = index;
                copy[index].prev = startNode;
            }
            setEndNode(index);
            deselectNodes();
        } 

        setNodes(copy);
    }

    const checkNodeConnection = (start, end) => {
        console.log("checkign")

        return true;
        // if (start.type === end.type)
    }

    const deselectNodes = () => {
        setStartNode(-1);
        setEndNode(-1);
    }

    const deleteConnection = (curr, next) => {
        const copy = [...nodes];
        copy[curr].next = -1;
        copy[next].prev = -1;
        setNodes(copy);
    }

    const allToolTips = [
        {
            name: tooltips.DIALOGUE,
            mouseEnter: () => setToggleDialogueNodeTooltip(true),
            mouseLeave: () => setToggleDialogueNodeTooltip(false),
            icon: <AddDialogueNode/>,
            open: toggleDialogueNodeTooltip,
            text: "Dialogue node"
        }, {
            name: tooltips.NODE,
            mouseEnter: () => setToggleNodeTooltip(true),
            mouseLeave: () => setToggleNodeTooltip(false),
            icon: <AddNode/>,
            open: toggleNodeTooltip,
            text: "Base Node"
        }, {
            name: tooltips.NODE_OPTION,
            mouseEnter: () => setToggleNodeOptionTooltip(true),
            mouseLeave: () => setToggleNodeOptionTooltip(false),
            icon: <AddNodeOption/>,
            open: toggleNodeOptionTooltip,
            text: "Node Option"
        }
    ]


    return (
        <div id="canvas">
            <div className="toolbar popover-anchor">
                {allToolTips.map((t, key) => {
                    return (
                        <IconButton key={key}
                            className="tooltip-anchor"
                            onClick={() => handlePopover(t.name)}
                            onMouseEnter={t.mouseEnter}
                            onMouseLeave={t.mouseLeave}
                        >
                            {t.icon}
                            <Tooltip open={t.open}>
                                {t.text}
                            </Tooltip>
                        </IconButton>
                    )
                })}
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
                    return (
                        <Fragment key={key}>
                            {n.next !== -1 && (
                                <Line key={`${key}-goto-node`} node={n} next = {getNode(n.next)} onClick={() => deleteConnection(key, n.next)}/>
                            )}
                            {n.nextDialogue != null && n.nextDialogue !== -1 && (
                                <Line key={`${key}-goto-dialogue`} node={n} next= {getNode(n.nextDialogue)} onClick={() => deleteConnection(key, n.nextDialogue)}/>
                            )}
                        </Fragment>
                    )        
                })}
            </svg>
        
            {nodes.map((n, key) => {
                return (
                    <Draggable
                        key={key}
                        handle=".handle"
                        position={{x: n.currentPosition.x, y: n.currentPosition.y}}
                        onDrag={(e, data) => updateNodePosition(key, n, data)}
                        onMouseDown={(e, data) => {
                            if (startNode !== -1) {
                                connectNode(key, n);
                            }
                            // console.log(e);
                            // console.log(data);
                        }}
                        bounds="parent"
                        scale={1}
                    >
                        <div className="handle wrapper">
                            <NewNode index={key} currentNode={n} updateNode={updateNode}/>
                            {(n.next === -1 || n.nextDialogue === -1) && (
                                <IconButton 
                                    style={{
                                        position: 'absolute',
                                        left: n.dimensions.width + 5,
                                        top: n.dimensions.height / 2 - 20
                                    }}
                                    onClick={() => connectNode(key, n)}
                                >
                                    <ConnectButton/>
                                </IconButton>
                            )}
                        </div>
                    </Draggable>
                )
            })}
        </div>
    )
}
const NewNode = ({key, ...props}) => {
    const { currentNode } = props;
    switch(currentNode.type) {
        case nodeType.DIALOGUE:
            return <DialogueNode {...props}/>
        case nodeType.DEFAULT:
        case nodeType.OPTION:
            return <Node {...props}/>
        case nodeType.NODE_OPTION:
            return <Option {...props}/>
        default:
            return null;
    }
}