import React, { useState } from 'react';
import { nodeType } from '../Canvas';

import NodeBase from './NodeBase';
export default function Node({id, type, currentSpeaker, currentLine, canvasOffset}) {
    const [speaker, setSpeaker] = useState(currentSpeaker);
    const [line, setLine] = useState(currentLine);
    const [node, setNode] = useState(type);
    const nodeClass = node === nodeType.OPTION ? "option-node" : "default-node";
    const heading = node === nodeType.OPTION ? "Option" : "Default";
    return (
    <NodeBase id={id} canvasOffset={canvasOffset} nodeClass={nodeClass}>
        <h5> {heading} </h5>
        <form className="container-vertical" onSubmit={e => e.preventDefault()}>
            <div className="form-grid">
                <label htmlFor="edit-form-node-select">Node Type</label>
                <select name="nodes" id="edit-form-node-select"
                  value={node}
                  onChange={e => setNode(e.target.value)}
                >
                  <option value={nodeType.DEFAULT}>Default</option>
                  <option value={nodeType.OPTION}>Option</option>
                </select>
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
