import React, { useEffect, useRef, useCallback, useState, useLayoutEffect } from "react";
import ReactDOM from 'react-dom';

import contextMenu from "../../styles/ContextMenu.module.scss"

export interface iContextMenuStatus {
  isOpen: boolean;
  top?: number;
  left?: number;
}

interface iProps {
  contextMenuStatus: iContextMenuStatus;
  setOpen: (contextMenuStatus: iContextMenuStatus) => void;
  wrapperRef: React.RefObject<HTMLDivElement>;
  children?: React.ReactNode;
}

export default function ContextMenu(props: iProps) {
  const { contextMenuStatus, setOpen, wrapperRef, children } = props;
  const styles = { top: contextMenuStatus.top, left: contextMenuStatus.left };
  const target = usePortal(contextMenuStatus.isOpen);
  const [portalElement, setPortalElement] = useState<HTMLUListElement | null>(null);
  const portalRef = useCallback<(element: HTMLUListElement) => void>(element => { if (element !== null) setPortalElement(element); }, [])
  useContextMenuInViewListener(portalElement, setOpen, contextMenuStatus);
  useOutsideClickListener(wrapperRef.current, setOpen);
  if (contextMenuStatus.isOpen) return ReactDOM.createPortal(
    <ul ref={portalRef} className={contextMenu.contextMenu} onClick={() => setOpen({ isOpen: false })} style={{ ...styles }}>
      {children}
    </ul>,
    target);
  else return null;
}

const useContextMenuInViewListener = (portalRef: HTMLUListElement | null, setOpen: (contextMenuStatus: iContextMenuStatus) => void, contextMenuStatus: iContextMenuStatus) => {
  useLayoutEffect(() => {
    if (!portalRef || !contextMenuStatus.left || !contextMenuStatus.top) return

    const geomBody = document.body.getBoundingClientRect();
    const heightBody = geomBody.height;
    const widthBody = geomBody.width;

    const geomPortal = portalRef.getBoundingClientRect();
    const bottomPortal = geomPortal.bottom;
    const rightPortal = geomPortal.right;
    const heightPortal = geomPortal.height;
    const widthPortal = geomPortal.width;

    if (heightBody < bottomPortal && widthBody < rightPortal) {
      setOpen({
        isOpen: true,
        left: contextMenuStatus.left - widthPortal,
        top: contextMenuStatus.top - heightPortal
      })
    }
    else if (heightBody < bottomPortal) {
      setOpen({
        isOpen: true,
        left: contextMenuStatus.left,
        top: contextMenuStatus.top - heightPortal
      })
    }
    else if (widthBody < rightPortal) {
      setOpen({
        isOpen: true,
        left: contextMenuStatus.left - widthPortal,
        top: contextMenuStatus.top
      })
    }
  })
}

const usePortal = (isOpen: boolean, className: string = 'Portal') => {
  const rootElemRef = useRef(document.createElement('div'));
  rootElemRef.current.className = className;
  useEffect(
    () => {
      const rootElemRefCurrent = rootElemRef.current;
      if (isOpen) document.body.appendChild(rootElemRefCurrent);
      return () => {
        rootElemRefCurrent.remove();
      };
    }
  );
  return rootElemRef.current;
}

const useOutsideClickListener = (ref: HTMLDivElement | null, setOpen: (isOpen: iContextMenuStatus) => void) => {
  function handleClickOutside(event: MouseEvent) {
    if (!ref) return;
    if (!ref.contains(event.target as Node)) setOpen({ isOpen: false });
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });
}
