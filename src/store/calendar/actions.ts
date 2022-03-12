import { Dispatch } from 'redux';
import {
    CalendarActionTypes,
    iMRGENERATED_EVENT,
    SET_CALENDAR_RANGE_TYPE,
    SET_CALENDAR_NEXT_RANGE,
    SET_CALENDAR_PREV_RANGE,
    RESET_CALENDAR_RANGE,
    SET_SELECTION,
    SET_DAYS_START,
    SET_DAYS_FINISH,
    GET_MEETINGS,
    GET_MEETINGS_SUCCESS,
    GET_MEETINGS_FAIL,
    GET_CALENDAR_CL,
    GET_GENERATED_EVENTS,
    GET_NOTES,
    GET_PLANS,
    GET_CALENDAR_CL_SUCCESS,
    GET_CALENDAR_CL_FAIL,
    GET_GENERATED_EVENTS_SUCCESS,
    GET_GENERATED_EVENTS_FAIL,
    GET_NOTES_SUCCESS,
    GET_NOTES_FAIL,
    GET_PLANS_SUCCESS,
    GET_PLANS_FAIL,
    iREMINDER_ADVANCE
} from './types';
import { iCurrentEvent } from "../../store/calendar/types";
import { Piper, iCALENDAR_CL, iMREVT_ASSOCIATION, iMREVT_EVENT, iMTG_PARTICIPANT, iMTG_MEETING, iREPLY } from '@eos/mrsoft-core';
import { EventsType, StatusTypePlan, ViewRange } from '../../Dictionary/Enums';
import { iDay, iMonth } from '../../Dictionary/Interfaces';
import { getDays, getMonths, getWeeks, getDateRangeHelper } from '../../Utils/CalendarHelper';
import { getDateRange } from "../../Utils/getDateRange";
import { store } from '..';
import { format, isSameDay } from 'date-fns';

export function loadCalendarCl() {
    return async (dispatch: Dispatch<CalendarActionTypes>) => {
        dispatch({
            type: GET_CALENDAR_CL,
            isLoading: true,
        })
        try {
            const calendarCL = await Piper.load<iCALENDAR_CL[]>("CALENDAR_CL", null)
            dispatch({
                type: GET_CALENDAR_CL_SUCCESS,
                calendarCl: calendarCL,
                isLoading: false
            })
        }
        catch (error) {
            console.error(error)
            dispatch({
                type: GET_CALENDAR_CL_FAIL,
                calendarCl: [],
                isLoading: false,
                error: true
            })
        }
    }
}

export function loadGeneratedEvents() {
    return async (dispatch: Dispatch<CalendarActionTypes>) => {
        dispatch({
            type: GET_GENERATED_EVENTS,
            isLoading: true,
            loadingGeneratedEvents: true,
        })
        try {
            const ISN_CABINET = store.getState().common.ISN_CABINET;
            const DUE_CURRENT_USER = store.getState().common.DUE_CURRENT_USER;

            //const generatedEvents = await Piper.load<iMRGENERATED_EVENT[]>(
            //    'StressTest',
            //    { args: { DUE_DEPARTMENT: ISN_CABINET || DUE_CURRENT_USER } }
            //);
            const generatedEvents = await Piper.load<iMRGENERATED_EVENT[]>(
                'GeneratedEvents',
                { args: { DUE_DEPARTMENT: `${DUE_CURRENT_USER}`, ISN_CABINET: `${ISN_CABINET}` } }
            );
            const allIsnReply = generatedEvents.reduce((acc: number[], item) => {
                if (Array.isArray(item.REMINDERS) && item.REMINDERS.length) {
                    const isnReplyList = item.REMINDERS.map(remind => remind.ISN_REPLY).map(item => item) as number[];
                    acc.push(...isnReplyList);
                }
                return acc;
            }, []);

            if (allIsnReply.length) {
                await Piper.load<iREPLY>('REPLY', { criteries: { ISN_REPLY: allIsnReply.join("|") } }, { saveToStore: true });
            }

            const reminders = generatedEvents.reduce((acc: iREMINDER_ADVANCE[], item) => {
                if (item.REMINDERS && item.REMINDERS.length)
                    return acc.concat(item.REMINDERS.map(remind => {
                        return ({
                            ...remind,
                            EVENT_DATE: item.EVENT_DATE,
                            EVENT_TYPE: item.EVENT_TYPE,
                            ISN_EVENT: item.ISN_EVENT,
                            TITLE: item.TITLE,
                            DUE_DEPARTMENT: item.DUE_DEPARTMENT,
                            BODY: remind.REMINDER_TEXT || "",
                            ISN_OBJECT_ATTACHED: item.ISN_OBJECT_ATTACHED,
                            _type: "MREVT_REMINDER",
                        });
                    }));
                return acc;
            }, []);
            dispatch({
                type: GET_GENERATED_EVENTS_SUCCESS,
                generatedEvents: generatedEvents,
                reminders: reminders,
                loadingGeneratedEvents: false,
                isLoading: false,
            })
        }
        catch (error) {
            console.error(error)
            dispatch({
                type: GET_GENERATED_EVENTS_FAIL,
                generatedEvents: [],
                reminders: [],
                loadingGeneratedEvents: false,
                isLoading: false,
                error: true,
            })
        }
    }
}

