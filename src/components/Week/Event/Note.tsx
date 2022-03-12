import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { iMREVT_EVENT, ToolTip } from "@eos/mrsoft-core";
import { iDay } from "../../../Dictionary/Interfaces";
import { State } from "../../../store";
import { useScrollIntoView } from "../useScrollIntoView";
import ToolTipNote from "./ToolTipNote";
import { getISN_EVENT } from "../../../Utils/getField";

import week from "../Week.module.scss";


export interface iProps {
    note: iMREVT_EVENT;
    setSelected: ({ day, event }: { day?: iDay, event?: iMREVT_EVENT }, e: React.MouseEvent) => void
}

export default function Note(props: iProps) {
    const { note, note: { EVENT_DATE: DATE, BODY, ISN_EVENT }, setSelected } = props
    const currentEvent = useSelector((state: State) => state.calendar.currentEvent)
    const eventClasses = [week.eventItem, week.note, getISN_EVENT(currentEvent) === ISN_EVENT ? week.selected : ''];
    const noteRef = useRef<HTMLDivElement>(null);
    useScrollIntoView(noteRef, ISN_EVENT, currentEvent);
    return (
        <ToolTip position='underMouse' element={<ToolTipNote event={note} />} delayShow={500}>
            <div ref={noteRef} className={eventClasses.join(' ')} onClick={(e) => { if (ISN_EVENT) setSelected({ event: note }, e) }}>
                {DATE && <span className={week.date}>{format(new Date(DATE), 'HH:mm')}</span>}
                <span className={week.bodyNote}>{BODY}</span>
            </div>
        </ToolTip>
    )
}