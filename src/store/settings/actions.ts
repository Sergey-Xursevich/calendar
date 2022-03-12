import { Dispatch } from 'redux';
import {
    SettingActionTypes,
    SET_PARTICIPATE,
    SET_RESPONSIBLE,
    SET_CREATED_BY_ME,
    SET_DIVISION_PLAN,
    SET_ORGANIZATION_PLAN,
    SET_SHOW_CANCELED,
    SET_SHOW_EVENTS,
    ISettings,
    SET_SETTINGS,
    SET_SHOW_LOG_DELETED_DL,
} from './types';

export function setSettings(settings: ISettings) {
    return (dispatch: Dispatch<SettingActionTypes>) => {
        localStorage.setItem("MREvent_Settings_Participate", settings.participate.toString());
        localStorage.setItem("MREvent_Settings_Responsible", settings.responsible.toString());
        localStorage.setItem("MREvent_Settings_CreatedByMe", settings.createdByMe.toString());
        localStorage.setItem("MREvent_Settings_DivisionPlan", settings.divisionPlan.toString());
        localStorage.setItem("MREvent_Settings_OrganizationPlan", settings.organizationPlan.toString());
        localStorage.setItem("MREvent_Settings_DL_PLAN", settings.DLPlan.toString());
        localStorage.setItem("MREvent_Settings_DL_PLAN_DUES", settings.DLPlanDUES.join('|'));
        localStorage.setItem("MREvent_Settings_DL_PLAN_START_FROM", settings.DLPlanDateStartFrom ? settings.DLPlanDateStartFrom.toString() : 'null');
        localStorage.setItem("MREvent_Settings_DL_PLAN_START_TO", settings.DLPlanDateStartTo ? settings.DLPlanDateStartTo.toString() : 'null');
        localStorage.setItem("MREvent_Settings_DL_PLAN_FINISH_FROM", settings.DLPlanDateFinishFrom ? settings.DLPlanDateFinishFrom.toString() : 'null');
        localStorage.setItem("MREvent_Settings_DL_PLAN_FINISH_TO", settings.DLPlanDateFinishTo ? settings.DLPlanDateFinishTo.toString() : 'null');
        localStorage.setItem("MREvent_Settings_ShowLogDeletedDL", settings.showLogDeletedDL.toString());
        localStorage.setItem("MREvent_Settings_ShowCanceled", settings.showCanceled.toString());
        localStorage.setItem("MREvent_Settings_ShowEvents", settings.showEvents.toString());
        localStorage.setItem("MREvent_Settings_CreateByDefault", settings.createByDefault.toString());
        localStorage.setItem("MREvent_Settings_EXPORT_DATE_FINISH_FROM", settings.ExportDateStart ? settings.ExportDateStart.toString() : 'null');
        localStorage.setItem("MREvent_Settings_EXPORT_DATE_FINISH_TO", settings.ExportDateFinish ? settings.ExportDateFinish.toString() : 'null');
        dispatch({
            type: SET_SETTINGS,
            ...settings,
        })
    }
}

export function setParticipate(participate: boolean) {
    return (dispatch: Dispatch<SettingActionTypes>) => {
        dispatch({
            type: SET_PARTICIPATE,
            participate: participate,
        })
    }
}

export function setResponsible(responsible: boolean) {
    return (dispatch: Dispatch<SettingActionTypes>) => {
        dispatch({
            type: SET_RESPONSIBLE,
            responsible: responsible,
        })
    }
}

export function setCreatedByMe(createdByMe: boolean) {
    return (dispatch: Dispatch<SettingActionTypes>) => {
        dispatch({
            type: SET_CREATED_BY_ME,
            createdByMe: createdByMe,
        })
    }
}

export function setDivisionPlan(divisionPlan: boolean) {
    return (dispatch: Dispatch<SettingActionTypes>) => {
        dispatch({
            type: SET_DIVISION_PLAN,
            divisionPlan: divisionPlan,
        })
    }
}

export function setOrganizationPlan(organizationPlan: boolean) {
    return (dispatch: Dispatch<SettingActionTypes>) => {
        dispatch({
            type: SET_ORGANIZATION_PLAN,
            organizationPlan: organizationPlan,
        })
    }
}

export function setShowLogDeletedDL(showLogDeletedDL: boolean) {
    return (dispatch: Dispatch<SettingActionTypes>) => {
        dispatch({
            type: SET_SHOW_LOG_DELETED_DL,
            showLogDeletedDL: showLogDeletedDL,
        })
    }
}

export function setShowCanceled(showCanceled: boolean) {
    return (dispatch: Dispatch<SettingActionTypes>) => {
        dispatch({
            type: SET_SHOW_CANCELED,
            showCanceled: showCanceled,
        })
    }
}

export function setShowEvents(showEvents: boolean) {
    return (dispatch: Dispatch<SettingActionTypes>) => {
        dispatch({
            type: SET_SHOW_EVENTS,
            showEvents: showEvents,
        })
    }
}