export function loadNotes() {
    return async (dispatch: Dispatch<CalendarActionTypes>) => {
        dispatch({
            type: GET_NOTES,
            isLoading: true,
            loadingNotes: true,
        })
        try {
            const isnLClassifCurrentUser = store.getState().common.ISN_LCLASSIF_CURRENT_USER;
            const DUE_CURRENT_USER = store.getState().common.DUE_CURRENT_USER;
            const [notes, mrevt_association] = await Promise.all([
                isnLClassifCurrentUser ? Piper.load<iMREVT_EVENT[]>(
                    "MREVT_EVENT",
                    { criteries: { INS_WHO: isnLClassifCurrentUser, EVENT_TYPE: EventsType.NOTE } },
                    { expand: 'MREVT_ASSOCIATION_List,MREVT_REF_List', saveToStore: true }
                ) : [],
                Piper.load<iMREVT_ASSOCIATION[]>(
                    "MREVT_ASSOCIATION",
                    { criteries: { DUE_DEPARTMENT: DUE_CURRENT_USER } }
                ).then((item: iMREVT_ASSOCIATION[]) => item.map(x => x.ISN_EVENT as number))
            ]);
            const notesLikeDL: iMREVT_EVENT[] = mrevt_association.length ? await Piper.load<iMREVT_EVENT[]>(
                "MREVT_EVENT",
                { criteries: { ISN_EVENT: mrevt_association.join("|"), EVENT_TYPE: EventsType.NOTE } },
                { expand: 'MREVT_ASSOCIATION_List,MREVT_REF_List', saveToStore: true }
            ) : [];
            const allNotes: iMREVT_EVENT[] = [];
            [...notes, ...notesLikeDL]
                .sort((a, b) => a.ISN_EVENT! < b.ISN_EVENT! ? -1 : 1)
                .forEach(value => {
                    if (!allNotes.length || allNotes[allNotes.length - 1].ISN_EVENT !== value.ISN_EVENT) {
                        allNotes.push(value);
                    }
                });
            dispatch({
                type: GET_NOTES_SUCCESS,
                notes: allNotes,
                isLoading: false,
                loadingNotes: false,
            })
        }
        catch (error) {
            console.error(error)
            dispatch({
                type: GET_NOTES_FAIL,
                notes: [],
                isLoading: false,
                error: true,
                loadingNotes: false,
            })
        }
    }
}

