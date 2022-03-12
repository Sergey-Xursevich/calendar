import React, { useCallback, useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { setEventType } from "../../../store/dialogPlan/actions";
import { EventsType } from "../../../Dictionary/Enums";
import { State } from "../../../store";

import dialogNewPlan from "../DialogNewPlan.module.scss";

export default function EventTypeAndInsDate() {
    const dispatch = useCallback(useDispatch(), []);
    const { edit, dialogCancelled, dialogDone, EVENT_TYPE, INS_DATE } = useSelector((state: State) => state.dialogPlan);
    const resultEdit = (dialogCancelled || dialogDone) ? false : edit;
    const [insDate, setInsDate] = useState<Date>(INS_DATE ? new Date(INS_DATE) : new Date());
    useEffect(() => {
        if (INS_DATE) return;
        const timer = setInterval(() => setInsDate(new Date()), 1000)
        return () => clearInterval(timer);
    }, [INS_DATE]);

    const onChangeEventType = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const EVENT_TYPE = +event.target.value;
        dispatch(setEventType(EVENT_TYPE));
    }

    return (
        <div className={dialogNewPlan.row}>
            <div className={dialogNewPlan.columnLeft}>
                <span className={dialogNewPlan.label}>Вид события:</span>
                <select disabled={!resultEdit} value={EVENT_TYPE} onChange={onChangeEventType} name="EventsType" className={dialogNewPlan.dropDown}>
                    <option value={EventsType.EVENT}>Мероприятие</option>
                    {/* Следующий код выродился из того что EventsType.SESSION и EventsType.MEETING вроде как одно и тоже но не одно и тоже(???) */}
                    {EVENT_TYPE !== EventsType.SESSION && EVENT_TYPE !== EventsType.MEETING && <option value={EventsType.SESSION}>Собрание</option>}
                    {EVENT_TYPE === EventsType.SESSION && <option value={EventsType.SESSION}>Собрание</option>}
                    {EVENT_TYPE === EventsType.MEETING && <option value={EventsType.MEETING}>Собрание</option>}
                    <option value={EventsType.EXPERTISE}>Экспертиза</option>
                    <option value={EventsType.PRIVATE}>Личный</option>
                </select>
            </div>
            <div className={dialogNewPlan.columnRight}>
                <span className={dialogNewPlan.label}>Дата создания:</span>
                <div className={dialogNewPlan.date}>
                    <ReactDatePicker
                        locale="ru"
                        disabled
                        className={dialogNewPlan.datePicker}
                        selected={insDate}
                        onChange={() => { }}
                        timeInputLabel="Дата создания:"
                        dateFormat="dd.MM.yyyy HH:mm"
                    />
                </div>
            </div>
        </div>
    )
}