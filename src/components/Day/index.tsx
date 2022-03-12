import React from "react";
import { useSelector } from "react-redux";
import ruLocale from "date-fns/locale/ru";
import { format, isSameDay } from "date-fns";
import { State } from "../../store";
import { getUniqByField, isNote, isPlan, sortByDate } from "../../Utils/CalendarHelper";
import { getEVENT_DATE, getISN_EVENT } from "../../Utils/getField";
import Note from "./Note";
import Plan from "./Plan";
import Meeting from "./Meeting";
import Reminder from "./Reminder";

import dayClass from "./Day.module.scss"

export default function Day() {
    const day = useSelector((state: State) => state.calendar.days)[0];
    const commonViewType = useSelector((state: State) => state.common.commonViewType);
    const { notes, plans, meetings, reminders } = day
    const uniqPlans = getUniqByField(plans, "ISN_EVENT", "EVENT_DATE", day.date);
    const uniqMeetings = getUniqByField(meetings, "ISN_MTG_MEETING", "MEETING_DATE", day.date);
    const uniqReminders = getUniqByField(reminders, 'ISN_REMINDER', "INS_DATE", day.date);
    const events = [...notes, ...(commonViewType === "plan" ? uniqPlans : []), ...uniqMeetings, ...(commonViewType === "calendar" ?  uniqReminders : [])]
        .filter(item => isSameDay(new Date(getEVENT_DATE(item) || 0), day.date))
        .sort((a, b) => sortByDate(getEVENT_DATE(a) || '', getEVENT_DATE(b) || ''));

    return (
        <div className={dayClass.day}>
            <div className={dayClass.header}>
                Совещания и заметки на&nbsp;
                <span className={day?.isHoliday ? dayClass.holiday : ''}>{format(day?.date || 0, 'd MMMM', { locale: ruLocale })}</span>
            </div>
            <div className={dayClass.timeLine}>
                {!events.length && <div className={dayClass.empty}>На сегодня заметок, напоминаний и совещаний нет</div>}
                {events.map(event => {
                    if (event._type === 'MREVT_EVENT' && isNote(event)) return <Note key={getISN_EVENT(event)} item={event} />
                    if (event._type === 'MREVT_EVENT' && isPlan(event)) return <Plan key={getISN_EVENT(event)} item={event} />
                    if (event._type === 'MREVT_REMINDER') return <Reminder key={getISN_EVENT(event)} item={event} />
                    if (event._type === 'MTG_MEETING') return <Meeting key={getISN_EVENT(event)} item={event} />
                    else return null;
                })}
            </div>
        </div>
    );
}
