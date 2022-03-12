import React from 'react';
import { resetDateRange } from "../../store/calendar/actions";
import { format } from "date-fns";
import ruLocale from "date-fns/locale/ru";
import { State } from "../../store";
import { useSelector, useDispatch } from "react-redux";
import panel from "./Panel.module.scss"

export default function Today() {
    const dispatch = useDispatch();
    const { rangeType, range } = useSelector((state: State) => state.calendar);
    const onClick = () => {
        dispatch(resetDateRange(range.dateRangeHelper, rangeType))
    }

    return (
        <span className={panel.today} onClick={onClick}>Сегодня {format(new Date(), 'd MMMM', { locale: ruLocale })}</span>
    )
}