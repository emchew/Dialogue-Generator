import React, { useEffect, useRef } from 'react'

export default function BaseNode({index, currentNode, nodeClass, updateNode, children}) {
  const nodeRef = useRef();
  useEffect(() => {
    const { offsetHeight, offsetWidth } = nodeRef.current;
    if (offsetHeight > 0 && offsetWidth > 0) {
      updateParentNode({dimensions: { width: offsetWidth, height: offsetHeight }})
    }
  }, [nodeRef]);
  const updateParentNode = ({...updatedValue}) => {
    const copy = {...currentNode, ...updatedValue};
    updateNode(index, copy);
  }
  return (
    <div  ref={nodeRef} className={`node-container node handle ${nodeClass}`} id={`node-${index}`}>
        {children}
    </div>
  )
}
