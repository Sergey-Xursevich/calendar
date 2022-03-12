import React from "react";
import { iDay } from "../../../Dictionary/Interfaces";
import { iCurrentEvent } from "../../../store/calendar/types";
import { isPlan, isNote } from "../../../Utils/CalendarHelper";
import { EventsType } from "../../../Dictionary/Enums";
import Resolution from "./Resolution";
import VisaSign from "./VisaSign";
import Note from "./Note";
import Plan from "./Plan";
import Meeting from "./Meeting";
import Reminder from "./Reminder";

interface iEventCardProps {
    event: iCurrentEvent;
    setSelected: ({ day, event }: { day?: iDay, event?: iCurrentEvent }, e: React.MouseEvent) => void
}

export default function Event({ event, setSelected }: iEventCardProps) {
    if (event._type === "MRevtContext" && event.EVENT_TYPE === EventsType.RESOLUTION)
        return <Resolution resolution={event} setSelected={setSelected} />
    if (event._type === "MRevtContext" && event.EVENT_TYPE === EventsType.VISA_SIGN)
        return <VisaSign visaSign={event} setSelected={setSelected} />
    if (event._type === "MREVT_EVENT" && isNote(event))
        return <Note note={event} setSelected={setSelected} />
    if (event._type === "MREVT_EVENT" && isPlan(event))
        return <Plan plan={event} setSelected={setSelected} />
    if (event._type === "MTG_MEETING")
        return <Meeting meeting={event} setSelected={setSelected} />
    if (event._type === "MREVT_REMINDER")
        return <Reminder reminder={event} setSelected={setSelected} />
    else
        return null;
}