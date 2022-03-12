import { iDay, iMonth, iDateRange } from "../../Dictionary/Interfaces";
import { ViewRange } from "../../Dictionary/Enums";
import { iCALENDAR_CL, iMTG_MEETING, iEnt, iMREVT_EVENT, iREMINDER } from "@eos/mrsoft-core";

export const GET_CALENDAR_CL = 'GET_CALENDAR_CL';
export const GET_CALENDAR_CL_SUCCESS = 'GET_CALENDAR_CL_SUCCESS';
export const GET_CALENDAR_CL_FAIL = 'GET_CALENDAR_CL_FAIL';

export const GET_GENERATED_EVENTS = 'GET_GENERATED_EVENTS';
export const GET_GENERATED_EVENTS_SUCCESS = 'GET_GENERATED_EVENTS_SUCCESS';
export const GET_GENERATED_EVENTS_FAIL = 'GET_GENERATED_EVENTS_FAIL';

export const GET_NOTES = 'GET_NOTES';
export const GET_NOTES_SUCCESS = 'GET_NOTES_SUCCESS';
export const GET_NOTES_FAIL = 'GET_NOTES_FAIL';

export const GET_PLANS = 'GET_PLANS';
export const GET_PLANS_SUCCESS = 'GET_PLANS_SUCCESS';
export const GET_PLANS_FAIL = 'GET_PLANS_FAIL';

export const GET_MEETINGS = 'GET_MEETINGS';
export const GET_MEETINGS_SUCCESS = 'GET_MEETINGS_SUCCESS';
export const GET_MEETINGS_FAIL = 'GET_MEETINGS_FAIL';

export const SET_CALENDAR_RANGE_TYPE = 'SET_CALENDAR_RANGE_TYPE';
export const SET_CALENDAR_CUSTOM_RANGE = 'SET_CALENDAR_CUSTOM_RANGE';
export const SET_CALENDAR_NEXT_RANGE = 'SET_CALENDAR_NEXT_RANGE';
export const SET_CALENDAR_PREV_RANGE = 'SET_CALENDAR_PREV_RANGE';
export const RESET_CALENDAR_RANGE = 'RESET_CALENDAR_RANGE';
export const SET_SELECTION = 'SET_SELECTION';
export const SET_DAYS_START = 'SET_DAYS_START';
export const SET_DAYS_FINISH = 'SET_DAYS_FINISH';

export interface CalendarState {
    rangeType: ViewRange;
    range: iDateRange;
    days: iDay[];
    months: iMonth[];

    selection?: iDay;
    generatedEvents: iMRGENERATED_EVENT[];
    loadingGeneratedEvents: boolean;
    notes: iMREVT_EVENT[];
    loadingNotes: boolean;
    plans: iMREVT_EVENT[];
    loadingPlans: boolean;
    meetings: iMTG_MEETING[];
    loadingMeetings: boolean;
    currentEvent?: iCurrentEvent;
    calendarCl: iCALENDAR_CL[];
    reminders: iREMINDER_ADVANCE[];
    isMTG: boolean;
    isLoading: boolean;
    error: boolean;
}

interface SetRangeType {
    type: typeof SET_CALENDAR_RANGE_TYPE;
    rangeType: ViewRange;
    range: iDateRange;
}

interface SetCustomRange {
    type: typeof SET_CALENDAR_CUSTOM_RANGE;
    range: iDateRange;
}

interface SetNextRange {
    type: typeof SET_CALENDAR_NEXT_RANGE;
    range: iDateRange;
}

interface SetPrevRange {
    type: typeof SET_CALENDAR_PREV_RANGE;
    range: iDateRange;
}

interface ResetRange {
    type: typeof RESET_CALENDAR_RANGE;
    range: iDateRange;
    selection: undefined;
}

interface GetCalendarCl {
    type: typeof GET_CALENDAR_CL;
    isLoading: boolean;
}

interface GetCalendarClSuccess {
    type: typeof GET_CALENDAR_CL_SUCCESS;
    calendarCl: iCALENDAR_CL[];
    isLoading: boolean;
}

interface GetCalendarClFail {
    type: typeof GET_CALENDAR_CL_FAIL;
    calendarCl: iCALENDAR_CL[];
    isLoading: boolean;
    error: boolean;
}

interface GetGeneratedEvents {
    type: typeof GET_GENERATED_EVENTS;
    loadingGeneratedEvents: boolean;
    isLoading: boolean;
}

interface GetGeneratedEventsSuccess {
    type: typeof GET_GENERATED_EVENTS_SUCCESS;
    generatedEvents: iMRGENERATED_EVENT[];
    reminders: iREMINDER_ADVANCE[];
    loadingGeneratedEvents: boolean;
    isLoading: boolean;
}

interface GetGeneratedEventsFail {
    type: typeof GET_GENERATED_EVENTS_FAIL;
    generatedEvents: iMRGENERATED_EVENT[];
    reminders: iREMINDER_ADVANCE[];
    loadingGeneratedEvents: boolean;
    isLoading: boolean;
    error: boolean;
}

interface GetNotes {
    type: typeof GET_NOTES;
    loadingNotes: boolean;
    isLoading: boolean;
}