export function loadPlans() {
    return async (dispatch: Dispatch<CalendarActionTypes>) => {
        dispatch({
            type: GET_PLANS,
            isLoading: true,
            loadingPlans: true,
        })
        try {
            const {
                responsible, createdByMe, divisionPlan, organizationPlan, showCanceled,
                DLPlan, DLPlanDUES, DLPlanDateStartFrom, DLPlanDateStartTo, DLPlanDateFinishFrom, DLPlanDateFinishTo
            } = store.getState().settings;
            const dateStartFromString = DLPlanDateStartFrom ? format(DLPlanDateStartFrom, 'dd.MM.yyyy') : null;
            const dateStartToString = DLPlanDateStartTo ? format(DLPlanDateStartTo, 'dd.MM.yyyy') : null;
            const dateFinishFromString = DLPlanDateFinishFrom ? format(DLPlanDateFinishFrom, 'dd.MM.yyyy') : null;
            const dateFinishToString = DLPlanDateFinishTo ? format(DLPlanDateFinishTo, 'dd.MM.yyyy') : null;
            const filterByDivisionPlan = divisionPlan;
            const filterByOrganizationPlan = organizationPlan;
            const filterByShowCanceled = (item: iMREVT_EVENT) => {
                if (showCanceled) return true;
                else return item.STATUS !== StatusTypePlan.CANCELLED
            };

            const isnLClassifCurrentUser = store.getState().common.ISN_LCLASSIF_CURRENT_USER;
            const dues = store.getState().common.DUE_CURRENT_USER?.split('.')
                .filter(item => item !== '')
                .reduce((acc, cur, curIndex) => {
                    acc.push((acc[curIndex - 1] || '') + cur + '.')
                    return acc;
                }, [] as string[]);
            dues?.pop() //удаляем самого ДЛ
            const [plans, plansResponsible, plansDLResponsibles, mrevt_association_common, mrevt_association_no_common] = await Promise.all([
                //Если к текущему департменту не прикреплен пользователь не делаем запрос на создателя
                (isnLClassifCurrentUser && createdByMe) ? Piper.load<iMREVT_EVENT[]>(
                    "MREVT_EVENT",
                    {
                        criteries: {
                            INS_WHO: isnLClassifCurrentUser || undefined,
                            EVENT_TYPE: [EventsType.EVENT, EventsType.EXPERTISE, EventsType.SESSION, EventsType.MEETING, EventsType.PRIVATE],
                            STATUS: [StatusTypePlan.PLAN, StatusTypePlan.DONE, StatusTypePlan.CANCELLED]
                        }
                    },
                    { expand: 'MREVT_ASSOCIATION_List,MREVT_REF_List', saveToStore: true }
                ) : [],
                // Запрос за что ответственен текущий пользователь
                responsible ? Piper.load<iMREVT_EVENT[]>(
                    'MREVT_EVENT',
                    {
                        criteries: {
                            DUE_DEPARTMENT: store.getState().common.DUE_CURRENT_USER,
                            EVENT_TYPE: [EventsType.EVENT, EventsType.EXPERTISE, EventsType.SESSION, EventsType.MEETING, EventsType.PRIVATE],
                            STATUS: [StatusTypePlan.PLAN, StatusTypePlan.DONE, StatusTypePlan.CANCELLED]
                        }
                    },
                    { expand: 'MREVT_ASSOCIATION_List,MREVT_REF_List', saveToStore: true }
                ) : [],
                // Запрос плана должностных лиц, за что они ответственны
                (DLPlan && DLPlanDUES.length > 0) ? Piper.load<iMREVT_EVENT[]>(
                    'MREVT_EVENT',
                    {
                        criteries: {
                            DUE_DEPARTMENT: DLPlanDUES.join('|'),
                            EVENT_DATE: (dateStartFromString || dateStartToString) ? `${dateStartFromString}:${dateStartToString}` : undefined,
                            EVENT_DATE_TO: (dateFinishFromString || dateFinishToString) ? `${dateFinishFromString}:${dateFinishToString}` : undefined,
                            EVENT_TYPE: [EventsType.EVENT, EventsType.EXPERTISE, EventsType.SESSION, EventsType.MEETING, EventsType.PRIVATE],
                            STATUS: [StatusTypePlan.PLAN, StatusTypePlan.DONE, StatusTypePlan.CANCELLED]
                        }
                    },
                    { expand: 'MREVT_ASSOCIATION_List,MREVT_REF_List', saveToStore: true }
                ) : [],
                // Департаменты для запроса планов общих (с вложенными подразделениями)
                filterByOrganizationPlan ? Piper.load<iMREVT_ASSOCIATION[]>(
                    "MREVT_ASSOCIATION",
                    {
                        criteries: {
                            DUE_DEPARTMENT: dues?.join('|')
                        }
                    }
                ).then((item: iMREVT_ASSOCIATION[]) => item.map(x => x.ISN_EVENT as number)) : [],
                // Департаменты для запроса планов не общих (без вложенных подразделений)
                filterByDivisionPlan ? Piper.load<iMREVT_ASSOCIATION[]>(
                    "MREVT_ASSOCIATION",
                    {
                        criteries: {
                            DUE_DEPARTMENT: dues?.[dues?.length! - 1]
                        }
                    }
                ).then((item: iMREVT_ASSOCIATION[]) => item.map(x => x.ISN_EVENT as number)) : [],
            ])
            const [plansLikeDLCommon, plansLikeDLNoCommon] = await Promise.all([
                // Запрос планов общих
                mrevt_association_common.length > 0 ? Piper.load<iMREVT_EVENT[]>(
                    "MREVT_EVENT",
                    {
                        criteries: {
                            ISN_EVENT: mrevt_association_common.join("|"),
                            IS_PERSONAL: 0,
                            IS_COMMON: 1,
                            EVENT_TYPE: [EventsType.EVENT, EventsType.MEETING, EventsType.SESSION, EventsType.EXPERTISE, EventsType.PRIVATE],
                            STATUS: [StatusTypePlan.PLAN, StatusTypePlan.DONE, StatusTypePlan.CANCELLED]
                        }
                    },
                    { expand: 'MREVT_ASSOCIATION_List,MREVT_REF_List', saveToStore: true }
                ) : [],
                // Запрос планов не общих
                mrevt_association_no_common.length > 0 ? Piper.load<iMREVT_EVENT[]>(
                    "MREVT_EVENT",
                    {
                        criteries: {
                            ISN_EVENT: mrevt_association_no_common.join("|"),
                            IS_PERSONAL: 0,
                            IS_COMMON: 0,
                            EVENT_TYPE: [EventsType.EVENT, EventsType.MEETING, EventsType.SESSION, EventsType.EXPERTISE, EventsType.PRIVATE],
                            STATUS: [StatusTypePlan.PLAN, StatusTypePlan.DONE, StatusTypePlan.CANCELLED]
                        }
                    },
                    { expand: 'MREVT_ASSOCIATION_List,MREVT_REF_List', saveToStore: true }
                ) : []
            ])

            const allPlans: iMREVT_EVENT[] = [];
            [...plans, ...plansResponsible, ...plansDLResponsibles, ...plansLikeDLCommon, ...plansLikeDLNoCommon] // изза 4ех запросов могут дубилроваться ивенты
                .sort((a, b) => a.ISN_EVENT! < b.ISN_EVENT! ? -1 : 1) // поэтому сначала соритруем по ISN_EVENT
                .forEach(value => {
                    if (!allPlans.length || allPlans[allPlans.length - 1].ISN_EVENT !== value.ISN_EVENT) {
                        allPlans.push(value); // и пушим в массив уникальных только те которые имеют уникальный ISN_EVENT (срнавния текущий с предыдущим, т.к. отсортировано)
                    }
                });

            dispatch({
                type: GET_PLANS_SUCCESS,
                plans: allPlans.filter(filterByShowCanceled),
                isLoading: false,
                loadingPlans: false,
            })
        }
        catch (error) {
            console.error(error)
            dispatch({
                type: GET_PLANS_FAIL,
                plans: [],
                isLoading: false,
                error: true,
                loadingPlans: false,
            })
        }
    }
}

