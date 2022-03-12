import React from "react";
import { EventsType } from "../../../Dictionary/Enums"
import ToolTipElement from "./TooltipElement"
import { ToolTip } from "@eos/mrsoft-core";
import { iMRGENERATED_EVENT } from "../../../store/calendar/types";

import shortDay from "../ShortDay.module.scss"

interface iProps {
    events: iMRGENERATED_EVENT[];
    date: Date;
    compareCallback: (fDate: Date, sDate: Date) => boolean
}

export default function ResolutionStart({ events, date, compareCallback }: iProps) {
    const uniqEvents: iMRGENERATED_EVENT[] = [];
    events.forEach(item => {
        if (!~uniqEvents.findIndex(uniqsItems => item.ISN_EVENT === uniqsItems.ISN_EVENT)) uniqEvents.push(item)
    })

    let count = uniqEvents.filter(item => {
        return item.EVENT_DATE
            && item.EVENT_TYPE === EventsType.RESOLUTION
            && compareCallback(new Date(item.EVENT_DATE), date)
    }).length
    if (count > 0) return (
        <ToolTip position='bottom-end' element={<ToolTipElement text={'Поручение/ознакомление/пересланная РК'} />}>
            <div className={`${shortDay.monthStartItem} ${shortDay.yellowIcon}`}>
                <div className={shortDay.count}>{count}</div>
            </div>
        </ToolTip>
    )
    else return null;
}

