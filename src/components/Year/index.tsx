import React from "react";
import { useSelector } from "react-redux";
import { State } from "../../store";
import YearDay from "./YearDay";
import WeekDays from "./WeekDays";

import year from "./Year.module.scss";

export default function Year() {
    const months = useSelector((state: State) => state.calendar.months);
    const isLoading = useSelector((state: State) => state.calendar.isLoading);

    const yearClassName = [year.year];
    if (isLoading) yearClassName.push(year.loading);
    return (
        <div className={yearClassName.join(' ')}>
            {months.map(month => (
                <div className={year.month} key={month.index}>
                    <div className={year.monthTitle}>{month.name}</div>
                    <WeekDays />
                    <div className={year.monthBody}>
                        {month.days.map((day, index) => (
                            <YearDay key={day.date.getTime() + index} day={day} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}