import React from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import cl from "classnames";
import Note from "./Note";
import { useSelector } from "react-redux";
import { State } from "../../../store";

import notesCss from "./Notes.module.scss";

interface iNewNoteProps { }

export default function NewNote(props: iNewNoteProps) {
    const selection = useSelector((state: State) => state.calendar.selection)
    const onDate = format(selection?.date || new Date(), 'd MMMM', { locale: ru });
    return (
        <div className={notesCss.notesBlock}>
            <span className={notesCss.titleNotes}>
                <span>Новая заметка на <span className={cl({ [notesCss.holiday]: selection?.isHoliday })}>{onDate}</span></span>
            </span>
            <Note isNewNote />
        </div>
    )
}
