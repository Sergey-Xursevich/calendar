import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { ToolTip } from "@eos/mrsoft-core";
import { iDay } from "../../../Dictionary/Interfaces";
import { iMRGENERATED_EVENT } from "../../../store/calendar/types";
import { State } from "../../../store";
import { useScrollIntoView } from "../useScrollIntoView";
import ToolTipElement from "./ToolTipVisaSign";
import { getISN_EVENT } from "../../../Utils/getField";

import week from "../Week.module.scss";


export interface iProps {
    visaSign: iMRGENERATED_EVENT;
    setSelected: ({ day, event }: { day?: iDay, event?: iMRGENERATED_EVENT }, e: React.MouseEvent) => void
}

export default function VisaSign(props: iProps) {
    const { visaSign, visaSign: { STAGE, NAME_DOCUMENT, EVENT_DATE_TO: DATE_TO, ISN_EVENT }, setSelected } = props;
    const currentEvent = useSelector((state: State) => state.calendar.currentEvent);
    const eventClasses = [week.eventItem, week.visaSign, getISN_EVENT(currentEvent) === ISN_EVENT ? week.selected : ''];
    const visaSignRef = useRef<HTMLDivElement>(null);
    useScrollIntoView(visaSignRef, ISN_EVENT, currentEvent);
    return (
        <ToolTip position='underMouse' element={<ToolTipElement event={visaSign} />} delayShow={500}>
            <div ref={visaSignRef} className={eventClasses.join(' ')} onClick={(e) => { if (ISN_EVENT) setSelected({ event: visaSign }, e) }}>
                <span className={week.stage}>{STAGE}</span>
                <span className={week.nameDoc}>{NAME_DOCUMENT}</span>
                {DATE_TO && <span className={week.dateTo}>Срок: {format(new Date(DATE_TO), 'dd.MM.yyyy')}</span>}
            </div>
        </ToolTip>
    )
}

