import React from "react";
import { useSelector } from "react-redux";
import { isAfter, isBefore, isSameDay } from "date-fns";
import { EventsType } from "../../../Dictionary/Enums";
import { State } from "../../../store";
import cl from "classnames";

import countEvent from "./CountEvents.module.scss"
import Icon from "../../../UI/components/Icon";

interface iProps {
    type: EventsType;
}

export default function CountEvents(props: iProps) {
    const { type } = props;
    const generatedEvents = useSelector((state: State) => state.calendar.generatedEvents);
    const loadingGeneratedEvents = useSelector((state: State) => state.calendar.loadingGeneratedEvents);
    const loadingMeetings = useSelector((state: State) => state.calendar.loadingMeetings);
    const loadingNotes = useSelector((state: State) => state.calendar.loadingNotes);
    const loadingPlans = useSelector((state: State) => state.calendar.loadingPlans);
    const notes = useSelector((state: State) => state.calendar.notes);
    const plans = useSelector((state: State) => state.calendar.plans);
    const meetings = useSelector((state: State) => state.calendar.meetings);
    const isBeforeOrSameDay = (date: string) => isBefore(new Date(date), new Date()) || isSameDay(new Date(date), new Date());
    const isAfterOrSameDay = (date: string) => isAfter(new Date(date), new Date()) || isSameDay(new Date(date), new Date());

    const Count = (type: number): number | React.ReactElement => {
        if (type === EventsType.RESOLUTION) {
            if (loadingGeneratedEvents) return <Icon name="spiner" />;
            return generatedEvents.filter(item => item.EVENT_TYPE === EventsType.RESOLUTION).length;
        }
        if (type === EventsType.VISA_SIGN) {
            if (loadingGeneratedEvents) return <Icon name="spiner" />;
            return generatedEvents.filter(item => item.EVENT_TYPE === EventsType.VISA_SIGN).length;
        }
        if (type === EventsType.MEETING) {
            if (loadingMeetings || loadingPlans) return <Icon name="spiner" />;
            return [...meetings, ...plans].length;
        }
        if (type === EventsType.NOTE) {
            if (loadingNotes) return <Icon name="spiner" />;
            return notes.filter(item => isAfterOrSameDay(item.EVENT_DATE)).length;
        }
        else return 0;
    }

    const Label = (type: EventsType) => {
        if (type === EventsType.RESOLUTION) return "Работа с документами"
        if (type === EventsType.VISA_SIGN) return "Работа с проектами"
        if (type === EventsType.NOTE) return "Заметки"
        if (type === EventsType.MEETING) return "События"
    }

    let classname = cl(
        { [countEvent.circle]: type !== EventsType.NOTE },
        { [countEvent.square]: type === EventsType.NOTE },
        { [countEvent.yellow]: type === EventsType.RESOLUTION },
        { [countEvent.blue]: type === EventsType.VISA_SIGN },
        { [countEvent.green]: type === EventsType.MEETING },
        { [countEvent.grey]: type === EventsType.NOTE }
    );

    return (
        <div className={countEvent.countEvent}>
            <div className={classname}>{Count(type)}</div>
            <div className={countEvent.label}>{Label(type)}</div>
        </div>
    );
}
