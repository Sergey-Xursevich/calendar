
import { iDay } from "../../Dictionary/Interfaces"
import React from "react";
import year from "./Year.module.scss";
import { isSameDay } from "date-fns";
import { CommonViewType } from "../../store/common/types";

interface iProps {
    day: iDay;
    commonViewType: CommonViewType;
}

export default function GreenLine({ day, commonViewType }: iProps) {
    if (commonViewType === 'calendar')
        if (day.meetings.find(item => item.REVIEW_END_DATE && isSameDay(new Date(item.REVIEW_END_DATE), day.date)))
            return <div className={`${year.dayLine} ${year.greenLine}`}></div>
    if (commonViewType === 'plan')
        if (day.plans.find(item => item.EVENT_DATE_TO && isSameDay(new Date(item.EVENT_DATE_TO), day.date)))
            return <div className={`${year.dayLine} ${year.greenLine}`}></div>
    return null
}
