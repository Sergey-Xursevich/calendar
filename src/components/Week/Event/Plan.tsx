import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { iMREVT_EVENT, ToolTip } from "@eos/mrsoft-core";
import { format, isSameDay } from "date-fns";
import { iDay } from "../../../Dictionary/Interfaces";
import { iCurrentEvent } from "../../../store/calendar/types";
import { State } from "../../../store";
import { useScrollIntoView } from "../useScrollIntoView";
import { getISN_EVENT } from "../../../Utils/getField";
import { getIconPlanName, getPlanName } from "../../../Utils/CalendarHelper";
import ToolTipPlan from "./ToolTipPlan";
import Icon from "../../../UI/components/Icon";

import week from "../Week.module.scss";

export interface iProps {
    plan: iMREVT_EVENT;
    setSelected: ({ day, event }: { day?: iDay, event?: iCurrentEvent }, e: React.MouseEvent) => void
}

export default function Plan(props: iProps) {
    const { plan, setSelected } = props
    const currentEvent = useSelector((state: State) => state.calendar.currentEvent)
    const ISN_EVENT = plan.ISN_EVENT;

    const eventClasses = [week.eventItem, week.plan, getISN_EVENT(currentEvent) === ISN_EVENT ? week.selected : ''];
    const planRef = useRef<HTMLDivElement>(null);
    useScrollIntoView(planRef, ISN_EVENT, currentEvent);
    return (
        <ToolTip position='underMouse' element={<ToolTipPlan event={plan} />} delayShow={500}>
            <div ref={planRef} className={eventClasses.join(' ')} onClick={(e) => { if (ISN_EVENT) setSelected({ event: plan }, e) }}>
                <div className={week.planHeader}>
                    <Icon color="#58B070" width={14} height={14} name={getIconPlanName(plan.EVENT_TYPE, true)} />
                    <TimeRange plan={plan} />

                </div>
                <div className={week.planTitle}>
                    {getPlanName(plan.EVENT_TYPE)}
                </div>
                <div className={week.planBody}>
                    {plan.BODY}
                </div>
            </div>
        </ToolTip>
    )
}

function TimeRange({ plan }: { plan: iMREVT_EVENT }) {
    return (
        <div className={week.planTime}>
            {!plan.EVENT_DATE_TO &&
                `${format(new Date(plan.EVENT_DATE || 0), 'HH:mm')}`
            }
            {plan.EVENT_DATE_TO && isSameDay(new Date(plan.EVENT_DATE || 0), new Date(plan.EVENT_DATE_TO || 0)) &&
                `${format(new Date(plan.EVENT_DATE || 0), 'HH:mm')}-${format(new Date(plan.EVENT_DATE_TO || 0), 'HH:mm')}`
            }
            {plan.EVENT_DATE_TO && !isSameDay(new Date(plan.EVENT_DATE || 0), new Date(plan.EVENT_DATE_TO || 0)) &&
                <>
                    <span>{format(new Date(plan.EVENT_DATE || 0), 'dd.MM HH:mm')}</span>
                    <span>{format(new Date(plan.EVENT_DATE_TO || 0), 'dd.MM HH:mm')}</span>
                </>
            }
        </div>
    )
}
