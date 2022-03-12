import { ContextMenu as ContextMenuDefault, ContextMenuItem, deloDialogAlert, DeloSubSystem, DM, EntityHelper, iContextMenuStatus, iDOC_RC, iMREVT_REF, iPRJ_RC, PageContext, Piper, _ES } from "@eos/mrsoft-core";
import todolist from "./ToDoList.module.scss"
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../../store";
import { getEVENT_DATE, getISN_EVENT, getISN_PRJ, getISN_RC, getREF_KIND } from "../../Utils/getField";
import { setMakingNewNote } from "../../store/common/actions";
import { EventsType, StatusTypePlan } from "../../Dictionary/Enums";
import { isPlan } from "../../Utils/CalendarHelper";
import { loadMeetings, loadPlans, setSelection } from "../../store/calendar/actions";
import { setDialogCancelled, setDialogDone, setEdit, setPlan, setShow, setStatus } from "../../store/dialogPlan/actions";
import { iCurrentEvent } from "../../store/calendar/types";
import { downloadIcsFile } from "../../Utils/SaveToIcs";

declare var setToBuf: (val: string) => Promise<any>;

interface iToDoListContextMenu {
    contextMenuStatus: iContextMenuStatus;
    setContextMenuStatus: React.Dispatch<React.SetStateAction<iContextMenuStatus>>;
    wrapperRef: React.RefObject<HTMLDivElement>;
    openPopUpWrapper: (item: iCurrentEvent) => void;
}

