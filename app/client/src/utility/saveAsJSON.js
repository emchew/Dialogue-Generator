import { nodeType } from "./node"
// import fs from 'fs';

export default function saveAsJson (nodes) {
    const nodesJSONArray = [];
    for (const node of nodes) {
        switch (node.type) {
            case nodeType.DIALOGUE:
                nodesJSONArray.push(saveDialogueNode(nodes, node));
        }
    }
    // console.log(nodesJSONArray)
    saveFile(nodesJSONArray, 'data.json')
}


const saveFile = (data, filename) => {
    // fs.write(filename, JSON.stringify(data), (error) => {
    //     if (error) {
    //         console.log(error);
    //     }
    // })
}

const saveDialogueNode = (nodes, node) => {
    let goTo = null;
    const nextDialogue = node.nextDialogue 

    if (nextDialogue !== -1) {
        goTo = nodes[nextDialogue].id;
    }
    const dialogue = [];
    let currentNodeIndex = node.next;
    while (currentNodeIndex !== -1) {
        console.log(nodes);
        console.log(currentNodeIndex);
        let currentNode = {};
        if (nodes[currentNodeIndex].type === nodeType.DEFAULT) {
            currentNode = saveDefaultNode(nodes[currentNodeIndex]);
        } else if (nodes[currentNodeIndex].type === nodeType.OPTION) {
            currentNode = saveOptionNode(nodes, nodes[currentNodeIndex]);
        }
        dialogue.push(currentNode);
        currentNodeIndex = nodes[currentNodeIndex].next;
    }
    // if ()
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


const saveOptionNode = (nodes, node) => {
    console.log(node)
    let options = [];

    for (const option of node.options) {
        options.push(saveOption(nodes, nodes[option]));
    }

    return {
        speaker: node.speaker,
        line: node.line,
        type: "option",
        options
    }
}

const saveOption = (nodes, option) => {
    
    const nextNodeIndex = option.next;
    let hasNext = false;
    // Save links to next dialogue
    // TODO : consider whether to save links to default/option nodes
    if (nextNodeIndex !== -1 && nodes[nextNodeIndex].type === nodeType.DIALOGUE) {
        hasNext = true;
    }
    return {
        value: option.value,
        goTo: hasNext ? nodes[nextNodeIndex].id : null
    }
}