export function loadMeetings() {
    return async (dispatch: Dispatch<CalendarActionTypes>) => {
        dispatch({
            type: GET_MEETINGS,
            isLoading: true,
            loadingMeetings: true,
        })
        try {
            const DUE_CURRENT_USER = store.getState().common.DUE_CURRENT_USER;
            const participate = store.getState().settings.participate;
            const responsible = store.getState().settings.responsible;

            const { DLPlan, DLPlanDUES, DLPlanDateStartFrom, DLPlanDateStartTo, DLPlanDateFinishFrom, DLPlanDateFinishTo } = store.getState().settings;
            const dateStartFromString = DLPlanDateStartFrom ? format(DLPlanDateStartFrom, 'dd.MM.yyyy') : null;
            const dateStartToString = DLPlanDateStartTo ? format(DLPlanDateStartTo, 'dd.MM.yyyy') : null;
            const dateFinishFromString = DLPlanDateFinishFrom ? format(DLPlanDateFinishFrom, 'dd.MM.yyyy') : null;
            const dateFinishToString = DLPlanDateFinishTo ? format(DLPlanDateFinishTo, 'dd.MM.yyyy') : null;

            const ROLE_TYPES = [];
            if (responsible) ROLE_TYPES.push(1);
            if (participate) ROLE_TYPES.push(0, 2);

            const [mtgParticipant, mtgParticipantDlPlan] = await Promise.all([
                ROLE_TYPES.length ? Piper.load<iMTG_PARTICIPANT[]>(
                    "MTG_PARTICIPANT",
                    {
                        criteries: {
                            DUE_DL: DUE_CURRENT_USER,
                            ROLE_TYPE: ROLE_TYPES
                        }
                    }
                ).then((res) => res.map(item => item.ISN_MTG_MEETING!)) : [],
                (DLPlan && DLPlanDUES.length > 0) ? Piper.load<iMTG_PARTICIPANT[]>(
                    "MTG_PARTICIPANT", { criteries: { DUE_DL: DLPlanDUES.join('|'), } }
                ).then((res) => res.map(item => item.ISN_MTG_MEETING!)) : []
            ]);
            const [mtgMeetings, mtgMeetingsDlPlan] = await Promise.all([
                mtgParticipant.length > 0 ? await Piper.load<iMTG_MEETING[]>(
                    "MTG_MEETING",
                    {
                        criteries: {
                            ISN_MTG_MEETING: mtgParticipant.join('|'),
                        }
                    },
                    {
                        expectArray: true,
                        expand: 'MTG_PARTICIPANT_List'
                    }
                ) : [],
                mtgParticipantDlPlan.length > 0 ? await Piper.load<iMTG_MEETING[]>(
                    "MTG_MEETING",
                    {
                        criteries: {
                            ISN_MTG_MEETING: mtgParticipantDlPlan.join('|'),
                            MEETING_DATE: (dateStartFromString || dateStartToString) ? `${dateStartFromString}:${dateStartToString}` : undefined,
                            REVIEW_END_DATE: (dateFinishFromString || dateFinishToString) ? `${dateFinishFromString}:${dateFinishToString}` : undefined,
                        }
                    },
                    {
                        expectArray: true,
                        expand: 'MTG_PARTICIPANT_List'
                    }
                ) : [],
            ]);
            const allMeetings: iMTG_MEETING[] = [];
            [...mtgMeetings, ...mtgMeetingsDlPlan] // изза 4ех запросов могут дубилроваться ивенты
                .sort((a, b) => a.ISN_MTG_MEETING! < b.ISN_MTG_MEETING! ? -1 : 1) // поэтому сначала соритруем по ISN_EVENT
                .forEach(value => {
                    if (!allMeetings.length || allMeetings[allMeetings.length - 1].ISN_MTG_MEETING !== value.ISN_MTG_MEETING) {
                        allMeetings.push(value); // и пушим в массив уникальных только те которые имеют уникальный ISN_EVENT (срнавния текущий с предыдущим, т.к. отсортировано)
                    }
                });

            dispatch({
                type: GET_MEETINGS_SUCCESS,
                meetings: allMeetings,
                isLoading: false,
                isMTG: true,
                loadingMeetings: false,
            })
        }
        catch (error) {
            console.error(error)
            dispatch({
                type: GET_MEETINGS_FAIL,
                isLoading: false,
                isMTG: false,
                meetings: [],
                loadingMeetings: false,
            })
        }
    }
}

