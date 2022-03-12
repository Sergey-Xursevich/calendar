import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { State } from '../../store';
import { loadCalendarCl, loadGeneratedEvents, loadNotes, loadPlans, loadMeetings, setDays } from "../../store/calendar/actions";
import { loadPageContext/*,  loadDocs */ } from "../../store/common/actions";
import View from "../View";
import Sidebar from "../Sidebar/Sidebar";
import { registerLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";
import DialogPlan from "../DialogPlan";

import "./App.scss";

registerLocale("ru", ru);

export default function App() {
    const dispatch = useCallback(useDispatch(), [])
    const DUE_CURRENT_USER = useSelector((state: State) => state.common.DUE_CURRENT_USER);
    const ISN_CABINET = useSelector((state: State) => state.common.ISN_CABINET);
    const isnLClassifCurrentUser = useSelector((state: State) => state.common.ISN_LCLASSIF_CURRENT_USER);
    const range = useSelector((state: State) => state.calendar.range);
    const generatedEvents = useSelector((state: State) => state.calendar.generatedEvents);
    const reminders = useSelector((state: State) => state.calendar.reminders);
    const plans = useSelector((state: State) => state.calendar.plans);
    const notes = useSelector((state: State) => state.calendar.notes);
    const meetings = useSelector((state: State) => state.calendar.meetings);
    const isLoadingCalendar = useSelector((state: State) => state.calendar.isLoading);
    const isLoadingCommon = useSelector((state: State) => state.common.isLoading);

    useEffect( // load pageContext and CalendarCl
        () => {
            dispatch(loadPageContext());
            dispatch(loadCalendarCl())
        },
        [dispatch]
    );

    useEffect( // load generatedEvents, notes, plans, meetings
        () => {
            if (DUE_CURRENT_USER) {
                dispatch(loadGeneratedEvents())
                dispatch(loadNotes())
                dispatch(loadPlans())
                dispatch(loadMeetings());
            }
        },
        [dispatch, DUE_CURRENT_USER, ISN_CABINET, isnLClassifCurrentUser]
    );

    useEffect( // fill days by events
        () => { dispatch(setDays()); },
        [dispatch, generatedEvents, meetings, plans, notes, range, reminders]
    );

    if (typeof DUE_CURRENT_USER === 'string')
        return (
            <div id="app">
                <Sidebar />
                <View />
                <DialogPlan />
            </div>
        );
    else if (isLoadingCalendar || isLoadingCommon) {
        return <div id="start-loading">Загрузка</div>;
    }
    /* else if (DUE_CURRENT_USER === null)
        return <div id="error-nullDL">Для работы требуется привязка Должностного лица</div> */
    else
        return <div id="start-loading">Загрузка</div>;
}
