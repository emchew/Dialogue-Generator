import React, { useState } from 'react'
import saveAsJson from '../../utility/saveAsJSON';

export default function SaveJSONPopover({ nodes }) {
    console.log(nodes);
    const [sceneName, setSceneName] = useState('');

    const handleSubmit = () => {
        console.log("integrity check");
        if (sceneName === "") {
            alert("Scene name must not be empty");
        } else {
            saveAsJson(sceneName, nodes);
        }
    }

  return (
    <div className="node-container" id="create-node-container">
        <form className="container-vertical" onSubmit={e => e.preventDefault()}>
            <div className="form-grid">
                <label htmlFor="form-save-scene-txt">Scene Name</label>
                <input id="form-save-scene-txt" value={sceneName} onChange={e => setSceneName(e.target.value)}/>
            </div>
            
            <button type="submit" onClick={handleSubmit}>Download JSON</button>
        </form>
    </div>
  )
}
