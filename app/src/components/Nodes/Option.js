import React, { useState, useEffect } from 'react';
import NodeBase from './NodeBase';

export default function Option({index, currentNode, parent }) {
    const [node, setNode] = useState(currentNode);
    const updateNode = ({...updatedValue}) => {
      const copy = {...node, ...updatedValue};
      setNode(copy);
    }
    return (
        <NodeBase id={index} currentNode={node} parent={parent} nodeClass="option">
            <h5>Option Value</h5>
             <form className="container-vertical" onSubmit={e => e.preventDefault()}>
                <div className="form-grid">
                    <label htmlFor={`option-${index}-id-txt`}>Value</label>
                    <input id={`option-${index}-id-txt`} value={node.value}
                        onChange={e => updateNode({value: e.target.value})}
                    />
                </div>
        </form>
        </NodeBase>
    )
}
