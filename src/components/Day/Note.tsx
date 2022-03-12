import { iMREVT_EVENT } from "@eos/mrsoft-core";
import { format } from "date-fns";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { iDay } from "../../Dictionary/Interfaces";
import { State } from "../../store";
import { setSelection } from "../../store/calendar/actions";
import { getISN_EVENT } from "../../Utils/getField";
import Link from "../../UI/components/Link";
import dayClass from "./Day.module.scss"

interface iProps {
    item: iMREVT_EVENT;
}

export default function Note(props: iProps) {
    const { item, item: { ISN_EVENT, EVENT_DATE, BODY, MREVT_REF_List } } = props;
    const refs = MREVT_REF_List || [];
    const classes = [dayClass.timeLineItem];
    const currentEvent = useSelector((state: State) => state.calendar.currentEvent)
    const dispatch = useDispatch();
    const setSelected = (selection: { day?: iDay, event?: iMREVT_EVENT }, e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(setSelection({ event: selection.event }))
    }
    if (getISN_EVENT(currentEvent) === ISN_EVENT) classes.push(dayClass.selected)
    return (
        <div className={classes.join(' ')} onClick={(e) => { if (ISN_EVENT) setSelected({ event: item }, e) }}>
            <div className={dayClass.time}>{format(new Date(EVENT_DATE || 0), 'HH:mm')}</div>
            <div className={dayClass.body}>
                <span>{BODY}</span>
                <div className={dayClass.refs}>
                    {refs.map(item => <Link key={item.ISN_REF} href={item} isEdit={false} />)}
                </div>
            </div>
        </div>
    )
}