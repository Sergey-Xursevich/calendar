import { iDEPARTMENT, iMTG_MEETING, Piper } from "@eos/mrsoft-core";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EventsType } from "../../Dictionary/Enums";
import { iDay } from "../../Dictionary/Interfaces";
import { State } from "../../store";
import { setSelection } from "../../store/calendar/actions";
import Icon from "../../UI/components/Icon";
import { getIconPlanName, getPlanName } from "../../Utils/CalendarHelper";
import { getEVENT_TYPE, getISN_EVENT } from "../../Utils/getField";
import dayClass from "./Day.module.scss"

interface iProps {
    item: iMTG_MEETING;
}

export default function Meeting(props: iProps) {
    const { item, item: { ISN_MTG_MEETING, MEETING_DATE, NOTE, NAME, REVIEW_END_DATE, MEETING_PLACE, DUE_DEP } } = props;
    const classes = [dayClass.timeLineItem];
    const currentEvent = useSelector((state: State) => state.calendar.currentEvent)
    const [responsible, setResponsible] = useState('')

    useEffect(() => {
        if (!DUE_DEP) return;
        setResponsible('Загрузка...');
        Piper.load<iDEPARTMENT>('DEPARTMENT', DUE_DEP, { saveToStore: true }).then((res) => {
            setResponsible(res.CLASSIF_NAME || res.SURNAME || res.FULLNAME || DUE_DEP);
        })
    }, [DUE_DEP]);

    const dispatch = useDispatch();
    const setSelected = (selection: { day?: iDay, event?: iMTG_MEETING }, e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(setSelection({ event: selection.event }))
    }
    if (getISN_EVENT(currentEvent) === ISN_MTG_MEETING) classes.push(dayClass.selected)
    return (
        <div className={classes.join(' ')} onClick={(e) => { if (ISN_MTG_MEETING) setSelected({ event: item }, e) }}>
            <div className={dayClass.time}>{format(new Date(MEETING_DATE || 0), 'HH:mm')}</div>
            <div className={[dayClass.body, dayClass.meetingDay].join(' ')}>
                <div className={dayClass.title}>
                    <Icon color="#58B070" width={14} height={14} name={getIconPlanName(getEVENT_TYPE(item) || 0)} />
                    <span className={dayClass.TitleName}>
                        <span> {getPlanName(getEVENT_TYPE(item) || 0)}:</span>
                        <span> {NAME}</span>
                    </span>
                    <span>{format(new Date(MEETING_DATE || 0), 'dd.MM.yyyy HH:mm')}</span>
                </div>
                <div className={dayClass.content}>
                    <div>
                        <span>{NOTE}</span>
                    </div>
                    <div>
                        <span>Время начала: {format(new Date(MEETING_DATE || 0), 'dd.MM.yyyy HH:mm')}</span>
                        <span style={{ marginLeft: 30 }}>Место: {MEETING_PLACE}</span>
                    </div>
                    <div>
                        {REVIEW_END_DATE && <span>Время окончания: {format(new Date(REVIEW_END_DATE), 'dd.MM.yyyy HH:mm')}</span>}
                    </div>
                    <div>
                        {(getEVENT_TYPE(item) === EventsType.MEETING || getEVENT_TYPE(item) === EventsType.EXPERTISE || getEVENT_TYPE(item) === EventsType.SESSION) &&
                            <span>Секретарь: {responsible}</span>
                        }
                        {getEVENT_TYPE(item) === EventsType.EVENT &&
                            <span>Ответственный: {responsible}</span>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}