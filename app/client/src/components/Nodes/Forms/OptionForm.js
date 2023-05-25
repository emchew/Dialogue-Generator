import React, { useState } from 'react'

export default function OptionForm({ submit }) {
  const [value, setValue] = useState('');
  
  const handleSubmit = () => {
    submit(value);
    handleReset();
  }

  const handleReset = () => {
    setValue('');
  }

  return (
    <div className="node-container" id="create-node-container">
        <form className="container-vertical" onSubmit={e => e.preventDefault()}>
            <div className="form-grid">
                <label htmlFor="form-option-value-txt">Value</label>
                <input id="form-option-value-txt" value={value} onChange={e => setValue(e.target.value)}/>
            </div>
            
            <button type="submit" onClick={handleSubmit}>Add</button>
        </form>
    </div>
  )
}
