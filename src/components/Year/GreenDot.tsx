
import { iDay } from "../../Dictionary/Interfaces"
import React from "react";
import year from "./Year.module.scss";
import { isSameDay } from "date-fns";
import { CommonViewType } from "../../store/common/types";

interface iProps {
    day: iDay;
    commonViewType: CommonViewType;
}

export default function GreenDot({ day, commonViewType }: iProps) {
    if (commonViewType === 'calendar')
        if (day.meetings.find(item => item.MEETING_DATE && isSameDay(new Date(item.MEETING_DATE), day.date)))
            return <div className={`${year.dayDot} ${year.greenDot}`}></div>

    if (commonViewType === 'plan')
        if (day.plans.find(item => item.EVENT_DATE && isSameDay(new Date(item.EVENT_DATE), day.date)))
            return <div className={`${year.dayDot} ${year.greenDot}`}></div>
    return null
}
