import React, { useState, Fragment } from 'react'
import Draggable from 'react-draggable';
import IconButton from '@mui/material/IconButton';
import AddDialogueNode from '@mui/icons-material/Add';
import AddNode from '@mui/icons-material/MapsUgc';
import AddNodeOption from '@mui/icons-material/List';
import ConnectButton from '@mui/icons-material/ControlPoint';
import SaveButton from '@mui/icons-material/Save';

import { nodeType, getNodeFollowedBy } from '../utility/node';
import Popover from './Popover';
import DialogueNodeForm from './Nodes/Forms/DialogueNodeForm';
import NodeForm from './Nodes/Forms/NodeForm';
import OptionForm from './Nodes/Forms/OptionForm';
import DialogueNode from './Nodes/DialogueNode';
import Node from './Nodes/Node';
import Option from './Nodes/Option';
import Tooltip from './Tooltip';
import Line from './Line';
import saveAsJson from '../utility/saveAsJSON';
import SaveJSONPopover from './Save/SaveJSONPopover';

const tooltips = {
    NONE: '',
    DIALOGUE: 'dialogue',
    NODE: 'node',
    NODE_OPTION: 'node_option',
    SAVE: 'save'
};

export default function Canvas() {
    const currentPosition = { x: 0, y: 0 };
    const [nodes, setNodes] = useState([]);
    const [togglePopover, setTogglePopover] = useState(true);
    const [selectedTooltip, setSelectedTooltip] = useState(tooltips.NONE);
    const [toggleTooltips, setToggleTooltips] = useState(() => {
        return (new Array(Object.keys(tooltips).length - 1))
            .fill(false, 0)
    });
    const [toggleDialogueNodeTooltip, setToggleDialogueNodeTooltip] = useState(false);
    const [toggleNodeTooltip, setToggleNodeTooltip] = useState(false);
    const [toggleNodeOptionTooltip, setToggleNodeOptionTooltip] = useState(false);
    const [startNode, setStartNode] = useState(-1);
    const [endNode, setEndNode] = useState(-1);

    const handleSubmitDialogueNode = (id) => {
        updateNodes({
            type: nodeType.DIALOGUE, 
            id,
            nextDialogue: -1,
            followedBy: [nodeType.DIALOGUE, nodeType.DEFAULT, nodeType.OPTION]
        });
    }

    const handleSubmitNode = (speaker, line, type) => {
        const followedBy = getNodeFollowedBy(type);
        updateNodes({
            type,
            speaker,
            line,
            options:[],
            followedBy
        });
    }
    const handleSubmitNodeOption = (value) => {
        updateNodes({
            type: nodeType.NODE_OPTION,
            value,
            followedBy: [nodeType.DIALOGUE, nodeType.DEFAULT, nodeType.OPTION]
        });
    }
    const updateNodes = (newNode) => {
        newNode = {
            ...newNode, 
            currentPosition, 
            next: -1, 
            hasNext: true, 
            dimensions: {width: 0, height: 0}
        };
        const copy = [...nodes, newNode];
        setNodes(copy);
    }

    const getNode = (index) => {
        if (index >= 0 && index < nodes.length) {
            return nodes[index];
        }
        return null;
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
            copy[index].hasNext = true;
            setStartNode(index);
        } else if (startNode !== index && checkNodeEnd(copy[startNode], copy[index])) {
            if (copy[startNode].type === nodeType.DIALOGUE && copy[index].type === nodeType.DIALOGUE) {
                copy[startNode].nextDialogue = index;
            } else if (copy[startNode].type === nodeType.OPTION && copy[index].type === nodeType.NODE_OPTION) {
                copy[startNode].options.push(index);
            } else {
                copy[startNode].next = index;
            }
            if (!checkHasNext(copy[startNode])) {
                copy[startNode].hasNext = false;
            }
            setEndNode(index);
            deselectNodes();
        } 

        setNodes(copy);
    }

    const checkNodeEnd = (start, end) => {
        if (!start.hasNext) return false;
        return (start.followedBy.includes(end.type));
    }

    const checkHasNext = (start) => {
        if (start.type === nodeType.OPTION) {
            return (start.options.length < 4 || start.next === -1);
        }
        if (start.type === nodeType.DIALOGUE) {
            return (start.nextDialogue === -1 || start.next === -1);
        }

        return (start.next === -1);
    }

    const deselectNodes = () => {
        setStartNode(-1);
        setEndNode(-1);
    }

    const deleteConnection = (curr, next, isOptionNode) => {
        const copy = [...nodes];
        if (copy[curr].type === nodeType.DIALOGUE && copy[next].type === nodeType.DIALOGUE) {
            copy[curr].nextDialogue = -1;
        } else if (copy[curr].type === nodeType.OPTION && isOptionNode) {
            copy[curr].options.splice(next, 1);
        } else {
            copy[curr].next = -1;
        }
        copy[curr].hasNext = true;
        setNodes(copy);
    }

    const allToolTips = [
        {
            name: tooltips.DIALOGUE,
            icon: <AddDialogueNode/>,
            text: "Dialogue node",
            click: () => handlePopover(tooltips.DIALOGUE)
        }, {
            name: tooltips.NODE,
            icon: <AddNode/>,
            text: "Base Node",
            click: () => handlePopover(tooltips.NODE)
        }, {
            name: tooltips.NODE_OPTION,
            icon: <AddNodeOption/>,
            text: "Node Option",
            click: () => handlePopover(tooltips.NODE_OPTION)
        },
        {
            name: tooltips.SAVE,
            icon: <SaveButton/>,
            text: "Save as JSON",
            click: () => handlePopover(tooltips.SAVE)
        },
    ]

    const toggleTooltip = (index, value) => {
        const tips = [];
        tips[index] = value;
        setToggleTooltips(tips);
    
    }

    return (
        <div id="canvas">
            <div className="toolbar popover-anchor">
                {allToolTips.map((t, key) => {
                    return (
                        <IconButton key={key}
                            className="tooltip-anchor"
                            onClick={t.click}
                            onMouseEnter={() => toggleTooltip(key, true)}
                            onMouseLeave={() => toggleTooltip(key, false)}
                        >
                            {t.icon}
                            <Tooltip open={toggleTooltips[key]}>
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
                    {selectedTooltip === tooltips.SAVE && (
                        <SaveJSONPopover nodes={nodes}/>
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
                            {n.type === nodeType.OPTION && n.options.length > 0 && (
                                n.options.map((o, oKey)=> {
                                    return  <Line key={`${key}-goto-option-${oKey}`} node={n} next={getNode(o)} onClick={() => deleteConnection(key, oKey, true)}/>
                                })
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
                            <NewNode index={key} currentNode={n} updateNode={updateNode} getNode={getNode}/>
                            {n.hasNext && (
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