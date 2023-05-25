import React from 'react'
import BaseNode from './BaseNode'

export default function DialogueNode({ index, currentNode, updateNode, children}) {
    const updateParentNode = ({...updatedValue}) => {
      const copy = {...currentNode, ...updatedValue};
      updateNode(index, copy);
    }
    return (
      <BaseNode index={index} currentNode={currentNode} updateNode={updateNode} nodeClass="">
          <h5>Dialogue</h5>

          <form className="container-vertical" onSubmit={e => e.preventDefault()}>
                  <div className="form-grid">
                      <label htmlFor={`node-${index}-id-txt`}>ID</label>
                      <input id={`node-${index}-id-txt`} value={currentNode.id} onChange={e => updateParentNode({id: e.target.value})}/>
                  </div>
          </form>
      </BaseNode>
    )
}
