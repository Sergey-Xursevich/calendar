import React, { useState, useRef, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import { ToolTip, _ES, Piper, DM, iMREVT_EVENT, deloDialogConfirm } from "@eos/mrsoft-core";
import cl from "classnames";
import Icon from "../../../../UI/components/Icon";
import { useDispatch, useSelector } from "react-redux";
import { setSelection, loadNotes } from "../../../../store/calendar/actions";
import { State } from "../../../../store";
import { setMakingNewNote } from "../../../../store/common/actions";
import { format, isAfter } from "date-fns";
import Link from "../../../../UI/components/Link";
import { useScrollIntoView } from "../../../Week/useScrollIntoView";
import { getEVENT_DATE, getISN_EVENT } from "../../../../Utils/getField";

import noteCss from "./Note.module.scss";
import { downloadIcsFile } from "../../../../Utils/SaveToIcs";

interface iProps {
    event?: iMREVT_EVENT;
    setEdit: (isnEvent: false | number) => void;
}

export default function ViewNote(props: iProps) {
    const { event, setEdit } = props;
    const dispatch = useDispatch();
    const [isExpand, setExpand] = useState<boolean>(!event ? true : false);
    const { DUE_CURRENT_USER, showNewNote, PageContext } = useSelector((state: State) => state.common);
    const { currentEvent } = useSelector((state: State) => state.calendar);
    const ISN_EVENT = event?.ISN_EVENT;
    const EVENT_DATE = new Date(event?.EVENT_DATE || 0);
    const dues = event?.MREVT_ASSOCIATION_List?.map(item => { return item.DUE_DEPARTMENT || '' }) || [];
    const href = event?.MREVT_REF_List || [];
    const [isOpenDues, setIsOpenDues] = useState(false)
    const noteRef = useRef<HTMLDivElement>(null);
    useScrollIntoView(noteRef, ISN_EVENT, currentEvent);
    useEffect(() => { // Раскрытие в зависимости от выбранного элемента в неделе или дне
        if (getISN_EVENT(currentEvent) === event?.ISN_EVENT) setExpand(true);
        else {
            setIsOpenDues(false)
            setExpand(false);
        }
    }, [currentEvent, setExpand, event]);
    useEffect(() => { // Прокрутка в область видимости в зависимости от выбранного элемента в неделе или дне
        const compatibilityIE = navigator.userAgent.match(/Trident/i) != null
        if (getISN_EVENT(currentEvent) === event?.ISN_EVENT && !compatibilityIE)
            noteRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
        if (getISN_EVENT(currentEvent) === event?.ISN_EVENT && compatibilityIE)
            noteRef.current?.scrollIntoView(false)
    }, [isExpand, currentEvent, event]);
    useEffect(() => setIsOpenDues(false), [DUE_CURRENT_USER])

    if (!event) return null;

    const deleteNote = () => {
        deloDialogConfirm("Вы действительно хотите удалить заметку?", 'Дело-Web').then(() => {
            event._State = _ES.Deleted;
            if (event.MREVT_ASSOCIATION_List!.length > 0) event.MREVT_ASSOCIATION_List?.forEach(value => value._State = _ES.Deleted);
            Piper.save(event).then(() => {
                dispatch(loadNotes())
                if (!event) dispatch(setMakingNewNote(!showNewNote));
                else setEdit(false)
            });
        })
    };

    const handleExpander = () => {
        setExpand(!isExpand);
        setIsOpenDues(false);
        if (isExpand) dispatch(setSelection({}));
        else dispatch(setSelection({ event }))
    }

    const handleToolTipClick = () => {
        setIsOpenDues(!isOpenDues);
    }

    const mainClassName = cl(
        noteCss.note,
        { [noteCss.selected]: getISN_EVENT(currentEvent) === event.ISN_EVENT }
    )

    const saveToIcs = () => {
        const eventDate = new Date(getEVENT_DATE(currentEvent));
        if (currentEvent) downloadIcsFile([currentEvent], eventDate, eventDate);
    }

    const rightForEditOrDelete = () =>
        isAfter(EVENT_DATE, new Date())
        && PageContext?.CurrentUser.DUE_DEP === event.DUE_DEPARTMENT;

    return (
        <div ref={noteRef} className={mainClassName}>
            <div className={noteCss.header}>
                <span className={noteCss.date}>{format(EVENT_DATE, 'HH:mm')}</span>
                <span className={noteCss.title}>{event.BODY}</span>
                <Icon className={noteCss.buttonExpand} name={isExpand ? "up" : "down"} onClick={handleExpander} />
            </div>
            <CSSTransition in={isExpand} mountOnEnter unmountOnExit timeout={200} classNames={animationClassnames}>
                <div className={noteCss.noteBody}>
                    <div className={noteCss.content}>
                        {event.BODY}
                        {href.map(item => <Link key={item.ISN_REF} href={item} isEdit={false} />)}
                    </div>
                    <div className={noteCss.noteFooter}>
                        <div className={noteCss.titleGroup}>
                            {dues.length > 0 &&
                                <ToolTip element={
                                    <div style={{ padding: 5 }}>Должностных лиц - {dues.length} <br /> Нажмите, чтобы просмотреть список</div>} >
                                    <Icon name="noteMultipleSend" width="15px" height="15px" onClick={handleToolTipClick} />
                                </ToolTip>}
                            <span>{` ${DM.get("DEPARTMENT", event.DUE_DEPARTMENT, 'SURNAME')} ${format(EVENT_DATE, "dd.MM.yyyy 'в' HH:mm")}`}</span>
                        </div>
                        <div className={noteCss.iconsGroupWrapper}>
                            {rightForEditOrDelete() &&
                                <Icon
                                    width={15}
                                    height={15}
                                    title="Редактировать заметку"
                                    name="editNote"
                                    onClick={() => setEdit(event.ISN_EVENT || 0)}
                                />
                            }
                            <Icon
                                width={15}
                                height={15}
                                title="Сохранить заметку в файл (*.ics)"
                                name="save"
                                onClick={saveToIcs}
                            />
                            {rightForEditOrDelete() &&
                                <Icon
                                    width={10}
                                    height={10}
                                    title="Удалить заметку"
                                    name="cross"
                                    onClick={deleteNote}
                                />
                            }
                        </div>
                    </div>
                </div>
            </CSSTransition>
            {isOpenDues &&
                <div className={noteCss.addedDLWrapper}>
                    <div className={noteCss.addedDLTitle}>Кому</div>
                    <div className={noteCss.addedDLItems}>
                        {dues.map(item => <div className={noteCss.addedDL} key={item}>
                            <span className={noteCss.classifName}>{DM.get("DEPARTMENT", item, 'CLASSIF_NAME')}</span>
                        </div>)}
                    </div>
                </div>
            }
        </div>
    );
}

const animationClassnames = {
    enter: noteCss.enter,
    enterActive: noteCss.enterActive,
    exitActive: noteCss.exitActive
}

/* Классы анимации TODO расписать все в стилях
classNames={{
    appear: 'my-appear',
    appearActive: 'my-appear-active',
    appearDone: 'my-appear-done',
    enter: 'my-enter',
    enterActive: 'my-enter-active',
    enterDone: 'my-enter-done',
    exit: 'my-exit',
    exitActive: 'my-exit-active',
    exitDone: 'my-exit-done'
}}
*/