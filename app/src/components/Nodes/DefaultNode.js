import React, { useState } from 'react';
import NodeBase from './NodeBase';
export default function DefaultNode({id, currentSpeaker, currentLine, canvasOffset}) {
    const [speaker, setSpeaker] = useState(currentSpeaker);
    const [line, setLine] = useState(currentLine);
    return (
    <NodeBase id={id} canvasOffset={canvasOffset} nodeClass="default-node">
        <h5>Default</h5>
        <form className="container-vertical" onSubmit={e => e.preventDefault()}>
            <div className="form-grid">
                <label htmlFor="edit-form-speaker-txt">Speaker</label>
                <input id="edit-form-speaker-txt" value={speaker} onChange={e => setSpeaker(e.target.value)}/>

                <label htmlFor="edit-form-line-txt">Line</label>
                <textarea id="edit-form-line-txt"
                rows={2}
                value={line}
                onChange={e => setLine(e.target.value)}
                />
            </div>
        </form>
    </NodeBase>
  )
}
