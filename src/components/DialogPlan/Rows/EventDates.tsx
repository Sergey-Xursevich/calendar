import React, { useCallback, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { set } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox } from "@eos/mrsoft-core";
import { setEventDate, setEventDateTo, setEventDateFact, setEventDateToFact } from "../../../store/dialogPlan/actions";
import { State } from "../../../store";

import dialogNewPlan from "../DialogNewPlan.module.scss";

export default function EventDates() {
    const dispatch = useCallback(useDispatch(), []);
    const { edit, dialogCancelled, dialogDone, EVENT_DATE, EVENT_DATE_TO, EVENT_DATE_FACT, EVENT_DATE_TO_FACT } = useSelector((state: State) => state.dialogPlan);
    const resultEdit = (dialogCancelled || dialogDone) ? false : edit;
    const selectedDate = useSelector((state: State) => state.calendar.selection?.date) || new Date();
    const [allDay, setAllDay] = useState(false);
    const allDayHandler = (allDay: boolean, date: Date, cb: (date: Date) => void, start: boolean) => {
        if (date == null) return dispatch(cb(date));
        if (allDay) {
            if (start) {
                const newDate = set(date, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })
                dispatch(cb(newDate));
            }
            else {
                const newDate = set(date, { hours: 23, minutes: 59, seconds: 59, milliseconds: 999 })
                dispatch(cb(newDate));
            }
        }
        else dispatch(cb(date))
    }

    const onChangeAllDay = (newValue: boolean) => { //При клике на "Целый день" требуется выставлять даты соответсвенно
        setAllDay(newValue);
        if (newValue) {
            allDayHandler(newValue, EVENT_DATE ? new Date(EVENT_DATE) : selectedDate || new Date(), setEventDate, true)
            // allDayHandler(newValue, currentDate || new Date(EVENT_DATE_FACT) || new Date(), setEventDateFact, true)
            allDayHandler(newValue, EVENT_DATE ? new Date(EVENT_DATE) : selectedDate || new Date(), setEventDateTo, false)
            // allDayHandler(newValue, currentDate || new Date(EVENT_DATE_TO_FACT) || new Date(), setEventDateToFact, false)
        }
    }

    const onChangeEventDate = (date: Date) => {
        allDayHandler(allDay, date, setEventDate, true);
        if (allDay) allDayHandler(allDay, date, setEventDateTo, false);
    }

    const onChangeEventDateTo = (date: Date) => {
        if (allDay) allDayHandler(allDay, date, setEventDate, true);
        allDayHandler(allDay, date, setEventDateTo, false);
    }

    const onChangeEventDateFact = (date: Date) => {
        allDayHandler(allDay, date, setEventDateFact, true);
    }

    const onChangeEventDateToFact = (date: Date) => {
        allDayHandler(allDay, date, setEventDateToFact, true);
    }

    return (
        <>
            <div className={dialogNewPlan.row}>
                <span className={dialogNewPlan.label}></span>
                <Checkbox disabled={!resultEdit} inline label="Целый день" checked={allDay} onChange={onChangeAllDay} />
            </div>
            <div className={dialogNewPlan.row}>
                <div className={dialogNewPlan.columnLeft}>
                    <span className={dialogNewPlan.label}>Дата начала:</span>
                    <div className={dialogNewPlan.date}>
                        <ReactDatePicker
                            className={dialogNewPlan.datePicker}
                            {...datepickerOptions({
                                edit: resultEdit,
                                allDay: allDay,
                                start: EVENT_DATE ? new Date(EVENT_DATE) : selectedDate,
                                end: EVENT_DATE_TO ? new Date(EVENT_DATE_TO) : void 0,
                                selected: EVENT_DATE ? new Date(EVENT_DATE) : selectedDate,
                                onChange: onChangeEventDate
                            })}
                        />
                    </div>
                </div>
                <div className={dialogNewPlan.columnRight}>
                    <span className={dialogNewPlan.label}>Дата начала(факт.):</span>
                    <div className={dialogNewPlan.date}>
                        <ReactDatePicker
                            className={dialogNewPlan.datePicker}
                            {...datepickerOptions({
                                edit: resultEdit,
                                allDay: allDay,
                                start: EVENT_DATE_FACT ? new Date(EVENT_DATE_FACT) : void 0,
                                end: EVENT_DATE_TO_FACT ? new Date(EVENT_DATE_TO_FACT) : void 0,
                                selected: EVENT_DATE_FACT ? new Date(EVENT_DATE_FACT) : void 0,
                                onChange: onChangeEventDateFact
                            })} />
                    </div>
                </div>
            </div>
            <div className={dialogNewPlan.row}>
                <div className={dialogNewPlan.columnLeft}>
                    <span className={dialogNewPlan.label}>Дата окончания:</span>
                    <div className={dialogNewPlan.date}>
                        <ReactDatePicker
                            className={dialogNewPlan.datePicker}
                            {...datepickerOptions({
                                edit: resultEdit,
                                allDay: allDay,
                                start: EVENT_DATE ? new Date(EVENT_DATE) : void 0,
                                end: EVENT_DATE_TO ? new Date(EVENT_DATE_TO) : void 0,
                                selected: EVENT_DATE_TO ? new Date(EVENT_DATE_TO) : void 0,
                                onChange: onChangeEventDateTo
                            })} />
                    </div>
                </div>
                <div className={dialogNewPlan.columnRight}>
                    <span className={dialogNewPlan.label}>Дата оконч.(факт.):</span>
                    <div className={dialogNewPlan.date}>
                        <ReactDatePicker
                            className={dialogNewPlan.datePicker}
                            {...datepickerOptions({
                                edit: resultEdit,
                                allDay: allDay,
                                start: EVENT_DATE_FACT ? new Date(EVENT_DATE_FACT) : void 0,
                                end: EVENT_DATE_TO_FACT ? new Date(EVENT_DATE_TO_FACT) : void 0,
                                selected: EVENT_DATE_TO_FACT ? new Date(EVENT_DATE_TO_FACT) : void 0,
                                onChange: onChangeEventDateToFact
                            })} />
                    </div>
                </div>
            </div>
        </>
    )
}

function datepickerOptions({ edit, allDay, start, end, selected, onChange }: iDatePickerOptions) {
    return {
        locale: "ru",
        dateFormat: allDay ? 'dd MMMM yyyy' : "dd.MM.yyyy HH:mm",
        disabled: !edit,
        selectsStart: start === selected ? true : false,
        selectsEnd: end === selected ? true : false,
        selected: selected,
        onChange: onChange || (() => { }),
        startDate: start,
        endDate: end,
        showTimeSelect: !allDay,
        timeIntervals: 15,
        timeCaption: "Время:",
        timeFormat: "HH:mm",
    };
}

interface iDatePickerOptions {
    allDay: boolean;
    edit?: boolean;
    start?: Date;
    end?: Date;
    selected?: Date;
    onChange: (date: Date) => void;
}
