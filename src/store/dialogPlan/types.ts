import { iMREVT_ASSOCIATION, iMREVT_EVENT, iMREVT_REF } from "@eos/mrsoft-core";
import { EventsType, StatusTypePlan } from "../../Dictionary/Enums";

export const SET_SHOW = 'SET_SHOW';
export const SET_EDIT = 'SET_EDIT';
export const SET_PLAN = 'SET_PLAN';
export const SET_DONE = 'SET_DONE';
export const SET_CANCELLED = 'SET_CANCELLED';
export const RESET_PLAN = 'RESET_PLAN';
export const SET_ISN_EVENT = 'SET_ISN_EVENT';
export const SET_EVENT_TYPE = 'SET_EVENT_TYPE';
export const SET_EVENT_DATE = 'SET_EVENT_DATE';
export const SET_EVENT_DATE_TO = 'SET_EVENT_DATE_TO';
export const SET_EVENT_DATE_FACT = 'SET_EVENT_DATE_FACT';
export const SET_EVENT_DATE_TO_FACT = 'SET_EVENT_DATE_TO_FACT';
export const SET_TITLE = 'SET_TITLE';
export const SET_PLACE = 'SET_PLACE';
export const SET_DUE_DEPARTMENT = 'SET_DUE_DEPARTMENT';
export const SET_REASON = 'SET_REASON';
export const SET_IS_COMMON = 'SET_IS_COMMON';
export const SET_IS_PERSONAL = 'SET_IS_PERSONAL';
export const SET_STATUS = 'SET_STATUS';
export const SET_BODY = 'SET_BODY';
export const SET_RESULTS = 'SET_RESULTS';
export const SET_MREVT_ASSOCIATION = 'SET_MREVT_ASSOCIATION';
export const SET_MREVT_REF_REASON = 'SET_MREVT_REF_REASON';
export const SET_MREVT_REF_RESULTS = 'SET_MREVT_REF_RESULTS';

export interface IDialogPlanState {
    plan?: iMREVT_EVENT;
    show: boolean;
    edit: boolean;
    dialogDone: boolean;
    dialogCancelled: boolean;
    INS_DATE?: Date | null;
    ISN_EVENT: number;
    EVENT_TYPE: EventsType;
    EVENT_DATE: Date | null;
    EVENT_DATE_TO: Date | null;
    EVENT_DATE_FACT: Date | null;
    EVENT_DATE_TO_FACT: Date | null;
    TITLE: string;
    PLACE: string;
    DUE_DEPARTMENT: string | null;
    REASON: string;
    IS_COMMON: number;
    IS_PERSONAL: number;
    STATUS: StatusTypePlan;
    BODY: string;
    RESULTS: string;
    MREVT_ASSOCIATION: iMREVT_ASSOCIATION[];
    MREVT_REF_REASON: iMREVT_REF[]; //Идут в одну таблицу iMREVT_REF но REF_KIND === DOC_RC || PRJ_RC
    MREVT_REF_RESULTS: iMREVT_REF[]; //Идут в одну таблицу iMREVT_REF но REF_KIND === DOC_RESULT || PRJ_RESULT
}

interface setShow {
    type: typeof SET_SHOW;
    show: boolean;
}

interface setEdit {
    type: typeof SET_EDIT;
    edit: boolean;
}

interface setDone {
    type: typeof SET_DONE;
    dialogDone: boolean;
}

interface setCancelled {
    type: typeof SET_CANCELLED;
    dialogCancelled: boolean;
}

interface resetPlan {
    type: typeof RESET_PLAN;
    plan: undefined;
    ISN_EVENT: number;
    INS_DATE: Date | null;
    EVENT_TYPE: EventsType;
    EVENT_DATE: Date | null;
    EVENT_DATE_TO: Date | null;
    EVENT_DATE_FACT: Date | null;
    EVENT_DATE_TO_FACT: Date | null;
    TITLE: string;
    PLACE: string;
    DUE_DEPARTMENT: string | null;
    REASON: string;
    IS_COMMON: number;
    IS_PERSONAL: number;
    STATUS: StatusTypePlan;
    BODY: string;
    RESULTS: string;
    MREVT_ASSOCIATION: iMREVT_ASSOCIATION[];
    MREVT_REF_REASON: iMREVT_REF[];
    MREVT_REF_RESULTS: iMREVT_REF[];
}

