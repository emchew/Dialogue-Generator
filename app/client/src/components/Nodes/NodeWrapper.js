import React, { useState } from 'react'
import { nodeType } from '../../utility/node';

import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import ConnectButton from '@mui/icons-material/ControlPoint';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuIcon from '@mui/icons-material/MoreHoriz';
import DialogueNode from './DialogueNode';
import Node from './Node';
import Option from './Option';

export default function NodeWrapper({index, currentNode, updateNode, getNode, connectNode, deleteNode }) {
    const [isHovering, setIsHovering] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    
    const handleMouseLeave = () => {
        setIsHovering(false);
        setShowMenu(false);
    }

    return (
    <div className="node-wrapper"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => handleMouseLeave()}
    >
        <NewNode index={index} currentNode={currentNode} updateNode={updateNode} getNode={getNode}/>
        {isHovering && 
            <div className='node-control' style={{position: 'absolute', right: 0}}>
                <IconButton onClick={() => setShowMenu(true)}>
                    <MenuIcon/>
                </IconButton>
            </div>
        }

        {showMenu && (
            <MenuList sx={ menuStyle }>
                <MenuItem onClick={() => deleteNode(index)}>
                    <ListItemIcon>
                        <DeleteIcon fontSize='small'/>
                    </ListItemIcon>
                    Delete
                </MenuItem>
            </MenuList>
        )}
        {currentNode.hasNext && isHovering && !showMenu && (
            <IconButton 
                style={{
                    position: 'absolute',
                    left: currentNode.dimensions.width,
                    top: currentNode.dimensions.height / 2 - 20
                }}
                onClick={() => connectNode(index, currentNode)}
            >
                <ConnectButton/>
            </IconButton>
        )}
    </div>
  )
}

const menuStyle = {
    backgroundColor: 'white', 
    position: 'absolute',
    top: 0,
    right: -105,
    '& li': { 
        fontSize: '0.8em'
    }
}
const NewNode = ({key, ...props}) => {
    const { currentNode } = props;
    switch(currentNode.type) {
        case nodeType.DIALOGUE:
            return <DialogueNode {...props}/>
        case nodeType.DEFAULT:
        case nodeType.OPTION:
            return <Node {...props}/>
        case nodeType.NODE_OPTION:
            return <Option {...props}/>
        default:
            return null;
    }
}