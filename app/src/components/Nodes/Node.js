import React, { useState } from 'react';
import { nodeType } from '../Canvas';
import NodeBase from './NodeBase';

export default function Node({index, currentNode, parent}) {
    const [node, setNode] = useState(currentNode);

    const handleSpeakerChange = (speaker) => updateNode({speaker});
    const handleLineChange = (line) => updateNode({line});
    const handleTypeChange = (type) => updateNode({type});
    const updateNode = ({...updatedValue}) => {
      const copy = {...node, ...updatedValue};
      setNode(copy);
    }

    const nodeClass = node.type === nodeType.OPTION ? "option-node" : "default-node";
    const heading = node.type === nodeType.OPTION ? "Option" : "Default";
    return (
    <NodeBase id={index} currentNode={node} parent={parent} nodeClass={nodeClass}>
        <h5> {heading} </h5>
        <form className="container-vertical" onSubmit={e => e.preventDefault()}>
            <div className="form-grid">
                <label htmlFor={`node-${index}-node-select`}>Node Type</label>
                <select name="nodes" id={`node-${index}-node-select`}
                  value={node}
                  onChange={e => handleTypeChange(e.target.value)}
                >
                  <option value={nodeType.DEFAULT}>Default</option>
                  <option value={nodeType.OPTION}>Option</option>
                </select>
                <label htmlFor={`node-${index}-speaker-txt`}>Speaker</label>
                <input id={`node-${index}-speaker-txt`} value={node.speaker} onChange={e => handleSpeakerChange(e.target.value)}/>

                <label htmlFor={`node-${index}-line-txt`}>Line</label>
                <textarea id={`node-${index}-line-txt`}
                rows={2}
                value={node.line}
                onChange={e => handleLineChange(e.target.value)}
                />
            </div>
        </form>
    </NodeBase>
  )
}
