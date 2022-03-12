import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { isBefore, isSameDay } from "date-fns";
import { CSSTransition } from "react-transition-group";
import cl from "classnames";
import { DM, Core, iContextMenuStatus, iMREVT_EVENT, iMTG_MEETING } from "@eos/mrsoft-core";
import { iCurrentEvent, iMRGENERATED_EVENT } from "../../store/calendar/types";
import { State } from "../../store";
import { EventsType } from "../../Dictionary/Enums";
import { checkEventType, sortEventsByTypeAndDate } from "../../Utils/CalendarHelper";
import { getISN_EVENT } from "../../Utils/getField";
import { TodoListViewType } from "../../store/common/types";
import Event from "./Event";
import Header from "./Header";
import ContextMenu from "./ContextMenu";
import { setEdit, setPlan, setShow } from "../../store/dialogPlan/actions";

import todolist from "./ToDoList.module.scss";

const animationClasses = {
    enterActive: todolist.enterActive,
    enterDone: todolist.enterDone,
    exitActive: todolist.exitActive,
    exitDone: todolist.exitDone
};

export default function ToDoList() {
    const compatibilityIE = navigator.userAgent.match(/Trident/i) != null
    const { selection, currentEvent, generatedEvents, plans, meetings } = useSelector((state: State) => state.calendar)
    const wrapperRef = useRef<HTMLDivElement>(null);
    const PageContext = useSelector((state: State) => state.common.PageContext);
    const todoListFullView = useSelector((state: State) => state.common.todoListFullView);
    const todoListViewType = useSelector((state: State) => state.common.todoListViewType);
    const commonViewType = useSelector((state: State) => state.common.commonViewType);
    const [contextMenuStatus, setContextMenuStatus] = useState<iContextMenuStatus>({ isOpen: false });
    const dispatch = useDispatch();
    const [generatedEventsCount, setGeneratedEventsCount] = useState<Array<iMRGENERATED_EVENT>>([]);
    const [plansCount, setPlansCount] = useState<Array<iMREVT_EVENT>>([]);
    const [meetingsCount, setMeetingsCount] = useState<Array<iMTG_MEETING>>([]);

    useEffect(() => {
        setGeneratedEventsCount(generatedEvents.filter(item => filter(item, "EVENT_DATE", "EVENT_DATE_TO", selection?.date || new Date(), todoListViewType)))
        setGeneratedEventsCount(generatedEvents.filter(item => filter(item, "EVENT_DATE", "EVENT_DATE_TO", selection?.date || new Date(), todoListViewType)))
        setPlansCount(plans.filter(item => filter(item, "EVENT_DATE", "EVENT_DATE_TO", selection?.date || new Date(), todoListViewType)))
        setMeetingsCount(meetings.filter(item => filter(item, "MEETING_DATE", "REVIEW_END_DATE", selection?.date || new Date(), todoListViewType)))
    }, [selection, currentEvent, generatedEvents, meetings, plans, todoListViewType])

    if (!PageContext) return null;
    const user = DM.get("DEPARTMENT", PageContext.CurrentUser.DUE_DEP);
    const card_id: string = user.DEPARTMENT_DUE;
    const cabinet_id: number = user.ISN_CABINET;

    const openPopUpWrapper = (item: iCurrentEvent) => {
        if (item._type === 'MTG_MEETING')
            return openPopUp(`../../MeetingsWeb/Cards/Meeting.html#meeting_id=${item.ISN_MTG_MEETING}&card_id=${card_id}&cabinet_id=${cabinet_id}`);
        if (item._type === 'MREVT_EVENT') {
            dispatch(setPlan(item));
            dispatch(setShow(true));
            dispatch(setEdit(false));
        }
        if (item._type === 'MRevtContext' && checkEventType(item, EventsType.RESOLUTION))
            return openPopUp(`${Core.DeloPath}/WebRC/DOC_RC/DOC_RC.aspx#rc_id=${item.ISN_RC}&card_id=${card_id}&cabinet_id=${cabinet_id}&isn_resolution=${item.ISN_OBJECT_ATTACHED}`);
        if (item._type === 'MRevtContext' && checkEventType(item, EventsType.VISA_SIGN))
            return openPopUp(`${Core.DeloPath}/WebRC/PRJ_RC/PRJ_RC.aspx#rc_id=${item.ISN_PRJ}&card_id=${card_id}&cabinet_id=${cabinet_id}`);
    }

    const contextMenuHandler = (event: React.MouseEvent) => {
        event.preventDefault();
        setContextMenuStatus({ isOpen: true, top: event.pageY, left: event.pageX });
    }

    const missClick = () => {
        setContextMenuStatus({ isOpen: false });
    }

    return (
        <CSSTransition
            in={!todoListFullView}
            timeout={compatibilityIE ? 0 : { appear: 0, enter: 200, exit: 200 }}
            classNames={animationClasses}
            appear
        >
            <div className={cl(todolist.todolist, { [todolist.todolistFullView]: todoListFullView })}>
                <Header generatedEventsCount={generatedEventsCount} plansCount={plansCount} meetingsCount={meetingsCount} />
                <div ref={wrapperRef} className={todolist.body} onContextMenu={contextMenuHandler} onClick={missClick}>
                    {commonViewType === "calendar" &&
                        [...generatedEventsCount, ...meetingsCount].sort(sortEventsByTypeAndDate).map(item =>
                            <Event key={getISN_EVENT(item)}
                                item={item}
                                selected={getISN_EVENT(currentEvent) === getISN_EVENT(item)}
                                openPopUpWrapper={openPopUpWrapper}
                            />)
                    }
                    {commonViewType === "plan" &&
                        [...plansCount, ...meetingsCount].sort(sortEventsByTypeAndDate).map(item =>
                            <Event key={getISN_EVENT(item)}
                                item={item}
                                selected={getISN_EVENT(currentEvent) === getISN_EVENT(item)}
                                openPopUpWrapper={openPopUpWrapper}
                            />)
                    }
                    <ContextMenu
                        openPopUpWrapper={openPopUpWrapper}
                        contextMenuStatus={contextMenuStatus}
                        setContextMenuStatus={setContextMenuStatus}
                        wrapperRef={wrapperRef}
                    />
                </div>
            </div>
        </CSSTransition >
    );
}

function filter<T>(item: T, EVENT_DATE: keyof T, EVENT_DATE_TO: keyof T, date: Date, todoListViewType: TodoListViewType) {
    const itemDate = new Date(item[EVENT_DATE] as any || 0);
    const itemDateTo = new Date(item[EVENT_DATE_TO] as any || 0);
    if (todoListViewType === 'all') return isBefore(itemDate, date) || isSameDay(itemDate, date) || isSameDay(itemDateTo, date);
    if (todoListViewType === 'onDate') return isSameDay(itemDate, date) || isSameDay(itemDateTo, date)
    return false;
}
