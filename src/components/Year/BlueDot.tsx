import { iDay } from "../../Dictionary/Interfaces"
import React from "react";
import year from "./Year.module.scss";
import { EventsType } from "../../Dictionary/Enums";
import { isSameDay } from "date-fns";
import { CommonViewType } from "../../store/common/types";

interface iProps {
    day: iDay;
    commonViewType: CommonViewType;
}

export default function BlueDot({ day, commonViewType }: iProps) {
    if (commonViewType === 'plan') return null;
    if (day.generatedEvents.find(item => item.EVENT_DATE && item.EVENT_TYPE === EventsType.VISA_SIGN && isSameDay(new Date(item.EVENT_DATE), day.date)))
        return <div className={`${year.dayDot} ${year.blueDot}`}></div>
    return null
}
