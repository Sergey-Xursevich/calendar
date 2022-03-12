import React from "react";
import { useSelector } from "react-redux";
import cl from "classnames";
import { iDay } from "../../Dictionary/Interfaces";
import { iCurrentEvent } from "../../store/calendar/types";
import { State } from "../../store";
import Event from "./Event";
import { getUniqByField, sortEventsByTypeAndDate } from "../../Utils/CalendarHelper";
import { getISN_EVENT } from "../../Utils/getField";

import week from "./Week.module.scss";

const compatibilityChrome = navigator.userAgent.match(/Chrome/i) != null

export interface iProps {
    day: iDay;
    setSelected: ({ day, event }: { day?: iDay, event?: iCurrentEvent }, e: React.MouseEvent) => void;
}

export default function Day(props: iProps) {
    const { day, setSelected, day: { isSelected, isHoliday, generatedEvents, notes, plans, meetings, reminders } } = props;
    const commonViewType = useSelector((state: State) => state.common.commonViewType)

    const uniqGeneratedEvents = getUniqByField(generatedEvents, 'ISN_EVENT', "EVENT_DATE_TO", day.date);
    const uniqNotes = getUniqByField(notes, 'ISN_EVENT', "EVENT_DATE", day.date);
    const uniqPlans = getUniqByField(plans, 'ISN_EVENT', "EVENT_DATE", day.date);
    const uniqMeetings = getUniqByField(meetings, 'ISN_MTG_MEETING', "MEETING_DATE", day.date);
    const uniqReminder = getUniqByField(reminders, 'ISN_REMINDER', "INS_DATE", day.date);

    const setAllSelection = (selection: { day?: iDay, event?: iCurrentEvent }, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelected(selection, e);
    }

    const dayClasses = cl(
        week.day,
        { [week.selected]: isSelected },
        { [week.holiday]: isHoliday }
    )

    return (
        <div className={dayClasses} style={{ width: compatibilityChrome ? 'calc(99.9% / 7)' : '' }} onClick={(e) => setAllSelection({ day }, e)} >
            <div className={week.body}>
                {commonViewType === 'calendar' &&
                    [...uniqGeneratedEvents, ...uniqNotes, ...uniqMeetings, ...uniqReminder]
                        .sort(sortEventsByTypeAndDate)
                        .map(item => <Event key={getISN_EVENT(item)} event={item} setSelected={setAllSelection} />)
                }
                {commonViewType === 'plan' &&
                    [...uniqNotes, ...uniqPlans, ...uniqMeetings]
                        .sort(sortEventsByTypeAndDate)
                        .map(item => <Event key={getISN_EVENT(item)} event={item} setSelected={setAllSelection} />)
                }
            </div>
        </div>
    )
}