export default function ContextMenu({ contextMenuStatus, setContextMenuStatus, wrapperRef, openPopUpWrapper }: iToDoListContextMenu) {
    const dispatch = useDispatch();
    const { currentEvent } = useSelector((state: State) => state.calendar);
    const pc = useSelector((state: State) => state.common.PageContext);
    const DUE_CURRENT_USER = useSelector((state: State) => state.common.DUE_CURRENT_USER)

    const user = DM.get("DEPARTMENT", pc?.CurrentUser.DUE_DEP);
    const card_id: string = user.DEPARTMENT_DUE;
    const cabinet_id: number = user.ISN_CABINET;

    const rightForWorkWithMTG = () => {
        if (currentEvent?._type !== 'MREVT_EVENT') return false;

        if (!PageContext.isLicensed(DeloSubSystem.MTG)) return false;
        const rightForDues = pc?.CurrentUser.USERDEP_List?.filter(item => item.FUNC_NUM === 36)
        if (!rightForDues || !rightForDues.length) return false;
        if (pc?.CurrentUser.DUE_DEP === DUE_CURRENT_USER && rightForDues.length) return true;
        if (rightForDues.filter(item => item.DUE === currentEvent.DUE_DEPARTMENT).length) return true;
        return false;
    };

    const canEditPlan = (): boolean => {
        if (currentEvent?._type !== 'MREVT_EVENT') return false;
        if (!PageContext.isLicensed(DeloSubSystem.MTG)) return false;

        const rightForDues = pc?.CurrentUser.USERDEP_List?.filter(item => item.FUNC_NUM === 36);
        if (DUE_CURRENT_USER === currentEvent.DUE_DEPARTMENT) return true;
        if (!rightForDues || !rightForDues.length) return false;
        if (rightForDues.some(item => item.DUE === currentEvent.DUE_DEPARTMENT)) return true;

        return false;
    }

    const makeNewNoteOnClick = async () => {
        if (getISN_RC(currentEvent)) await Piper.load<iDOC_RC>("DOC_RC", getISN_RC(currentEvent), { saveToStore: true, cacheFirst: true })
        else if (getISN_PRJ(currentEvent)) await Piper.load<iPRJ_RC>("PRJ_RC", getISN_PRJ(currentEvent), { saveToStore: true, cacheFirst: true })
        else if (getISN_EVENT) await Piper.load<iPRJ_RC>("MTG_MEETING", getISN_EVENT(currentEvent), { saveToStore: true, cacheFirst: true })
        const REF_KIND = getREF_KIND(currentEvent)
        dispatch(setMakingNewNote(true, EntityHelper.createEntity<iMREVT_REF>('MREVT_REF', {
            ISN_DOC: getISN_RC(currentEvent) || getISN_PRJ(currentEvent) || getISN_EVENT(currentEvent),
            REF_KIND: REF_KIND,
        })))
    }

    const copyToBufOnClick = () => {
        const deloAlert = () => deloDialogAlert('Скопировано в буфер', 'Дело-Web')
        if (currentEvent?._type === 'MTG_MEETING') {
            const EOS_OBJECT_MTG_MEETING = 750;
            const ISN_MTG_MEETING = getISN_EVENT(currentEvent)
            return setToBuf(`${ISN_MTG_MEETING}:${EOS_OBJECT_MTG_MEETING}`).then(deloAlert)
        }
        else {
            const RESULTED_EOS_OBJECT = getISN_RC(currentEvent)
                ? 1 //EOS_OBJECT_RC
                : getISN_PRJ(currentEvent)
                    ? 7 //EOS_OBJECT_PRJ
                    : '0';
            const ISN = getISN_RC(currentEvent) || getISN_PRJ(currentEvent);
            return setToBuf(`${ISN}:${RESULTED_EOS_OBJECT}`).then(deloAlert)
        }
    }

    const makeNewMeeting = () => {
        if (currentEvent?._type === "MREVT_EVENT" && isPlan(currentEvent)) {
            openPopUp(
                `../../MeetingsWeb/Cards/Meeting.html?regParams={}&isn_plan=${getISN_EVENT(currentEvent)}&card_id=${card_id}&cabinet_id=${cabinet_id}`,
                (event, data) => {
                    if (data?.isnMeeting > 0) {
                        currentEvent.isn_mtg_meeting = data.isnMeeting;
                        currentEvent.STATUS = StatusTypePlan.EVENT_CREATED;
                        Piper.save(currentEvent).then(() => {
                            dispatch(loadMeetings())
                            dispatch(loadPlans())
                        });
                    }
                }
            )
        }
    }

    const editPlan = () => {
        if (currentEvent?._type === "MREVT_EVENT") {
            dispatch(setPlan(currentEvent))
            dispatch(setShow(true));
            dispatch(setEdit(true));
        }
    }

    const donePlan = () => {
        if (currentEvent?._type === "MREVT_EVENT" && isPlan(currentEvent)) {
            dispatch(setPlan(currentEvent));
            dispatch(setShow(true));
            dispatch(setEdit(true));
            dispatch(setStatus(StatusTypePlan.DONE));
            dispatch(setDialogDone(true));
            // currentEvent.STATUS = StatusType.DONE;
            // Piper.save(currentEvent).then(() => dispatch(loadPlans()));
        }
    }

    const cancelPlan = () => {
        if (currentEvent?._type === "MREVT_EVENT" && isPlan(currentEvent)) {
            dispatch(setPlan(currentEvent));
            dispatch(setShow(true));
            dispatch(setEdit(true));
            dispatch(setStatus(StatusTypePlan.CANCELLED));
            dispatch(setDialogCancelled(true));
            // currentEvent.STATUS = StatusType.CANCELLED;
            // Piper.save(currentEvent).then(() => dispatch(loadPlans()));
        }
    }

    const deletePlan = () => {
        if (currentEvent?._type === "MREVT_EVENT" && isPlan(currentEvent)) {
            currentEvent._State = _ES.Deleted;
            Piper.save(currentEvent).then(() => {
                dispatch(loadPlans());
                dispatch(setSelection({}));
            }).then(() => dispatch(loadPlans()));
        }
    }

    const saveToIcs = () => {
        const eventDate = new Date(getEVENT_DATE(currentEvent));
        if (currentEvent) downloadIcsFile([currentEvent], eventDate, eventDate);
    }

    return (
        <ContextMenuDefault contextMenuStatus={contextMenuStatus} setOpen={setContextMenuStatus} wrapperRef={wrapperRef}>
            {currentEvent?._type === 'MRevtContext' &&
                <>
                    <ContextMenuItem className={todolist.contextMenuItem} onClick={makeNewNoteOnClick}>Создать заметку со ссылкой на РК/РКПД</ContextMenuItem>
                    <ContextMenuItem className={todolist.contextMenuItem} onClick={copyToBufOnClick}>Скопировать в буфер</ContextMenuItem>
                </>
            }
            {currentEvent?._type === 'MREVT_EVENT' &&
                <>
                    {currentEvent.EVENT_TYPE !== EventsType.PRIVATE && rightForWorkWithMTG() &&
                        <ContextMenuItem className={todolist.contextMenuItem} onClick={makeNewMeeting}>Создать событие из пункта плана</ContextMenuItem>
                    }
                    {
                        canEditPlan() && <ContextMenuItem className={todolist.contextMenuItem} onClick={editPlan}>Редактировать пункт плана</ContextMenuItem>
                    }
                    {currentEvent.STATUS === StatusTypePlan.PLAN &&
                        <ContextMenuItem className={todolist.contextMenuItem} onClick={donePlan}>Отметить выполнение пункта плана</ContextMenuItem>
                    }
                    <ContextMenuItem className={todolist.contextMenuItem} onClick={saveToIcs}>Сохранить событие в файл (*.ics)</ContextMenuItem>
                    {currentEvent.STATUS === StatusTypePlan.PLAN &&
                        <ContextMenuItem className={todolist.contextMenuItem} onClick={cancelPlan}>Отменить пункт плана</ContextMenuItem>
                    }
                    <ContextMenuItem className={todolist.contextMenuItem} onClick={deletePlan}>Удалить пункт плана</ContextMenuItem>
                </>
            }
            {currentEvent?._type === 'MTG_MEETING' &&
                <>
                    <ContextMenuItem className={todolist.contextMenuItem} onClick={() => openPopUpWrapper(currentEvent)}>Открыть событие</ContextMenuItem>
                    <ContextMenuItem className={todolist.contextMenuItem} onClick={copyToBufOnClick}>Скопировать в буфер</ContextMenuItem>
                    <ContextMenuItem className={todolist.contextMenuItem} onClick={makeNewNoteOnClick}>Создать заметку со ссылкой на событие</ContextMenuItem>
                    <ContextMenuItem className={todolist.contextMenuItem} onClick={saveToIcs}>Сохранить событие в файл (*.ics)</ContextMenuItem>
                </>
            }
        </ContextMenuDefault>
    )
}