import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { deloDialogAlert } from "@eos/mrsoft-core";
import cl from "classnames";
import { ViewRange } from "../../Dictionary/Enums";
import { DateFormatter, useWindowSize } from "../../Utils/CalendarHelper";
import { setCustomDateRange, setNextDateRange, setPrevDateRange } from "../../store/calendar/actions";
import { State } from "../../store";
import Icon from "../../UI/components/Icon";
import DatePicker from "react-datepicker";

import panel from "./Panel.module.scss"

export default function Direction() {
    const dispatch = useDispatch();
    const { rangeType, range, days } = useSelector((state: State) => state.calendar);
    const editingNote = useSelector((state: State) => state.common.editingNote);
    const shortView = useWindowSize().width < 1300;
    const onClickLeft = () => {
        if (editingNote) deloDialogAlert('Для дальнейшей работы завершите редактирование элемента', 'Дело-Web')
        else dispatch(setPrevDateRange(range.dateRangeHelper, rangeType))
    }
    const onClickRight = () => {
        if (editingNote) deloDialogAlert('Для дальнейшей работы завершите редактирование элемента', 'Дело-Web')
        else dispatch(setNextDateRange(range.dateRangeHelper, rangeType))
    }
    const onClickCustomRange = (date: Date) => {
        if (editingNote) deloDialogAlert('Для дальнейшей работы завершите редактирование элемента', 'Дело-Web')
        else dispatch(setCustomDateRange(date, rangeType))
    }

    const className = cl(
        panel.dateRange,
        { [panel.holiday]: rangeType === ViewRange.Day && days[0]?.isHoliday }
    );

    return (
        <div className={panel.direction}>
            <Icon onClick={onClickLeft} name="left" className={panel.directionButton} />
            <DatePicker
                selected={range.dateRangeHelper}
                onChange={date => { if (date && !Array.isArray(date)) onClickCustomRange(date) }}
                customInput={
                    <div className={className}>
                        {DateFormatter(rangeType, range, shortView)}
                    </div>
                }
                showYearPicker={rangeType === "Year"}
                showMonthYearPicker={rangeType === "Month"}
                locale="ru"
            />
            <Icon onClick={onClickRight} name="right" className={panel.directionButton} />
        </div>
    );
}