interface GetNotesSuccess {
    type: typeof GET_NOTES_SUCCESS;
    notes: iMREVT_EVENT[];
    loadingNotes: boolean;
    isLoading: boolean;
}

interface GetNotesFail {
    type: typeof GET_NOTES_FAIL;
    notes: iMREVT_EVENT[];
    isLoading: boolean;
    loadingNotes: boolean;
    error: boolean;
}

interface GetPlans {
    type: typeof GET_PLANS;
    loadingPlans: boolean;
    isLoading: boolean;
}

interface GetPlansSuccess {
    type: typeof GET_PLANS_SUCCESS;
    plans: iMREVT_EVENT[];
    loadingPlans: boolean;
    isLoading: boolean;
}

interface GetPlansFail {
    type: typeof GET_PLANS_FAIL;
    plans: iMREVT_EVENT[];
    loadingPlans: boolean;
    isLoading: boolean;
    error: boolean;
}

interface GetMeetings {
    type: typeof GET_MEETINGS;
    loadingMeetings: boolean;
    isLoading: boolean;
}

interface GetMeetingsSuccess {
    type: typeof GET_MEETINGS_SUCCESS;
    meetings: iMTG_MEETING[];
    loadingMeetings: boolean;
    isLoading: boolean;
    isMTG: boolean;
}

interface GetMeetingsFail {
    type: typeof GET_MEETINGS_FAIL;
    meetings: iMTG_MEETING[];
    loadingMeetings: boolean;
    isLoading: boolean;
    isMTG: boolean;
}

interface SetSelection {
    type: typeof SET_SELECTION;
    selection?: iDay;
    days?: iDay[];
    currentEvent?: iCurrentEvent;
}

interface SetDaysStart {
    type: typeof SET_DAYS_START;
    isLoading: boolean
}

interface SetDaysFinish {
    type: typeof SET_DAYS_FINISH;
    days: iDay[],
    months: iMonth[],
    selection?: iDay,
    isLoading: boolean
}

export type CalendarActionTypes =
    | GetPlans
    | GetPlansSuccess
    | GetPlansFail

    | GetGeneratedEvents
    | GetGeneratedEventsSuccess
    | GetGeneratedEventsFail

    | GetNotes
    | GetNotesSuccess
    | GetNotesFail

    | GetCalendarCl
    | GetCalendarClSuccess
    | GetCalendarClFail

    | GetMeetings
    | GetMeetingsSuccess
    | GetMeetingsFail

    | SetRangeType
    | SetCustomRange
    | SetNextRange
    | SetPrevRange
    | ResetRange

    | SetSelection
    | SetDaysStart
    | SetDaysFinish;

export type iCurrentEvent = iMREVT_EVENT | iMRGENERATED_EVENT | iMTG_MEETING | iREMINDER_ADVANCE;

/* export interface ICalendarEvent extends iEnt {
    //Common fields
    ISN_EVENT: number;
    EVENT_TYPE: number;
    EVENT_DATE: Date;
    DUE_DEPARTMENT?: string;
    EVENT_DATE_TO?: Date;
    TITLE?: string;
 
    //MREVT notes and plan
    BODY?: string;
    MREVT_ASSOCIATION_List?: iMREVT_ASSOCIATION[];
    MREVT_REF_List?: iMREVT_REF[];
    INS_DATE?: Date;
    INS_WHO?: number;
    UPD_DATE?: Date;
    UPD_WHO?: number;
 
    //Generated events fields
    CONTROL_STATE?: number
    DATE_CREATE_DOCUMENT?: Date;
    ISN_PRJ?: number;
    ISN_RC?: number;
    KIND_DOC?: number;
    NAME_DOCUMENT?: string;
    STAGE?: string;
    TOOLTIP_ANNOTATION?: string;
    TOOLTIP_CORRESP?: string;
    TOOLTIP_ORGANIZ?: string;
 
    //MREVT plan
    EVENT_DATE_FACT?: Date;
    EVENT_DATE_TO_FACT?: Date;
    IS_COMMON?: number;
    IS_PERSONAL?: number;
    PLACE?: string;
    REASON?: string;
    STATUS?: number;
    RESULTS?: string;
}
 */
export interface iMRGENERATED_EVENT extends iEnt {
    ISN_EVENT: number;
    DUE_DEPARTMENT: string;
    EVENT_DATE: string;
    EVENT_TYPE: number;
    TITLE: string;
    EVENT_DATE_TO?: string;
    ISN_OBJECT_ATTACHED?: number;

    CONTROL_STATE?: number;
    DATE_CREATE_DOCUMENT?: Date;
    ISN_PRJ?: number;
    ISN_RC?: number;
    KIND_DOC?: number;
    NAME_DOCUMENT?: string;
    STAGE?: string;
    TOOLTIP_ANNOTATION?: string;
    TOOLTIP_CORRESP?: string;
    TOOLTIP_ORGANIZ?: string;
    REMINDERS?: iREMINDER[];

    _type: "MRevtContext";
}

export interface iREMINDER_ADVANCE extends iEnt, iREMINDER {
    EVENT_DATE: string;
    EVENT_TYPE: number;
    ISN_EVENT: number;
    TITLE: string;
    DUE_DEPARTMENT: string;
    BODY: string;
    ISN_OBJECT_ATTACHED?: number;
    _type: "MREVT_REMINDER";
}