import React from 'react'
import { nodeType } from '../App';

export default function Line({node, next, onClick }) {
  const isDialogue = isDialogueToDialogueLine(node, next);
  let pos = {};
  pos = {...pos, ...getStartPos(node, isDialogue)};
  pos = {...pos, ...getEndPos(next, isDialogue)};
  return (
    <line {...pos} stroke="black" onClick={onClick}/>
  )
}

const getStartPos = (node, isDialogue) => {
  const centredX = node.currentPosition.x + (node.dimensions.width / 2);
  const centredY = node.currentPosition.y + 1.5*(node.dimensions.height) - 5;
  const startX = node.currentPosition.x + node.dimensions.width;
  const startY = node.currentPosition.y + (node.dimensions.height);
  return {
    x1: isDialogue ? centredX : startX,
    y1: isDialogue ? centredY : startY
  }
}

const getEndPos = (next, isDialogue) => {
  const centredX = next.currentPosition.x + (next.dimensions.width / 2);
  const centredY = next.currentPosition.y + (next.dimensions.height / 2);
  const endX = next.currentPosition.x;
  const endY = next.currentPosition.y + (next.dimensions.height);
  return {
    x2: isDialogue ? centredX : endX,
    y2: isDialogue ? centredY : endY
  }
}

const isDialogueToDialogueLine = (node, next) => {
  return (node.type === nodeType.DIALOGUE && next.type === nodeType.DIALOGUE);
}