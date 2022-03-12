import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { deloDialogAlert } from "@eos/mrsoft-core";
import { State } from "../../store";
import { setSelection } from "../../store/calendar/actions";
import Day from "./Day";
import DayName from "./DayName";

import week from "./Week.module.scss"

export default function Week() {
    const dispatch = useDispatch()
    const days = useSelector((state: State) => state.calendar.days);
    const editingNote = useSelector((state: State) => state.common.editingNote);
    const compatibilityChrome = navigator.userAgent.match(/Chrome/i) != null

    return (
        <div className={week.week}>
            <div className={week.header}>
                {days.map(day =>
                    <DayName
                        key={day.date.toString()}
                        day={day}
                        setSelected={(selection) => {
                            if (editingNote) deloDialogAlert('Для дальнейшей работы завершите редактирование элемента', 'Дело-Web')
                            else dispatch(setSelection({ days, selection: day, event: selection.event }))
                        }}
                    />
                )}
            </div>
            <div className={week.weekBody} style={{ overflowY: compatibilityChrome ? 'overlay' : 'scroll' as any }}>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', minHeight: '100%' }}>
                    {days.map(day =>
                        <Day
                            key={day.date.getTime()}
                            day={day}
                            setSelected={(selection) => {
                                if (editingNote) deloDialogAlert('Для дальнейшей работы завершите редактирование элемента', 'Дело-Web')
                                else dispatch(setSelection({ days, selection: day, event: selection.event }))
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

