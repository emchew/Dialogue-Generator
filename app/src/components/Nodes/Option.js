import React, { useState, useEffect } from 'react';
import NodeBase from './NodeBase';

export default function Option({id, currentValue, canvasOffset}) {
    const [value, setValue] = useState(currentValue);
    return (
        <NodeBase id={id} canvasOffset={canvasOffset} nodeClass="option">
            <h5>Option Value</h5>
             <form className="container-vertical" onSubmit={e => e.preventDefault()}>
                <div className="form-grid">
                    <label htmlFor={`option-${id}-id-txt`}>Value</label>
                    <input id={`option-${id}-id-txt`} value={value} onChange={e => setValue(e.target.value)}/>
                </div>
        </form>
        </NodeBase>
    )
}
