import { downloadFile } from "./file";

export function saveApp (fileName, nodes) {
    const nodesJSON = { nodes };
    downloadFile(JSON.stringify(nodesJSON, null, 4), `generator-save-${fileName}.json`, 'text/json')
}