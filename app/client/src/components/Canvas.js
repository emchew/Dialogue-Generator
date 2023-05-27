import React, { useState, Fragment } from 'react'
import Draggable from 'react-draggable';
import IconButton from '@mui/material/IconButton';
import AddDialogueNode from '@mui/icons-material/Add';
import AddNode from '@mui/icons-material/MapsUgc';
import AddNodeOption from '@mui/icons-material/List';
import SaveButton from '@mui/icons-material/Save';

import { nodeType, getNodeFollowedBy } from '../utility/node';
import Popover from './Popover';
import DialogueNodeForm from './Nodes/Forms/DialogueNodeForm';
import NodeForm from './Nodes/Forms/NodeForm';
import OptionForm from './Nodes/Forms/OptionForm';
import Tooltip from './Tooltip';
import Line from './Line';
import SaveJSONPopover from './Save/SaveJSONPopover';
import NodeWrapper from './Nodes/NodeWrapper';
import LoadIcon from '@mui/icons-material/FileUpload';
import LoadJSONPopover from './Save/LoadJSONForm';

const tooltips = {
    NONE: '',
    DIALOGUE: 'dialogue',
    NODE: 'node',
    NODE_OPTION: 'node_option',
    SAVE: 'save',
    LOAD: 'load'
};

export default function Canvas() {
    const [nodes, setNodes] = useState([]);
    const [togglePopover, setTogglePopover] = useState(true);
    const [selectedTooltip, setSelectedTooltip] = useState(tooltips.NONE);
    const [toggleTooltips, setToggleTooltips] = useState(() => {
        return (new Array(Object.keys(tooltips).length - 1))
            .fill(false, 0)
    });
    const [startNode, setStartNode] = useState(-1);
    const [endNode, setEndNode] = useState(-1);

    const handleSubmitDialogueNode = (id) => {
        updateNodes({
            type: nodeType.DIALOGUE, 
            id,
            nextDialogue: -1,
            prevDialogue: -1,
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
    const handleLoad = (nodes) => {
        setNodes(nodes);
    }

    const updateNodes = (newNode) => {
        const currentPosition = {x: 200, y: 100}
        newNode = {
            ...newNode, 
            currentPosition, 
            next: -1, 
            prev: -1,
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
        node.currentPosition = { x: data.x, y: data.y };
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
    const connectNode = (index, node) => {
        const copy = [...nodes];
        if (startNode === -1) {
            copy[index].hasNext = true;
            setStartNode(index);
        } else if (startNode !== index && checkNodeEnd(copy[startNode], copy[index])) {
            if (copy[startNode].type === nodeType.DIALOGUE && copy[index].type === nodeType.DIALOGUE) {
                copy[startNode].nextDialogue = index;
                copy[index].prevDialogue = startNode;
            } else if (copy[startNode].type === nodeType.OPTION && copy[index].type === nodeType.NODE_OPTION) {
                copy[startNode].options.push(index);
                copy[index].prev = startNode;
            } else {
                copy[index].prev = startNode;
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

    const deleteNode = (curr) => {
        let copy = [...nodes];
        const node = nodes[curr];
        if (node.next !== -1) {
            const isOptionNode = node.next === nodeType.NODE_OPTION ? true : false;
            deleteConnection(curr, node.next, isOptionNode);
        } else if (curr.nextDialogue != null && curr.nextDialogue !== -1) {
            deleteConnection(curr, node.nextDialogue);
        }
        
        if (node.prev !== -1) {
            if (copy[node.prev].type === nodeType.OPTION && node.type === nodeType.NODE_OPTION) {
                console.log(copy[node.prev].options)
                const index = copy[node.prev].options.findIndex(o => o === curr);
                console.log(index);
                copy[node.prev].options.splice(index, 1);
                console.log(copy[node.prev].options)
            }
            else {
                copy[node.prev].next = -1;
            }
             // Shuffle options
            if (copy[node.prev].type === nodeType.OPTION) {
                copy[node.prev].options = copy[node.prev].options.map(i => i >= curr ? i - 1 : i);
                console.log(copy[node.prev].options)
            }
            copy[node.prev].hasNext = true;
        } else if (node.prevDialogue != null && node.prevDialogue !== -1) {
            console.log("go away")
            copy[node.prevDialogue].nextDialogue = -1;
            copy[node.prevDialogue].hasNext = true;
        }
       
        copy.splice(curr, 1);
        // Shuffle all nodes
        copy = copy.map((node, index) => {
            if (node.next >= curr) node.next--;
            if (node.nextDialogue != null && node.nextDialogue >= curr) node.nextDialogue--;
            if (node.prev !== -1 && node.prev >= curr) node.prev--;
            if (node.prevDialogue != null && node.prevDialogue >= curr) node.prevDialogue--;
        
            return node;
        })
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
            text: "Save",
            click: () => handlePopover(tooltips.SAVE)
        },
        {
            name: tooltips.LOAD,
            icon: <LoadIcon/>,
            text: "Load file",
            click: () => handlePopover(tooltips.LOAD)
        },
    ]

    const toggleTooltip = (index, value) => {
        const tips = [];
        tips[index] = value;
        setToggleTooltips(tips);
    }

    return (
        <div id="canvas">
            <div id="canvas-container">
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
                        {selectedTooltip === tooltips.LOAD && (
                            <LoadJSONPopover nodes={nodes} load={handleLoad}/>
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
                            }}
                            bounds="parent"
                            scale={1}
                        >
                            <div className="handle wrapper">
                                <NodeWrapper index={key} currentNode={n}
                                    updateNode={updateNode}
                                    getNode={getNode}
                                    connectNode={connectNode}
                                    deleteNode={deleteNode}
                                />
                            </div>
                        </Draggable>
                    )
                })}
            </div>
        </div>
    )
}