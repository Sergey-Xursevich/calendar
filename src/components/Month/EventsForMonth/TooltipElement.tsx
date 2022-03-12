import React from "react";

interface iProps {
    text: string;
}

export default function ToolTipElement({ text }: iProps) {
    return <span style={{ padding: '5px 10px', display: 'block' }}>{text}</span>
}
