import React, { useState } from 'react'
import { nodeType } from '../../Canvas';

export default function NodeForm({ submit }) {
  const [speaker, setSpeaker] = useState('');
  const [line, setLine] = useState('');
  const [node, setNode] = useState(nodeType.DEFAULT);
  
  const handleSubmit = () => {
    submit(speaker, line, node);
    handleReset();
  }

  const handleReset = () => {
    setSpeaker('');
    setLine('');
    setNode('');
  }

  return (
    <div className="node-container" id="create-node-container">
        <form className="container-vertical" onSubmit={e => e.preventDefault()}>
            <div className="form-grid">
                <label htmlFor="form-node-select">Node Type</label>
                <select name="nodes" id="form-node-select"
                  value={node}
                  onChange={e => setNode(e.target.value)}
                >
                  <option value={nodeType.DEFAULT}>Default</option>
                  <option value={nodeType.OPTION}>Option</option>
                </select>

                <label htmlFor="form-speaker-txt">Speaker</label>
                <input id="form-speaker-txt" value={speaker} onChange={e => setSpeaker(e.target.value)}/>

                <label htmlFor="form-line-txt">Line</label>
                <textarea id="form-line-txt"
                  rows={2}
                  value={line}
                  onChange={e => setLine(e.target.value)}
                />
            </div>
            
            <button type="submit" onClick={handleSubmit}>Add</button>
        </form>
    </div>
  )
}
