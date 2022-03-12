import React from "react";
import { useSelector } from "react-redux";
import Note from "./Note";
import { State } from "../../../store";
import { sortByDate } from "../../../Utils/CalendarHelper";

import notesCss from "./Notes.module.scss";

interface iEditNoteProps {
    editNote: number | false;
}

export default function EditNote({ editNote }: iEditNoteProps) {
    const selection = useSelector((state: State) => state.calendar.selection)
    const notes = selection?.notes.sort((a, b) => sortByDate(a.EVENT_DATE || "", b.EVENT_DATE || ""));
    const editingNote = notes?.filter(item => editNote === item.ISN_EVENT)[0];
    return (
        <div className={notesCss.notesBlock}>
            <span className={notesCss.titleNotes}>Редактирование заметки</span>
            <Note key={editingNote?.ISN_EVENT} event={editingNote} />
        </div>
    )
}

