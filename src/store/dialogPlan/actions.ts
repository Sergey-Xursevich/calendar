import { iMREVT_ASSOCIATION, iMREVT_EVENT, iMREVT_REF, SequenceMap } from '@eos/mrsoft-core';
import { set } from 'date-fns';
import { Dispatch } from 'redux';
import { store } from '..';
import { EventsType, StatusTypePlan } from '../../Dictionary/Enums';
import {
    DialogPlanActionTypes,
    SET_PLAN,
    RESET_PLAN,
    SET_EDIT,
    SET_EVENT_DATE,
    SET_EVENT_DATE_FACT,
    SET_EVENT_DATE_TO,
    SET_EVENT_DATE_TO_FACT,
    SET_EVENT_TYPE,
    SET_ISN_EVENT,
    SET_DUE_DEPARTMENT,
    SET_PLACE,
    SET_TITLE,
    SET_REASON,
    SET_IS_COMMON,
    SET_IS_PERSONAL,
    SET_STATUS,
    SET_BODY,
    SET_RESULTS,
    SET_MREVT_ASSOCIATION,
    SET_MREVT_REF_REASON,
    SET_MREVT_REF_RESULTS,
    SET_SHOW,
    SET_DONE,
    SET_CANCELLED,
} from './types';

export function resetPlan() {
    return (dispatch: Dispatch<DialogPlanActionTypes>) => {
        const selection = store.getState().calendar.selection
        const dateForPlan = set(selection?.date || new Date(), { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 })

        dispatch({
            type: RESET_PLAN,
            plan: undefined,
            ISN_EVENT: SequenceMap.getTempIsn(),
            INS_DATE: null,
            EVENT_TYPE: EventsType.PRIVATE,
            EVENT_DATE: dateForPlan,
            EVENT_DATE_TO: null,
            EVENT_DATE_FACT: null,
            EVENT_DATE_TO_FACT: null,
            TITLE: '',
            PLACE: '',
            DUE_DEPARTMENT: store.getState().common.PageContext?.CurrentUser.DUE_DEP || null,
            REASON: '',
            IS_COMMON: 0,
            IS_PERSONAL: 1,
            STATUS: StatusTypePlan.PLAN,
            BODY: '',
            RESULTS: '',

            MREVT_ASSOCIATION: [],

            MREVT_REF_REASON: [],
            MREVT_REF_RESULTS: [],
        })
    }
}

export function setShow(show: boolean) {
    return (dispatch: Dispatch<DialogPlanActionTypes>) => {
        dispatch({
            type: SET_SHOW,
            show: show,
        })
    }
}

export function setEdit(edit: boolean) {
    return (dispatch: Dispatch<DialogPlanActionTypes>) => {
        dispatch({
            type: SET_EDIT,
            edit: edit,
        })
    }
}

export function setPlan(plan: iMREVT_EVENT) {
    return (dispatch: Dispatch<DialogPlanActionTypes>) => {
        dispatch({
            type: SET_PLAN,
            plan: plan,
            ISN_EVENT: plan.ISN_EVENT,
            INS_DATE: plan.INS_DATE ? new Date(plan.INS_DATE) : null,
            EVENT_TYPE: plan.EVENT_TYPE,
            EVENT_DATE: plan.EVENT_DATE ? new Date(plan.EVENT_DATE) : null,
            EVENT_DATE_TO: plan.EVENT_DATE_TO ? new Date(plan.EVENT_DATE_TO) : null,
            EVENT_DATE_FACT: plan.EVENT_DATE_FACT ? new Date(plan.EVENT_DATE_FACT) : null,
            EVENT_DATE_TO_FACT: plan.EVENT_DATE_TO_FACT ? new Date(plan.EVENT_DATE_TO_FACT) : null,
            TITLE: plan.TITLE,
            PLACE: plan.PLACE,
            DUE_DEPARTMENT: plan.DUE_DEPARTMENT,
            REASON: plan.REASON,
            IS_COMMON: plan.IS_COMMON || 0,
            IS_PERSONAL: plan.IS_PERSONAL || 0,
            STATUS: plan.STATUS || 0,
            BODY: plan.BODY,
            RESULTS: plan.RESULTS,
            MREVT_ASSOCIATION: plan.MREVT_ASSOCIATION_List || [],
            MREVT_REF_REASON: plan.MREVT_REF_List?.filter(item => item.REF_KIND && ~['DOC_RC', 'PRJ_RC', 'MEETING'].indexOf(item.REF_KIND)) || [],
            MREVT_REF_RESULTS: plan.MREVT_REF_List?.filter(item => item.REF_KIND && ~['DOC_RC', 'PRJ_RC', 'MEETING'].indexOf(item.REF_KIND)) || [],
        })
    }
}

export function setDialogDone(dialogDone: boolean) {
    return (dispatch: Dispatch<DialogPlanActionTypes>) => {
        dispatch({
            type: SET_DONE,
            dialogDone: dialogDone
        })
    }
}

