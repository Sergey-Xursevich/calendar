import React from "react";
import { isSameDay } from "date-fns";
import { ResolutionStart, VisaSignStart, MeetingStart, Note } from ".";
import { CommonViewType } from "../../../store/common/types";
import { iDay } from "../../../Dictionary/Interfaces";

import shortDay from "../ShortDay.module.scss"

interface iProps {
    day: iDay;
    commonViewType: CommonViewType;
}

export default function ShownStartEventsForMonth({ day, commonViewType }: iProps) {
    const { generatedEvents, notes, plans, meetings, date } = day
    if (commonViewType === 'calendar')
        return (
            <div className={shortDay.monthEvents}>
                <ResolutionStart events={generatedEvents} date={date} compareCallback={isSameDay} />
                <VisaSignStart events={generatedEvents} date={date} compareCallback={isSameDay} />
                <MeetingStart plans={[]} meetings={meetings} date={date} compareCallback={isSameDay} />
                <Note notes={notes} date={date} />
            </div>
        )
    if (commonViewType === 'plan')
        return (
            <div className={shortDay.monthEvents}>
                <MeetingStart plans={plans} meetings={meetings} date={date} compareCallback={isSameDay} />
                <Note notes={notes} date={date} />
            </div>
        )
    else return null;
}

