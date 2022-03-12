import { isSameDay } from "date-fns";
import React from "react";
import { EventsType } from "../../../Dictionary/Enums"
import ToolTipElement from "./TooltipElement"
import { ToolTip } from "@eos/mrsoft-core";
import { iMRGENERATED_EVENT } from "../../../store/calendar/types";

import shortDay from "../ShortDay.module.scss"

interface iProps {
    generatedEvents: iMRGENERATED_EVENT[];
    date: Date;
}

export default function ResolutionEnd({ generatedEvents, date }: iProps) {
    let count = generatedEvents.filter(item =>
        item.EVENT_DATE_TO
        && item.EVENT_TYPE === EventsType.RESOLUTION
        && isSameDay(new Date(item.EVENT_DATE_TO || 0), date)
    ).length
    if (count > 0) return (
        <ToolTip position='bottom-end' element={<ToolTipElement text={'Окончание срока документа/поручения'} />}>
            <div className={`${shortDay.monthEndItem} ${shortDay.yellowIcon}`}>
            </div>
        </ToolTip>
    )
    else return null;
}
