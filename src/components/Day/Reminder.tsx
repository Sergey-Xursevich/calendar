import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { iCurrentEvent, iREMINDER_ADVANCE } from "../../store/calendar/types";
import { format } from "date-fns";
import { iDay } from "../../Dictionary/Interfaces";
import { State } from "../../store";
import { loadGeneratedEvents, setSelection } from "../../store/calendar/actions";
import { getISN_EVENT } from "../../Utils/getField";
import dayClass from "./Day.module.scss";
import S from "../../values/Strings";
import Icon from "../../UI/components/Icon";
import { Core, DM } from "@eos/mrsoft-core";

interface iProps {
  item: iREMINDER_ADVANCE;
}

export default function Reminder(props: iProps) {
  const dispatch = useDispatch();
  const setSelected = (selection: { day?: iDay, event?: iCurrentEvent }, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(setSelection({ event: selection.event }))
  }

  const { item: { ISN_EVENT, INS_DATE, REMINDER_TEXT, ISN_OBJECT_ATTACHED, ISN_REPLY } } = props;
  const classes = [dayClass.timeLineItem, dayClass.reminder];
  const currentEvent = useSelector((state: State) => state.calendar.currentEvent)
  const event = useSelector((state: State) => state.calendar.generatedEvents.filter(event => event.ISN_EVENT === ISN_EVENT)[0]);
  const openReminder = () => {
    const dueReply = DM.get("REPLY", ISN_REPLY, "DUE");
    return openPopUp(`${Core.DeloPath}/WebRC/Pages/Reminders.html?res_id=${ISN_OBJECT_ATTACHED}&readFilter=NotReading&addressFilter=${dueReply}`, () => dispatch(loadGeneratedEvents()));
  }

  if (getISN_EVENT(currentEvent) === ISN_EVENT) classes.push(dayClass.selected)

  return (
    <div className={classes.join(' ')} onClick={(e) => { if (ISN_EVENT) { openReminder(); setSelected({ event: event }, e); } }}>
      <div className={dayClass.time}>
        {format(new Date(INS_DATE || 0), 'HH:mm')}
        <Icon name={"reminder"} width="22px" height="24px" title={S.textTooltipReminderTodo} />
      </div>
      <div className={dayClass.body}>
        <span className={dayClass.headerReminder}>{S.textHeaderReminderDay}</span>
        <span className={dayClass.messageReminder}>{REMINDER_TEXT}</span>
      </div>
    </div>
  )
}