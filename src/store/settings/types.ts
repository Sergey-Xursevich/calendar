import { EventsType } from "../../Dictionary/Enums";

export const SET_PARTICIPATE = 'SET_PARTICIPATE';
export const SET_RESPONSIBLE = 'SET_RESPONSIBLE';
export const SET_CREATED_BY_ME = 'SET_CREATED_BY_ME';
export const SET_DIVISION_PLAN = 'SET_DIVISION_PLAN';
export const SET_ORGANIZATION_PLAN = 'SET_ORGANIZATION_PLAN';
export const SET_SHOW_LOG_DELETED_DL = 'SET_SHOW_LOG_DELETED_DL';
export const SET_SHOW_CANCELED = 'SET_SHOW_CANCELED';
export const SET_SHOW_EVENTS = 'SET_SHOW_EVENTS';
export const SET_SETTINGS = 'SET_SETTINGS';
export const SET_DL_PLAN = 'SET_DL_PLAN';
export const SET_DL_PLAN_DUES = 'SET_DL_PLAN_DUES';
export const SET_DL_PLAN_DATE_START_FROM = 'SET_DL_PLAN_DATE_START_FROM';
export const SET_DL_PLAN_DATE_START_TO = 'SET_DL_PLAN_DATE_START_TO';
export const SET_DL_PLAN_DATE_FINISH_FROM = 'SET_DL_PLAN_DATE_FINISH_FROM';
export const SET_DL_PLAN_DATE_FINISH_TO = 'SET_DL_PLAN_DATE_FINISH_TO';
export const SET_EXPORT_DATE_FINISH_FROM = 'SET_EXPORT_DATE_FINISH_FROM';
export const SET_EXPORT_DATE_FINISH_TO = 'SET_EXPORT_DATE_FINISH_TO';

export interface SettingsState extends ISettings { }

export interface ISettings {
    participate: boolean;
    responsible: boolean;
    createdByMe: boolean;
    divisionPlan: boolean;
    organizationPlan: boolean;
    showLogDeletedDL: boolean;
    showCanceled: boolean;
    showEvents: boolean;
    DLPlan: boolean;
    DLPlanDUES: string[];
    DLPlanDateStartFrom: Date | null;
    DLPlanDateStartTo: Date | null;
    DLPlanDateFinishFrom: Date | null;
    DLPlanDateFinishTo: Date | null;
    ExportDateStart: Date | null;    
    ExportDateFinish: Date | null;
    createByDefault: createByDefault;
}

type createByDefault = EventsType.MEETING | EventsType.SESSION;

interface setSettings {
    type: typeof SET_SETTINGS;
    participate: boolean;
    responsible: boolean;
    createdByMe: boolean;
    divisionPlan: boolean;
    organizationPlan: boolean;
    showLogDeletedDL: boolean;
    showCanceled: boolean;
    showEvents: boolean;
    DLPlan: boolean;
    DLPlanDUES: string[];
    DLPlanDateStartFrom: Date | null;
    DLPlanDateStartTo: Date | null;
    DLPlanDateFinishFrom: Date | null;
    DLPlanDateFinishTo: Date | null;
    ExportDateStart: Date | null;    
    ExportDateFinish: Date | null;
}

interface setParticipate {
    type: typeof SET_PARTICIPATE;
    participate: boolean;
}

interface setResponsible {
    type: typeof SET_RESPONSIBLE;
    responsible: boolean;
}

interface setCreatedByMe {
    type: typeof SET_CREATED_BY_ME;
    createdByMe: boolean;
}

interface setDivisionPlan {
    type: typeof SET_DIVISION_PLAN;
    divisionPlan: boolean;
}

interface setOrganizationPlan {
    type: typeof SET_ORGANIZATION_PLAN;
    organizationPlan: boolean;
}

interface setDLPlan {
    type: typeof SET_DL_PLAN;
    DLPlan: boolean;
}

interface setDLPlanDues {
    type: typeof SET_DL_PLAN_DUES;
    DLPlanDUES: boolean;
}

interface setDLPlanDateStartFrom {
    type: typeof SET_DL_PLAN_DATE_START_FROM;
    DLPlanDateStartFrom: boolean;
}

interface setDLPlanDateStartTo {
    type: typeof SET_DL_PLAN_DATE_START_TO;
    DLPlanDateStartTo: boolean;
}

interface setDLPlanDateFinishFrom {
    type: typeof SET_DL_PLAN_DATE_FINISH_FROM;
    DLPlanDateFinishFrom: boolean;
}

interface setDLPlanDateFinishTo {
    type: typeof SET_DL_PLAN_DATE_FINISH_TO;
    DLPlanDateFinishTo: boolean;
}

interface setExportDateStart {
    type: typeof SET_EXPORT_DATE_FINISH_FROM;
    ExportDateStart: boolean;
}

interface setExportDateFinish {
    type: typeof SET_EXPORT_DATE_FINISH_TO;
    ExportDateFinish: boolean;
}

interface setShowLogDeletedDL {
    type: typeof SET_SHOW_LOG_DELETED_DL;
    showLogDeletedDL: boolean;
}

interface setShowCanceled {
    type: typeof SET_SHOW_CANCELED;
    showCanceled: boolean;
}

interface setShowEvents {
    type: typeof SET_SHOW_EVENTS;
    showEvents: boolean;
}

export type SettingActionTypes =
    | setParticipate
    | setResponsible
    | setCreatedByMe
    | setDivisionPlan
    | setOrganizationPlan
    | setDLPlan
    | setShowLogDeletedDL
    | setShowCanceled
    | setSettings
    | setShowEvents
    | setDLPlanDues
    | setDLPlanDateStartFrom
    | setDLPlanDateStartTo
    | setDLPlanDateFinishFrom
    | setDLPlanDateFinishTo
    | setExportDateStart
    | setExportDateFinish;