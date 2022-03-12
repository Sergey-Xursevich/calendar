import { SequenceMap } from '@eos/mrsoft-core';
import { EventsType, StatusTypePlan } from '../../Dictionary/Enums';
import {
    DialogPlanActionTypes,
    IDialogPlanState,
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
    SET_PLAN,
    SET_SHOW,
    RESET_PLAN,
    SET_CANCELLED,
    SET_DONE,
} from './types';

export const initStateCalendarReducer: IDialogPlanState = {
    show: false,
    edit: false,
    dialogCancelled: false,
    dialogDone: false,
    ISN_EVENT: SequenceMap.getTempIsn(),
    EVENT_TYPE: EventsType.PRIVATE,
    EVENT_DATE: null,
    EVENT_DATE_TO: null,
    EVENT_DATE_FACT: null,
    EVENT_DATE_TO_FACT: null,
    TITLE: '',
    PLACE: '',
    DUE_DEPARTMENT: '',
    REASON: '',
    IS_COMMON: 1,
    IS_PERSONAL: 1,
    STATUS: StatusTypePlan.PLAN,
    BODY: '',
    RESULTS: '',

    MREVT_ASSOCIATION: [],

    MREVT_REF_REASON: [],
    MREVT_REF_RESULTS: [],
};

export function dialogPlanReducer(state = initStateCalendarReducer, action: DialogPlanActionTypes) {
    switch (action.type) {
        case SET_SHOW:
            return { ...state, ...action };
        case SET_EDIT:
            return { ...state, ...action };
        case SET_PLAN:
            return { ...state, ...action };
        case SET_ISN_EVENT:
            return { ...state, ...action };
        case SET_EVENT_TYPE:
            return { ...state, ...action };
        case SET_EVENT_DATE:
            return { ...state, ...action };
        case SET_EVENT_DATE_TO:
            return { ...state, ...action };
        case SET_EVENT_DATE_FACT:
            return { ...state, ...action };
        case SET_EVENT_DATE_TO_FACT:
            return { ...state, ...action };
        case SET_TITLE:
            return { ...state, ...action };
        case SET_PLACE:
            return { ...state, ...action };
        case SET_DUE_DEPARTMENT:
            return { ...state, ...action };
        case SET_REASON:
            return { ...state, ...action };
        case SET_IS_COMMON:
            return { ...state, ...action };
        case SET_IS_PERSONAL:
            return { ...state, ...action };
        case SET_STATUS:
            return { ...state, ...action };
        case SET_BODY:
            return { ...state, ...action };
        case SET_RESULTS:
            return { ...state, ...action };
        case SET_MREVT_ASSOCIATION:
            return { ...state, ...action };
        case SET_MREVT_REF_REASON:
            return { ...state, ...action };
        case SET_MREVT_REF_RESULTS:
            return { ...state, ...action };
        case RESET_PLAN:
            return { ...state, ...action };
        case SET_CANCELLED:
            return { ...state, ...action };
        case SET_DONE:
            return { ...state, ...action };

        default:
            return state;
    }
}