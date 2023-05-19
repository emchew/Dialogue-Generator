import React, { useState } from 'react'

export default function DialogueNodeForm({ submit }) {
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
                <label htmlFor="form-id-txt">Dialogue ID</label>
                <input id="form-id-txt" value={speaker} onChange={e => setSpeaker(e.target.value)}/>
            </div>
            
            <button type="submit" onClick={handleSubmit}>Add</button>
        </form>
    </div>
  )
}
