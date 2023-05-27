import { nodeType } from "./node"
import { downloadFile } from "./file";

export default function saveAsJson (sceneName, nodes) {
    const nodesJSONArray = [];
    let nextDialogue = null;
    for (const node of nodes) {
        if (node.type === nodeType.DIALOGUE) {
            nextDialogue = node.nextDialogue !== -1 ? node.nextDialogue : nextDialogue;
            nodesJSONArray.push(saveDialogueNode(nodes, node, nextDialogue));
        }
    }
    const nodesJSON = {scene: nodesJSONArray};
    downloadFile(JSON.stringify(nodesJSON, null, 4), `${sceneName}.json`, 'text/json')
}

const saveDialogueNode = (nodes, node, parentNext) => {
    const nextDialogueIndex = node.nextDialogue;
    // Inherit the parent's next property, otherwise assign next to be the child's next
    let goTo = nextDialogueIndex !== -1 ? nodes[nextDialogueIndex].id :  nodes[parentNext].id;
    // Last node always be null
    goTo = goTo === node.id ? null : goTo;
    const dialogue = [];
    let currentNodeIndex = node.next;
    while (currentNodeIndex !== -1) {
        let currentNode = {};
        if (nodes[currentNodeIndex].type === nodeType.DEFAULT) {
            currentNode = saveDefaultNode(nodes[currentNodeIndex]);
        } else if (nodes[currentNodeIndex].type === nodeType.OPTION) {
            currentNode = saveOptionNode(nodes, nodes[currentNodeIndex], goTo);
        }
        dialogue.push(currentNode);
        currentNodeIndex = nodes[currentNodeIndex].next;
    }
    return {
        id: node.id,
        goTo,
        dialogue
    }
}

const saveDefaultNode = (node) => {
    return {
        speaker: node.speaker,
        line: node.line,
        type: "default"
    }
}

const saveOptionNode = (nodes, node, goTo) => {
    console.log(node)
    let options = [];

    for (const option of node.options) {
        options.push(saveOption(nodes, nodes[option], goTo));
    }

    return {
        speaker: node.speaker,
        line: node.line,
        type: "option",
        options
    }
}

const saveOption = (nodes, option, goTo) => {
    
    const nextNodeIndex = option.next;
    let hasNext = false;
    // Save links to next dialogue
    // TODO : consider whether to save links to default/option nodes
    if (nextNodeIndex !== -1 && nodes[nextNodeIndex].type === nodeType.DIALOGUE) {
        hasNext = true;
    }
    return {
        value: option.value,
        goTo: hasNext ? nodes[nextNodeIndex].id : goTo
    }
}
