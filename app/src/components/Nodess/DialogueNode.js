import React, { useState, useEffect } from 'react';
import NodeBase from './NodeBase';

export default function DialogueNode({ index, currentNode, parent}) {
    console.log(currentNode);
    // const [node, setNode] = useState(currentNode);
    const [nextId, setNextId] = useState();
    const updateNode = ({...updatedValue}) => {
        const copy = {...currentNode, ...updatedValue};
        // setNode(copy);
        console.log(copy);
        parent.callbacks.updateNode(index, copy);
    }
    return (
        <NodeBase index={index} currentNode={currentNode} parent={parent} nodeClass="">
            <h5>Dialogue</h5>
             <form className="container-vertical" onSubmit={e => e.preventDefault()}>
                <div className="form-grid">
                    <label htmlFor={`node-${index}-id-txt`}>ID</label>
                    <input id={`node-${index}-id-txt`} value={currentNode.id} onChange={e => updateNode({id: e.target.value})}/>
                </div>
        </form>
        </NodeBase>
    )
}
