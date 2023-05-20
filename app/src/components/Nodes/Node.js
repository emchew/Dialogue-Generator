import React from 'react'
import { nodeType } from '../../App';
import BaseNode from './BaseNode'
export default function Node({ index, currentNode, updateNode }) {
  const nodeClass = currentNode.type === nodeType.OPTION ? "option-node" : "default-node";
  const heading = currentNode.type === nodeType.OPTION ? "Option" : "Default";
  
  const updateParentNode = ({...updatedValue}) => {
    const copy = {...currentNode, ...updatedValue};
    updateNode(index, copy);
  }
  return (
    <BaseNode index={index} currentNode={currentNode} updateNode={updateNode} nodeClass={nodeClass}>
        <h5>{heading}</h5>
        <form className="container-vertical" onSubmit={e => e.preventDefault()}>
            <div className="form-grid">
                <label htmlFor={`node-${index}-node-select`}>Node Type</label>
                <select name="nodes" id={`node-${index}-node-select`}
                  value={currentNode.type}
                  onChange={e => updateParentNode({type: e.target.value})}
                >
                  <option value={nodeType.DEFAULT}>Default</option>
                  <option value={nodeType.OPTION}>Option</option>
                </select>
                <label htmlFor={`node-${index}-speaker-txt`}>Speaker</label>
                <input id={`node-${index}-speaker-txt`}
                  value={currentNode.speaker}
                  onChange={e => updateParentNode({speaker: e.target.value})}
                />

                <label htmlFor={`node-${index}-line-txt`}>Line</label>
                <textarea id={`node-${index}-line-txt`}
                rows={2}
                value={currentNode.line}
                onChange={e => updateParentNode({line: e.target.value})}
                />
            </div>
        </form>
    </BaseNode>
  )
}
