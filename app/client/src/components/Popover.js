import React, {useState} from 'react'

export default function Popover({children, open, setOpen}) {
    let inputProps = {
        className: open ? "popover" : "popover hide"
    };
    return (
        <div {...inputProps}>
            {children}
        </div>
    )
}
