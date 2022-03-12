import React from "react";
import MeetingEnd from "./MeetingEnd";
import ResolutionEnd from "./ResolutionEnd";
import VisaSignEnd from "./VisaSignEnd";
import ShownReminder from "./ShownReminder";
import { CommonViewType } from "../../../store/common/types";
import { iDay } from "../../../Dictionary/Interfaces";

import shortDay from "../ShortDay.module.scss"


interface iProps {
    day: iDay;
    commonViewType: CommonViewType;
}

export default function ShownEndEvents({ day, commonViewType }: iProps) {
    const { generatedEvents, plans, meetings, date, reminders } = day
    if (commonViewType === 'calendar')
        return (
            <div className={shortDay.ending}>
                <ResolutionEnd generatedEvents={generatedEvents} date={date} />
                <ShownReminder reminders={reminders} date={date} />
                <VisaSignEnd generatedEvents={generatedEvents} date={date} />
                <MeetingEnd meetings={meetings} plans={[]} date={date} />
            </div>
        )
    if (commonViewType === 'plan')
        return (
            <div className={shortDay.ending}>
                <MeetingEnd meetings={meetings} plans={plans} date={date} />
            </div>
        )
    else return null;
}
