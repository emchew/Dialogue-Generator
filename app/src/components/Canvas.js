import React, {useState, useEffect} from 'react'

import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import NodeForm from './NodeForm';
import Popover from './Popover';
import Tooltip from './Tooltip';

export default function Canvas() {
    const [togglePopover, setTogglePopover] = useState(true);
    const [toggleNodeTooltip, setToggleNodeTooltip] = useState(false);

    const handleTooltip = () => {
        console.log("yeet");
    }

    return (
    <div className="canvas">
        <div className="toolbar popover-anchor">
            <IconButton
                className="tooltip-anchor"
                onClick={() => setTogglePopover(p => !p)}
                onMouseEnter={() => setToggleNodeTooltip(true)}
                onMouseLeave={() => setToggleNodeTooltip(false)}
            >
                <AddIcon/>
                <Tooltip open={toggleNodeTooltip}>
                    New Dialogue Node
                </Tooltip>
            </IconButton>
            <Popover open={togglePopover}>
                <NodeForm/>
            </Popover>
        </div>

    </div>
  )
}
