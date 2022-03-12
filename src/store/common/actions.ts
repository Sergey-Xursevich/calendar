import { Dispatch } from 'redux';
import {
    GET_PAGE_CONTEXT,
    GET_PAGE_CONTEXT_SUCCESS,
    GET_PAGE_CONTEXT_FAIL,
    CommonActionTypes,
    SET_VIEWED_DL,
    SET_MAKING_NEW_NOTE,
    SET_EDITING_NOTE,
    SET_TODO_LIST_FULLVIEW,
    SET_TODO_LIST_VIEW_MODE,
    SHOW_SETTINGS, TodoListViewType, CommonViewType, SET_COMMON_VIEW_MODE
} from './types';
import { Piper, PageContext, iUSERCARD, iUSER_CABINET, iMREVT_REF, iDEPARTMENT, iCABINET, iUSER_CL } from '@eos/mrsoft-core';

export function loadPageContext() {
    return async (dispatch: Dispatch<CommonActionTypes>) => {
        dispatch({
            type: GET_PAGE_CONTEXT,
            isLoading: true,
            isLogged: false,
        })
        try {
            const [pc] = await Promise.all([
                PageContext.init(),
                Piper.load<iCABINET>("CABINET", null, { saveToStore: true })
            ]);
            // Собираем ISN_CABINET
            if (!pc.CurrentUser.USERCARD_List) return;
            const ids: number[] = pc.CurrentUser.USERCARD_List.reduce((prev, curr: iUSERCARD) => {
                if (curr.USER_CABINET_List) return [...prev, ...curr.USER_CABINET_List.reduce((prev, curr: iUSER_CABINET) => {
                    if (curr.ISN_CABINET) return [...prev, curr.ISN_CABINET];
                    else return []
                }, [] as number[])];
                else return []
            }, [] as number[]);
            const usersPC = ids.reduce((prev, cur) => {
                const lastEl = prev.length - 1;
                if (prev[lastEl] && prev[lastEl].join('|').length + cur.toString().length < 1500) {
                    prev[lastEl].push(cur);
                    return prev;
                } else {
                    prev[prev.length] = [cur];
                    return prev;
                }
            }, [] as number[][]).map(item => Piper.load<iDEPARTMENT[]>("DEPARTMENT", { criteries: { ISN_CABINET: item.join("|") } }, { saveToStore: true }))
            const loadedUsersPC = await Promise.all<iDEPARTMENT[]>([...usersPC]);
            const userPC = loadedUsersPC.reduce((acc, val) => [...acc, ...val], []);
            const [userDL] = userPC.filter(user => user.DUE === pc.CurrentUser.DUE_DEP);
            dispatch({
                type: GET_PAGE_CONTEXT_SUCCESS,
                PageContext: pc,
                usersPC: loadedUsersPC.reduce((acc, val) => [...acc, ...val], []),
                DUE_CURRENT_USER: pc.CurrentUser.DUE_DEP || null,
                ISN_LCLASSIF_CURRENT_USER: pc.CurrentUser.ISN_LCLASSIF || null,
                ISN_CABINET: userDL && userDL.ISN_CABINET || null,
                isLogged: true,
                isLoading: false
            });
        }
        catch (error) {
            dispatch({
                type: GET_PAGE_CONTEXT_FAIL,
                isLoading: false,
                error: true,
                isLogged: false,
            });
            console.error(error)
            window.location.href = window.location.origin + "/login.aspx";
        }
    }
}

export function setDueCurrentUser(DUE: string | null, ISN_CABINET: number | null) {
    return (dispatch: Dispatch<CommonActionTypes>) => {
        Piper.load<iUSER_CL[]>('USER_CL', { criteries: { DUE_DEP: DUE } }).then(res => {
            dispatch({
                type: SET_VIEWED_DL,
                DUE_CURRENT_USER: DUE,
                ISN_LCLASSIF_CURRENT_USER: res.map(item => item.ISN_LCLASSIF).join('|') || null,
                ISN_CABINET: ISN_CABINET
            })
        })
    }
}

export function setMakingNewNote(state: boolean, addition?: iMREVT_REF) {
    return (dispatch: Dispatch<CommonActionTypes>) => {
        dispatch({
            type: SET_MAKING_NEW_NOTE,
            showNewNote: state,
            addition: addition,
            editingNote: undefined
        })
    }
}

export function setEditingNote(isnEditingNote: number | false) {
    return (dispatch: Dispatch<CommonActionTypes>) => {
        dispatch({
            type: SET_EDITING_NOTE,
            editingNote: isnEditingNote,
        })
    }
}

export function setToDoListFullView(isFull: boolean) {
    return (dispatch: Dispatch<CommonActionTypes>) => {
        dispatch({
            type: SET_TODO_LIST_FULLVIEW,
            todoListFullView: isFull
        })
    }
}

export function setToDoListViewType(mode: TodoListViewType) {
    localStorage.setItem("MREvent_TodoListViewType", mode); //При следующей загрузки начнем с этого вида
    return (dispatch: Dispatch<CommonActionTypes>) => {
        dispatch({
            type: SET_TODO_LIST_VIEW_MODE,
            todoListViewType: mode
        })
    }
}

export function setCommonViewType(mode: CommonViewType) {
    localStorage.setItem("MREvent_CommonViewType", mode); //При следующей загрузки начнем с этого вида
    return (dispatch: Dispatch<CommonActionTypes>) => {
        dispatch({
            type: SET_COMMON_VIEW_MODE,
            commonViewType: mode
        })
    }
}

export function showSettings(toggle: boolean) {
    return (dispatch: Dispatch<CommonActionTypes>) => {
        dispatch({
            type: SHOW_SETTINGS,
            showSettings: toggle,
        })
    }
}