export function setDays() {
    return async (dispatch: Dispatch<CalendarActionTypes>) => {
        try {
            const range = store.getState().calendar.range;
            const generatedEvents = store.getState().calendar.generatedEvents;
            const plans = store.getState().calendar.plans;
            const notes = store.getState().calendar.notes;
            const meetings = store.getState().calendar.meetings;
            const reminders = store.getState().calendar.reminders;
            const rangeType = store.getState().calendar.rangeType;
            const selection = store.getState().calendar.selection;
            const calendarCl = store.getState().calendar.calendarCl;
            dispatch({
                type: SET_DAYS_START,
                isLoading: true,
            });
            const computation = new Promise(
                (resolve: ({ days, months, newSelection }: { days: iDay[], months: iMonth[], newSelection?: iDay }) => void, reject) => {
                    setTimeout(() => {
                        const days = getDays(range, { calendarCl, generatedEvents, plans, notes, meetings, reminders }, selection);
                        const months = getMonths(days);
                        //TODO: Selection надо выносить в отдельную работу
                        const dayIndex = days.findIndex((item) => isSameDay(new Date(), item.date))
                        const viewRange = rangeType;
                        let newSelection = days.find(item => item.isSelected) || selection;
                        if (viewRange === ViewRange.Day) newSelection = days[0];
                        if (!newSelection && dayIndex >= 0) {
                            newSelection = days[dayIndex]
                            days[dayIndex].isSelected = true;
                        }
                        resolve({ days, months, newSelection })
                    }, 0)
                })
            const { days, months, newSelection } = await computation;
            dispatch({
                type: SET_DAYS_FINISH,
                days: days,
                months: months,
                selection: newSelection,
                isLoading: false
            })
        }
        catch (error) {
            console.error('COMPUTATION FAILED', error)
        }
    }
}

