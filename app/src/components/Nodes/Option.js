import React from 'react'
import BaseNode from './BaseNode'

export default function Option({ index, currentNode, updateNode }) {
  const updateParentNode = ({...updatedValue}) => {
    const copy = {...currentNode, ...updatedValue};
    updateNode(index, copy);
  }
  return (
    <BaseNode index={index} currentNode={currentNode} updateNode={updateNode} nodeClass="option">
        <h5>Option</h5>
        <form className="container-vertical" onSubmit={e => e.preventDefault()}>
          <div className="form-grid">
              <label htmlFor={`option-${index}-id-txt`}>Value</label>
              <input id={`option-${index}-id-txt`} value={currentNode.value}
                  onChange={e => updateParentNode({value: e.target.value})}
              />
          </div>
        </form>

    </BaseNode>
  )
}