export function setDialogCancelled(dialogCancelled: boolean) {
    return (dispatch: Dispatch<DialogPlanActionTypes>) => {
        dispatch({
            type: SET_CANCELLED,
            dialogCancelled: dialogCancelled
        })
    }
}

export function setIsnEvent(IsnEvent: number) {
    return (dispatch: Dispatch<DialogPlanActionTypes>) => {
        dispatch({
            type: SET_ISN_EVENT,
            ISN_EVENT: IsnEvent
        })
    }
}

export function setEventType(EventType: EventsType) {
    return (dispatch: Dispatch<DialogPlanActionTypes>) => {
        dispatch({
            type: SET_EVENT_TYPE,
            EVENT_TYPE: EventType
        })
    }
}

export function setEventDate(EventDate: Date | null) {
    return (dispatch: Dispatch<DialogPlanActionTypes>) => {
        dispatch({
            type: SET_EVENT_DATE,
            EVENT_DATE: EventDate
        })
    }
}

export function setEventDateTo(EventDateTo: Date | null) {
    return (dispatch: Dispatch<DialogPlanActionTypes>) => {
        dispatch({
            type: SET_EVENT_DATE_TO,
            EVENT_DATE_TO: EventDateTo
        })
    }
}

export function setEventDateFact(EventDateFact: Date | null) {
    return (dispatch: Dispatch<DialogPlanActionTypes>) => {
        dispatch({
            type: SET_EVENT_DATE_FACT,
            EVENT_DATE_FACT: EventDateFact
        })
    }
}

export function setEventDateToFact(EventDateToFact: Date | null) {
    return (dispatch: Dispatch<DialogPlanActionTypes>) => {
        dispatch({
            type: SET_EVENT_DATE_TO_FACT,
            EVENT_DATE_TO_FACT: EventDateToFact
        })
    }
}

export function setTitle(Title: string) {
    return (dispatch: Dispatch<DialogPlanActionTypes>) => {
        dispatch({
            type: SET_TITLE,
            TITLE: Title
        })
    }
}

export function setPlace(Place: string) {
    return (dispatch: Dispatch<DialogPlanActionTypes>) => {
        dispatch({
            type: SET_PLACE,
            PLACE: Place
        })
    }
}

export function setDueDepartment(DueDepartment: string) {
    return (dispatch: Dispatch<DialogPlanActionTypes>) => {
        dispatch({
            type: SET_DUE_DEPARTMENT,
            DUE_DEPARTMENT: DueDepartment
        })
    }
}

export function setReason(Reason: string) {
    return (dispatch: Dispatch<DialogPlanActionTypes>) => {
        dispatch({
            type: SET_REASON,
            REASON: Reason
        })
    }
}

export function setIsCommon(IsCommon: 0 | 1) {
    return (dispatch: Dispatch<DialogPlanActionTypes>) => {
        dispatch({
            type: SET_IS_COMMON,
            IS_COMMON: IsCommon
        })
    }
}

export function setIsPersonal(IsPersonal: 0 | 1) {
    return (dispatch: Dispatch<DialogPlanActionTypes>) => {
        dispatch({
            type: SET_IS_PERSONAL,
            IS_PERSONAL: IsPersonal
        })
    }
}

export function setStatus(status: StatusTypePlan) {
    return (dispatch: Dispatch<DialogPlanActionTypes>) => {
        dispatch({
            type: SET_STATUS,
            STATUS: status
        })
    }
}

export function setBody(body: string) {
    return (dispatch: Dispatch<DialogPlanActionTypes>) => {
        dispatch({
            type: SET_BODY,
            BODY: body
        })
    }
}

export function setCancelReason(results: string) {
    return (dispatch: Dispatch<DialogPlanActionTypes>) => {
        dispatch({
            type: SET_RESULTS,
            RESULTS: results
        })
    }
}

export function setMrEvtAssociation(MrEvtAssociation: iMREVT_ASSOCIATION[]) {
    return (dispatch: Dispatch<DialogPlanActionTypes>) => {
        dispatch({
            type: SET_MREVT_ASSOCIATION,
            MREVT_ASSOCIATION: MrEvtAssociation
        })
    }
}

export function setMrEvtRefReason(MrEvtRefReason: iMREVT_REF[]) {
    return (dispatch: Dispatch<DialogPlanActionTypes>) => {
        dispatch({
            type: SET_MREVT_REF_REASON,
            MREVT_REF_REASON: MrEvtRefReason
        })
    }
}

export function setMrEvtRefCancel(MrEvtRefCancel: iMREVT_REF[]) {
    return (dispatch: Dispatch<DialogPlanActionTypes>) => {
        dispatch({
            type: SET_MREVT_REF_RESULTS,
            MREVT_REF_RESULTS: MrEvtRefCancel
        })
    }
}