interface setPlan {
    type: typeof SET_PLAN;
    plan: iMREVT_EVENT;
    INS_DATE?: Date | null;
    ISN_EVENT: number;
    EVENT_TYPE: EventsType;
    EVENT_DATE: Date | null;
    EVENT_DATE_TO?: Date | null;
    EVENT_DATE_FACT?: Date | null;
    EVENT_DATE_TO_FACT?: Date | null;
    TITLE: string;
    PLACE?: string;
    DUE_DEPARTMENT: string | null;
    REASON?: string;
    IS_COMMON: number;
    IS_PERSONAL: number;
    STATUS: StatusTypePlan;
    BODY: string;
    RESULTS?: string;
    MREVT_ASSOCIATION: iMREVT_ASSOCIATION[];
    MREVT_REF_REASON: iMREVT_REF[];
    MREVT_REF_RESULTS: iMREVT_REF[];
}

interface setIsnEvent {
    type: typeof SET_ISN_EVENT;
    ISN_EVENT: number;
}

interface setEventType {
    type: typeof SET_EVENT_TYPE;
    EVENT_TYPE: EventsType;
}

interface setEventDate {
    type: typeof SET_EVENT_DATE;
    EVENT_DATE: Date | null;
}

interface setEventDateTo {
    type: typeof SET_EVENT_DATE_TO;
    EVENT_DATE_TO: Date | null;
}

interface setEventDateFact {
    type: typeof SET_EVENT_DATE_FACT;
    EVENT_DATE_FACT: Date | null;
}

interface setEventDateToFact {
    type: typeof SET_EVENT_DATE_TO_FACT;
    EVENT_DATE_TO_FACT: Date | null;
}

interface setTitle {
    type: typeof SET_TITLE;
    TITLE: string;
}

interface setPlace {
    type: typeof SET_PLACE;
    PLACE: string;
}

interface setDueDepartment {
    type: typeof SET_DUE_DEPARTMENT;
    DUE_DEPARTMENT: string | null;
}

interface setReason {
    type: typeof SET_REASON;
    REASON: string;
}

interface setIsCommon {
    type: typeof SET_IS_COMMON;
    IS_COMMON: 0 | 1;
}

interface setIsPersonal {
    type: typeof SET_IS_PERSONAL;
    IS_PERSONAL: 0 | 1;
}

interface setStatus {
    type: typeof SET_STATUS;
    STATUS: StatusTypePlan;
}

interface setBody {
    type: typeof SET_BODY;
    BODY: string;
}

interface setResults {
    type: typeof SET_RESULTS;
    RESULTS: string;
}

interface setMrEvtAssociation {
    type: typeof SET_MREVT_ASSOCIATION;
    MREVT_ASSOCIATION: iMREVT_ASSOCIATION[];
}

interface setMrEvtRefReason {
    type: typeof SET_MREVT_REF_REASON;
    MREVT_REF_REASON: iMREVT_REF[];
}

interface setMrEvtRefCancel {
    type: typeof SET_MREVT_REF_RESULTS;
    MREVT_REF_RESULTS: iMREVT_REF[];
}

export type DialogPlanActionTypes =
    | setShow
    | setPlan
    | setEdit
    | setIsnEvent
    | setEventType
    | setEventDate
    | setEventDateTo
    | setEventDateFact
    | setEventDateToFact
    | setTitle
    | setPlace
    | setDueDepartment
    | setReason
    | setIsCommon
    | setIsPersonal
    | setStatus
    | setBody
    | setResults
    | setMrEvtAssociation
    | setMrEvtRefReason
    | setMrEvtRefCancel
    | resetPlan
    | setCancelled
    | setDone;