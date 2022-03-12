import { iDEPARTMENT, iMREVT_REF, iPageContext } from "@eos/mrsoft-core";

export const GET_PAGE_CONTEXT = 'GET_PAGE_CONTEXT';
export const GET_PAGE_CONTEXT_SUCCESS = 'GET_PAGE_CONTEXT_SUCCESS';
export const GET_PAGE_CONTEXT_FAIL = 'GET_PAGE_CONTEXT_FAIL';
export const SET_VIEWED_DL = 'SET_VIEWED_DL';
export const SET_MAKING_NEW_NOTE = 'SET_MAKING_NEW_NOTE';
export const SET_EDITING_NOTE = 'SET_EDITING_NOTE';
export const SET_TODO_LIST_FULLVIEW = 'SET_TODO_LIST_FULLVIEW';
export const SET_TODO_LIST_VIEW_MODE = 'SET_TODO_LIST_VIEW_MODE';
export const SET_COMMON_VIEW_MODE = 'SET_COMMON_VIEW_MODE';
export const GET_DOCS = 'GET_DOCS';
export const GET_DOCS_SUCCESS = 'GET_DOCS_SUCCESS';
export const GET_DOCS_FAIL = 'GET_DOCS_FAIL';
export const SHOW_SETTINGS = 'SHOW_SETTINGS';

export interface CommonState {
    PageContext?: iPageContext;
    usersPC: iDEPARTMENT[];
    DUE_CURRENT_USER: string | null;
    ISN_LCLASSIF_CURRENT_USER: string | number | null;
    ISN_CABINET: number | null;
    editingNote: false | number;

    addition?: iMREVT_REF // TODO delete прокидывать в action

    todoListFullView: boolean;
    todoListViewType: TodoListViewType;
    commonViewType: CommonViewType;

    showNewNote: boolean;
    showSettings: boolean;
    isLoadingDocs: boolean;
    isLoading: boolean;
    isLogged: boolean;
    error: boolean;
}

export type TodoListViewType = 'all' | 'onDate';
export type CommonViewType = 'calendar' | 'plan';

interface GetPageContext {
    type: typeof GET_PAGE_CONTEXT;
    isLoading: boolean;
    isLogged: boolean
    PageContext?: iPageContext;
}

interface GetPageContextSuccess {
    type: typeof GET_PAGE_CONTEXT_SUCCESS;
    PageContext: iPageContext;
    usersPC: iDEPARTMENT[];
    DUE_CURRENT_USER: string | null;
    ISN_LCLASSIF_CURRENT_USER: string | number | null;
    ISN_CABINET: number | null;
    isLogged: boolean
    isLoading: boolean;
}

interface GetPageContextFail {
    type: typeof GET_PAGE_CONTEXT_FAIL;
    isLoading: boolean;
    error: boolean;
    isLogged: boolean
    PageContext?: iPageContext;
}

interface SetDueCurrentUser {
    type: typeof SET_VIEWED_DL;
    DUE_CURRENT_USER: string | null;
    ISN_LCLASSIF_CURRENT_USER: string | number | null;
    ISN_CABINET: number | null;
}

interface SetMakingNewNote {
    type: typeof SET_MAKING_NEW_NOTE,
    showNewNote: boolean;
    addition?: iMREVT_REF;
}

interface SetEditingNote {
    type: typeof SET_EDITING_NOTE,
    editingNote: number | false,
}

interface SetToDoListFullView {
    type: typeof SET_TODO_LIST_FULLVIEW,
    todoListFullView: boolean,
}

interface SetToDoListViewtype {
    type: typeof SET_TODO_LIST_VIEW_MODE,
    todoListViewType: TodoListViewType,
}

interface SetCommonViewtype {
    type: typeof SET_COMMON_VIEW_MODE,
    commonViewType: CommonViewType,
}

interface GetDocs {
    type: typeof GET_DOCS,
    isLoadingDocs: boolean,
}

interface GetDocsSuccess {
    type: typeof GET_DOCS_SUCCESS,
    isLoadingDocs: boolean,
}

interface GetDocsFail {
    type: typeof GET_DOCS_FAIL,
    isLoadingDocs: boolean,
    error: boolean;
}

interface ShowSettings {
    type: typeof SHOW_SETTINGS,
    showSettings: boolean;
}



export type CommonActionTypes =
    | GetPageContext
    | GetPageContextSuccess
    | GetPageContextFail
    | SetDueCurrentUser
    | SetMakingNewNote
    | SetEditingNote
    | SetToDoListFullView
    | SetToDoListViewtype
    | GetDocs
    | GetDocsSuccess
    | GetDocsFail
    | ShowSettings
    | SetCommonViewtype;