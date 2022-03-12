import React from "react";
import { iCITIZEN, iCONTACT, iDEPARTMENT, Piper } from "@eos/mrsoft-core";

const DEPARTMENT = 'DEPARTMENT';
const CONTACT = 'CONTACT';
const CITIZEN = 'CITIZEN';
// const UNIFIED_SOP = 'UNIFIED_SOP';
export type Entity = typeof DEPARTMENT | typeof CONTACT | typeof CITIZEN;
export type EntityInterface = iDEPARTMENT | iCONTACT | iCITIZEN;
export type SopInterface = iBlueDepartment | iBlueContact | iBlueCitizen;

type SopName = 'BlueSearchDepartments' | 'BlueSearchContacts' | 'BlueSearchCitizens' | 'BlueSearchUnified';

interface iConfig<T> {
    tableName: Entity;
    sopName: SopName;
    template: (item: T) => JSX.Element;
    loader: (id: string | string[] | number | number[]) => Promise<EntityInterface>;
    searchReturnDue: boolean;
    returnValue: (item: T) => string;
}

const loadDepartmentAssets = async (id: string | string[] | number | number[]) => {
    const result = await Piper.load<iDEPARTMENT>('DEPARTMENT', id, { saveToStore: true });
    return result;
}
const loadContactAssets = async (id: string | string[] | number | number[]) => {
    const result = await Piper.load<iCONTACT>('CONTACT', id, { saveToStore: true });
    return result;
}
const loadCitizenAssets = async (id: string | string[] | number | number[]) => {
    const result = await Piper.load<iCITIZEN>('CITIZEN', id, { saveToStore: true });
    return result;
}
/* const loadUnifiedAssets = async (id: string | string[] | number | number[]) => {
    const result = await Piper.load('CONTACT', id, { saveToStore: true });
    return result;
} */

const departmentItemTemplate = (item: iBlueDepartment) => <div><div>{item.CLASSIF_NAME}</div><div>{item.DEPT_NAME}</div></div>
function contactItemTemplate() { return <div>contactItemTemplate</div> }
function citizenItemTemplate() { return <div>citizenItemTemplate</div> }
// function unifiedItemTemplate() { return <div>unifiedItemTemplate</div> }

export const DEPARTMENT_CONFIG: iConfig<iDEPARTMENT | iBlueDepartment> = {
    tableName: DEPARTMENT,
    sopName: "BlueSearchDepartments",
    template: departmentItemTemplate,
    loader: loadDepartmentAssets,
    searchReturnDue: true,
    returnValue: (item: iDEPARTMENT | iBlueDepartment) => item.DUE || "",
};

export interface iBlueDepartment {
    _filterKey?: string;
    _foundAs?: string;
    _foundBy?: string;
    CLASSIF_NAME?: string;
    DEPT_NAME?: string;
    DUE?: string;
    IS_NODE?: number
}

export const CONTACT_CONFIG: iConfig<iCONTACT | iBlueContact> = {
    tableName: CONTACT,
    sopName: "BlueSearchContacts",
    template: contactItemTemplate,
    loader: loadContactAssets,
    searchReturnDue: false,
    returnValue: (item: iCONTACT | iBlueContact) => ''
};

export interface iBlueContact {
    _filterKey?: string;
    _foundAs?: string;
    _foundBy?: string;
    CLASSIF_NAME?: string;
    DEPT_NAME?: string;
    DUE?: string;
    IS_NODE?: number
}

export const CITIZEN_CONFIG: iConfig<iCITIZEN | iBlueCitizen> = {
    tableName: CITIZEN,
    sopName: 'BlueSearchCitizens',
    template: citizenItemTemplate,
    loader: loadCitizenAssets,
    searchReturnDue: false,
    returnValue: (item: iCITIZEN | iBlueCitizen) => ''
};

export interface iBlueCitizen {
    _filterKey?: string;
    _foundAs?: string;
    _foundBy?: string;
    CLASSIF_NAME?: string;
    DEPT_NAME?: string;
    DUE?: string;
    IS_NODE?: number
}

// export const UNIFIED_SOP_CONFIG: iConfig<any> = {
//     tableName: UNIFIED_SOP,
//     sopName: "BlueSearchUnified",
//     template: unifiedItemTemplate,
//     loader: loadUnifiedAssets,
//     searchReturnDue: true,
//     returnValue: (item: any) => ''
// };

export default function Config(entity: Entity) {
    switch (entity) {
        case DEPARTMENT: return DEPARTMENT_CONFIG
        case CONTACT: return CONTACT_CONFIG
        case CITIZEN: return CITIZEN_CONFIG
        // case UNIFIED_SOP: return UNIFIED_SOP_CONFIG
    }
} 