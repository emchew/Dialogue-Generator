import React, { useState, useEffect } from 'react';
import NodeBase from './NodeBase';

export default function Option({index, currentNode, parent }) {
    const updateNode = ({...updatedValue}) => {
      const copy = {...currentNode, ...updatedValue};
      parent.callbacks.updateNode(index, copy);
    }
    return (
        <NodeBase index={index} currentNode={currentNode} parent={parent} nodeClass="option">
            <h5>Option Value</h5>
             <form className="container-vertical" onSubmit={e => e.preventDefault()}>
                <div className="form-grid">
                    <label htmlFor={`option-${index}-id-txt`}>Value</label>
                    <input id={`option-${index}-id-txt`} value={currentNode.value}
                        onChange={e => updateNode({value: e.target.value})}
                    />
                </div>
        </form>
        </NodeBase>
    )
}
