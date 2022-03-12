import React from "react";

interface iProps {
    corresp?: string;
    organiz?: string;
    text?: string
}

export default function ToolTipElement({ corresp, organiz, text }: iProps) {
    if (corresp || organiz) {
        return (
            <div style={{ padding: 10 }}>
                <strong>{organiz}</strong>
                <div>{corresp}</div>
            </div>
        )
    } 

    if (text) {
        return (
            <div style={{ padding: 10 }}>                
                <div>{text}</div>
            </div>
        )
    }

    return null
}