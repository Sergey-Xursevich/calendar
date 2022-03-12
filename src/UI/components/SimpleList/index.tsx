import React from "react";
import TextareaAutosize from 'react-textarea-autosize';
import cl from "classnames";
import Icon from "../Icon";

import simpleList from "./SimpleList.module.scss";

interface iProps<T, G> {
    isText: boolean;
    items: T[];
    onChangeItems: (items: T[]) => void;
    onDelete: (items: T) => void;
    filterDeleted: (item: T) => boolean;
    setJSXElement: (item: T) => JSX.Element | null;
    text?: string;
    maxLength?: number;
    onChangeText?: (value: string) => void;
    placeholder?: string;
    minRows?: number
    disabled?: boolean;
}

export default function SimpleList<T, G>(props: iProps<T, G>) {
    const { items, onDelete, filterDeleted, setJSXElement, text, onChangeText, placeholder, minRows, disabled, maxLength, isText } = props;
    return (
        <div className={cl(simpleList.wrapper, { [simpleList.disabled]: disabled })}>
            {isText && <TextareaAutosize
                className={simpleList.textarea}
                value={text}
                onChange={(e) => onChangeText && onChangeText(e.target.value)}
                placeholder={placeholder}
                minRows={minRows || 4}
                maxLength={maxLength}
            />}
            {items.filter(filterDeleted).map((item, index) => (
                <div key={index} className={simpleList.item}>
                    {setJSXElement(item)}
                    {disabled ? null : <Icon className={simpleList.iconDelete} name="cross" onClick={() => onDelete(item)} />}
                </div>
            ))}
        </div>
    )
}