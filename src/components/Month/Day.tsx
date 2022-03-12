import React from "react";
import { useSelector } from "react-redux";
import isAfter from "date-fns/isAfter";
import isBefore from "date-fns/isBefore";
import isSameDay from "date-fns/isSameDay";
import { State } from "../../store";
import { iDay } from "../../Dictionary/Interfaces";
import { ShownStartEventsForMonth, ShownEndEvents, DurationLine } from "./EventsForMonth";
import { iCurrentEvent, iMRGENERATED_EVENT, iREMINDER_ADVANCE } from "../../store/calendar/types";
import { iMREVT_EVENT, iMTG_MEETING } from "@eos/mrsoft-core";
import { getEVENT_DATE, getEVENT_DATE_TO, getEVENT_TYPE } from "../../Utils/getField";

import shortDay from "./ShortDay.module.scss"

export interface iPropsDay {
    day: iDay,
    setSelected: Function;
}

export default function Day(props: iPropsDay) {
    const { day, setSelected, day: { date } } = props;
    const currentEvent = useSelector((state: State) => state.calendar.currentEvent)
    const commonViewType = useSelector((state: State) => state.common.commonViewType)

    let shortDayClassName = () => {
        const arr = [shortDay.shortDay];
        if (day.isSelected) arr.push(shortDay.selected);
        if (day.isHoliday) arr.push(shortDay.holiday);
        return arr;
    }

    const isStartDurationLine = startDurationLine(date, currentEvent)
    const isEndDurationLine = endDurationLine(date, currentEvent)
    const isDurLine = durLine(date, currentEvent)
    const eventType = getEVENT_TYPE(currentEvent)

    return (
        <div className={shortDayClassName().join(' ')} onClick={() => setSelected(day)}>
            <div className={shortDay.date}>{day.date.getDate()}</div>
            <ShownEndEvents day={day} commonViewType={commonViewType} />
            <ShownStartEventsForMonth day={day} commonViewType={commonViewType} />
            <DurationLine isDurLine={isDurLine} eventType={eventType} start={isStartDurationLine} end={isEndDurationLine} />
        </div>
    )
}

const startDurationLine = (date: Date, currentEvent?: iMRGENERATED_EVENT | iMTG_MEETING | iMREVT_EVENT | iREMINDER_ADVANCE) => {
    const EVENT_DATE = getEVENT_DATE(currentEvent);
    return !!EVENT_DATE && isSameDay(new Date(EVENT_DATE), date);
}

const endDurationLine = (date: Date, currentEvent?: iMRGENERATED_EVENT | iMTG_MEETING | iMREVT_EVENT | iREMINDER_ADVANCE) => {
    const EVENT_DATE_TO = getEVENT_DATE_TO(currentEvent);
    return !!EVENT_DATE_TO && isSameDay(new Date(EVENT_DATE_TO), date);
}

const durLine = (date: Date, currentEvent?: iCurrentEvent) => {
    const EVENT_DATE = getEVENT_DATE(currentEvent);
    const EVENT_DATE_TO = getEVENT_DATE_TO(currentEvent);
    if (!EVENT_DATE || !EVENT_DATE_TO) return false;
    const evDate = new Date(EVENT_DATE)
    const evDateTo = new Date(EVENT_DATE_TO)
    if ((isAfter(date, evDate) && isBefore(date, evDateTo)) || isSameDay(date, evDate) || isSameDay(date, evDateTo))
        return true
    return false;
}
