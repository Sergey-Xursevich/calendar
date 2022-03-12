import {
    SettingActionTypes,
    SettingsState,
    SET_PARTICIPATE,
    SET_RESPONSIBLE,
    SET_CREATED_BY_ME,
    SET_DIVISION_PLAN,
    SET_ORGANIZATION_PLAN,
    SET_DL_PLAN,
    SET_SHOW_LOG_DELETED_DL,
    SET_SHOW_CANCELED,
    SET_SHOW_EVENTS,
    SET_SETTINGS,
    ISettings
} from './types';

setDefaultSettings();
const settings = getSettings()
export const initStateCalendarReducer: SettingsState = {
    ...settings
};

export function settingsReducer(state = initStateCalendarReducer, action: SettingActionTypes) {
    switch (action.type) {
        case SET_PARTICIPATE:
            return { ...state, ...action };
        case SET_RESPONSIBLE:
            return { ...state, ...action };
        case SET_CREATED_BY_ME:
            return { ...state, ...action };
        case SET_DIVISION_PLAN:
            return { ...state, ...action };
        case SET_ORGANIZATION_PLAN:
            return { ...state, ...action };
        case SET_DL_PLAN:
            return { ...state, ...action };
        case SET_SHOW_CANCELED:
            return { ...state, ...action };
        case SET_SHOW_LOG_DELETED_DL:
            return { ...state, ...action };
        case SET_SHOW_EVENTS:
            return { ...state, ...action };
        case SET_SETTINGS:
            return { ...state, ...action };
        default:
            return state;
    }
}


function getSettings(): ISettings {
    const participate = localStorage.getItem("MREvent_Settings_Participate") === 'true';
    const responsible = localStorage.getItem("MREvent_Settings_Responsible") === 'true';
    const createdByMe = localStorage.getItem("MREvent_Settings_CreatedByMe") === 'true';
    const divisionPlan = localStorage.getItem("MREvent_Settings_DivisionPlan") === 'true';
    const organizationPlan = localStorage.getItem("MREvent_Settings_OrganizationPlan") === 'true';
    const DLPlan = localStorage.getItem("MREvent_Settings_DL_PLAN") === 'true';
    const DLPlanDUES = localStorage.getItem("MREvent_Settings_DL_PLAN_DUES")?.split('|').filter(i => i) || [];
    const DLPlanDateStartFromStr = localStorage.getItem("MREvent_Settings_DL_PLAN_START_FROM");
    const DLPlanDateStartFrom = DLPlanDateStartFromStr && DLPlanDateStartFromStr !== 'null' ? new Date(DLPlanDateStartFromStr) : null;
    const DLPlanDateStartToStr = localStorage.getItem("MREvent_Settings_DL_PLAN_START_TO");
    const DLPlanDateStartTo = DLPlanDateStartToStr && DLPlanDateStartToStr !== 'null' ? new Date(DLPlanDateStartToStr) : null;
    const DLPlanDateFinishFromStr = localStorage.getItem("MREvent_Settings_DL_PLAN_FINISH_FROM");
    const DLPlanDateFinishFrom = DLPlanDateFinishFromStr && DLPlanDateFinishFromStr !== 'null' ? new Date(DLPlanDateFinishFromStr) : null;
    const DLPlanDateFinishToStr = localStorage.getItem("MREvent_Settings_DL_PLAN_FINISH_TO");
    const DLPlanDateFinishTo = DLPlanDateFinishToStr && DLPlanDateFinishToStr !== 'null' ? new Date(DLPlanDateFinishToStr) : null;    
    const ExportDateStartStr = localStorage.getItem("MREvent_Settings_EXPORT_DATE_FINISH_FROM");
    const ExportDateStart = ExportDateStartStr && ExportDateStartStr !== 'null' ? new Date(ExportDateStartStr) : null;
    const ExportDateFinishStr = localStorage.getItem("MREvent_Settings_EXPORT_DATE_FINISH_TO");
    const ExportDateFinish = ExportDateFinishStr && ExportDateFinishStr !== 'null' ? new Date(ExportDateFinishStr) : null;
    const showLogDeletedDL = localStorage.getItem("MREvent_Settings_ShowLogDeletedDL") === 'true';
    const showCanceled = localStorage.getItem("MREvent_Settings_ShowCanceled") === 'true';
    const showEvents = localStorage.getItem("MREvent_Settings_ShowEvents") === 'true';
    const createByDefault = localStorage.getItem("MREvent_Settings_CreateByDefault");
    return ({
        createByDefault: +createByDefault!,
        participate,
        responsible,
        createdByMe,
        divisionPlan,
        organizationPlan,
        showLogDeletedDL,
        showCanceled,
        showEvents,
        DLPlan,
        DLPlanDUES,
        DLPlanDateStartFrom,
        DLPlanDateStartTo,
        DLPlanDateFinishFrom,
        DLPlanDateFinishTo,
        ExportDateStart,
        ExportDateFinish
    })
}

function setDefaultSettings() {
    const participate = localStorage.getItem("MREvent_Settings_Participate");
    const responsible = localStorage.getItem("MREvent_Settings_Responsible");
    const createdByMe = localStorage.getItem("MREvent_Settings_CreatedByMe");
    const divisionPlan = localStorage.getItem("MREvent_Settings_DivisionPlan");
    const organizationPlan = localStorage.getItem("MREvent_Settings_OrganizationPlan");
    const showLogDeletedDL = localStorage.getItem("MREvent_Settings_ShowLogDeletedDL");
    const showCanceled = localStorage.getItem("MREvent_Settings_ShowCanceled");
    const showEvents = localStorage.getItem("MREvent_Settings_ShowEvents");
    const createByDefault = localStorage.getItem("MREvent_Settings_CreateByDefault");
    if (participate &&
        responsible &&
        createdByMe &&
        divisionPlan &&
        organizationPlan &&
        showLogDeletedDL &&
        showCanceled &&
        showEvents &&
        createByDefault
    )
        return;
    else {
        localStorage.setItem("MREvent_Settings_Participate", 'true');
        localStorage.setItem("MREvent_Settings_Responsible", 'true');
        localStorage.setItem("MREvent_Settings_CreatedByMe", 'true');
        localStorage.setItem("MREvent_Settings_DivisionPlan", 'true');
        localStorage.setItem("MREvent_Settings_OrganizationPlan", 'true');
        localStorage.setItem("MREvent_Settings_ShowLogDeletedDL", 'false');
        localStorage.setItem("MREvent_Settings_ShowCanceled", 'true');
        localStorage.setItem("MREvent_Settings_ShowEvents", 'true');
        localStorage.setItem("MREvent_Settings_CreateByDefault", '103');
    }
}