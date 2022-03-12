
import React from "react";
import { iDay } from "../../Dictionary/Interfaces"
import { CommonViewType } from "../../store/common/types";
import BlueLine from "./BlueLine";
import YellowLine from "./YellowLine";
import GreenLine from "./GreenLine";

import year from "./Year.module.scss";

interface iProps {
    day: iDay;
    commonViewType: CommonViewType;
}

export default function Lines({ day, commonViewType }: iProps) {
    return (
        <div className={year.dayLines}>
            <YellowLine day={day} commonViewType={commonViewType} />
            <BlueLine day={day} commonViewType={commonViewType} />
            <GreenLine day={day} commonViewType={commonViewType} />
        </div>
    );
}
