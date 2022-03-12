import React from "react";
import ruLocale from "date-fns/locale/ru";
import { format } from "date-fns";
import { iDay } from "../../Dictionary/Interfaces";
import { iCurrentEvent } from "../../store/calendar/types";

import week from "./Week.module.scss"

interface iProps {
    day: iDay;
    setSelected: ({ day, event }: { day?: iDay, event?: iCurrentEvent }, e: React.MouseEvent) => void
}

export default function DayName(props: iProps) {
    const dayName = format(props.day.date, 'EEEE', { locale: ruLocale })
    const dayClasses = [week.title];
    if (props.day.isSelected) dayClasses.push(week.selected);
    if (props.day.isHoliday) dayClasses.push(week.holiday);
    const setAllSelection = (selection: { day?: iDay, event?: iCurrentEvent }, e: React.MouseEvent) => {
        e.stopPropagation();
        props.setSelected(selection, e);
    }
    return <div className={dayClasses.join(' ')} onClick={(e) => setAllSelection({ day: props.day }, e)}>
        <span>{dayName[0].toUpperCase() + dayName.slice(1)}</span>
        <span>{props.day.date.getDate()}</span>
    </div>
}
