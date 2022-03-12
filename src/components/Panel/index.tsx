import React from "react";
import Today from "./Today"
import CommonViewTypeBlock from "./CommonViewTypeBlock"
import DirectionBlock from "./DirectionBlock"
import RangeTypeBlock from "./RangeTypeBlock"

import panel from "./Panel.module.scss"

export default function Panel() {
    return (
        <div className={panel.wraper}>
            <Today />
            <div className={panel.panel}>
                <CommonViewTypeBlock />
                <DirectionBlock />
                <RangeTypeBlock />
            </div>
        </div>
    );
}