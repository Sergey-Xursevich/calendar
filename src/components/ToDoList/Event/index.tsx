import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format, isSameDay, isBefore } from "date-fns";
import { Core, DM, ToolTip } from "@eos/mrsoft-core";
import { iCurrentEvent, iMRGENERATED_EVENT } from "../../../store/calendar/types";
import Icon from "../../../UI/components/Icon";
import { EventsType, StatusTypeMeeting, StatusTypePlan } from "../../../Dictionary/Enums";
import { State } from "../../../store";
import { useScrollIntoView } from "../../Week/useScrollIntoView";
import { isPlan, getIconPlanName, getIconWithHover } from "../../../Utils/CalendarHelper";
import {
    getCONTROL_STATE, getDATE_CREATE_DOCUMENT, getEVENT_DATE_TO, getEVENT_TYPE, getISN_EVENT, getKIND_DOC,
    getNAME_DOCUMENT, getSTAGE, getSTATUS, getTITLE, getTOOLTIP_CORRESP, getTOOLTIP_ORGANIZ,
} from "../../../Utils/getField";
import cl from "classnames";
import { setSelection, loadGeneratedEvents } from "../../../store/calendar/actions";
import S from "../../../values/Strings";
import ToolTipElement from "./ToolTipElement";

import event from "./Event.module.scss"

interface iProps {
    item: iCurrentEvent;
    selected: boolean;
    openPopUpWrapper: (item: iCurrentEvent) => void
}

export default function Event(props: iProps) {
    const {
        item,
        selected,
        openPopUpWrapper,
    } = props

    const [isHovered, setHovered] = useState<boolean>(false);
    const date = useSelector((state: State) => state.calendar.selection?.date);

    const dispatch = useDispatch();
    const setCurrentEv = (item: iCurrentEvent) => {
        dispatch(setSelection({ event: item }));
    }

    const currentEvent = useSelector((state: State) => state.calendar.currentEvent);
    const docRef = useRef<HTMLDivElement>(null);
    const ISN_EVENT = getISN_EVENT(item);
    const EVENT_DATE_TO = getEVENT_DATE_TO(item);
    const EVENT_TYPE = getEVENT_TYPE(item);
    const KIND_DOC = getKIND_DOC(item);
    const TITLE = getTITLE(item);
    const CONTROL_STATE = getCONTROL_STATE(item);
    const STAGE = getSTAGE(item);
    const DATE_CREATE_DOCUMENT = getDATE_CREATE_DOCUMENT(item);
    const NAME_DOCUMENT = getNAME_DOCUMENT(item);
    const TOOLTIP_CORRESP = getTOOLTIP_CORRESP(item);
    const TOOLTIP_ORGANIZ = getTOOLTIP_ORGANIZ(item);
    const STATUS = getSTATUS(item);
    const dateTo = new Date(EVENT_DATE_TO || 0);

    useScrollIntoView(docRef, ISN_EVENT, currentEvent);

    const openReminder = (item: iMRGENERATED_EVENT) => {
        const dueReply = DM.get("REPLY", item.REMINDERS![0].ISN_REPLY, "DUE");
        return openPopUp(`${Core.DeloPath}/WebRC/Pages/Reminders.html?res_id=${item.ISN_OBJECT_ATTACHED}&readFilter=NotReading&addressFilter=${dueReply}`, () => dispatch(loadGeneratedEvents()));
    }

    const eventClass = cl(
        event.event,
        { [event.selected]: selected },
        {
            [event.expired]:
                item._type === "MRevtContext"
                && EVENT_DATE_TO
                && date
                && (isBefore(dateTo, date) || isSameDay(dateTo, date))
        }
    );
    const eventTypeClass = cl(
        event.eventType,
        { [event.resolution]: EVENT_TYPE === EventsType.RESOLUTION },
        { [event.visaSign]: EVENT_TYPE === EventsType.VISA_SIGN },
        { [event.plan]: isPlan(item) },
        { [event.meeting]: item._type === "MTG_MEETING" },
        {
            [event.cancelled]:
                (item._type === "MTG_MEETING" && STATUS === StatusTypeMeeting.CANCELLED)
                || (item._type === "MREVT_EVENT" && STATUS === StatusTypePlan.CANCELLED)
        },
    );
    return (
        <div
            ref={docRef}
            className={eventClass}
            onClick={() => setCurrentEv(item)}
            onContextMenu={() => setCurrentEv(item)}
        >
            <div className={event.kindDoc}>
                {item._type === "MRevtContext" &&
                    <>
                        {KIND_DOC === 1 && <Icon name="kindIncoming" width="22px" height="22px" />}
                        {KIND_DOC === 2 && <Icon name="kindCitizen" width="22px" height="22px" />}
                        {KIND_DOC === 3 && <Icon name="kindOutcoming" width="22px" height="22px" />}
                        {KIND_DOC === 7 && <Icon name="kindProject" width="22px" height="22px" />}
                        {CONTROL_STATE && <Icon name="kindControl" width="22px" height="22px" />}
                    </>
                }
                {item._type !== "MRevtContext" &&
                    <Icon
                        color={(item._type === "MTG_MEETING" && STATUS === StatusTypeMeeting.CANCELLED)
                            || (item._type === "MREVT_EVENT" && STATUS === StatusTypePlan.CANCELLED)
                            ? ''
                            : "#58B070"}
                        name={getIconPlanName(EVENT_TYPE)}
                        width="22px"
                        height="22px"
                    />
                }
                {item._type === "MRevtContext" && item.REMINDERS && item.REMINDERS.length > 0 &&
                    <ToolTip position='bottom-end' element={<ToolTipElement text={S.textTooltipReminderTodo} />}>
                        <Icon
                            name={getIconWithHover("reminder", isHovered)}
                            width="22px"
                            height="24px"
                            title={S.textTooltipReminderTodo}
                            onClick={() => openReminder(item)}
                            onMouseEnter={() => setHovered(true)}
                            onMouseLeave={() => setHovered(false)}
                        />
                    </ToolTip>
                }
            </div>
            <ToolTip element={<ToolTipElement corresp={TOOLTIP_CORRESP} organiz={TOOLTIP_ORGANIZ} />}>
                <div className={event.numberWrap} onClick={() => openPopUpWrapper(item)}>
                    <div>{NAME_DOCUMENT}</div>
                    <div>{format(new Date(DATE_CREATE_DOCUMENT || 0), 'dd.MM.yyyy')}</div>
                </div>
            </ToolTip>
            <div className={eventTypeClass}>{STAGE}</div>
            <div className={event.name} title={TITLE}>{TITLE}</div>
            <div className={event.dateTo}>
                {(STATUS !== StatusTypeMeeting.CANCELLED && EVENT_DATE_TO) &&
                    <span>
                        {item._type === 'MRevtContext' ? 'Срок:' : 'До:'}
                        <strong> {format(new Date(EVENT_DATE_TO || 0), 'dd.MM.yyyy')}</strong>
                    </span>}
            </div>
        </div>
    )
}