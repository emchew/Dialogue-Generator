import React, { useState } from 'react'
import exportJSON from '../../utility/exportAsJSON';
import { loadApp } from '../../utility/saveApp';

const saveTypes = {
    APP: 'app',
    EXPORT: 'export'
}

export default function LoadJSONPopover({ load }) {
    const [uploaded, setUploaded] = useState({});

    const handleUpload = (e) => {
        let file = e.target.files[0];
        if (file != null) {
            if (!file.name.startsWith('generator-save')) {
                setUploaded({});
                alert("File should start with 'generator-save'. Please make sure you save as 'App' next time");
            } else {
                readFile(file);
            }
        }
    }

    const readFile = (file) => {
        const fileReader = new FileReader();
        fileReader.onload = (e => {
            const jsonLoad = JSON.parse(e.target.result);
            setUploaded(jsonLoad);
        })
        fileReader.readAsText(file);
        setUploaded(file);
    }

    const handleSubmit = () => {
        console.log("integrity check");
        if (!("nodes" in uploaded)) {
            alert("Please upload a JSON file starting with generator-save");
        } else {
            load(uploaded.nodes);
        }
    }

  return (
    <div className="node-container" id="create-node-container">
        <form className="container-vertical" onSubmit={e => e.preventDefault()}>
            <div className="form-grid">
                <label htmlFor="form-load-file">File Name</label>
                <input id="form-load-file" accept=".json" type="file" onChange={handleUpload}/>          
            </div>
            
            <button type="submit" onClick={handleSubmit}>Load</button>
        </form>
    </div>
  )
}
