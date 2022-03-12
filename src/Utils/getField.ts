import { StatusTypePlan, StatusTypeMeeting, EventsType } from "../Dictionary/Enums";
import { iCurrentEvent } from "../store/calendar/types";

export function getEVENT_TYPE(currentEvent?: iCurrentEvent) {
    switch (currentEvent?._type) {
        case "MRevtContext": return currentEvent.EVENT_TYPE;
        case "MREVT_EVENT": return currentEvent.EVENT_TYPE;
        case "MTG_MEETING": return (currentEvent.MEETING_TYPE || 0) + 100;
    }
}

export function getDUE_DEPARTMENT(currentEvent?: iCurrentEvent) {
    switch (currentEvent?._type) {
        case "MRevtContext": return currentEvent.DUE_DEPARTMENT;
        case "MREVT_EVENT": return currentEvent.DUE_DEPARTMENT;
        case "MTG_MEETING": return currentEvent.DUE_DEP;
    }
}

export function getEVENT_DATE(currentEvent?: iCurrentEvent) {
    switch (currentEvent?._type) {
        case "MRevtContext": return currentEvent.EVENT_DATE;
        case "MREVT_EVENT": return currentEvent.EVENT_DATE;
        case "MTG_MEETING": return currentEvent.MEETING_DATE;
        case "MREVT_REMINDER": return currentEvent.INS_DATE;
        default: return ''
    }
}

export function getEVENT_DATE_TO(currentEvent?: iCurrentEvent) {
    switch (currentEvent?._type) {
        case "MRevtContext": return currentEvent.EVENT_DATE_TO;
        case "MREVT_EVENT": return currentEvent.EVENT_DATE_TO;
        case "MTG_MEETING": return currentEvent.REVIEW_END_DATE;
    }
}

export function getISN_EVENT(currentEvent?: iCurrentEvent) {
    switch (currentEvent?._type) {
        case "MRevtContext": return currentEvent.ISN_EVENT;
        case "MREVT_EVENT": return currentEvent.ISN_EVENT;
        case "MTG_MEETING": return currentEvent.ISN_MTG_MEETING;
        case "MREVT_REMINDER": return currentEvent.ISN_REMINDER;
    }
}

export function getISN_RC(currentEvent?: iCurrentEvent) {
    switch (currentEvent?._type) {
        case "MRevtContext": return currentEvent.ISN_RC;
        case "MREVT_EVENT": return;
        case "MTG_MEETING": return;
    }
}

export function getISN_PRJ(currentEvent?: iCurrentEvent) {
    switch (currentEvent?._type) {
        case "MRevtContext": return currentEvent.ISN_PRJ;
        case "MREVT_EVENT": return;
        case "MTG_MEETING": return;
    }
}

export function getKIND_DOC(currentEvent?: iCurrentEvent) {
    switch (currentEvent?._type) {
        case "MRevtContext": return currentEvent.KIND_DOC;
        case "MREVT_EVENT": return;
        case "MTG_MEETING": return;
    }
}

export function getREF_KIND(currentEvent?: iCurrentEvent) {
    switch (currentEvent?._type) {
        case "MRevtContext": return currentEvent.KIND_DOC === 7 ? 'PRJ' : 'RC';
        case "MREVT_EVENT": return;
        case "MTG_MEETING": return 'MEETING';
    }
}

export function getTITLE(currentEvent?: iCurrentEvent) {
    switch (currentEvent?._type) {
        case "MRevtContext": return currentEvent.TITLE;
        case "MREVT_EVENT": return currentEvent.TITLE;
        case "MTG_MEETING": return currentEvent.NAME;
    }
}

export function getCONTROL_STATE(currentEvent?: iCurrentEvent) {
    switch (currentEvent?._type) {
        case "MRevtContext": return currentEvent.CONTROL_STATE;
        case "MREVT_EVENT": return;
        case "MTG_MEETING": return;
    }
}

