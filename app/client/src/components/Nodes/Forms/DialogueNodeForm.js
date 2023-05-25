import React, { useState } from 'react'

export default function DialogueNodeForm({ submit }) {
  const [id, setId] = useState('');
  
  const handleSubmit = () => {
    submit(id);
    handleReset();
  }

  const handleReset = () => {
    setId('');
  }

  return (
    <div className="node-container" id="create-node-container">
        <form className="container-vertical" onSubmit={e => e.preventDefault()}>
            <div className="form-grid">
                <label htmlFor="form-id-txt">Dialogue ID</label>
                <input id="form-id-txt" value={id} onChange={e => setId(e.target.value)}/>
            </div>
            
            <button type="submit" onClick={handleSubmit}>Add</button>
        </form>
    </div>
  )
}
