
import { iDay } from "../../Dictionary/Interfaces"
import React from "react";
import year from "./Year.module.scss"
import { EventsType } from "../../Dictionary/Enums";
import { isSameDay } from "date-fns";
import { CommonViewType } from "../../store/common/types";

interface iProps {
    day: iDay;
    commonViewType: CommonViewType;
}

export default function BlueLine({ day, commonViewType }: iProps) {
    if (commonViewType === 'plan') return null;
    if (day.generatedEvents.find(item => item.EVENT_DATE_TO && item.EVENT_TYPE === EventsType.VISA_SIGN && isSameDay(new Date(item.EVENT_DATE_TO), day.date)))
        return <div className={`${year.dayLine} ${year.blueLine}`}></div>
    return null
}
