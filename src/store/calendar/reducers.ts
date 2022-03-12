import {
    CalendarState,
    CalendarActionTypes,
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
    GET_PLANS,
    GET_PLANS_SUCCESS,
    GET_PLANS_FAIL,
    GET_CALENDAR_CL,
    GET_CALENDAR_CL_SUCCESS,
    GET_CALENDAR_CL_FAIL,
    GET_NOTES,
    GET_NOTES_SUCCESS,
    GET_NOTES_FAIL,
    GET_GENERATED_EVENTS,
    GET_GENERATED_EVENTS_SUCCESS,
    GET_GENERATED_EVENTS_FAIL,
    SET_CALENDAR_CUSTOM_RANGE
} from './types';
import { getDateRange } from "../../Utils/getDateRange";
import { getDays, getMonths } from '../../Utils/CalendarHelper';
import { ViewRange } from '../../Dictionary/Enums';
import { isSameDay } from 'date-fns';

const viewRange = getViewRange()
const dateRange = getDateRange(new Date(), viewRange);
const days = getDays(dateRange)
const months = getMonths(days);

export const initStateCalendarReducer: CalendarState = {
    rangeType: viewRange,
    range: dateRange,
    days: days,
    months: months,
    generatedEvents: [],
    loadingGeneratedEvents: false,
    notes: [],
    loadingNotes: false,
    plans: [],
    loadingPlans: false,
    meetings: [],
    reminders: [],
    loadingMeetings: false,
    calendarCl: [],
    selection: days.find(item => isSameDay(item.date, new Date())) || { date: new Date(), generatedEvents: [], notes: [], plans: [], meetings: [], reminders: [], isSelected: true },
    isLoading: false,
    error: false,
    isMTG: false,
};

export function calendarReducer(state = initStateCalendarReducer, action: CalendarActionTypes) {
    switch (action.type) {
        /* case GET_DATA: {
            return { ...state, ...action };
        }

        case GET_DATA_SUCCESS: {
            return { ...state, ...action };
        }

        case GET_DATA_FAIL: {
            return { ...state, ...action };
        }
 */
        case GET_PLANS: {
            return { ...state, ...action };
        }

        case GET_PLANS_SUCCESS: {
            return { ...state, ...action };
        }

        case GET_PLANS_FAIL: {
            return { ...state, ...action };
        }

        case GET_CALENDAR_CL: {
            return { ...state, ...action };
        }

        case GET_CALENDAR_CL_SUCCESS: {
            return { ...state, ...action };
        }

        case GET_CALENDAR_CL_FAIL: {
            return { ...state, ...action };
        }

        case GET_NOTES: {
            return { ...state, ...action };
        }

        case GET_NOTES_SUCCESS: {
            return { ...state, ...action };
        }

        case GET_NOTES_FAIL: {
            return { ...state, ...action };
        }

        case GET_GENERATED_EVENTS: {
            return { ...state, ...action };
        }

        case GET_GENERATED_EVENTS_SUCCESS: {
            return { ...state, ...action };
        }

        case GET_GENERATED_EVENTS_FAIL: {
            return { ...state, ...action };
        }

        case GET_MEETINGS: {
            return { ...state, ...action };
        }

        case GET_MEETINGS_SUCCESS: {
            return { ...state, ...action };
        }

        case GET_MEETINGS_FAIL: {
            return { ...state, ...action };
        }

        case SET_SELECTION: {
            const selection = action.selection || state.selection;
            const days = action.days || state.days;
            const currentEvent = action.currentEvent;
            return { ...state, selection, days, currentEvent };
        }

        case SET_DAYS_START: {
            return {
                ...state,
                type: action.type,
                isLoading: action.isLoading
            }
        }

        case SET_DAYS_FINISH: {
            return {
                ...state,
                type: action.type,
                days: action.days,
                months: action.months,
                selection: action.selection,
                isLoading: action.isLoading
            }
        }

        case SET_CALENDAR_CUSTOM_RANGE: {
            return { ...state, ...action };
        }

        case SET_CALENDAR_NEXT_RANGE: {
            return { ...state, ...action };
        }

        case SET_CALENDAR_PREV_RANGE: {
            return { ...state, ...action };
        }

        case RESET_CALENDAR_RANGE: {
            return { ...state, ...action };
        }

        case SET_CALENDAR_RANGE_TYPE: {
            return { ...state, ...action };
        }

        default:
            return state;
    }
}

function getViewRange(): ViewRange {
    const viewRange = localStorage.getItem("MREvent_ViewRange");
    if (viewRange === ViewRange.Day || viewRange === ViewRange.Week || viewRange === ViewRange.Month || viewRange === ViewRange.Year)
        return viewRange
    else return "Month" as ViewRange;
}