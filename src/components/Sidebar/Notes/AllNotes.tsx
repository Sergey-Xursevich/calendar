import React from "react";
import { useDispatch, useSelector } from "react-redux";
import cl from "classnames";
import Button from "../../../UI/components/Button";
import { setMakingNewNote } from "../../../store/common/actions";
import { setSelection } from "../../../store/calendar/actions";
import Note from "./Note";
import { State } from "../../../store";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { sortByDate } from "../../../Utils/CalendarHelper";

import notesCss from "./Notes.module.scss";

interface iAllNotesProps { }

export default function AllNotes(props: iAllNotesProps) {
    const dispatch = useDispatch();
    const selection = useSelector((state: State) => state.calendar.selection)
    const onDate = format(selection?.date || new Date(), 'd MMMM yyyy', { locale: ru });
    const notes = selection?.notes.sort((a, b) => sortByDate(a.EVENT_DATE || "", b.EVENT_DATE || ""));

    const makeNewNoteHandler = () => {
        dispatch(setSelection({}))
        dispatch(setMakingNewNote(true))
    }

    return (
        <div className={notesCss.notesBlock}>
            <span className={notesCss.titleNotes}>
                <span>Заметки на <span className={cl({ [notesCss.holiday]: selection?.isHoliday })}>{onDate}</span></span>
                <Button className={notesCss.newNoteButton} text="Создать заметку" onClick={makeNewNoteHandler} />
            </span>
            <div className={notesCss.allNotes}>
                {notes?.map(item => <Note key={item.ISN_EVENT} event={item} />)}
            </div>
        </div>
    )
}
