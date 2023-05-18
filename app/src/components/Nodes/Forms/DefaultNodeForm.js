import React, { useState } from 'react'

export default function DefaultNodeForm({ submit }) {
  const [speaker, setSpeaker] = useState('');
  const [line, setLine] = useState('');
  
  const handleSubmit = () => {
    submit(speaker, line);
    handleReset();
  }

  const handleReset = () => {
    setSpeaker('');
    setLine('');
  }

  return (
    <div className="node-container" id="create-node-container">
        <form className="container-vertical" onSubmit={e => e.preventDefault()}>
            <div className="form-grid">
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
