
import { iDay } from "../../Dictionary/Interfaces"
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelection } from "../../store/calendar/actions";
import year from "./Year.module.scss";
import { State } from "../../store";
import { deloDialogAlert } from "@eos/mrsoft-core";
import TitleDate from "./TitleDate";
import DayItems from "./DayItems";

interface iProps {
    day: iDay;
}

export default function YearDay({ day }: iProps) {
    const dispatch = useDispatch();
    const allDays = useSelector((state: State) => state.calendar.days);
    const commonViewType = useSelector((state: State) => state.common.commonViewType);
    const editingNote = useSelector((state: State) => state.common.editingNote);

    const dayClassName = (item: iDay) => {
        const arrClasses = [];
        if (item.mock) arrClasses.push(year.mock)
        else arrClasses.push(year.day);
        if (item.isSelected) arrClasses.push(year.selectedDay);
        if (item.isHoliday) arrClasses.push(year.holiday);
        return arrClasses.join(' ')
    }

    const setSelectionDay = (day: iDay) => {
        if (day.mock) return;
        if (editingNote) deloDialogAlert('Для дальнейшей работы завершите редактирование элемента', 'Дело-Web')
        else dispatch(setSelection({ days: allDays, selection: day }));
    }

    return (
        <div className={dayClassName(day)} onClick={() => setSelectionDay(day)}>
            <TitleDate day={day} />
            <DayItems day={day} commonViewType={commonViewType} />
        </div>
    )
}