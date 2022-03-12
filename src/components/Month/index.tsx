import React from "react";
import { DAYS_FULL } from "../../Dictionary/Constants";
import Day from "./Day";
import { setSelection } from "../../store/calendar/actions";
import { useSelector, useDispatch } from "react-redux";
import { State } from "../../store";

import month from "./Month.module.scss"
import { deloDialogAlert } from "@eos/mrsoft-core";

export default function Month() {
    const dispatch = useDispatch();
    const days = useSelector((state: State) => state.calendar.days);
    const isLoading = useSelector((state: State) => state.calendar.isLoading);
    const editingNote = useSelector((state: State) => state.common.editingNote);
    const WeekDays = () => (
        <div className={month.header}>
            {DAYS_FULL.map((item, index) => {
                return <div className={month.weekDays} key={index}><span className={month.weekDaysName}>{item}</span></div>
            })}
        </div>
    );
    const monthClassName = [month.month];
    if (isLoading) monthClassName.push(month.loading);
    return (
        <div className={monthClassName.join(' ')}>
            {WeekDays()}
            <div className={month.wrapDays}>
                {days.map(day => (
                    <Day key={day.date.getTime()}
                        day={day}
                        setSelected={() => {
                            if (editingNote) deloDialogAlert('Для дальнейшей работы завершите редактирование элемента', 'Дело-Web')
                            else dispatch(setSelection({ days, selection: day }))
                        }}
                    />
                ))}
            </div>
        </div>
    );
}