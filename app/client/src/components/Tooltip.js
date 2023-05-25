import React from 'react'

export default function Tooltip({open, children}) {
    let inputProps = {
        className: open ? "tooltip" : "tooltip hide"
    };
    return (
        <div {...inputProps} onClick={(e) => e.stopPropagation()}>
            {children}
        </div>
    )
}
