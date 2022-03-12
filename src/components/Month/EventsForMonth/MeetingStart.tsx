import React from "react";
import ToolTipElement from "./TooltipElement"
import { iMREVT_EVENT, iMTG_MEETING, ToolTip } from "@eos/mrsoft-core";

import shortDay from "../ShortDay.module.scss"

interface iProps {
    plans: iMREVT_EVENT[];
    meetings: iMTG_MEETING[];
    date: Date;
    compareCallback: (fDate: Date, sDate: Date) => boolean
}

export default function MeetingStart({ plans, meetings, date, compareCallback }: iProps) {
    const uniqMeetings: iMTG_MEETING[] = [];
    meetings.forEach(item => {
        if (!~uniqMeetings.findIndex(uniqItem => item.ISN_MTG_MEETING === uniqItem.ISN_MTG_MEETING)) uniqMeetings.push(item)
    })
    const countMTG = uniqMeetings.filter(item =>
        item.MEETING_DATE &&
        compareCallback(new Date(item.MEETING_DATE), date)
    ).length

    const uniqPlans: iMREVT_EVENT[] = [];
    plans.filter(item => (compareCallback(new Date(item.EVENT_DATE), date)))
        .forEach(item => {
            if (!~uniqPlans.findIndex(uniqItem => item.ISN_EVENT === uniqItem.ISN_EVENT)) uniqPlans.push(item)
        })
    const countEVT = uniqPlans.filter(item => compareCallback(new Date(item.EVENT_DATE), date)).length
    const count = countMTG + countEVT;
    if (count > 0) return (
        <ToolTip position='bottom-end' element={<ToolTipElement text={'Событие'} />}>
            <div className={`${shortDay.monthStartItem} ${shortDay.greenIcon}`}>
                <div className={shortDay.count}>{count}</div>
            </div>
        </ToolTip>
    )
    else return null;
}

