import React from "react";
import { EventsType } from "../../../Dictionary/Enums"
import shortDay from "../ShortDay.module.scss"

interface iProps {
    isDurLine: boolean;
    start: boolean;
    end: boolean
    eventType?: EventsType;
}

export default function DurationLine({ isDurLine, eventType, start, end }: iProps) {
    const classes = [shortDay.durationLine];
    if (isDurLine) classes.push(shortDay.visibleDurLine)
    if (eventType === EventsType.RESOLUTION) classes.push(shortDay.RESOLUTION);
    if (eventType === EventsType.VISA_SIGN) classes.push(shortDay.VISA_SIGN);
    if (eventType === EventsType.MEETING || eventType === EventsType.EVENT || eventType === EventsType.EXPERTISE || eventType === EventsType.PRIVATE || eventType === EventsType.SESSION) classes.push(shortDay.MEETING);
    if (start) classes.push(shortDay.start);
    if (end) classes.push(shortDay.end);
    return (
        <div className={classes.join(' ')}></div>
    )
}
