import React, { useState, useEffect } from 'react';
import NodeBase from './NodeBase';

export default function DialogueNode({currentId, canvasOffset}) {
    const [id, setId] = useState(currentId);
    const [nextId, setNextId] = useState();
    return (
        <NodeBase id={id} canvasOffset={canvasOffset} nodeClass="">
            <h5>Dialogue</h5>
             <form className="container-vertical" onSubmit={e => e.preventDefault()}>
                <div className="form-grid">
                    <label htmlFor={`node-${id}-id-txt`}>ID</label>
                    <input id={`node-${id}-id-txt`} value={id} onChange={e => setId(e.target.value)}/>
                </div>
        </form>
        </NodeBase>
    )
}