export function setRangeType(viewRange: ViewRange, selection?: iDay, calendarCl?: iCALENDAR_CL[]) {
    return (dispatch: Dispatch<CalendarActionTypes>) => {
        localStorage.setItem("MREvent_ViewRange", viewRange.toString()); //При следующей загрузки начнем с этого вида
        const dateRangeHelper = getDateRangeHelper(viewRange, selection)
        const dateRange = getDateRange(dateRangeHelper, viewRange);
        const days = getDays(dateRange);
        const months = viewRange === ViewRange.Year ? getMonths(days) : [];
        const weeks = getWeeks(days);
        dispatch({
            type: SET_CALENDAR_RANGE_TYPE,
            rangeType: viewRange,
            range: dateRange,
            days: days,
            months: months,
            weeks: weeks
        })
    }
}

export function setCustomDateRange(dateRangeHelper: Date, viewType: ViewRange) {
    let dateRange = getDateRange(dateRangeHelper, viewType, 'custom');
    return (dispatch: Dispatch<CalendarActionTypes>) => {
        dispatch({
            type: SET_CALENDAR_PREV_RANGE,
            range: dateRange,
        });
    }
}

export function setPrevDateRange(dateRangeHelper: Date, viewType: ViewRange) {
    let dateRange = getDateRange(dateRangeHelper, viewType, 'prev');
    return (dispatch: Dispatch<CalendarActionTypes>) => {
        dispatch({
            type: SET_CALENDAR_PREV_RANGE,
            range: dateRange,
        });
    }
}

export function setNextDateRange(dateRangeHelper: Date, viewType: ViewRange) {
    let dateRange = getDateRange(dateRangeHelper, viewType, 'next');
    return (dispatch: Dispatch<CalendarActionTypes>) => {
        dispatch({
            type: SET_CALENDAR_NEXT_RANGE,
            range: dateRange
        });
    }

}

export function resetDateRange(dateRangeHelper: Date, viewType: ViewRange) {
    let dateRange = getDateRange(dateRangeHelper, viewType, 'reset');
    return (dispatch: Dispatch<CalendarActionTypes>) => {
        dispatch({
            type: RESET_CALENDAR_RANGE,
            range: dateRange,
            selection: undefined
        });
    }
}

//TODO function setSelection(selectedDate: Date) and function setCurrentEvent(currentEvent: iCurrentEvent) 
export function setSelection({ days, selection, event }: { days?: iDay[], selection?: iDay, event?: iCurrentEvent }) {
    return (dispatch: Dispatch<CalendarActionTypes>) => {
        const newDays = days?.map(item => {
            item.isSelected = item.date.getTime() === selection?.date.getTime() ? true : false;
            return item;
        });
        dispatch({
            type: SET_SELECTION,
            selection: selection,
            days: newDays,
            currentEvent: event
        })
    }
}
