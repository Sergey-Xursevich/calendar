
import React from "react";
import { iDay } from "../../Dictionary/Interfaces"
import { CommonViewType } from "../../store/common/types";
import BlueDot from "./BlueDot";
import YellowDot from "./YellowDot";
import GreenDot from "./GreenDot";

import year from "./Year.module.scss";

interface iProps {
    day: iDay;
    commonViewType: CommonViewType;
}

export default function Dots({ day, commonViewType }: iProps) {
    return (
        <div className={year.dayDots}>
            <YellowDot day={day} commonViewType={commonViewType} />
            <BlueDot day={day} commonViewType={commonViewType} />
            <GreenDot day={day} commonViewType={commonViewType} />
        </div>
    );
}
