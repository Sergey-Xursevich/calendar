import React from "react";
import contextMenu from "../../styles/ContextMenu.module.scss"

interface iProps {
  onClick: (event: React.MouseEvent) => void
  children?: React.ReactNode;
  rights?: boolean;
}

export default function ContextMenuItem(props: iProps) {
  const { children, onClick, rights } = props

  if (typeof rights === 'undefined' || rights) return (
    <li className={contextMenu.item} onMouseDown={onClick}>{children}</li>
  )
  else return (
    <li className={[contextMenu.item, contextMenu.disabled].join(' ')}>{children}</li>
  )
}