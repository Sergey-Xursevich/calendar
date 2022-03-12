import React, { useState } from "react";

import selection from "../styles/Selection.module.scss"
import Button from "./Button";

export interface iOption {
    ISN_CABINET: number | null;
    DUE: string | null
    values: Array<iOption>;
    element: JSX.Element | string | null;
    shortElement: JSX.Element | string | null;
    disabled: boolean;
}

interface iProps {
    selected: iOption;
    options: iOption[];
    onItemClick: Function;
    onClick?: Function;
}

export default function Selection(props: iProps) {
    const { selected, options, onItemClick } = props;
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen(!isOpen)
    }

    const handleItemClick = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>, item: iOption) => {
        event.stopPropagation();
        handleClick();
        return onItemClick(event, item)
    }

    const Options = (options: Array<iOption>) => {
        return options.map((item, index) => {
            const className = [selection.item, selection.header]
            if (item.disabled) className.push(selection.disabled)
            return (
                <div className={selection.level} key={index}>
                    {item.values.length
                        ? (<>
                            <span
                                className={className.join(' ')}
                                onClick={(event) => { if (!item.disabled) handleItemClick(event, item) }}
                            >{item.element}</span>
                            {Options(item.values)}
                        </>)
                        : <span
                            className={`${selection.item} ${item.DUE === selected.DUE ? selection.selected : ''}`}
                            onClick={(event) => { if (!item.disabled) handleItemClick(event, item) }}
                        >{item.element}</span>}
                </div >
            )
        })
    }

    return (
        <div className={`${selection.wrapper} ${isOpen ? selection.opened : selection.closed}`} >
            <Button
                text={selected.shortElement}
                onClick={handleClick}
                icon={isOpen ? "up" : "down"}
                transparent={!isOpen}
                styles={{ padding: 0 }}
                fluid
            />
            { isOpen && <div className={selection.wrapOptions}>{Options(options)}</div>}
        </div >
    );
}