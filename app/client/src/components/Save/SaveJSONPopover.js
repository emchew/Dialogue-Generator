import React, { useState } from 'react'
import exportJSON from '../../utility/exportAsJSON';
import { saveApp } from '../../utility/saveApp';

const saveTypes = {
    APP: 'app',
    EXPORT: 'export'
}

export default function SaveJSONPopover({ nodes }) {
    const [sceneName, setSceneName] = useState('');
    const [saveType, setSaveType] = useState(saveTypes.APP);

    const handleSubmit = () => {
        console.log("integrity check");
        if (sceneName === "") {
            alert("Scene name must not be empty");
        } else {
            switch(saveType) {
                case saveTypes.APP:
                    saveApp(sceneName, nodes);
                    break;
                case saveTypes.EXPORT:
                    exportJSON(sceneName, nodes);
                    break;
            }
        }
    }

  return (
    <div className="node-container" id="create-node-container">
        <form className="container-vertical" onSubmit={e => e.preventDefault()}>
            <div className="form-grid">
                <label htmlFor="form-save-scene-txt">Scene Name</label>
                <input id="form-save-scene-txt" value={sceneName} onChange={e => setSceneName(e.target.value)}/>
                <label htmlFor="form-save-type-txt">Save As</label>
                <select onChange={e => setSaveType(e.target.value)}>
                    <option value={saveTypes.APP}>Save Progress</option>
                    <option value={saveTypes.EXPORT}>Export</option>
                </select>
            </div>
            
            <button type="submit" onClick={handleSubmit}>Download</button>
        </form>
    </div>
  )
}
