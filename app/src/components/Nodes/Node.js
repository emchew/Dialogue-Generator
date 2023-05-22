import React from 'react'
import { nodeType } from '../../utility/node';
import { getNodeFollowedBy } from '../../utility/node';
import BaseNode from './BaseNode'

export default function Node({ index, currentNode, updateNode, getNode}) {
  const nodeClass = currentNode.type === nodeType.OPTION ? "option-node" : "default-node";
  const heading = currentNode.type === nodeType.OPTION ? "Option" : "Default";
  
  const updateParentNode = ({...updatedValue}) => {
    const copy = {...currentNode, ...updatedValue};
    // If the node type has changed, update the type of nodes a node can be connected to
    if (copy.type !== currentNode.type) {
      copy.followedBy = getNodeFollowedBy(copy.type);

      // Delete links to existing nodes if they are invalid 
      if (copy.type === nodeType.DEFAULT) {
        // Can't connect default node to a node options node
        copy.options = [];
      } else if (copy.type === nodeType.OPTION && copy.next !== -1) {
        // Can't connect an option node to another option node
        const next = getNode(copy.next);
        if (next.type === nodeType.OPTION) {
          copy.next = -1;
        }
      }
    }
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
