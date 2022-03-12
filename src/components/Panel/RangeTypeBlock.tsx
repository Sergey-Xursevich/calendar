import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { ViewRange } from "../../Dictionary/Enums";
import Button from "../../UI/components/Button";
import ButtonGroup from "../../UI/components/ButtonGroup";
import { setRangeType } from "../../store/calendar/actions";
import { State } from "../../store";

export default function Panel() {
    const dispatch = useDispatch();
    const { rangeType, selection, calendarCl } = useSelector((state: State) => state.calendar);
    const buttonStyles = { width: 60, height: 25, padding: 0 }
    return (
        <ButtonGroup>
            <Button
                text="Год"
                onClick={() => dispatch(setRangeType(ViewRange.Year, selection, calendarCl))}
                isActive={rangeType === ViewRange.Year}
                styles={buttonStyles}
            />
            <Button
                text="Месяц"
                onClick={() => dispatch(setRangeType(ViewRange.Month, selection, calendarCl))}
                isActive={rangeType === ViewRange.Month}
                styles={buttonStyles}
            />
            <Button
                text="Неделя"
                onClick={() => dispatch(setRangeType(ViewRange.Week, selection, calendarCl))}
                isActive={rangeType === ViewRange.Week}
                styles={buttonStyles}
            />
            <Button
                text="День"
                onClick={() => dispatch(setRangeType(ViewRange.Day, selection, calendarCl))}
                isActive={rangeType === ViewRange.Day}
                styles={buttonStyles}
            />
        </ButtonGroup>
    );
}