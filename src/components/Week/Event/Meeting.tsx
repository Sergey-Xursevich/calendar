import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { iMTG_MEETING, ToolTip } from "@eos/mrsoft-core";
import { iDay } from "../../../Dictionary/Interfaces";
import { iCurrentEvent } from "../../../store/calendar/types";
import { State } from "../../../store";
import { useScrollIntoView } from "../useScrollIntoView";
import { getEVENT_TYPE, getISN_EVENT, } from "../../../Utils/getField";
import { getIconPlanName, getPlanName } from "../../../Utils/CalendarHelper";
import ToolTipMeeting from "./ToolTipMeeting";

import week from "../Week.module.scss";
import Icon from "../../../UI/components/Icon";
import { format, isSameDay } from "date-fns";

export interface iProps {
    meeting: iMTG_MEETING;
    setSelected: ({ day, event }: { day?: iDay, event?: iCurrentEvent }, e: React.MouseEvent) => void
}

export default function Meeting(props: iProps) {
    const { meeting, setSelected } = props
    const currentEvent = useSelector((state: State) => state.calendar.currentEvent)
    const ISN_EVENT = meeting.ISN_MTG_MEETING;

    const eventClasses = [week.eventItem, week.meeting, getISN_EVENT(currentEvent) === ISN_EVENT ? week.selected : ''];
    const meetingRef = useRef<HTMLDivElement>(null);
    useScrollIntoView(meetingRef, ISN_EVENT, currentEvent);
    return (
        <ToolTip position='underMouse' element={<ToolTipMeeting event={meeting} />} delayShow={500}>
            <div ref={meetingRef} className={eventClasses.join(' ')} onClick={(e) => { if (ISN_EVENT) setSelected({ event: meeting }, e) }}>
                <div className={week.meetingHeader}>
                    <Icon color="#58B070" width={14} height={14} name={getIconPlanName(getEVENT_TYPE(meeting) || 0)} />
                    <div className={week.meetingTime}>
                        {!meeting.REVIEW_END_DATE &&
                            `${format(new Date(meeting.MEETING_DATE || 0), 'HH:mm')}`
                        }
                        {meeting.REVIEW_END_DATE && isSameDay(new Date(meeting.MEETING_DATE || 0), new Date(meeting.REVIEW_END_DATE || 0)) &&
                            `${format(new Date(meeting.MEETING_DATE || 0), 'HH:mm')}-${format(new Date(meeting.REVIEW_END_DATE || 0), 'HH:mm')}`
                        }
                        {meeting.REVIEW_END_DATE && !isSameDay(new Date(meeting.MEETING_DATE || 0), new Date(meeting.REVIEW_END_DATE || 0)) &&
                            <>
                                <span>{format(new Date(meeting.MEETING_DATE || 0), 'dd.MM HH:mm')}</span>
                                <span>{format(new Date(meeting.REVIEW_END_DATE || 0), 'dd.MM HH:mm')}</span>
                            </>
                        }
                    </div>
                </div>
                <div className={week.meetingTitle}>
                    {getPlanName(getEVENT_TYPE(meeting) || 0)}
                </div>
                <div className={week.meetingBody}>
                    {meeting.NOTE}
                </div>
            </div>
        </ToolTip>
    )
}
