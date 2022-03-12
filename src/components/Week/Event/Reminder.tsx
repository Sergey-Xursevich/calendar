import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { iDay } from "../../../Dictionary/Interfaces";
import { iCurrentEvent, iREMINDER_ADVANCE } from "../../../store/calendar/types";
import { State } from "../../../store";
import { useScrollIntoView } from "../useScrollIntoView";
import { getISN_EVENT } from "../../../Utils/getField";

import week from "../Week.module.scss";
import { loadGeneratedEvents } from "../../../store/calendar/actions";
import { Core, DM } from "@eos/mrsoft-core";

export interface iProps {
  reminder: iREMINDER_ADVANCE;
  setSelected: ({ day, event }: { day?: iDay, event?: iCurrentEvent }, e: React.MouseEvent) => void
}

export default function Reminder(props: iProps) {
  const { reminder: { ISN_EVENT, INS_DATE, ISN_OBJECT_ATTACHED, ISN_REPLY }, setSelected } = props;

  const dispatch = useDispatch();
  const currentEvent = useSelector((state: State) => state.calendar.currentEvent);
  const event = useSelector((state: State) => state.calendar.generatedEvents.filter(event => event.ISN_EVENT === ISN_EVENT)[0]);
  const eventClasses = [week.eventItem, week.reminder, getISN_EVENT(currentEvent) === ISN_EVENT ? week.selected : ''];
  const resolRef = useRef<HTMLDivElement>(null);
  useScrollIntoView(resolRef, ISN_EVENT, currentEvent);

  const openReminder = () => {
    const dueReply = DM.get("REPLY", ISN_REPLY, "DUE");
    return openPopUp(`${Core.DeloPath}/WebRC/Pages/Reminders.html?res_id=${ISN_OBJECT_ATTACHED}&readFilter=NotReading&addressFilter=${dueReply}`, () => dispatch(loadGeneratedEvents()));
  }

  return (
    <>
      <div ref={resolRef} className={eventClasses.join(' ')} onClick={(e) => { if (ISN_EVENT) { openReminder(); setSelected({ event: event }, e); } }}>
        <span className={week.stage}>{`${format(new Date(INS_DATE), "HH:mm")}`}</span>
        <span className={week.nameDoc}>НАПОМИНАНИЕ</span>
      </div>
    </>
  )
}
