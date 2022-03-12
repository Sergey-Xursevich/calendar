import {
    CommonActionTypes,
    GET_PAGE_CONTEXT,
    GET_PAGE_CONTEXT_SUCCESS,
    GET_PAGE_CONTEXT_FAIL,
    SET_VIEWED_DL,
    CommonState,
    SET_MAKING_NEW_NOTE,
    SET_EDITING_NOTE,
    SET_TODO_LIST_FULLVIEW,
    SET_TODO_LIST_VIEW_MODE,
    GET_DOCS_SUCCESS,
    GET_DOCS_FAIL,
    GET_DOCS,
    SHOW_SETTINGS,
    TodoListViewType,
    CommonViewType, SET_COMMON_VIEW_MODE
} from './types';

const todoListViewType = getTodoListViewType()
const commonViewType = getCommonViewType()

export const initStateCalendarReducer: CommonState = {
    ISN_LCLASSIF_CURRENT_USER: null,
    ISN_CABINET: null,
    DUE_CURRENT_USER: null,
    usersPC: [],
    showNewNote: false,
    isLoading: false,
    isLoadingDocs: false,
    error: false,
    isLogged: false,
    editingNote: false,
    showSettings: false,
    todoListFullView: false,
    commonViewType: commonViewType,
    todoListViewType: todoListViewType
};

export function commonReducer(state = initStateCalendarReducer, action: CommonActionTypes) {
    switch (action.type) {
        case GET_PAGE_CONTEXT: {
            return { ...state, ...action };
        }
        case GET_PAGE_CONTEXT_SUCCESS: {
            return { ...state, ...action };
        }
        case GET_PAGE_CONTEXT_FAIL: {
            return { ...state, ...action };
        }
        case SET_VIEWED_DL: {
            return { ...state, ...action };
        }
        case SET_MAKING_NEW_NOTE: {
            return { ...state, ...action };
        }
        case SET_EDITING_NOTE: {
            return { ...state, ...action };
        }
        case SET_TODO_LIST_FULLVIEW: {
            return { ...state, ...action };
        }
        case SET_TODO_LIST_VIEW_MODE: {
            return { ...state, ...action };
        }
        case GET_DOCS: {
            return { ...state, ...action };
        }
        case GET_DOCS_SUCCESS: {
            return { ...state, ...action };
        }
        case GET_DOCS_FAIL: {
            return { ...state, ...action };
        }
        case SHOW_SETTINGS: {
            return { ...state, ...action };
        }
        case SET_COMMON_VIEW_MODE: {
            return { ...state, ...action }
        }

        default: return state;
    }
}


function getTodoListViewType(): TodoListViewType {
    const viewType = localStorage.getItem("MREvent_TodoListViewType");
    if (viewType === 'all' || viewType === 'onDate')
        return viewType
    else return 'all';
}

function getCommonViewType(): CommonViewType {
    const viewType = localStorage.getItem("MREvent_CommonViewType");
    if (viewType === 'calendar' || viewType === 'plan')
        return viewType
    else return 'calendar';
}
