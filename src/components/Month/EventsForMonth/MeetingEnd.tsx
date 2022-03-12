import { isSameDay } from "date-fns";
import React from "react";
import { EventsType } from "../../../Dictionary/Enums"
import ToolTipElement from "./TooltipElement"
import { iMREVT_EVENT, iMTG_MEETING, ToolTip } from "@eos/mrsoft-core";

import shortDay from "../ShortDay.module.scss"

interface iProps {
    meetings: iMTG_MEETING[];
    plans: iMREVT_EVENT[];
    date: Date;
}

export default function MeetingEnd({ meetings, plans, date }: iProps) {
    const countMTG = meetings.filter(item =>
        item.MEETING_DATE
        && isSameDay(new Date(item.REVIEW_END_DATE || 0), date)
    ).length
    const countEVT = plans?.filter(item => (
        item.EVENT_TYPE === EventsType.EVENT ||
        item.EVENT_TYPE === EventsType.EXPERTISE ||
        item.EVENT_TYPE === EventsType.MEETING ||
        item.EVENT_TYPE === EventsType.PRIVATE ||
        item.EVENT_TYPE === EventsType.SESSION
    ) && item.EVENT_DATE_TO && isSameDay(new Date(item.EVENT_DATE_TO || 0), date)).length || 0;
    const count = countEVT + countMTG;
    if (count > 0) return (
        <ToolTip position='bottom-end' element={<ToolTipElement text={'Окончание срока Событие'} />}>
            <div className={`${shortDay.monthEndItem} ${shortDay.greenIcon}`}>
            </div>
        </ToolTip>
    )
    else return null;
}