export function getSTAGE(currentEvent?: iCurrentEvent) {
    switch (currentEvent?._type) {
        case "MRevtContext": return currentEvent.STAGE;
        case "MREVT_EVENT": {
            if (currentEvent.STATUS === StatusTypePlan.CANCELLED) return 'ОТМЕНЕН'
            if (currentEvent.STATUS === StatusTypePlan.DONE) return 'ВЫПОЛНЕН'
            else return 'ПЛАН';
        }
        case "MTG_MEETING": {
            if (getEVENT_TYPE(currentEvent) === EventsType.EVENT) {
                if (currentEvent.MEETING_STATUS === StatusTypeMeeting.PROJECT) return 'ПРОЕКТ'
                if (currentEvent.MEETING_STATUS === StatusTypeMeeting.IN_WORK) return 'СОГЛАСОВАНИЕ'
                if (currentEvent.MEETING_STATUS === StatusTypeMeeting.DECISION_MAKING) return 'В РАБОТЕ'
                if (currentEvent.MEETING_STATUS === StatusTypeMeeting.CANCELLED) return 'ОТМЕНЕН'
                if (currentEvent.MEETING_STATUS === StatusTypeMeeting.DONE) return 'ИСПОЛНЕН'
            }
            if (getEVENT_TYPE(currentEvent) === EventsType.EXPERTISE) {
                if (currentEvent.MEETING_STATUS === StatusTypeMeeting.PROJECT) return 'ПРОЕКТ'
                if (currentEvent.MEETING_STATUS === StatusTypeMeeting.IN_WORK) return 'В РАБОТЕ'
                if (currentEvent.MEETING_STATUS === StatusTypeMeeting.DECISION_MAKING) return 'ПРИНЯТИЕ РЕШЕНИЯ'
                if (currentEvent.MEETING_STATUS === StatusTypeMeeting.PROTOCOL_NEGOTIATION) return 'СОГЛАСОВАНИЕ ПРОТОКОЛА'
                if (currentEvent.MEETING_STATUS === StatusTypeMeeting.CANCELLED) return 'ОТМЕНЕН'
                if (currentEvent.MEETING_STATUS === StatusTypeMeeting.DONE) return 'ПРОТОКОЛ УТВЕРЖДЕН'
            }
            if (getEVENT_TYPE(currentEvent) === EventsType.SESSION || getEVENT_TYPE(currentEvent) === EventsType.MEETING) {
                if (currentEvent.MEETING_STATUS === StatusTypeMeeting.PROJECT) return 'ПРОЕКТ'
                if (currentEvent.MEETING_STATUS === StatusTypeMeeting.IN_WORK) return 'СОГЛАСОВАНИЕ ПОВЕСТКИ ДНЯ'
                if (currentEvent.MEETING_STATUS === StatusTypeMeeting.APPROVED_AGENDA) return 'УТВЕРЖДЕНА ПОВЕСТКА'
                if (currentEvent.MEETING_STATUS === StatusTypeMeeting.DECISION_MAKING) return 'ОПРОСНЫЙ ЛИСТ'
                if (currentEvent.MEETING_STATUS === StatusTypeMeeting.VOTE) return 'ГОЛОСОВАНИЕ'
                if (currentEvent.MEETING_STATUS === StatusTypeMeeting.PROTOCOL_NEGOTIATION) return 'СОГЛАСОВАНИЕ ПРОТОКОЛА'
                if (currentEvent.MEETING_STATUS === StatusTypeMeeting.CANCELLED) return 'ОТМЕНЕН'
                if (currentEvent.MEETING_STATUS === StatusTypeMeeting.DONE) return 'ПРОТОКОЛ УТВЕРЖДЕН'

            }
            else return 'ПЛАН';
        }
    }
}

export function getDATE_CREATE_DOCUMENT(currentEvent?: iCurrentEvent) {
    switch (currentEvent?._type) {
        case "MRevtContext": return currentEvent.DATE_CREATE_DOCUMENT;
        case "MREVT_EVENT": return currentEvent.EVENT_DATE;
        case "MTG_MEETING": return currentEvent.MEETING_DATE;
    }
}

export function getNAME_DOCUMENT(currentEvent?: iCurrentEvent) {
    switch (currentEvent?._type) {
        case "MRevtContext": return currentEvent.NAME_DOCUMENT;
        case "MREVT_EVENT": return;
        case "MTG_MEETING": return;
    }
}

export function getTOOLTIP_CORRESP(currentEvent?: iCurrentEvent) {
    switch (currentEvent?._type) {
        case "MRevtContext": return currentEvent.TOOLTIP_CORRESP;
        case "MREVT_EVENT": return;
        case "MTG_MEETING": return;
    }
}

export function getTOOLTIP_ORGANIZ(currentEvent?: iCurrentEvent) {
    switch (currentEvent?._type) {
        case "MRevtContext": return currentEvent.TOOLTIP_ORGANIZ;
        case "MREVT_EVENT": return;
        case "MTG_MEETING": return;
    }
}

export function getSTATUS(currentEvent?: iCurrentEvent) {
    switch (currentEvent?._type) {
        case "MRevtContext": return currentEvent.STAGE;
        case "MREVT_EVENT": return currentEvent.STATUS;
        case "MTG_MEETING": return currentEvent.MEETING_STATUS;
    }
}