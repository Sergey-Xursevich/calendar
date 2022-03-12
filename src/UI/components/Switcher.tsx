import React from "react";

import switcher from "../styles/Switcher.module.scss";

interface iProps {
    value: boolean;
    onClick: (mode: boolean) => void;
}

export default function Switcher(props: iProps) {
    const { onClick, value } = props;

    return (
        <label className={switcher.switch} >
            <input type="checkbox" />
            <span className={[switcher.slider/* , switcher.round */].join(' ')} onClick={(ev) => { onClick(!value) }}></span>
        </label >
    );
}